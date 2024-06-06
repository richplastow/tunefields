# Step 3: 'Not Found' and deep links

[^ Notes](./00-notes.md)

## Add the 'about' page to the 'make' app

> TODO fix `npx nx g @nx/next:page` - it always makes a file called page.tsx,
> and the generated .spec.tsx file is placed in the wrong folder.

Based on <https://nx.dev/nx-api/next/generators/page>, use NX's 'page' generator
to create an 'about' page for the 'make' app:

```bash
npx nx g @nx/next:page make --directory=apps/make/pages --name=about --nameAndDirectoryFormat=as-provided --withTests
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
# ❯ As provided: apps/make/pages/about.ts
#   Derived:     apps/make/pages/about/about.ts
As provided
# CREATE apps/make/pages/page.spec.tsx
# CREATE apps/make/pages/page.tsx
mv apps/make/pages/page.spec.tsx apps/make/specs/about.spec.tsx
mv apps/make/pages/page.tsx apps/make/pages/about.tsx
```

You should see that two files have been created. 

Change `import About from './page'` to `import About from '../pages/about'`:

```tsx
import { render } from '@testing-library/react';

import About from '../pages/about';

describe('About', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<About />);
    expect(baseElement).toBeTruthy();
  });
});
```

```tsx
import styled from 'styled-components';

/* eslint-disable-next-line */
export interface AboutProps {}

const StyledAbout = styled.div`
  color: pink;
`;

export default function About(props: AboutProps) {
  return (
    <StyledAbout>
      <h1>Welcome to About!</h1>
    </StyledAbout>
  );
}
```

To check it works, run `npx nx dev make` and visit <http://localhost:3000/about>,
where you should see "Welcome to About!" in pink.

## Add initial links

Update the apps/make/pages/about.tsx page, and also apps/make/src/app/page.tsx:

```tsx
import Link from 'next/link';
...
      <Link href="/">‘make’ home</Link>
    </StyledAbout>
```

```tsx
'use client';

import Link from 'next/link';
...
  return (
    <StyledPage>
      <Link href="/about">‘make’ about page</Link>
...
```

Assuming `npx nx dev make` is still running, you should be able to navigate
between the two pages.

## Check that navigation and deep-linking works for the SSG build

Run `npm run build && npm start` and then deep-link to the 'make' about page
<http://localhost:9080/tunefields/make/about>, and click the navigation to check
that there's no surprises. The three routes `make/about`, `make/about/` and
`make/about/index.html` should all work.

After `[ctrl-c]` to stop `static-server` running, docs/make/about/index.html
should have been added. Push it to your repo, to check it on GitHub Pages.
