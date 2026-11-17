import { createRequire } from "node:module";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

// ES modules have no `require` or `__dirname`, so rebuild them.
const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  displayName: "feature-authentication",
  preset: "jest-expo",
  resolver: require.resolve("@nx/jest/plugins/resolver"),
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  testMatch: ["<rootDir>/src/**/*.(spec|test).(ts|tsx)"],
  setupFilesAfterEnv: ["<rootDir>/src/test-setup.ts"],
  transform: {
    "[.][jt]sx?$": ["babel-jest", { configFile: __dirname + "/.babelrc.js" }],
    "^.+[.](bmp|gif|jpg|jpeg|png|svg|webp|ttf|otf)$": require.resolve(
      "jest-expo/src/preset/assetFileTransformer.js",
    ),
  },
  coverageDirectory: "../../../coverage/libs/features/authentication",
};