import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';

export const SUPPORTED_LOCALES = ['pt-BR', 'en', 'ko'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: SupportedLocale = 'pt-BR';

export default getRequestConfig(async () => {
  let locale: string | undefined;

  try {
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;
    if (cookieLocale && (SUPPORTED_LOCALES as readonly string[]).includes(cookieLocale)) {
      locale = cookieLocale;
    }
  } catch {
    // cookies() may throw in some static prerender contexts
  }

  if (!locale) {
    const envLocale = process.env.NEXT_PUBLIC_APP_LOCALE;
    if (envLocale && (SUPPORTED_LOCALES as readonly string[]).includes(envLocale)) {
      locale = envLocale;
    } else {
      locale = DEFAULT_LOCALE;
    }
  }

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch {
    messages = (await import('../../messages/en.json')).default;
  }

  return {
    locale,
    messages,
  };
});

