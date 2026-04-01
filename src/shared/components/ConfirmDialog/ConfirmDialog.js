import React from 'react';

/**
 * ConfirmDialog — replaces window.confirm() with a styled modal.
 *
 * Usage:
 *   const [confirm, setConfirm] = useState(null);
 *   // to open:  setConfirm({ message: 'Delete this?', onConfirm: () => doDelete() })
 *   // to close: setConfirm(null)
 *
 *   <ConfirmDialog config={confirm} onClose={() => setConfirm(null)} />
 */
const ConfirmDialog = ({ config, onClose }) => {
  if (!config) return null;

  const {
    message = 'Are you sure?',
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    danger = true,
    onConfirm,
  } = config;

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.45)',
        zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: '28px 32px',
          maxWidth: 380,
          width: '90%',
          boxShadow: '0 16px 48px rgba(0,0,0,0.18)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 36, marginBottom: 12 }}>
          {danger ? '⚠️' : '❓'}
        </div>
        <p style={{ fontSize: 15, fontWeight: 600, color: '#111827', margin: '0 0 24px', lineHeight: 1.5 }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '10px 0', borderRadius: 10,
              border: '1.5px solid #d1d5db', background: '#f9fafb',
              color: '#374151', fontWeight: 600, fontSize: 14, cursor: 'pointer',
            }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={handleConfirm}
            style={{
              flex: 1, padding: '10px 0', borderRadius: 10, border: 'none',
              background: danger ? '#dc2626' : '#16a34a',
              color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
