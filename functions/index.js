const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { onDocumentDeleted } = require('firebase-functions/v2/firestore');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, FieldValue, Timestamp } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');

initializeApp();

/**
 * Callable Cloud Function: getEmailByPhone
 *
 * Accepts { phoneNumber: "9876543210" }
 * Queries Firestore with Admin SDK (bypasses all security rules)
 * Returns { email: "user@example.com" } or throws if not found.
 */
exports.getEmailByPhone = onCall(async (request) => {
  const { phoneNumber, expectedRole } = request.data || {};

  const db = getFirestore();

  // Basic rate limiting to reduce brute-force enumeration.
  // Note: this is not a perfect defense, but it meaningfully raises the cost of abuse.
  async function enforceRateLimit(key, limit, windowMs) {
    const ref = db.collection('rate_limits').doc(key);
    const nowMs = Date.now();
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) {
        tx.set(ref, {
          count: 1,
          windowStart: Timestamp.fromMillis(nowMs),
          updatedAt: FieldValue.serverTimestamp(),
        });
        return;
      }
      const data = snap.data() || {};
      const start = data.windowStart?.toMillis ? data.windowStart.toMillis() : 0;
      const count = Number(data.count || 0);

      if (!start || (nowMs - start) > windowMs) {
        tx.set(ref, {
          count: 1,
          windowStart: Timestamp.fromMillis(nowMs),
          updatedAt: FieldValue.serverTimestamp(),
        }, { merge: true });
        return;
      }

      if (count >= limit) {
        throw new HttpsError('resource-exhausted', 'Too many attempts. Please try again later.');
      }

      tx.set(ref, {
        count: FieldValue.increment(1),
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
    });
  }

  if (!phoneNumber || typeof phoneNumber !== 'string') {
    throw new HttpsError('invalid-argument', 'A valid phoneNumber is required.');
  }

  // Normalize: digits only
  const cleanPhone = phoneNumber.replace(/\D/g, '');

  // Expect India-style local 10-digit phone numbers (caller already normalizes)
  if (cleanPhone.length !== 10) {
    throw new HttpsError('invalid-argument', 'Phone number must be 10 digits.');
  }

  // Rate limit by phone + IP
  const ip = request.rawRequest?.ip || request.rawRequest?.headers?.['x-forwarded-for'] || 'unknown';
  await enforceRateLimit(`getEmailByPhone:phone:${cleanPhone}`, 5, 15 * 60 * 1000);
  await enforceRateLimit(`getEmailByPhone:ip:${String(ip).split(',')[0].trim()}`, 30, 15 * 60 * 1000);

  const snapshot = await db
    .collection('users')
    .where('phoneNumber', '==', cleanPhone)
    .limit(1)
    .get();

  if (snapshot.empty) {
    throw new HttpsError(
      'not-found',
      'No account is registered with this phone number. Please check and try again.'
    );
  }

  const userData = snapshot.docs[0].data() || {};
  const email = userData.email;

  if (expectedRole && typeof expectedRole === 'string') {
    if (!userData.role || userData.role !== expectedRole) {
      // Keep error generic to avoid leaking extra information
      throw new HttpsError('not-found', 'No account found with this phone number.');
    }
  }

  // Optional: block inactive/suspended accounts from phone lookup
  const normalizedStatus = String(userData.status || '').toLowerCase();
  if (normalizedStatus === 'inactive' || normalizedStatus === 'suspended') {
    throw new HttpsError('permission-denied', 'This account is not active.');
  }

  if (!email) {
    throw new HttpsError(
      'internal',
      'Account found but email is missing. Please contact support.'
    );
  }

  return { email };
});

/**
 * Firestore trigger: onUserDeleted
 *
 * Fires when admin deletes a document from the `users` collection.
 * Cascades to delete ALL data belonging to that user, EXCEPT:
 *   - orders with status "delivered"  → anonymised, kept for profit analysis
 *   - market_demands with status "completed" → anonymised, kept for profit analysis
 *
 * Collections cleaned:
 *   crops            (farmerId == uid)
 *   orders           (customerId == uid | farmerId == uid)
 *   market_demands   (consumerId == uid | committedFarmerId == uid) + messages sub-collection
 *   reviews          (consumerId == uid | farmerId == uid)
 *   complaints       (reporterId == uid)
 *   users/{uid}/cart         (sub-collection)
 *   users/{uid}/favorites    (sub-collection)
 *   Firebase Auth account
 */
exports.onUserDeleted = onDocumentDeleted('users/{uid}', async (event) => {
  const uid = event.params.uid;
  const db = getFirestore();
  const auth = getAuth();

  // Helper: delete all docs in a query in batches
  async function deleteQueryBatch(query) {
    const snap = await query.get();
    if (snap.empty) return;
    const batch = db.batch();
    snap.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
    // recurse if there may be more
    if (snap.size === 500) await deleteQueryBatch(query);
  }

  // Helper: delete all docs in a sub-collection
  async function deleteSubCollection(parentRef, subName) {
    const snap = await parentRef.collection(subName).limit(500).get();
    if (snap.empty) return;
    const batch = db.batch();
    snap.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
    if (snap.size === 500) await deleteSubCollection(parentRef, subName);
  }

  const promises = [];

  // ── 1. Crops (farmer only) ──────────────────────────────────────────────
  promises.push(
    deleteQueryBatch(db.collection('crops').where('farmerId', '==', uid))
  );

  // ── 2. Orders ───────────────────────────────────────────────────────────
  // Keep "delivered" orders but anonymise the user field.
  async function processOrders(field) {
    const snap = await db.collection('orders').where(field, '==', uid).get();
    if (snap.empty) return;
    const batch = db.batch();
    snap.docs.forEach(doc => {
      if (doc.data().status === 'delivered') {
        // Anonymise instead of delete
        batch.update(doc.ref, { [field]: '[deleted_user]' });
      } else {
        batch.delete(doc.ref);
      }
    });
    await batch.commit();
  }
  promises.push(processOrders('customerId'));
  promises.push(processOrders('farmerId'));

  // ── 3. Market Demands ───────────────────────────────────────────────────
  // Keep "completed" demands but anonymise; also delete messages sub-collection
  // for demands that are deleted.
  async function processMarketDemands(field) {
    const snap = await db.collection('market_demands').where(field, '==', uid).get();
    if (snap.empty) return;
    const batch = db.batch();
    for (const doc of snap.docs) {
      if (doc.data().status === 'completed') {
        batch.update(doc.ref, { [field]: '[deleted_user]' });
      } else {
        // Delete messages sub-collection first, then the demand doc
        await deleteSubCollection(doc.ref, 'messages');
        batch.delete(doc.ref);
      }
    }
    await batch.commit();
  }
  promises.push(processMarketDemands('consumerId'));
  promises.push(processMarketDemands('committedFarmerId'));

  // ── 4. Reviews ──────────────────────────────────────────────────────────
  promises.push(
    deleteQueryBatch(db.collection('reviews').where('consumerId', '==', uid))
  );
  promises.push(
    deleteQueryBatch(db.collection('reviews').where('farmerId', '==', uid))
  );

  // ── 5. Complaints ───────────────────────────────────────────────────────
  promises.push(
    deleteQueryBatch(db.collection('complaints').where('reporterId', '==', uid))
  );

  // ── 6. User sub-collections (cart & favorites) ──────────────────────────
  const userRef = db.collection('users').doc(uid);
  promises.push(deleteSubCollection(userRef, 'cart'));
  promises.push(deleteSubCollection(userRef, 'favorites'));

  // Run all Firestore operations in parallel
  await Promise.all(promises);

  // ── 7. Firebase Auth account ────────────────────────────────────────────
  try {
    await auth.deleteUser(uid);
    console.log(`Auth account deleted for uid: ${uid}`);
  } catch (err) {
    // User may already be deleted from Auth — not a fatal error
    if (err.code !== 'auth/user-not-found') {
      console.error(`Failed to delete Auth account for uid ${uid}:`, err);
    }
  }

  console.log(`Cascade delete completed for user: ${uid}`);
});
