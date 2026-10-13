Below is a complete migration plan you can copy into an `.md` file. Ask mode can’t create the file in the repo — switch to Agent mode if you want it written under `docs/`.

---

```markdown
# React Native Migration Plan: Adopt Polaris Architecture

**Scope:** React Native client only (shell, Module Federation, packages, navigation, design system, client data layer).  
**Out of scope:** Node.js / NestJS / tRPC server changes, DB, infra.  
**Source of truth (this monorepo):** `apps/ui/mobile-host`, `apps/ui/*` remotes, `packages/frontend/*`, `docs/microapp-host-compatibility.md`, `docs/navigation/`.

---

## 1. Goal

Replicate Polaris’s **host + federated microapps** model in your existing React Native app so that:

- A thin **shell (host)** owns auth session, native modules, theme shell, navigation coordination, and remote loading.
- **Feature UIs** live as independently built **Module Federation remotes** (OTA-capable when host-compatible).
- The app continues to call your **existing Node.js APIs** over HTTP (REST and/or tRPC) with **client-only adapters** — no backend rewrite.

### Target shape

```
Your RN binary (host / shell)
├── Providers (theme, query, language, auth, native APIs)
├── Navigation coordination + deep links
├── Module Federation loader (Re.Pack / RSPack)
└── Thin feature screens → loadRemote('claims/MicroApp') etc.

Remotes (JS bundles, deployable separately when OTA-safe)
├── authentication | claims | benefits | …
│   ├── remote-entry → MicroApp
│   ├── internal React Navigation stack
│   ├── screens / components / content
│   └── typed API client against existing Node endpoints

Shared libraries (workspace packages, not Nest)
├── design system (@polaris/components or fork)
├── frontend-shared (helpers, MicroAppContext, tRPC/HTTP factories)
├── frontend-core (true singletons only)
└── frontend-native-api (contracts; implementations stay in host)
```

---

## 2. What Polaris Owns Where (boundaries to copy)

| Concern | Owner | Do not put in remotes |
|--------|--------|------------------------|
| Native modules (camera, pickers, maps, biometrics) | Host | Native deps in shared packages/remotes |
| Auth session / token storage / login orchestration | Host | Own token vault per remote |
| Theme shell + `ComponentsProvider` | Host (+ remote ThemeProvider from context) | Hardcoded colors/spacing |
| Cross-feature navigation / deep links | Host `NavigationHandler` | Hardcoded cross-app navigators |
| Feature screens & business UI | Remotes | Permanent feature UI in host |
| API transport | Client factories in shared package | Nest services inside RN |

Reference host ownership: `apps/ui/mobile-host` — especially `src/app/app.tsx`, `appInnerChild.tsx`, `utils/initiateMicroApps.ts`, `navigation/`, `services/`.

---

## 3. Non-goals

- Changing Node route shapes, auth server, or DB.
- Requiring Nest packages inside the RN binary.
- Big-bang rewrite of all screens before the first remote loads.
- Treating `@polaris/frontend-shared` as a native MF singleton (Polaris **bundles** it per remote for OTA safety).

---

## 4. Prerequisites / inventory (Phase 0)

Document current app before moving code:

1. **Auth:** how tokens are obtained, refreshed, stored; header names your Node API expects.
2. **API surface:** REST vs tRPC; base URLs; tenant/env headers if any.
3. **Navigation:** stacks/tabs/deep links; which flows are cross-feature.
4. **Native modules:** list every native dependency (camera, maps, etc.).
5. **Feature map:** group screens into candidate remotes (e.g. auth, claims, profile).
6. **Bundle tooling:** Metro today? Plan Re.Pack + Module Federation (Polaris path) or a staged “in-process modules” interim.

**Exit criteria:** Written inventory + decision on MF Day-1 vs phased MF after shell.

---

## 5. Phased migration

### Phase 1 — Shell foundation (no remotes yet)

Build the Polaris-like host inside your app (or greenfield host that replaces the root).

**Deliverables**

1. Root provider stack (order similar to Polaris):
   - Config / env
   - Language / i18n
   - React Query `QueryClientProvider`
   - Theme + design-system provider
   - Safe area / device type
   - Error boundary
   - Auth provider (your backend)
2. **Native API boundary:** host implements services; UI code calls contracts only (mirror `@polaris/frontend-native-api/*` subpaths).
3. Persistent storage adapter for session/cache.
4. Align major shared deps versions (React, RN, Navigation, Query) — treat like Polaris `apps/ui/mf-tools/native.dependencies.json`.

**Exit criteria:** App boots with theme + authenticated session; still one bundle; no MF required.

**Polaris references**

- Provider tree: `apps/ui/mobile-host/src/app/app.tsx`, `appInnerChild.tsx`
- Native services: `apps/ui/mobile-host/src/app/services/`
- Native API contracts: `packages/frontend/native-api`

---

### Phase 2 — Client data adapters (backend unchanged)

Point the shell at your **existing** Node APIs.

**Deliverables**

1. HTTP/tRPC client factories equivalent to:
   - `packages/frontend/shared/src/lib/trpc/createTrpcClient.ts`
   - Public vs secure clients (auth headers from shell token).
2. Config: `apiDomain`, path prefix, version, tenant header — match what Node already expects.
3. One vertical typed: either reuse OpenAPI/tRPC router **types** or hand-written DTOs — compile-time only.
4. One real screen using React Query (`useSuspenseQuery` + boundary pattern optional).

**Adapter rules**

- Prefer thin adapters over rewriting APIs.
- Keep Nest/runtime out of RN; only types + HTTP.
- MSW for Storybook/Jest only, not production.

**Exit criteria:** Authenticated shell fetches real data from current Node server.

---

### Phase 3 — Module Federation host plumbing

Enable dynamic remote loading (Polaris: Re.Pack `ScriptManager` + `registerRemotes` / `loadRemote`).

**Deliverables**

1. Host MF config + script resolution/caching strategy.
2. Minimal **`MicroAppContext`** contract (Zod-validated subset OK):
   - `accessToken`, user/tenant ids as needed
   - navigation handler
   - native API handlers / host slots (add as needed)
3. Host feature wrapper pattern:
   - Suspense + ErrorBoundary
   - retry around `loadRemote`
   - inject full context
4. Host navigation container + linking stub + cross-feature handler.

**Exit criteria:** Host loads a hello-world remote that receives context and renders a screen.

**Polaris references**

- `apps/ui/mobile-host/src/app/utils/initiateMicroApps.ts`, `loadRemote.tsx`
- Context: `packages/frontend/shared/src/lib/microappContext.ts`
- Eager shared lists: `apps/ui/mf-tools/webpack.eager.modules.js`, `native.dependencies.json`
- OTA rules: `docs/microapp-host-compatibility.md`

---

### Phase 4 — First production remote

Pick one vertical (often auth or highest-churn feature). Scaffold like `apps/ui/claims`:

```
<remote>/
├── module-federation.config.ts
├── rspack.config.* 
├── src/
│   ├── remote-entry.ts          # export MicroApp + pathConfig
│   ├── app/
│   │   ├── microApp.tsx         # MicroAppProperties contract
│   │   ├── providers/
│   │   ├── navigation/          # internal stack only
│   │   ├── screens/
│   │   ├── components/
│   │   └── content/
│   └── trpc.ts | api.ts         # client against existing Node API
└── .storybook/
```

**Rules**

- Screens import within the microapp only (no screen→screen across remotes).
- Cross-feature nav goes through host handler.
- Avoid adding **required** fields to `MicroAppProperties` without shipping a new host binary.

**Exit criteria:** One feature loads from remote (or local MF) against existing APIs; Storybook + MSW for that screen.

---

### Phase 5 — Design system & shared packages

1. Adopt or fork `@polaris/components` (Paper under the hood; apps never import Paper directly).
2. Theme tokens via generated bags + `ThemeProvider(themeKey)` (Polaris: `theme:build` → `packages/frontend/shared/.../themes/`).
3. Split libraries:
   - **frontend-core-like:** true singletons on MF shared list.
   - **frontend-shared-like:** helpers, auth store, clients — **bundled per remote** on native.
4. Content bags for user-visible strings (avoid hardcoded copy in screens).

**Exit criteria:** New UI uses tokens + DS components only.

---

### Phase 6 — Cross-feature navigation, host slots, optional shared remotes

1. Register each remote’s `pathConfig` with the host for deep links.
2. Primitive, URL-safe route params only; fetch by ID on destination.
3. Host slots for host-owned widgets inside remotes (e.g. chat FAB).
4. Optional versioned `*-shared` remotes for cross-microapp UI (see `docs/microapps/microapp-injection-and-sharing.md`).

**Exit criteria:** Deep links and cross-feature flows work without remotes importing each other.

---

### Phase 7 — Remaining features + OTA discipline

1. Migrate one remote at a time; delete dead host feature UI after parity.
2. CI host-compat check (Polaris: `tools/host-compat/`) — flag changes that require App Store/Play rebuild.
3. Per-remote `minHostVersion` metadata.
4. Preload policy for critical remotes (Polaris preloads auth/claims-style pilots).

**Exit criteria:** Feature teams can ship OTA remotes when host-compatible; native releases only when contracts/deps force it.

---

## 6. Suggested target repo layout (standalone app)

You do not need the full Polaris monorepo. Minimal viable:

```
apps/
  mobile-host/          # your shell (native binary)
  claims/               # first remote
  authentication/       # optional
packages/
  frontend-core/
  frontend-shared/
  components/           # or vendor @polaris/components
  frontend-native-api/
  models/               # shared Zod/DTO types used by client (optional)
```

Keep Node APIs in their current repo/service; consume via URL + types only.

---

## 7. Backend-unchanged integration checklist

| Item | Action on RN only |
|------|-------------------|
| Base URL / env | Host config → client factories |
| Auth headers | Shell token → secure client link |
| Tenant / custom headers | Map in client header builder |
| Response shapes | Client DTOs/Zod; tolerate existing Nest contracts |
| Errors | Map HTTP/tRPC errors in UI boundaries |
| Realtime / uploads | Keep existing endpoints; wrap in host services if native |

Do **not** require Polaris’s multi-tenant NGINX proxy model unless you already have it.

---

## 8. Risk register

| Risk | Mitigation |
|------|------------|
| Shared dep / context churn forces frequent native releases | Freeze `MicroAppContext` early; host-compat CI; prefer optional fields |
| MF complexity before value | Phase 1–2 first; delay MF until shell + one vertical proven |
| Duplicate React Query / theme instances | Accept Polaris pattern (shared not singleton on native); keep core singletons only |
| Native modules leaking into remotes | Lint/restrict imports to `frontend-native-api` |
| Deep link races before remote load | Host loads `pathConfig` before navigate (Polaris `loadRemotePathConfig`) |

---

## 9. Verification per phase

| Phase | Prove |
|-------|--------|
| 1 | Cold start → login → themed home (monolith) |
| 2 | One authenticated API call to **current** Node |
| 3 | Hello remote renders with injected token |
| 4 | Feature parity for vertical + Storybook |
| 5 | No hardcoded colors in new screens |
| 6 | Deep link into remote screen works |
| 7 | OTA remote update without store release (compat case) |

---

## 10. Recommended first 30 / 60 / 90 days

**Days 1–30:** Phase 0–1 — inventory, shell providers, auth, native API boundary.  
**Days 31–60:** Phase 2–3 — API adapters + MF hello-world.  
**Days 61–90:** Phase 4–5 — first real remote + design system adoption; start Phase 6 for nav.

---

## 11. Key Polaris paths to study

| Topic | Path |
|-------|------|
| Host shell | `apps/ui/mobile-host/src/app/` |
| MF init | `apps/ui/mobile-host/src/app/utils/initiateMicroApps.ts` |
| Example remote | `apps/ui/claims/src/app/microApp.tsx`, `remote-entry.ts` |
| Context contract | `packages/frontend/shared/src/lib/microappContext.ts` |
| tRPC clients | `packages/frontend/shared/src/lib/trpc/createTrpcClient.ts` |
| MF sharing rules | `.cursor/rules/frontend/polaris-package-mf-sharing.mdc` |
| OTA vs rebuild | `docs/microapp-host-compatibility.md` |
| Navigation | `docs/navigation/architecture.md` |
| Storybook | `docs/frontend/storybook.md` |

---

## 12. Decision log (fill in for your app)

| Decision | Options | Choice |
|----------|---------|--------|
| MF Day-1 vs delayed | Full Re.Pack MF now / later | |
| Design system | Adopt Polaris components / fork / own Paper tokens | |
| API client | tRPC client / REST + React Query / hybrid | |
| First remote | auth / claims / … | |
| Monorepo tool | Nx / pnpm workspaces only | |
```

---

### How to use this

1. Copy into e.g. `docs/rn-polaris-architecture-migration.md` in your app repo.  
2. Fill §12 with your choices.  
3. Start at Phase 0–1; do **not** introduce MF until the shell and one API call work.

If you share your current RN stack (Metro vs Re.Pack, REST vs tRPC, nav library), I can tailor Phase 2–3 to your exact API/auth headers. Switch to Agent mode if you want this file written into the monorepo.