// Babel config used only by Jest (see jest.expo.config.js).
module.exports = function (api) {
  api.cache(true);
  return { presets: ["babel-preset-expo"] };
};
