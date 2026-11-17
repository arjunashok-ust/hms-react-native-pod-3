// Shared Jest config for every React Native lib. A lib's jest.config.js is just:
//   import { expoLibConfig } from "../../../jest.expo.config.mjs";
//   export default expoLibConfig({ displayName: "feature-x", libPath: "libs/features/x" });
import { createRequire } from "node:module";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

// ES modules have no `require` or `__dirname`, so rebuild them.
const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(import.meta.url));

export function expoLibConfig({ displayName, libPath }) {
  return {
    displayName,
    preset: "jest-expo",
    resolver: require.resolve("@nx/jest/plugins/resolver"),
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
    testMatch: ["<rootDir>/src/**/*.(spec|test).(ts|tsx)"],
    setupFilesAfterEnv: [join(root, "jest.setup.expo.ts")],
    moduleNameMapper: {
      // Stand-in for the shared UI kit: no native date picker or image assets.
      "^@hms/shared-ui$": join(root, "jest.shared-ui.mock.tsx"),
    },
    transform: {
      "[.][jt]sx?$": ["babel-jest", { configFile: join(root, "babel.jest.cjs") }],
      "^.+[.](bmp|gif|jpg|jpeg|png|svg|webp|ttf|otf)$": require.resolve(
        "jest-expo/src/preset/assetFileTransformer.js",
      ),
    },
    // Relative to the lib, the form Nx expects for its cached outputs.
    coverageDirectory: relative(
      join(root, libPath),
      join(root, "coverage", libPath),
    ).replaceAll("\\", "/"),
  };
}
