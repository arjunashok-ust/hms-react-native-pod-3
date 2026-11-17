// Runs before every test file in every React Native lib.
jest.mock('expo/src/winter/ImportMetaRegistry', () => ({
  ImportMetaRegistry: {
    get url() {
      return null;
    },
  },
}));

// Expo SDK 55+ installs lazy winter-runtime globals (fetch, URL, etc.) that
// require files Jest treats as "outside of the scope of the test code" in a
// monorepo. Replace them with the runtime's own globals so the lazy getters
// never fire during tests.
const defineGlobal = (name: string, value: unknown) => {
  try {
    Object.defineProperty(global, name, {
      value,
      configurable: true,
      writable: true,
    });
  } catch {
    // Ignore environments that don't allow redefining these globals.
  }
};
defineGlobal('fetch', globalThis.fetch);
defineGlobal('Headers', globalThis.Headers);
defineGlobal('Request', globalThis.Request);
defineGlobal('Response', globalThis.Response);
defineGlobal('FormData', globalThis.FormData);
defineGlobal('URL', globalThis.URL);
defineGlobal('URLSearchParams', globalThis.URLSearchParams);

// Icons load fonts asynchronously, which floods the output with act() warnings.
// No test depends on the icon itself.
jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
}));

if (typeof global.structuredClone === 'undefined') {
  (global as { structuredClone?: unknown }).structuredClone = (object: unknown) =>
    JSON.parse(JSON.stringify(object));
}
