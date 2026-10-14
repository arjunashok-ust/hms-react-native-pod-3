const https = require('https');
const { withNxMetro } = require('@nx/expo');
const { getDefaultConfig } = require('@expo/metro-config');
const { mergeConfig } = require('metro-config');

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const customConfig = {
  cacheVersion: "mobile",
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...sourceExts, 'cjs', 'mjs', 'svg'],
  },
};


// Web dev only: forward /api/* to the backend so the browser sees same-origin requests (no CORS).
// /api/trpc/auth.login -> https://backend.fortrancer.in/trpc/auth.login
const BACKEND = new URL('https://backend.fortrancer.in');

const apiProxy = (middleware) => (req, res, next) => {
  if (!req.url.startsWith('/api/')) return middleware(req, res, next);

  const upstream = https.request(
    {
      host: BACKEND.hostname,
      port: 443,
      method: req.method,
      path: req.url.slice('/api'.length),
      headers: { ...req.headers, host: BACKEND.host, origin: BACKEND.origin },
    },
    (proxyRes) => {
      const headers = { ...proxyRes.headers };
      // Cookies must be scoped to localhost, not the backend domain.
      if (headers['set-cookie']) {
        headers['set-cookie'] = headers['set-cookie'].map((c) =>
          c.replace(/;\s*Domain=[^;]*/i, '').replace(/;\s*Secure/i, '').replace(/;\s*SameSite=None/i, '; SameSite=Lax')
        );
      }
      res.writeHead(proxyRes.statusCode, headers);
      proxyRes.pipe(res);
    }
  );
  upstream.on('error', (err) => {
    res.writeHead(502);
    res.end(`Proxy error: ${err.message}`);
  });
  req.pipe(upstream);
};

customConfig.server = {
  enhanceMiddleware: apiProxy,
};

module.exports = withNxMetro(mergeConfig(defaultConfig, customConfig), {
  // Change this to true to see debugging info.
  // Useful if you have issues resolving modules
  debug: false,
  // all the file extensions used for imports other than 'ts', 'tsx', 'js', 'jsx', 'json'
  extensions: [],
  // Specify folders to watch, in addition to Nx defaults (workspace libraries and node_modules)
  watchFolders: [],
});
