# Step 3: 'Not Found' and deep links

[^ Notes](./00-notes.md)

## Add the 'about' page to the 'make' app

Based on <https://nx.dev/nx-api/next/generators/page>, use NX's 'page' generator
to create an 'about' page for the 'view' app:

```bash
npx nx g @nx/next:page view --directory=apps/view/app/about --name=about --withTests
#  NX  Generating @nx/next:page
# ? Which stylesheet format would you like to use? … 
# CSS
# SASS(.scss)       [ https://sass-lang.com          ]
# LESS              [ https://lesscss.org            ]
# styled-components [ https://styled-components.com ]
# emotion           [ https://emotion.sh            ]
# styled-jsx        [ https://www.npmjs.com/package/styled-jsx ]
# None
styled-components
# ? Where should the page be generated? …
# ❯ As provided: apps/view/app/about/about.ts
#   Derived:     apps/view/app/about/about/about.ts
As provided # this is ignored, and appears to be an @nx/next bug TODO fix!
# ? Where should the page be generated? … 
# ❯ As provided: apps/view/app/about/page.tsx
#   Derived:     apps/view/apps/view/app/about/about/page.tsx
As provided # this is the path that will be used
# CREATE apps/view/app/about/page.spec.tsx
# CREATE apps/view/app/about/page.tsx
```

You should see that two files have been created. 

## Add simple links

Update the new apps/view/app/about/page.tsx page, and also the original homepage
at apps/view/app/page.tsx:

```tsx
'use client'; // leads to an error if missing

import Link from 'next/link';
...
      <Link href="/">‘view’ home</Link>
    </StyledAbout>
```

```tsx
'use client';

import Link from 'next/link';
...
  return (
    <StyledPage>
      <Link href="/about">‘view’ about page</Link>
...
```

To check it works, run `npx nx dev view` and visit <http://localhost:3000/about>,
where you should see "Welcome to About!" in pink. You should be able to navigate
between the two pages by clicking the links.

## Check that navigation and deep-linking works for the SSG build

Run `npm run build && npm start` and then deep-link to the 'view' about page
<http://localhost:9080/tunefields/view/about>, and click the navigation to check
that there's no surprises. The three routes `view/about`, `view/about/` and
`view/about/index.html` should all work.

After `[ctrl-c]` to stop `static-server` running, docs/view/about/index.html
should have been added. Push it to your repo, to check it on GitHub Pages.

## Check that Jest can find the new unit test

```bash
npx nx test view
# > nx run view:test
# > jest
#  PASS   view  app/about/page.spec.tsx
#  PASS   view  specs/index.spec.tsx
# Test Suites: 2 passed, 2 total
# Tests:       2 passed, 2 total
# Snapshots:   0 total
# Time:        3.945 s
# Ran all test suites.
# ——————————————————————————————————————————————————————————————————————————————
#  NX   Successfully ran target test for project view (6s)
```

## Fix Playwright configuration

The generated Playwright e2e tests are configured to run `next start`. Next's
`start` command is not going to work for our GitHub Pages hosting setup - see
the `npm run build` and `npm start` custom scripts described in the earlier
['Setting up Nx and Next'](./01-setting-up-nx-and-next.md) notes.

Add two scripts to the top-level package.json file:

```json
...
    "build:make": "rm -rf docs && npx nx build make --configuration=production && node scripts/post-build.mjs",
    "build:view": "rm -rf docs && npx nx build view --configuration=production && node scripts/post-build.mjs",
...
```

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

And similarly for apps/view-e2e/playwright.config.ts for the 'view' app:

```ts
...
// For CI, you may want to set BASE_URL to the deployed application.
const baseURL = process.env['BASE_URL'] || 'http://127.0.0.1:9080';
...
  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'rm -rf tunefields && npm run clean && npm run build:view && npm start',
    url: 'http://127.0.0.1:9080',
    reuseExistingServer: !process.env.CI,
    cwd: workspaceRoot,
  },
...
```

> Note that, at a later stage, it will be possible to write Playwright e2e tests
> that traverse all three apps in a single test. For example, editing a profile
> in the 'admin' app, and then checking it updates correctly in the 'view' app.

TODO NEXT fix Nx's generator <https://medium.com/ngconf/extending-an-existing-nx-generator-4ae0e7b53484>

## Add an end-to-end test, for navigating between pages

Rename apps/view-e2e/src/example.spec.ts to apps/view-e2e/src/navigation.spec.ts
and change it to:

```ts
import { test, expect } from '@playwright/test';

test('navigates from homepage to about and back again', async ({ page }) => {
  
  // Expect the <H1> of the homepage to contain the 'view' welcome message.
  await page.goto('/tunefields/view/');
  expect(await page.locator('h1').innerText()).toContain('Welcome view');

  // Expect clicking "‘view’ about page" to navigate to the about page.
  await page.getByText('‘view’ about page').click();
  await expect(page).toHaveURL(/.*\/tunefields\/view\/about\/$/);
  expect(await page.locator('h1').innerText()).toContain('Welcome to About!');

  // Expect clicking "‘view’ home" to return to the homepage.
  await page.getByText('‘view’ home').click();
  await expect(page).toHaveURL(/.*\/tunefields\/view\/$/);
  expect(await page.locator('h1').innerText()).toContain('Welcome view');
});
```

Use `npm run e2e:view` to invoke just the 'view' end-to-end tests. 

## Use Next's `getStaticPaths()` to generate language routes

```bash
npx nx g @nx/next:page view --directory=apps/view/app/[lang] --name=[lang] --withTests
#  NX  Generating @nx/next:page
# ? Which stylesheet format would you like to use? … 
# CSS
# SASS(.scss)       [ https://sass-lang.com          ]
# LESS              [ https://lesscss.org            ]
# styled-components [ https://styled-components.com ]
# emotion           [ https://emotion.sh            ]
# styled-jsx        [ https://www.npmjs.com/package/styled-jsx ]
# None
styled-components
# ? Where should the page be generated? …
# ❯ As provided: apps/view/app/about/about.ts
#   Derived:     apps/view/app/about/about/about.ts
As provided # this is ignored, and appears to be an @nx/next bug TODO fix!
# ? Where should the page be generated? … 
# ❯ As provided: apps/view/app/about/page.tsx
#   Derived:     apps/view/apps/view/app/about/about/page.tsx
As provided # this is the path that will be used
# CREATE apps/view/app/[lang]/page.spec.tsx
# CREATE apps/view/app/[lang]/page.tsx
```

Add `'use client';` to the top of the apps/view/app/[lang]/page.tsx file. Now
`npx nx dev view` will catch all routes, eg <http://localhost:3000/anything>.

Based on <https://nextjs.org/docs/app/building-your-application/routing/internationalization#static-generation> create a apps/view/app/[lang]/layout.tsx
file to specify some commonly spoken languages:

```tsx
import '../global.css';
import { StyledComponentsRegistry } from '../registry';

export const metadata = {
  title: 'Tunefields | view',
  description: 'Explore some music!',
  icons: { icon: './favicon.ico' },
};

const langs = [
  { lang: 'en' },
  { lang: 'en-GB' },
  { lang: 'en-US' },
  { lang: 'es' },
  { lang: 'pt' },
];
const supportsLang = (l: string) => langs.some(({ lang }) => lang === l);

export async function generateStaticParams() {
  return langs;
}

export default function RootLayout({
  children, params,
}: {
  children: React.ReactNode;
  params: {
    lang: string;
  };
}) {
  const { lang } = params;
  return (
    <html lang="{supportsLang(lang) ? lang : 'en'}">
      <body>
        <StyledComponentsRegistry>
          lang: {supportsLang(lang) ? lang : `en (${lang} not supported)`}
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
```
