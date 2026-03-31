export const GMAIL_SUFFIX = '@gmail.com';

const PHONE_PATTERN = /^[\d\s\-+()]+$/;

export const isPhoneLike = (raw) => {
  const value = String(raw || '').trim();
  return value.length > 0 && !value.includes('@') && PHONE_PATTERN.test(value);
};

export const normalizeGmailInput = (raw) => {
  const value = String(raw || '');
  const trimmed = value.trim();

  const lower = trimmed.toLowerCase();
  let localPart = '';

  if (lower.endsWith(GMAIL_SUFFIX)) {
    localPart = trimmed.slice(0, trimmed.length - GMAIL_SUFFIX.length);
  } else if (trimmed.includes('@')) {
    localPart = trimmed.split('@')[0];
  } else {
    localPart = trimmed;
  }

  localPart = localPart.replace(/\s+/g, '');
  return `${localPart}${GMAIL_SUFFIX}`;
};

export const coerceEmailOrPhone = (raw) => {
  if (isPhoneLike(raw)) return String(raw || '').trim();
  return normalizeGmailInput(raw);
};

export const isGmailComplete = (raw) => {
  const value = String(raw || '').trim().toLowerCase();
  return value.endsWith(GMAIL_SUFFIX) && value.length > GMAIL_SUFFIX.length;
};

export const getGmailLocalPart = (raw) => {
  const value = String(raw || '');
  const at = value.indexOf('@');
  if (at <= 0) return '';
  return value.slice(0, at);
};

export const keepCaretInLocalPart = (inputEl) => {
  if (!inputEl) return;
  const value = String(inputEl.value || '');
  const at = value.indexOf('@');
  if (at < 0) return;

  const clampPos = (pos) => Math.max(0, Math.min(pos, at));
  const start = clampPos(inputEl.selectionStart ?? at);
  const end = clampPos(inputEl.selectionEnd ?? at);

  // Ensure caret never goes into the fixed suffix
  try {
    inputEl.setSelectionRange(start, end);
  } catch {}
};

export const moveCaretToLocalEnd = (inputEl) => {
  if (!inputEl) return;
  const value = String(inputEl.value || '');
  const at = value.indexOf('@');
  const pos = at >= 0 ? at : value.length;
  try {
    inputEl.setSelectionRange(pos, pos);
  } catch {}
};
