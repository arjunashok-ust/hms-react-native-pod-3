Below is a **copy-pasteable migration plan**. I’m in **Ask mode**, so I can’t write the file into the repo—switch to Agent mode if you want it saved (e.g. `.cursor/plans/migrate-basic-rn-to-polaris.md`).

Several sections assume a “basic RN + hosted Node API” starting point. Fill the **Open questions** before Phase 1 kicks off.

---

```markdown
# Migration Plan: Basic React Native App → Polaris Architecture

**Status:** Draft (needs intake answers)  
**Audience:** App owners migrating a standalone RN client + hosted Node.js API into the Polaris monorepo  
**Base reference:** Polaris monorepo (`apps/ui/*`, `apps/api/*`, `packages/*`)  
**Date:** 2026-09-30

---

## 1. Executive summary

Polaris is not “another RN template.” It is a **multi-tenant, Module Federation platform**:

| Layer | What you get |
| --- | --- |
| **Shell** | `apps/ui/mobile-host` — auth session, MF loading, theme, shared providers, navigation coordination |
| **UI remotes** | Feature microapps under `apps/ui/<feature>` — RN + RN-Web, independent OTA when host-compatible |
| **Contracts** | `packages/models` (Zod) + `packages/platform-integration/sdk/<domain>` (tRPC routers + service interfaces) |
| **APIs** | NestJS apps under `apps/api/<domain>` with **tenant-specific** service implementations |
| **Shared UI** | `@polaris/components` (Paper-based design system), content/i18n, Storybook-first |

**Recommended strategy:** migrate **feature-by-feature** (strangler), not a big-bang rewrite. Keep your hosted Node API behind a Polaris **BFF/gateway** first if rewriting the API is high risk; converge to full SDK + tenant services when stable.

---

## 2. Target architecture (what “done” looks like)

```text
┌─────────────────────────────────────────────────────────────┐
│  mobile-host (shell)                                        │
│  auth · theme · MF host · nav · shared context              │
└───────────────┬───────────────────────────────┬─────────────┘
                │ loads remotes                  │
                ▼                                ▼
     ┌──────────────────┐             ┌──────────────────┐
     │ your-feature MF  │             │ authentication  │
     │ apps/ui/<name>   │             │ (or host login)  │
     └────────┬─────────┘             └────────┬─────────┘
              │ tRPC client                     │
              ▼                                 ▼
     ┌────────────────────────────────────────────────────┐
     │ apps/api/<domain> (NestJS + tRPC)                  │
     │  sdk routers → service tokens → tenant impls       │
     └───────────────────────┬────────────────────────────┘
                             │ HTTP / existing contracts
                             ▼
                   ┌─────────────────────┐
                   │ Your existing Node  │  ← Phase A–B: keep hosted
                   │ backend (hosted)    │  ← Phase C+: optional rewrite
                   └─────────────────────┘
```

**Non-goals (unless explicitly added later):**
- Replacing production infra (AKS/NGINX) on day one
- Multi-tenant CMS/feature-flag parity with elevance tenants before first feature ships
- Full parity with every Polaris microapp (claims, benefits, idcard, …)

---

## 3. Intake checklist (complete before coding)

### 3.1 Current app inventory

| Item | Your answer | Why it matters |
| --- | --- | --- |
| RN version / Expo vs bare | | Align with host RN + Re.Pack |
| Platforms (iOS / Android / Web) | | Polaris is RN + RN-Web |
| Navigation lib | | Map to host + in-microapp stacks |
| State (Redux/Zustand/Context) | | Prefer React Query + microapp context |
| Auth (JWT / OAuth / cookies) | | Must map to Polarishost tokens / session |
| API style (REST / GraphQL) | | Gateway vs native tRPC rewrite |
| Multi-tenant? | | Polaris assumes `x-tenant` + tenant modules |
| Feature list (screens → domains) | | Microapp boundaries |
| Design system / theming | | Replace with `@polaris/components` |
| i18n | | Content maps (`en`/`es`) pattern |
| Native modules used | | Host-only via `@polaris/frontend-native-api` |

### 3.2 Decision gates (pick one per row)

| Decision | Option A (faster) | Option B (canonical) | Recommendation |
| --- | --- | --- | --- |
| Backend | Wrap existing Node with Nest gateway | Rewrite domain into Polaris API + SDK | **A first**, B per domain |
| Auth | Keep current login; mint Polaris-compatible tokens via adapter | Adopt Polaris auth microapp / OAuth flow | Depends on IdP |
| Tenancy | Single hard-coded tenant | Full multi-tenant from day 1 | Single tenant first |
| Delivery | One microapp for whole app | Split by product domain | Start **one**, split when ≥2 teams or deploy units |
| Host | New microapp inside existing monorepo | Standalone host clone | Use **this monorepo** |

---

## 4. Mapping: “basic RN app” → Polaris concepts

| Your app today | Polaris equivalent | Notes |
| --- | --- | --- |
| `App.tsx` + root navigator | `mobile-host` + per-microapp navigator | Host owns auth gate & remote load |
| Feature screens | `apps/ui/<feature>/src/app/screens/...` | No screen→screen imports |
| Shared UI kit | `@polaris/components` | Don’t import Paper directly |
| API client (`fetch`/`axios`) | tRPC React Query hooks | Models Zod at the boundary |
| Env `.env` | `configs/` + `configLoader` per env/tenant | Same pattern as claims |
| Strings / i18n | `content/` + `useXxxContext` | Typed content + styles keys |
| Native camera/etc. | `@polaris/frontend-native-api/*` | Implemented in host only |
| Jest / Detox | Microapp Jest + host smoke + optional BDD | Storybook mandatory for UI |

Reference microapps to copy patterns from: `apps/ui/claims` (template), `apps/ui/authentication`, `apps/ui/mobile-host`.

Scaffold command in-repo: `/generate-microapp-skeleton <name>` (claims-based checklist).

---

## 5. Phased plan

### Phase 0 — Foundations & spike (1–2 weeks)

**Goals:** Prove host loads a remote; one authenticated API round-trip through Polaris patterns.

**Work**
1. Clone/setup monorepo; run `mobile-host` (web + one native if needed).
2. Inventory current screens → draft **domain map** (1–N microapps).
3. Spike **API adapter**:
   - Option A: NestJS route/service that proxies your hosted Node API.
   - Option B: Temporary REST from microapp (discouraged long-term).
4. Spike **auth adapter**: map your session → host `accessToken` / `refreshToken` / member context.
5. Document env matrix (local/dev/sit) and CORS/proxy expectations.

**Exit criteria**
- [ ] Host boots; dummy remote renders inside host.
- [ ] One protected call succeeds with Polarissession headers.
- [ ] Written ADR: gateway vs rewrite; single vs multi microapp.

**Verify**
- `pnpm nx serve mobile-host` (or project’s documented serve) + load remote.
- Manual: login → call → render JSON on landing screen.

---

### Phase 1 — Scaffold first microapp (1 week)

**Goals:** Empty but “Polaris-correct” microapp wired end-to-end.

**Work**
1. Run `/generate-microapp-skeleton <your-app-name>` (or manually mirror claims).
2. Wire:
   - `remote-entry.ts` + MF config
   - Host screen: `apps/ui/mobile-host/src/app/screens/<name>/<name>.tsx` with `withRetry(MicroApps.YOUR_APP)()`
   - Models feature enum + content/styles keys
   - Web custom element + `commonIntegration.scss` selector (web)
3. Landing screen only (no business UI yet).
4. Register Nx project, package name, CI paths.

**Exit criteria**
- [ ] Microapp loads in host (mobile + web if in scope).
- [ ] Storybook for landing screen exists.
- [ ] Config loads for `local` + one remote env.

**Verify**
- Host navigation to feature opens landing.
- Storybook story renders without host.
- Typecheck/lint for new projects.

---

### Phase 2 — Design system & screen migration (2–6 weeks, parallelizable)

**Goals:** Move UI screen-by-screen into the microapp using Polaris patterns.

**Per-screen recipe**
1. Create `screens/<screenName>/` with:
   - `<screenName>.tsx`
   - `use<ScreenName>.ts` (business logic)
   - `<screenName>.styles.ts`
   - `<screenName>.stories.tsx`
   - private `components/` as needed
2. Replace RN/Paper with `@polaris/components` (`Surface`, `Text`, `Button`, …).
3. Move copy into content maps; styles via context hook.
4. Wire navigator route + deep link path if required.
5. Delete/disable equivalent screen in old app (or feature-flag).

**Migration order (suggested)**
1. Read-only list/detail screens (low risk)
2. Forms / mutations
3. Flows with native modules
4. Cross-feature navigation last

**Exit criteria**
- [ ] ≥80% of user journeys runnable from Polaris host (or agreed MVP slice).
- [ ] No direct Paper imports in new code.
- [ ] No screen→screen imports.

**Verify**
- Storybook + Jest for each migrated screen/component.
- Manual smoke on web; native on critical paths.
- Accessibility: labels on interactive elements.

---

### Phase 3 — Backend integration via Polaris API layer (2–8 weeks)

**Goals:** Frontend talks only to Polaris contracts (`@polaris/models` + SDK tRPC), not raw axios to legacy URLs.

#### 3.A Strangler gateway (recommended first)

```text
Microapp → tRPC (apps/api/<domain>) → Gateway → Existing hosted Node API
```

**Work**
1. Add Zod request/response schemas in `packages/models/src/lib/<domain>/`.
2. Add SDK package: router + service **interface** + injection token.
3. Implement Nest tenant service that calls your hosted API (HTTP client / gateway pattern).
4. Map DTOs carefully: external naming in `*.dto.ts`; internal models follow Polaris conventions.
5. Point microapp config `endpoints.<domain>` to `/api/<domain>`.
6. Use `useSuspenseQuery` + `QueryBoundary` (or documented `useQuery` exceptions).

#### 3.B Domain rewrite (later / per domain)

Replace gateway bodies with real tenant business logic; retire legacy endpoints when traffic is cut over.

**Exit criteria**
- [ ] All new UI uses tRPC + models only.
- [ ] Legacy API is an implementation detail behind Nest.
- [ ] OpenAPI/meta on procedures if platform requires it.
- [ ] Auth: `secureProcedure` vs `publicProcedure` correctly applied.

**Verify**
- Contract tests / MSW handlers for microapp.
- Backend unit tests for mappers + service.
- End-to-end: login → list → detail → mutation.

---

### Phase 4 — Auth, session, and member context (overlap with Phase 2–3)

**Goals:** Host owns session; microapp receives `MicroAppProperties` / context.

**Work**
1. Map identity fields: member id, plan, locale, features, theme.
2. Choose:
   - Integrate with existing Polaris auth microapp, **or**
   - Adapter that exchanges your tokens for Polaris session shape.
3. Feature flags: at least one `Feature` enum entry in models; wire from host/CMS if applicable.
4. Logout / token refresh parity with host.

**Exit criteria**
- [ ] Cold start, refresh, and expired-token paths work.
- [ ] Microapp never stores secrets outside approved storage patterns.
- [ ] Web + mobile session behavior documented.

**Verify**
- Auth smoke: login → deep link into microapp → API call → logout.
- Negative: invalid token shows host-level error, not blank remote.

---

### Phase 5 — Navigation & deep links (1–3 weeks)

**Goals:** In-app and external URLs resolve via host + microapp navigators.

**Work**
1. Define path params in microapp navigator (match claims pattern).
2. Register feature in host feature registry / path config.
3. Cross-feature navigation goes through host APIs (not direct remote imports).
4. Document URL scheme for web portal embedding (`polaris-<name>` custom element).

**Exit criteria**
- [ ] Deep link opens correct screen with params.
- [ ] Back stack behavior acceptable on iOS/Android/web.
- [ ] Host-compat implications understood (`docs/microapp-host-compatibility.md`).

**Verify**
- Universal/app links matrix.
- Host-compat checker on PRs touching `MicroAppProperties` / shared contracts.

---

### Phase 6 — Quality, CI, and deployment (ongoing; harden near cutover)

**Work**
1. Nx targets: lint, typecheck, test, Storybook build for new projects.
2. MSW for Storybook/tests; production MSW exclusion.
3. Optional BDD under `apps/automation/<domain>` for critical journeys.
4. Host smoke (`mobile-host-smoke` skill) for shell regressions.
5. Deploy pipeline: UI remote CDN/OTA + API image; align with existing feature-deploy docs.
6. Update `polaris.hostCompatibility.minHostVersion` when host contracts change.

**Exit criteria**
- [ ] PR checks green for affected projects.
- [ ] Staging parity with production auth + API.
- [ ] Rollback plan for remote + API independently.

**Verify**
- CI on a sample PR.
- Staging soak; monitor error rates / latency vs legacy.

---

### Phase 7 — Cutover & decommission

**Work**
1. Feature-flag traffic: old app → Polaris host.
2. Store / portal links point to new host.
3. Freeze legacy RN app; leave API until gateways unused.
4. Remove dead gateway paths after metrics hit zero.
5. Archive old repo; keep runbooks.

**Exit criteria**
- [ ] 100% of in-scope journeys on Polaris (or signed exceptions).
- [ ] Legacy app unpublished / redirected.
- [ ] Owner docs updated (ops + onboarding).

---

## 6. Suggested repo layout for your feature

```text
apps/ui/<your-feature>/
  remote-entry.ts
  src/app/
    microApp.tsx
    navigation/
    screens/
    components/
    content/
    hooks/
    configs/
apps/api/<your-domain>/
  src/app/tenants/<tenant>/
    gateways/          # calls your existing Node API
    services/          # implements SDK interfaces
packages/models/src/lib/<your-domain>/
packages/platform-integration/sdk/<your-domain>/
apps/ui/mobile-host/src/app/screens/<your-feature>/
```

---

## 7. Backend strategy detail (existing Node already hosted)

### Keep vs rewrite matrix

| Situation | Approach |
| --- | --- |
| Stable REST, team small, deadline tight | Nest **gateway** + Zod models + tRPC |
| API is messy / no types / security debt | New Polaris API; dual-write or read-migrate |
| Need multi-tenant soon | Tenant modules from day 1 even if one tenant |
| Web + mobile share same domain cookie needs | Follow production proxy/`apiDomain` same-origin pattern |

### Adapter checklist (gateway)

- [ ] Auth header forwarding (`Authorization`, `x-tenant`, correlation ids)
- [ ] Error mapping → tRPC error codes (don’t leak stack traces)
- [ ] Pagination / date formats (prefer Luxon/`DateTime` internally; DTO strings at edge)
- [ ] Idempotency for mutations
- [ ] Timeouts / retries / circuit breaker if platform standards require
- [ ] Observability: request id logging end-to-end

---

## 8. Frontend conventions (must follow)

- **Components:** `@polaris/components` only for Paper UI.
- **Data:** prefer `useSuspenseQuery` + `QueryBoundary`.
- **Structure:** screens private; promote to `components/` only when reused.
- **Native:** never autolink new native deps into a microapp without host rebuild plan.
- **Content:** no hardcoded user-visible strings in JSX.
- **Storybook:** mandatory for screens and shared components.
- **File names:** camelCase/kebab-case files; PascalCase components.

Rules to read while implementing:
- `.cursor/rules/frontend/microapp-integration.mdc`
- `.cursor/rules/frontend/component-patterns.mdc`
- `.cursor/rules/frontend/data-fetching-suspense.mdc`
- `.cursor/rules/backend/sdk-patterns.mdc`
- `.cursor/rules/backend/tenant-api-implementation.mdc`
- `.cursor/rules/backend/models-package.mdc`
- `docs/microapp-host-compatibility.md`
- `docs/PRODUCTION-ARCHITECTURE.md`

---

## 9. Risk register

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Auth shape mismatch | Blocked API calls | Phase 0 spike; adapter tests |
| Host contract churn (`MicroAppProperties`) | Forces native rebuild | Minimize required props; run host-compat |
| Big-bang UI rewrite | Slips schedule | Strangler by screen; ship MVP slice |
| Duplicating design system | Inconsistent UX | Component-library-first reviews |
| Direct legacy REST from UI | Permanent dual clients | Enforce tRPC-only lint/review |
| Native module in remote | Breaks OTA | Route through `@polaris/frontend-native-api` |
| Underestimating web embedding | Layout/CSS bugs | Use polaris-shell-repro / tenant CSS checklist |

---

## 10. Team roles & RACI (lightweight)

| Area | Responsible | Consulted |
| --- | --- | --- |
| Microapp UI | Frontend | Design / a11y |
| Models + SDK | Full-stack | API owners |
| Nest gateway | Backend | Legacy API owners |
| Host wiring | Platform / host owners | Microapp team |
| Auth | Security + platform | IdP owners |
| CI/CD | Platform | Feature team |

---

## 11. Milestone timeline (example)

| Week | Milestone |
| --- | --- |
| 0–1 | Phase 0 spike + ADR |
| 2 | Phase 1 scaffold live in host |
| 3–6 | Phase 2 MVP screens |
| 4–8 | Phase 3 gateway for MVP APIs (parallel) |
| 5–7 | Phase 4 auth hardening |
| 7–8 | Phase 5 deep links |
| 8–9 | Phase 6 staging + smoke |
| 10 | Phase 7 cutover |

Adjust based on screen count and API rewrite depth.

---

## 12. Definition of Done (program)

- [ ] Users complete agreed MVP journeys in Polaris host (web and/or mobile).
- [ ] UI is a federated microapp; no standalone old RN binary required for MVP.
- [ ] All network I/O for the feature goes through Polaris API + Zod models.
- [ ] Auth/session owned by host; microapp is a consumer.
- [ ] Storybook + unit tests for new UI; backend tests for mappers/services.
- [ ] Deploy/rollback docs; host-compat notes if contracts changed.
- [ ] Legacy app decommission plan dated and owned.

---

## 13. Open questions (blockers until answered)

1. **What is the feature domain name** (claims-like vs single “app” microapp)?
2. **Must you support web in v1**, or mobile-only?
3. **Which IdP / login** must you keep (Okta, custom JWT, cookies)?
4. **Is multi-tenant required** on day 1?
5. **Can the hosted Node API stay as-is** for 6+ months behind a gateway?
6. **Which screens are MVP** vs later?
7. **Any native modules** (camera, biometrics, maps)?
8. **Will you contribute into this monorepo**, or fork a Polaris-lite?

---

## 14. Immediate next actions

1. Fill §3 intake + §13 open questions.
2. Write a 1-page ADR: gateway vs rewrite; microapp boundaries.
3. Execute Phase 0 spike (host + empty remote + one proxied API call).
4. Scaffold with `/generate-microapp-skeleton <name>`.
5. Migrate first read-only screen end-to-end; use it as the template for the rest.

---

## Appendix A — Command cheat sheet (illustrative)

```bash
# After scaffold exists — use real Nx project names from project.json
pnpm nx serve mobile-host
pnpm nx serve <your-feature>
pnpm nx storybook <your-feature>
pnpm nx test <your-feature>
pnpm exec tsx tools/host-compat/check-microapp.ts --app=<your-feature>
```

## Appendix B — Related docs in this repo

- `AGENTS.md` — platform map
- `docs/PRODUCTION-ARCHITECTURE.md` — UI/API request flow
- `docs/navigation/architecture.md` — host/microapp navigation
- `docs/authentication/*` — OAuth / recovery flows
- `.cursor/commands/generate-microapp-skeleton.md` — scaffold checklist
```

---

### How to use this

1. Answer the **Open questions** (§13)—those drive whether you do one microapp vs many, and gateway vs rewrite.
2. Treat **Phase 0** as mandatory; don’t scaffold the whole app before auth + one API call work.
3. Prefer **strangler**: UI into Polaris first, **keep your hosted Node** behind a Nest/tRPC gateway, rewrite domains later.

If you share your feature list, auth type, and whether web is in scope, I can tighten this into a concrete MVP backlog (screen order + API endpoints). To have the file written into the repo, switch to **Agent mode** and point me at the path you want.