//@ts-check

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
  console.log('"view": Detected --production, adding custom basePath, distDir and output');
  nextConfig = {
    ...nextConfig,
    basePath: '/tunefields/view', // to host at richplastow.com/tunefields/view/
    distDir: 'view', // build to docs/view/
    output: 'export', // build the app as static HTML, for hosting on GitHub Pages
  };  
}

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
