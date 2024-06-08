//@ts-check

const createNextIntlPlugin = require('next-intl/plugin');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
let nextConfig = {
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },

  compiler: {
    // For other options, see https://styled-components.com/docs/tooling#babel-plugin
    styledComponents: true,
  },
};

if (process.env.NX_TASK_TARGET_CONFIGURATION === 'production') { // TODO make this a plugin
  console.log('"make": Detected --production, adding custom basePath, distDir, output and trailingSlash');
  nextConfig = {
    ...nextConfig,
    basePath: '/tunefields/make', // to host at richplastow.com/tunefields/make/
    distDir: 'make', // build to docs/make/
    output: 'export', // build the app as static HTML, for hosting on GitHub Pages
    trailingSlash: true, // build /about to /about/index.html not /about.html
  };
}

const plugins = [
  withNx,
  createNextIntlPlugin('./i18n.ts'),
];

module.exports = composePlugins(...plugins)(nextConfig);
