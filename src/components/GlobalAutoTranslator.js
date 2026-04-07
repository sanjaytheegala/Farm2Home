import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import enTranslations from '../locales/en.json';
import teTranslations from '../locales/te.json';
import hiTranslations from '../locales/hi.json';
import taTranslations from '../locales/ta.json';
import mlTranslations from '../locales/ml.json';
import knTranslations from '../locales/kn.json';

const EMAIL_REGEX = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;

const normalize = (value) => String(value || '').replace(/\s+/g, ' ').trim();
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const tokenize = (value) =>
  normalize(value)
    .split(/[^\p{L}\p{N}_]+/u)
    .map((part) => part.trim())
    .filter(Boolean);

const originalTextByNode = new WeakMap();
const originalAttrsByElement = new WeakMap();

const INDIC_SCRIPT_REGEX = /[\u0900-\u097F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F]/;
const hasIndicScript = (value) => INDIC_SCRIPT_REGEX.test(String(value || ''));

const isEnglishLang = (lang) => String(lang || '').toLowerCase().startsWith('en');

const toMaps = (langCode) => {
  const en = enTranslations?.translation || {};
  const targetResource = {
    en: enTranslations,
    te: teTranslations,
    hi: hiTranslations,
    ta: taTranslations,
    ml: mlTranslations,
    kn: knTranslations,
  }[langCode] || enTranslations;

  const target = targetResource?.translation || {};
  const exactMap = new Map();
  const phraseMap = new Map();
  const wordMap = new Map();

  Object.keys(en).forEach((key) => {
    const from = normalize(en[key]);
    const to = normalize(target[key]);
    if (!from || !to || from === to) return;

    exactMap.set(from, to);
    exactMap.set(from.toLowerCase(), to);
    phraseMap.set(from.toLowerCase(), to);

    const fromTokens = tokenize(from);
    const toTokens = tokenize(to);
    if (fromTokens.length && fromTokens.length === toTokens.length) {
      fromTokens.forEach((token, idx) => {
        const tFrom = token.toLowerCase();
        const tTo = toTokens[idx];
        if (!tFrom || !tTo || tFrom === tTo.toLowerCase()) return;
        if (!wordMap.has(tFrom)) wordMap.set(tFrom, tTo);
      });
    }
  });

  const sortedPhrases = [...phraseMap.entries()].sort((a, b) => b[0].length - a[0].length);
  return { exactMap, sortedPhrases, wordMap };
};

const shouldSkipElement = (el) => {
  if (!el) return true;
  const tag = (el.tagName || '').toLowerCase();
  if (['script', 'style', 'noscript', 'code', 'pre'].includes(tag)) return true;
  if (el.closest('[data-no-auto-translate="true"]')) return true;
  return false;
};

const translateString = (value, dictionary) => {
  const normalized = normalize(value);
  if (!normalized || EMAIL_REGEX.test(normalized)) return value;

  const exact = dictionary.exactMap.get(normalized) || dictionary.exactMap.get(normalized.toLowerCase());
  if (exact) return value.replace(normalized, exact);

  let output = value;
  const lowerOutput = output.toLowerCase();

  let phraseApplied = false;
  dictionary.sortedPhrases.forEach(([fromLower, to]) => {
    if (!fromLower || !to) return;
    const pattern = new RegExp(escapeRegex(fromLower), 'gi');
    if (pattern.test(lowerOutput)) {
      output = output.replace(pattern, to);
      phraseApplied = true;
    }
  });

  if (phraseApplied) return output;

  let tokenCount = 0;
  let translatedCount = 0;
  output = output.replace(/\b[\p{L}\p{N}_]+\b/gu, (token) => {
    tokenCount += 1;
    const translated = dictionary.wordMap.get(token.toLowerCase());
    if (!translated || translated === token) return token;
    translatedCount += 1;
    return translated;
  });

  // Avoid low-quality partial translations like: "No பயிர் listed yet".
  // If we can't translate most tokens, keep the original English string.
  if (tokenCount > 0 && translatedCount / tokenCount < 0.6) {
    return value;
  }

  return output;
};

const translateAttributes = (root, dictionary, lang = 'en') => {
  const attrs = ['placeholder', 'title', 'aria-label'];
  const elements = root.querySelectorAll('*');
  const english = isEnglishLang(lang);

  elements.forEach((el) => {
    if (shouldSkipElement(el)) return;

    if (!originalAttrsByElement.has(el)) {
      originalAttrsByElement.set(el, new Map());
    }
    const attrStore = originalAttrsByElement.get(el);

    attrs.forEach((attr) => {
      const current = el.getAttribute(attr);
      if (!current) return;

      // We only have a reliable dictionary for translating from English.
      // So: keep an English canonical source, restore it when switching back
      // to English, and translate from it for all non-English languages.
      if (!attrStore.has(attr)) {
        if (!english && hasIndicScript(current)) return;
        attrStore.set(attr, current);
      }

      const source = attrStore.get(attr);
      if (!source || EMAIL_REGEX.test(source)) return;

      if (english) {
        // If this attribute is currently localized (e.g., via auto-translation),
        // restore the canonical English source.
        if (hasIndicScript(current) && !hasIndicScript(source)) {
          el.setAttribute(attr, source);
        } else if (!hasIndicScript(current)) {
          // In English mode, treat current as the canonical source so dynamic
          // text updates don't get overwritten by stale cached values.
          attrStore.set(attr, current);
        }
        return;
      }

      const translated = translateString(source, dictionary);
      if (translated && translated !== current) {
        el.setAttribute(attr, translated);
      }
    });
  });
};

const translateTextNodes = (root, dictionary, lang = 'en') => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  const english = isEnglishLang(lang);

  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach((textNode) => {
    const parent = textNode.parentElement;
    const value = textNode.nodeValue;
    if (!parent || !value) return;
    if (shouldSkipElement(parent)) return;

    if (!originalTextByNode.has(textNode)) {
      // Only cache English-ish source when in non-English mode;
      // caching already-localized scripts makes later language switches impossible.
      if (!english && hasIndicScript(value)) return;
      originalTextByNode.set(textNode, value);
    }

    const source = originalTextByNode.get(textNode);
    const trimmed = normalize(source);
    if (!trimmed || EMAIL_REGEX.test(trimmed)) return;

    if (english) {
      // Restore English canonical text if currently localized.
      if (hasIndicScript(value) && !hasIndicScript(source)) {
        textNode.nodeValue = source;
      } else if (!hasIndicScript(value)) {
        // In English mode, keep the canonical source synced with dynamic content.
        originalTextByNode.set(textNode, value);
      }
      return;
    }

    const translated = translateString(source, dictionary);
    if (translated && translated !== value) {
      textNode.nodeValue = translated;
    }
  });
};

const GlobalAutoTranslator = () => {
  const { i18n } = useTranslation();

  const dictionary = useMemo(() => {
    const lang = (i18n.language || 'en').split('-')[0];
    return toMaps(lang);
  }, [i18n.language]);

  useEffect(() => {
    const lang = (i18n.language || 'en').split('-')[0];
    if (typeof document === 'undefined' || !document.body) return;

    const observeOptions = {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['placeholder', 'title', 'aria-label'],
    };

    let scheduled = false;
    let applying = false;
    let timeoutId = null;

    const observer = new MutationObserver(() => {
      // Debounce to avoid thrashing on large renders / language switch.
      if (scheduled) return;
      scheduled = true;
      timeoutId = setTimeout(() => {
        scheduled = false;
        run();
      }, 50);
    });

    const run = () => {
      if (applying) return;
      applying = true;
      try {
        // Prevent our own DOM edits from triggering the observer again.
        observer.disconnect();
        translateAttributes(document.body, dictionary, lang);
        translateTextNodes(document.body, dictionary, lang);
      } finally {
        try { observer.observe(document.body, observeOptions); } catch {}
        applying = false;
      }
    };

    // Initial pass on mount / language change
    run();
    observer.observe(document.body, observeOptions);

    return () => {
      try { observer.disconnect(); } catch {}
      if (timeoutId) {
        try { clearTimeout(timeoutId); } catch {}
      }
    };
  }, [dictionary, i18n.language]);

  return null;
};

export default GlobalAutoTranslator;
