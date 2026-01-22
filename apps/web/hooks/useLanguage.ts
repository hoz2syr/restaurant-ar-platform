'use client';

import { useState, useEffect } from 'react';
import { Locale, getTranslation, getDirection } from '@/lib/i18n';

const LOCALE_KEY = 'preferred_locale';

export function useLanguage() {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const stored = localStorage.getItem(LOCALE_KEY) as Locale;
    if (stored && (stored === 'en' || stored === 'ar')) {
      setLocaleState(stored);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(LOCALE_KEY, newLocale);
    document.documentElement.setAttribute('dir', getDirection(newLocale));
    document.documentElement.setAttribute('lang', newLocale);
  };

  const t = (key: string) => getTranslation(locale, key);

  const direction = getDirection(locale);

  return {
    locale,
    setLocale,
    t,
    direction,
    isRTL: direction === 'rtl',
  };
}
