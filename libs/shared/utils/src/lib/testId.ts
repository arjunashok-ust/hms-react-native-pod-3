export type TestIdTag = (
  strings: TemplateStringsArray,
  ...values: unknown[]
) => string;

export const createTestId =
  (namespace: string) =>
  (component: string): TestIdTag =>
  (strings, ...values) =>
    `${namespace}.${component}.${String.raw({ raw: strings }, ...values)}`;
