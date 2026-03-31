export const DEFAULT_COUNTRY_CODE = '+91';

export const COUNTRY_CODE_PREFIX = `${DEFAULT_COUNTRY_CODE} `;

export const prefillCountryCode = (raw) => {
  const value = String(raw ?? '').trim();
  if (!value) return COUNTRY_CODE_PREFIX;

  // Already starts with '+' (some country code)
  if (value.startsWith('+')) return value;

  // If user pasted digits only, keep as-is (validation/normalization will handle)
  return value;
};

export const normalizePhoneForLookup = (raw, localDigits = 10) => {
  const digits = String(raw ?? '').replace(/\D/g, '');
  if (!digits) return '';
  return digits.length > localDigits ? digits.slice(-localDigits) : digits;
};

export const isPhoneComplete = (raw, localDigits = 10) => {
  const digits = normalizePhoneForLookup(raw, localDigits);
  return digits.length === localDigits;
};
