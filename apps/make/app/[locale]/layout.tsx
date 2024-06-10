import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, unstable_setRequestLocale } from 'next-intl/server';

import './global.css';
import { StyledComponentsRegistry } from './registry';

// TODO import from a shared config
const locales = ['en', 'pt'];
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(
  { params: { locale }}:
  { params: { locale: string }}
) {
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    description: t('description'), // eg "Create some music!"
    icons: t('icons.icon'), // eg "./favicon.ico"
    title: t('title'), // eg "Tunefields | make"
  };
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);

  // Providing all messages to the client side is the easiest way to get started.
  const messages = await getMessages();

  return (
    <html lang="{locale}">
      <body>
        <StyledComponentsRegistry>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
