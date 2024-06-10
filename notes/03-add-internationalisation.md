# Step 3: Add Internationalisation

[^ Notes](./00-notes.md)

## Install 'next-intl'

This package is one of the recommendations in Next's 'Internationalisation' docs,
<https://nextjs.org/docs/app/building-your-application/routing/internationalization#resources>.

```bash
npm i next-intl
# added 15 packages, and audited 1387 packages in 14s
# 266 packages are looking for funding
#   run `npm fund` for details
# found 0 vulnerabilities
```

According to my Mac, node_modules is now 481,131,099 bytes (600.7 MB on disk)
for 45,798 items.

## Get `nx dev` working, for the 'make' app

Based on <https://next-intl-docs.vercel.app/docs/getting-started/app-router/with-i18n-routing>:

### Create English and Portuguese 'messages' JSON files

```bash
mkdir apps/make/messages
echo '{
  "metadata": {
    "description": "Create some music!",
    "icons": { "icon": "./favicon.ico" },
    "title": "Tunefields | make"
  },
  "homepage": {
    "title": "Hello make!"
  }
}' > apps/make/messages/en.json
echo '{
  "metadata": {
    "description": "Crie alguma música!",
    "icons": { "icon": "./favicon.ico" },
    "title": "Tunefields | make"
  },
  "homepage": {
    "title": "Oi make!"
  }
}' > apps/make/messages/pt.json
```

### Modify Next's configuration

Change apps/make/next.config.js to:

```js
//@ts-check

const createNextIntlPlugin = require('next-intl/plugin');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

...

const plugins = [
  withNx,
  createNextIntlPlugin('./i18n.ts'),
];

module.exports = composePlugins(...plugins)(nextConfig);
```

### Create the script which returns ext-intl's request configuration

Create the apps/make/i18n.ts file:

```ts
import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config.
const locales = ['en', 'pt'];

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid.
  if (! locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
```

### Create the middleware script

Create the apps/make/middleware.ts file:

```ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported.
  locales: ['en', 'pt'],

  // Used when no locale matches.
  defaultLocale: 'en'
});

export const config = {
  // Match only internationalised path names.
  matcher: ['/', '/(en|pt)/:path*']
};
```

### Move everything in the app/ folder to app/[locale]/

```bash
mkdir apps/make/app/[locale]
mv apps/make/app/*.{css,tsx} apps/make/app/[locale] # move all files
rm -rf apps/make/app/api # not needed for Tunefields
```

### Modify @nx/next's default layout

apps/make/app/[locale]/layout.tsx should now be:

```tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, unstable_setRequestLocale } from 'next-intl/server';

import './global.css';
import { StyledComponentsRegistry } from './registry';

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
```

### Use the translations in @nx/next's default page

Update the apps/make/app/[locale]/page.tsx file:

```tsx
'use client';

import { useTranslations } from 'next-intl';

...

export default function Index() {
  const t = useTranslations('homepage');

...
            <h1>
              <span> Hello there, </span>
              {t('title')} 👋
            </h1>
...
```

If you run `npx nx dev make`, <http://localhost:3000> should automatically
redirect to <http://localhost:3000/en> and show "Hello make!". And visiting
<http://localhost:3000/pt> should show "Oi make!". Note that `notFound()` is not
currently working for unrecognised locales.

TODO maybe fix `notFound()`, though the build works differently anyway

## Get static site generation working, for the 'make' app

If you run `npm run build && npm start` at this point, the build will fail with
a "Page "/[locale]" is missing "generateStaticParams()" error.

The following solution is based on the
<https://next-intl-docs.vercel.app/docs/getting-started/app-router/with-i18n-routing#static-rendering>
documentation.

Add `generateStaticParams()` to the app/[locale]/layout.tsx file, and also use
the special 'next-intl' `unstable_setRequestLocale()` workaround:

```tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, unstable_setRequestLocale } from 'next-intl/server';
...

// TODO import from a shared config
const locales = ['en', 'pt'];
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(
...

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

...
```

> According to [this GitHub Issues post](
> https://github.com/amannn/next-intl/issues/663#issuecomment-1852536760) by the
> 'next-intl' author, "You don’t need to call the function in client-only pages."

Now when you run `npm run build && npm start`, the build should succeed.

<http://localhost:9080/tunefields/make> does not automatically redirect to
<http://localhost:9080/tunefields/make/en>, so that will need fixing. TODO

Visiting <http://localhost:9080/tunefields/make/en> should show "Hello make!",
and <http://localhost:9080/tunefields/make/pt> should show "Oi make!".

The usual 404.html file is currently being shown for unrecognised locales.

## Update the tests

apps/make/specs/index.spec.tsx needs lots of changes to run without errors.

For a reference example, see:
- <https://next-intl-docs.vercel.app/docs/environments/core-library#react-apps>
- <https://github.com/amannn/next-intl/blob/main/examples/example-app-router/src/components/Navigation.spec.tsx>

```tsx
import { NextIntlClientProvider } from 'next-intl';
import React from 'react';
import { render } from '@testing-library/react';

import Page from '../app/[locale]/page';
import messagesEn from '../messages/en.json';

describe('Page', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <NextIntlClientProvider
        locale="en"
        messages={messagesEn}
      >
        <Page />
      </NextIntlClientProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
```

`npx nx test make` should now succeed.

Modify the apps/make-e2e/playwright.config.ts configuration file, to use port
`9080` instead of `3000`, and `npm run build:make && npm start` instead of
`npx nx start make`:

```ts
...
// For CI, you may want to set BASE_URL to the deployed application.
const baseURL = process.env['BASE_URL'] || 'http://127.0.0.1:9080';
...
  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'rm -rf tunefields && npm run clean && npm run build:make && npm start',
    url: 'http://127.0.0.1:9080',
    reuseExistingServer: !process.env.CI,
    cwd: workspaceRoot,
  },
...
```

> Note that, at a later stage, it will be possible to write Playwright e2e tests
> that traverse all three apps in a single test. For example, editing a profile
> in the 'admin' app, and then checking it updates correctly in the 'view' app.

Replace apps/make-e2e/src/example.spec.ts with a new file
apps/make-e2e/src/navigation.spec.ts (which will be completed later):

```ts
import { test, expect } from '@playwright/test';

test('navigates from homepage to about and back again', async ({ page }) => {

  // Expect the <H1> of the 'en' and 'pt' homepages to contain the 'make'
  // welcome message in the correct language.
  await page.goto('/tunefields/make/en/');
  expect(await page.locator('h1').innerText()).toContain('Hello make!');
  await page.goto('/tunefields/make/pt/');
  expect(await page.locator('h1').innerText()).toContain('Oi make!');

});
```

Running `npm run e2e:make` should pass all end-to-end tests.
