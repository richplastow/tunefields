import { rmSync, writeFileSync } from 'node:fs';

// Delete files and folders that are not needed for hosting on GitHub Pages.
const rf = { recursive: true }; // equivalent to '-rf' in 'rm -rf'
rmSync('docs/.nx-helpers', rf); // contains 3 files for Nx, none are needed
rmSync('docs/make/.gitkeep'); // TODO probably remove some more
rmSync('docs/next.config.js'); // not needed
rmSync('docs/package.json'); // not needed
rmSync('docs/public', rf); // contains 2 files, neither is needed
rmSync('docs/view/.gitkeep'); // TODO probably remove some more

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
