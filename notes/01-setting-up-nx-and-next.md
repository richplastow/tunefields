# Step 1: Setting up Nx and Next

[^ Notes](./00-notes.md)

Nx is a JavaScript-friendly monorepo system, with generators for Next.js.

Based on the [nx.dev '@nx/next' tutorial:](https://nx.dev/nx-api/next#nxnext)

## Create a new Next-flavoured Nx monorepo

The 'Application name' will be 'view', because that's the simplest of the three
Tunefields apps, and easiest to get started with. 'view' will be a small
standalone tune-playback app, which can be easily shared by users.

```bash
npx create-nx-workspace@latest tunefields --preset=next
# Need to install the following packages:
# create-nx-workspace@19.1.2
# Ok to proceed? (y)
y
#  NX   Let's create a new workspace [https://nx.dev/getting-started/intro]
# ? Application name ›
view
# ? Would you like to use the App Router (recommended)? … 
# Yes
# No
Yes
# ? Would you like to use the src/ directory? … 
# Yes
# No
Yes
# ? Test runner to use for end to end (E2E) tests …
# Playwright [ https://playwright.dev/ ]
# Cypress [ https://www.cypress.io/ ]
# None
Playwright
# ? Default stylesheet format …
# CSS
# SASS(.scss)       [ https://sass-lang.com   ]
# LESS              [ https://lesscss.org     ]
# tailwind          [ https://tailwindcss.com     ]
# styled-components [ https://styled-components.com            ]
# emotion           [ https://emotion.sh                       ]
# styled-jsx        [ https://www.npmjs.com/package/styled-jsx ]
styled-components
# ? Do you want Nx Cloud to make your CI fast? …  
# (it's free and can be disabled any time)
# Yes, enable Nx Cloud
# Yes, configure Nx Cloud for GitHub Actions
# Yes, configure Nx Cloud for Circle CI
# Skip for now
Skip for now
#  NX   Creating your v19.1.2 workspace.
# ✔ Installing dependencies with npm
# ✔ Successfully created the workspace: tunefields.
#  NX   Directory is already under version control. Skipping initialization of git.
# ——————————————————————————————————————————————————————————————————————————————
#  NX   Nx CLI is not installed globally.
# This means that you will have to use "npx nx" to execute commands in the workspace.
# Run "npm i -g nx" to be able to execute command directly.
# ——————————————————————————————————————————————————————————————————————————————
#  NX   First time using Nx? Check out this interactive Nx tutorial.
# https://nx.dev/react-tutorial/1-code-generation
```

You should see a new 'tunefields' subdirectory, with a bunch of files. According
to my Mac, 472,019,905 bytes (599.6 MB on disk) for 44,815 items. Nearly double
the 333.5 MB for 28,995 items that `--preset=react-monorepo` installs.

## Move the generated Nx monorepo files to the top level

I added `Thumbs.db` to the 'System Files' section in tunefields/.gitignore file.

I also added some info near the top of the tunefields/packages.json file:

```json
{
  "name": "tunefields",
  "version": "0.0.1",
  "description": "A creative music game, built using Next.js, Nx and react-three-fiber",
  "author": "Rich Plastow",
  "private": false,
  ...
}
```

```bash
mv tunefields/README.md notes/02-nestjs-default-readme.md
mv tunefields/* . # move visible...
mv tunefields/.[!.]* . # ...and invisible items
rmdir tunefields
```

Note that the preexisting top-level .gitignore has now been modified, but the
preexisting LICENSE, README.md and notes/ remain unchanged.

## List Nx's 'inferred tasks'

Different `--preset=...` values will generate different runnable tasks. You can
see what's available using Nx's `show project` command:

```bash
npx nx show project view --web
#  NX   Project graph started at http://127.0.0.1:4211/project-details/viewer
```

A page should open showing:

```
view
Root: apps/view
Type: Application

Targets

build         next build           Cacheable
dev           next dev
lint          eslint .             Cacheable
serve-static  @nx/web:file-server
start         next start
test          jest                 Cacheable
```

The six inferred tasks are expandable - click the down-arrows to view details
about each one.

`[ctrl-c]` to stop `npx nx show project`.

## Serve a development build of the app

```bash
npx nx dev view
# > nx run view:dev
# > next dev
#   ▲ Next.js 14.2.3
#   - Local:        http://localhost:3000
#  ✓ Starting...
#    We detected TypeScript in your project and reconfigured your tsconfig.json
#    file for you. Strict-mode is set to false by default.
#    The following suggested values were added to your tsconfig.json. These
#    values can be changed to fit your project's needs:
#    	- include was updated to add '.next/types/**/*.ts'
# warning ../../../../package.json: No license field
#  ✓ Ready in 7.5s
```

Visit <http://localhost:3000/> which should show 'Welcome view 👋'.

In your browser's 'Network' developer tab, you should see eight `200` requests,
plus a `101` for Webpack's hot module reloading. Later, the build will show ten
`200` requests.

`[ctrl-c]` to stop the server.

## See what capabilities the @nx/next plugin provides

```bash
npx nx list @nx/next
#  NX   Capabilities in @nx/next:
# 
# GENERATORS
# 
# init : Initialize the `@nrwl/next` plugin.
# application : Create an application.
# page : Create a page.
# component : Create a component.
# library : Create a library.
# custom-server : Set up a custom server.
# cypress-component-configuration : cypress-component-configuration generator
# 
# EXECUTORS/BUILDERS
# 
# build : Build a Next.js application.
# server : Serve a Next.js application.
# export : Export a Next.js application. The exported application is located at `dist/$outputPath/exported`.
```

This differs from the capabilities the @nx/react plugin:

```bash
npx nx list @nx/next
#  NX   Capabilities in @nx/react:
# 
# GENERATORS
# 
# init : Initialize the `@nrwl/react` plugin.
# application : Create a React application.
# library : Create a React library.
# component : Create a React component.
# redux : Create a Redux slice for a project.
# storybook-configuration : Set up storybook for a React app or library.
# component-story : Generate storybook story for a React component
# stories : Create stories/specs for all components declared in an app or library.
# component-cypress-spec : Create a Cypress spec for a UI component that has a story.
# hook : Create a hook.
# host : Generate a host react application
# remote : Generate a remote react application
# cypress-component-configuration : Setup Cypress component testing for a React project
# component-test : Generate a Cypress component test for a React component
# setup-tailwind : Set up Tailwind configuration for a project.
# setup-ssr : Set up SSR configuration for a project.
# federate-module : Federate a module.
# 
# EXECUTORS/BUILDERS
# 
# module-federation-dev-server : Serve a host or remote application.
# module-federation-ssr-dev-server : Serve a host application along with it's known remotes.
```

## Add the 'make' application

This will be the main creative app.

```bash
npx nx g @nx/next:app make --directory=apps/make # can also add --dry-run
#  NX  Generating @nx/react:application
# ? Which E2E test runner would you like to use? …
# playwright
# cypress
# none
playwright
# ? Would you like to add React Router to this application? (y/N) › true
true
# ? Would you like to use `src/` directory? (Y/n) › true
true
# ? What should be the project name and where should it be generated? …
# ❯ As provided:
#     Name: make
#     Root: apps/make
#   Derived:
#     Name: make-make
#     Root: apps/make/make
As provided
# CREATE apps/make/index.d.ts
# CREATE apps/make/next-env.d.ts
# CREATE apps/make/next.config.js
# CREATE apps/make/public/.gitkeep
# CREATE apps/make/public/favicon.ico
# CREATE apps/make/specs/index.spec.tsx
# CREATE apps/make/tsconfig.json
# CREATE apps/make/src/app/api/hello/route.ts
# CREATE apps/make/src/app/global.css
# CREATE apps/make/src/app/page.tsx
# CREATE apps/make/src/app/layout.tsx
# CREATE apps/make/src/app/registry.tsx
# CREATE apps/make/project.json
# CREATE apps/make-e2e/project.json
# CREATE apps/make-e2e/src/example.spec.ts
# CREATE apps/make-e2e/playwright.config.ts
# CREATE apps/make-e2e/tsconfig.json
# CREATE apps/make-e2e/.eslintrc.json
# CREATE apps/make/jest.config.ts
# CREATE apps/make/tsconfig.spec.json
# CREATE apps/make/.eslintrc.json
# UPDATE package.json
# added 8 packages, and audited 1297 packages in 7s
# 241 packages are looking for funding
#   run `npm fund` for details
# found 0 vulnerabilities
#  NX   Ensuring Playwright is installed.
# use --skipInstall to skip installation.
#  NX   👀 View Details of make
# Run "nx show project make --web" to view details about this project.
```

You should see that apps/make/ and apps/make-e2e/ have been created.

> Tailwind CSS is not listed when you `npx nx g @nx/next:lib` (see below),
> so for consistency I went with 'styled-components'. Also, Tailwind causes
> a `1 moderate severity vulnerability` NPM warning.

Take a look at the 'make' app with `npx nx dev make`, which should show 
'Welcome make 👋' at <http://localhost:3000/>. `[ctrl-c]` to stop the server.

## Create 'shared-ui', a local library

A library contains a collection of React components.

The 'view' app will be a cut-down version of the full Tunefields app, so many
components will be shared between them. These should live in a new libs/ folder.

```bash
npx nx g @nx/next:lib shared-ui --directory=libs/shared/ui
#  NX  Generating @nx/next:library
# ? Which stylesheet format would you like to use? … 
# CSS
# SASS(.scss)       [ https://sass-lang.com          ]
# LESS              [ https://lesscss.org            ]
# styled-components [ https://styled-components.com ]
# emotion           [ https://emotion.sh            ]
# styled-jsx        [ https://www.npmjs.com/package/styled-jsx ]
# None
styled-components
# ? What should be the project name and where should it be generated? … 
# ❯ As provided:
#     Name: shared-ui
#     Root: libs/shared/ui
#   Derived:
#     Name: shared-ui-shared-ui
#     Root: libs/shared/ui/shared-ui
As provided
# UPDATE package.json
# CREATE libs/shared/ui/project.json
# CREATE libs/shared/ui/.eslintrc.json
# CREATE libs/shared/ui/README.md
# CREATE libs/shared/ui/src/index.ts
# CREATE libs/shared/ui/tsconfig.lib.json
# CREATE libs/shared/ui/tsconfig.json
# CREATE libs/shared/ui/src/lib/shared-ui.spec.tsx
# CREATE libs/shared/ui/src/lib/shared-ui.tsx
# UPDATE nx.json
# UPDATE tsconfig.base.json
# CREATE libs/shared/ui/src/server.ts
# CREATE libs/shared/ui/src/lib/hello-server.tsx
# added 73 packages, and audited 1370 packages in 9s
# 265 packages are looking for funding
#   run `npm fund` for details
# found 0 vulnerabilities
#  NX   👀 View Details of shared-ui
# Run "nx show project shared-ui --web" to view details about this project.
```

You should see libs/shared/ui/ (but no libs/shared/ui-e2e/) has been created.

You should also see in tsconfig.base.json that 'shared-ui' has been added:

```json
{
  "compilerOptions": {
    ...
    "paths": {
      "shared-ui": ["libs/shared/ui/src/index.ts"],
      "shared-ui/server": ["libs/shared/ui/src/server.ts"]
    }
  },
  ...
}
```

## Add a 'UiFooter' component to the shared-ui library

```bash
npx nx g @nx/next:component ui-footer --directory="libs/shared/ui/src/lib/ui-footer"
#  NX  Generating @nx/next:component
# ? Which stylesheet format would you like to use? … 
# CSS
# SASS(.scss)       [ https://sass-lang.com          ]
# LESS              [ https://lesscss.org            ]
# styled-components [ https://styled-components.com ]
# emotion           [ https://emotion.sh            ]
# styled-jsx        [ https://www.npmjs.com/package/styled-jsx ]
# None
styled-components
# ? Where should the component be generated? … 
# ❯ As provided: libs/shared/ui/src/lib/ui-footer/ui-footer.tsx
#   Derived:     libs/shared/ui/src/libs/shared/ui/src/lib/ui-footer/ui-footer/ui-footer.tsx
As provided
# CREATE libs/shared/ui/src/lib/ui-footer/ui-footer.spec.tsx
# CREATE libs/shared/ui/src/lib/ui-footer/ui-footer.tsx
```

libs/shared/ui/src/index.ts contains:

`export * from './lib/shared-ui';`

But the new UiFooter plugin will not be directly exported, so add this line:

`export * from './lib/ui-footer/ui-footer';`

libs/shared/ui/src/lib/ui-footer/ui-footer.tsx contains:

```ts
import styled from 'styled-components';

/* eslint-disable-next-line */
export interface UiFooterProps {}

const StyledUiFooter = styled.div`
  color: pink;
`;

export function UiFooter(props: UiFooterProps) {
  return (
    <StyledUiFooter>
      <footer>Welcome to UiFooter!</footer>
    </StyledUiFooter>
  );
}

export default UiFooter;
```

## Import the 'UiFooter' library into both apps

Use the new `UiFooter` component in both apps. Note that the Nx Next say that
`import { UiFooter } from '@tunefields/shared-ui';` should be used, which did
not work for me. So in apps/make/src/app/page.tsx and apps/view/src/app/page.tsx:

```tsx
'use client';

import styled from 'styled-components';
import { UiFooter } from 'shared-ui';

...

      </div>
      <UiFooter />
    </StyledPage>
  );
}
```

`npx nx dev make` and `npx nx dev view` should both show the new UiFooter
component "Welcome to UiFooter!" in pink at the bottom of the page.

You should see that changing the text of `<footer>Welcome to UiFooter!</footer>`
in libs/shared/ui/src/lib/ui-footer/ui-footer.tsx immediately changes the app.

> Another issue that Tailwind has at this point, is to leak the pink color into
> the whole page! Using styled-components avoids that issue.

## Configure Next.js for static HTML export.

Next.js is perhaps best known as a 'server side rendered' (SSR) framework, for
hosting on a Node instance. But it also supports 'static site generation' (SSG),
when a CDN is used for hosting. To switch Next to SSG mode, `output: 'export'`
must be added to the apps/make/next.config.js and apps/view/next.config.js files.

Additionally, for hosting on a non-root GitHub Pages domain, custom `basePath`
and `distDir` values must be set.

See <https://nextjs.org/docs/pages/api-reference/next-config-js> for more info.

> Note that these 3 new config values would break `npx nx dev`, so they are only
> set when the `--configuration=production` command line option is present.

Update the apps/make/next.config.js file:

```js
...
let nextConfig = {
...
if (process.env.NX_TASK_TARGET_CONFIGURATION === 'production') { // TODO make this a plugin
  console.log('"make": Detected --production, adding custom basePath, distDir and output');
  nextConfig = {
    ...nextConfig,
    basePath: '/tunefields/make', // to host at richplastow.com/tunefields/make/
    distDir: 'make', // build to docs/make/
    output: 'export', // build the app as static HTML, for hosting on GitHub Pages
  };  
}

const plugins = [
...
```

And update the apps/view/next.config.js file:

```js
...
let nextConfig = {
...
if (process.env.NX_TASK_TARGET_CONFIGURATION === 'production') { // TODO make this a plugin
  console.log('"view": Detected --production, adding custom basePath, distDir and output');
  nextConfig = {
    ...nextConfig,
    basePath: '/tunefields/view', // to host at richplastow.com/tunefields/view/
    distDir: 'view', // build to docs/view/
    output: 'export', // build the app as static HTML, for hosting on GitHub Pages
  };  
}

const plugins = [
...
```


Now running Nx's `build` command should generate static HTML files.

By default, these will appear in the apps/make/out/ and apps/view/out/ folders.
The .gitignore file specifies 'out/' as a folder not to committed to the repo.

To change the output folder to docs/make/ and docs/view/ (which GitHub Pages
hosts at /tunefields/make/ and /tunefields/view/), the apps/make/project.json
and apps/make/project.json file need updating.

See <https://nx.dev/nx-api/next/executors/build> for the more info.

```json
{
  "name": "make",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "apps/make",
  "projectType": "application",
  "tags": [],
  "// targets": "to see all targets run: nx show project make --web",
  "targets": {
    "build": {
      "executor": "@nx/next:build",
      "outputs": ["{options.outputPath}"],
      "defaultConfiguration": "production",
      "options": {
        "outputPath": "docs"
      }
    }
  }
}
```

Now both apps are ready to be built. Nx can do that in parallel, with `run-many`:

```bash
npx nx run-many -t build
#  NX   Running target build for 2 projects
#    →  Executing 2/2 remaining tasks in parallel...
#    ✔  nx run view:build:production (1m)
#    ✔  nx run make:build:production (2m)
# ——————————————————————————————————————————————————————————————————————————————
#  NX   Successfully ran target build for 2 projects (2m)
```

You should see that the docs/make/ and docs/view/ folders have been created. My
Mac says the docs/ folder is 1,547,114 bytes (1.7 MB on disk) for 69 items. The
"69 items" does not include three files in the invisible docs/view/.nx-helpers/
folder.

```bash
static-server --version # you may need to `npm i -g static-server`
# static-server@2.2.1
mv docs tunefields && static-server .
# * Static server successfully started.
# * Serving files at: http://localhost:9080
# * Press Ctrl+C to shutdown.
```

Visit the two statically served apps at <http://localhost:9080/tunefields/make/>
and <http://localhost:9080/tunefields/view/>.

`[ctrl-c]` to stop `static-server`.

```bash
mv tunefields docs
touch docs/.nojekyll # stop GitHub Pages from ignoring underscore-prefixed folders
git add .
git status
# On branch main
# Your branch is ahead of 'origin/main' by 2 commits.
#   (use "git push" to publish your local commits)
# Changes to be committed:
#   (use "git restore --staged <file>..." to unstage)
#     modified:   apps/make/next.config.js
#     modified:   apps/make/project.json
#     modified:   apps/view/next.config.js
#     modified:   apps/view/project.json
#     new file:   docs/.nx-helpers/compiled.js
#     new file:   docs/.nx-helpers/compose-plugins.js
#     new file:   docs/.nx-helpers/with-nx.js
#     new file:   docs/make/.gitkeep
#     new file:   docs/make/404.html
# ...
#     new file:   docs/view/index.html
#     new file:   docs/view/index.txt
git commit -am 'After initial static build of default Nx + Next apps, ‘make’ and ‘view’'
# [main 2a6693e] After initial static build of default Nx + Next apps, ‘make’ and ‘view’
#  57 files changed, 688 insertions(+), 8 deletions(-)
#  create mode 100644 docs/.nx-helpers/compiled.js
# ...
#  create mode 100644 docs/view/index.txt
git push
# Enumerating objects: 112, done.
# Counting objects: 100% (112/112), done.
# ...
#    4e35129..2a6693e  main -> main
```

- Visit <https://github.com/GH_USER/tunefields/settings/pages>
- Build and deployment: set 'Branch' to 'main', select '/docs', click 'Save'
- Tick the 'Enforce HTTPS' checkbox
- Visit <https://richplastow.github.io/tunefields/make/>
- Visit <https://richplastow.github.io/tunefields/view/>

You should see "Welcome make 👋" and "Welcome view 👋".

## Create package.json scripts for building and running the apps locally

I found that running `npx nx run-many -t build` sometimes crashed if the docs/
folder already existed. Also, we may find later that old build-files hang around
in docs/ long after they are needed. A better approach is to have a `"build"`
script in the package.json `"scripts"` object, that deletes the docs/ folder if
it exists, and then tells Nx to build from scratch.

After Next's production build, docs/ contains a lot of files we don't need for
hosting on GitHub Pages, and so should be deleted after the build:

```
.nx-helpers/     -> contains 3 files for Nx, none are needed
make/.gitkeep    -> not needed, and could probably remove some more from make/
next.config.js   -> not needed
package.json     -> not needed
public/          -> contains 2 files, neither is needed
view/.gitkeep    -> not needed, and could probably remove some more from view/
```

Given that we also need to add docs/.nojekyll and docs/404.html files, the new
`"build"` script would be too complicated to be a one-liner in the package.json
`"scripts"` object. Create a folder named scripts/ in the top-level, and then
scripts/post-build.mjs:

```js
import { rmSync, writeFileSync } from 'node:fs';

// Delete files and folders that are not needed for hosting on GitHub Pages.
const rf = { recursive: true }; // equivalent to '-rf' in 'rm -rf'
try { rmSync('docs/.nx-helpers', rf) } catch(e) {} // contains 3 files for Nx, none are needed
try { rmSync('docs/make/.gitkeep') } catch(e) {} // TODO probably remove some more
try { rmSync('docs/next.config.js') } catch(e) {} // not needed
try { rmSync('docs/package.json') } catch(e) {} // not needed
try { rmSync('docs/public', rf) } catch(e) {} // contains 2 files, neither is needed
try { rmSync('docs/view/.gitkeep') } catch(e) {} // TODO probably remove some more

// Create top-level files needed for hosting on GitHub Pages. The .nojekyll file
// (which is empty) stops GitHub Pages from ignoring underscore-prefixed folders.
// The 404.html file will be used for incorrect routes, but also for redirecting
// deep-links to dynamic routes.
writeFileSync('docs/.nojekyll', '');
writeFileSync('docs/404.html', [
    '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">',
    '<title>Not Found TODO</title>',
    '</head><body><h1>Not Found TODO</h1></body></html>',
    ].join('\n')
);
```

Add these 3 scripts to package.json:

```json
...
  "scripts": {
    "build": "rm -rf docs && npx nx run-many -t build --configuration=production && node scripts/post-build.mjs",
    "clean": "rm -rf .nx && rm -rf dist && rm -rf apps/make/.next rm -rf apps/make/out && rm -rf apps/view/.next && rm -rf apps/view/out && npx nx reset",
    "start": "mv docs tunefields && static-server -n tunefields/404.html . && mv tunefields docs"
  },
...
```

Use the new `"build"` script to build both apps in parallel, and prepare the
resulting docs/ folder for hosting on GitHub Pages:

```bash
npm run build
# > tunefields@0.0.1 build
# > rm -rf docs && npx nx run-many -t build --configuration=production && node scripts/post-build.mjs
#    ✔  nx run make:build:production (38s)
#    ✔  nx run view:build:production (40s)
# ——————————————————————————————————————————————————————————————————————————————
#  NX   Successfully ran target build for 2 projects (40s)
```

If you encounter an Nx error, `npm run clean` may help.

The docs/ folder should now contain:

```
make/            -> no longer contains .gitkeep
view/            -> no longer contains .gitkeep
.nojekyll        -> stops GitHub Pages from ignoring underscore-prefixed folders
404.html         -> for incorrect routes, and redirecting dynamic deep-links
```

```bash
npm start # 'start' is a standard NPM script name, so no need for `npm run start`
# > tunefields@0.0.1 start
# > mv docs tunefields && static-server -n tunefields/404.html . && mv tunefields docs
# * Static server successfully started.
# * Serving files at: http://localhost:9080
# * Press Ctrl+C to shutdown.
```

While `static-server` is running, you should see that the docs/ folder has been
renamed to tunefields/ - and after you `[ctrl-c]` its name should revert back.

Visit the two statically served apps at <http://localhost:9080/tunefields/make/>
and <http://localhost:9080/tunefields/view/>, and also check that the 404.html
file is being served, <http://localhost:9080/no-such-route>.

`[ctrl-c]` to stop `static-server`.

## Fix the page title and missing favicon.ico

In apps/make/src/app/layout.tsx and apps/view/src/app/layout.tsx change the
default `title` to `'Tunefields | make'` and `'Tunefields | view'`.

Change the `description` to `'Create some music!'` and `'Explore some music!'`.

And add `icons: { icon: './favicon.ico' },` to both `metadata` objects.

`npx nx dev ...` and `npm run build && npm start` should show that the metadata
is working for both apps.

## View the project graph

```bash
npx nx graph
#  NX   Project graph started at http://127.0.0.1:4211/projects
```

A page should open. Click 'Show all projects' to see the relationship between
apps and libraries.

`[ctrl-c]` to stop `npx nx graph`.

## Lint, and run unit tests

Update apps/make/.eslintrc.json and apps/view/.eslintrc.json to ignore the out/
folder:

```json
...
  "ignorePatterns": ["!**/*", ".next/**/*", "out/**/*"],
...
```

Currently, the generated components in libs/ are being found for linting, but
not being found for unit testing. Add a libs/shared/ui/jest.config.ts file,
which is just a copy of apps/make/jest.config.ts with updated paths:

```ts
/* eslint-disable */
export default {
  displayName: 'make',
  preset: '../../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/next/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/apps/make',
};
```

Lint the apps and library in parallel.

```bash
npx nx run-many -t lint
#    ✔  nx run shared-ui:lint (7s)
#    ✔  nx run make-e2e:lint (9s)
#    ✔  nx run make:lint (16s)
#    ✔  nx run view:lint (17s)
#    ✔  nx run view-e2e:lint (10s)
# ——————————————————————————————————————————————————————————————————————————————
#  NX   Successfully ran target test for 5 projects (9s)
```

Run unit tests on the apps and library in parallel.

> Note that running linting or the unit tests again immediately afterwards will
> be faster, because Nx uses its cache.

```bash
npx nx run-many -t test
#    ✔  nx run shared-ui:test (6s)
#    ✔  nx run view:test (7s)
#    ✔  nx run make:test (7s)
# ——————————————————————————————————————————————————————————————————————————————
#  NX   Successfully ran target test for 3 projects (7s)
```

Run end-to-end tests on both apps. These need to be done one at a time. If you
encounter a Playwright error, `npm run clean` may help.

> If your /Users/richplastow/Library/Caches/ms-playwright/ folder is missing or
> does not have the correct binaries, for any reason, run the Playwright update
> command `npx playwright install --with-deps`

```bash
npx nx e2e make-e2e
# > nx run make-e2e:e2e
# > playwright test
# Running 3 tests using 2 workers
#   3 passed (53.7s)
# To open last HTML report run:
#   npx playwright show-report ../../dist/.playwright/apps/make-e2e/playwright-report
# ——————————————————————————————————————————————————————————————————————————————
#  NX   Successfully ran target e2e for project make-e2e (55s)
```

```bash
npx nx e2e view-e2e
# > nx run view-e2e:e2e
# > playwright test
# Running 3 tests using 2 workers
#   3 passed (44.8s)
# To open last HTML report run:
#   npx playwright show-report ../../dist/.playwright/apps/view-e2e/playwright-report
# ——————————————————————————————————————————————————————————————————————————————
#  NX   Successfully ran target e2e for project view-e2e (47s)
```

After running end-to-end tests, the doc/ folder is filled with files we don't
need again. Run `node scripts/post-build.mjs` to remove them.

Add two scripts to `"scripts"`, in the top-level package.json file:

```json
...
    "e2e:make": "npx nx e2e make-e2e && node scripts/post-build.mjs",
    "e2e:view": "npx nx e2e view-e2e && node scripts/post-build.mjs",
...
```

To see this working, change the word "Welcome" to "Something Else" in the
apps/view/src/app/page.tsx file.

```bash
npm run e2e:view
# > tunefields@0.0.1 e2e:view
# > npx nx e2e view-e2e && node scripts/post-build.mjs
# > nx run view-e2e:e2e
# > playwright test
# Running 3 tests using 2 workers
#   1) [chromium] › example.spec.ts:3:5 › has title ────────────────────────────
#     Error: expect(received).toContain(expected) // indexOf
#     Expected substring: "Welcome"
#     Received string:    "Hello there, Something Else view 👋"
#       5 |
#       6 |   // Expect h1 to contain a substring.
#     > 7 |   expect(await page.locator('h1').innerText()).toContain('Welcome');
#         |                                                ^
#       8 | });
#       9 |
#         at .../tunefields/apps/view-e2e/src/example.spec.ts:7:48
#   2) [webkit] › example.spec.ts:3:5 › has title ──────────────────────────────
#     Error: expect(received).toContain(expected) // indexOf
#     Expected substring: "Welcome"
#     Received string:    "Hello there, Something Else view 👋"
#       5 |
#       6 |   // Expect h1 to contain a substring.
#     > 7 |   expect(await page.locator('h1').innerText()).toContain('Welcome');
#         |                                                ^
#       8 | });
#       9 |
#         at .../tunefields/apps/view-e2e/src/example.spec.ts:7:48
#   3) [firefox] › example.spec.ts:3:5 › has title ─────────────────────────────
#     Error: expect(received).toContain(expected) // indexOf
#     Expected substring: "Welcome"
#     Received string:    "Hello there, Something Else view 👋"
#       5 |
#       6 |   // Expect h1 to contain a substring.
#     > 7 |   expect(await page.locator('h1').innerText()).toContain('Welcome');
#         |                                                ^
#       8 | });
#       9 |
#         at .../tunefields/apps/view-e2e/src/example.spec.ts:7:48
#   3 failed
#     [chromium] › example.spec.ts:3:5 › has title ─────────────────────────────
#     [firefox] › example.spec.ts:3:5 › has title ──────────────────────────────
#     [webkit] › example.spec.ts:3:5 › has title ───────────────────────────────
#   Serving HTML report at http://localhost:9323. Press Ctrl+C to quit.
```

If an e2e test times out, you may need to run `rm -rf docs`.

Other kinds of failed e2e tests may need `npm run clean && rm -rf docs`.

---

Next, we will add support for ['Not Found' and deep links.](
./03-not-found-and-deep-links.md)