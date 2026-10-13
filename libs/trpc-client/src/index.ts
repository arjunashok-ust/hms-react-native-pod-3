// Type-only: the router value calls initTRPC.create(), which @trpc/server rejects outside a server runtime.
export type { AppRouter } from './lib/app-router';
export * from './lib/router-types';
export * from './lib/create-trpc-client';
export * from './lib/trpc';
export * from './lib/token-storage';
