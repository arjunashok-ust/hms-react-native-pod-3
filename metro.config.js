const { getDefaultConfig } = require('expo/metro-config');
const https = require('https');

const config = getDefaultConfig(__dirname);
const PROXY_PREFIX = '/api/';

// Zscaler drops browser requests to the backend, so in web dev the browser calls /api/* on Metro and Metro forwards them.
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => (req, res, next) => {
    if (!req.url.startsWith(PROXY_PREFIX)) {
      return middleware(req, res, next);
    }

    const target = new URL(req.url.slice(PROXY_PREFIX.length), process.env.EXPO_PUBLIC_API_URL);
    const { 'user-agent': _userAgent, ...headers } = req.headers;

    const proxyReq = https.request(
      target,
      { method: req.method, headers: { ...headers, host: target.host } },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
      },
    );
    proxyReq.on('error', (err) => {
      res.statusCode = 502;
      res.end(`Proxy error: ${err.message}`);
    });
    req.pipe(proxyReq);
  },
};

module.exports = config;
