const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp();

/**
 * Callable Cloud Function: getEmailByPhone
 *
 * Accepts { phoneNumber: "9876543210" }
 * Queries Firestore with Admin SDK (bypasses all security rules)
 * Returns { email: "user@example.com" } or throws if not found.
 */
exports.getEmailByPhone = onCall(async (request) => {
  const { phoneNumber } = request.data;

  if (!phoneNumber || typeof phoneNumber !== 'string') {
    throw new HttpsError('invalid-argument', 'A valid phoneNumber is required.');
  }

  // Normalize: digits only
  const cleanPhone = phoneNumber.replace(/\D/g, '');

  if (cleanPhone.length < 7) {
    throw new HttpsError('invalid-argument', 'Phone number is too short.');
  }

  const db = getFirestore();
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

  const email = snapshot.docs[0].data().email;

  if (!email) {
    throw new HttpsError(
      'internal',
      'Account found but email is missing. Please contact support.'
    );
  }

  return { email };
});
