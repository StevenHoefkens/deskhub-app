# AI Step Summary — FT-001 SSO Login and Authenticated Session (deskhub-app)

Service slice: **deskhub-app** (frontend, Vue 3 + TypeScript + Vite). Manifest v2, `new` promotion tier, incremental strategy. All 5 checkpoints passed; final combined regression green (104 tests, 0 type errors, lint 0 warnings, 0 audit vulnerabilities, JS bundle 35.4 KB gzip < 200 KB budget).

**Scope note:** the only use-case spec in the manifest, UC-001 authenticate-via-sso, is `kind: upstream_dependency` — owned by the backend `deskhub-api`. This repo consumes its contract as a typed client artifact and **implements none of it**. The owned artifact is screen **SCR-001 (login page)**. Because no use-case spec is owned here, there are **no owned Gherkin scenarios and no owned contract operations** in this slice; traceability is therefore against the screen's component tree and orchestration, and code-to-contract conformance is the compile-time typed-contract check (STD-037 Rule 16).

## Section 1: Traceability Matrix

No owned Gherkin scenarios (UC-001 is upstream — its scenarios are the backend's contract). The owned artifact is a screen; the matrix below maps every SCR-001 element/behavior to code and a passing test.

| Element (SCR-001) | Code File(s) | Test File(s) | Status |
|---|---|---|---|
| LoginCard (card; surface/lg/radius tokens) | src/components/auth/login-form/login-form.vue | src/components/auth/login-form/login-form.spec.ts | pass |
| LocaleToggle (EN/NL, group aria-label) | src/components/shared/ui/locale-toggle/locale-toggle.vue | src/components/shared/ui/locale-toggle/locale-toggle.spec.ts; login-form.spec.ts | pass |
| AppTitle "DeskHub" | src/components/auth/login-form/login-form.vue | login-form.spec.ts | pass |
| SignInPrompt | src/components/auth/login-form/login-form.vue | login-form.spec.ts | pass |
| SignInButton (label + aria-label) | src/components/auth/login-form/login-form.vue | login-form.spec.ts | pass |
| LoginErrorAlert (container; surface-alt+border) | src/components/auth/login-error-alert/login-error-alert.vue | src/components/auth/login-error-alert/login-error-alert.spec.ts; login-form.spec.ts | pass |
| ErrorMessage (localized by state) | login-error-alert.vue; src/lib/login-error.ts; src/lib/i18n/messages.ts | login-error.spec.ts; use-i18n.spec.ts; login-form.spec.ts | pass |
| RetryButton (visibleWhen errorState==idp_unreachable) | login-error-alert.vue; src/lib/login-error.ts (isRetryableLoginError) | login-error-alert.spec.ts; login-error.spec.ts; login-form.spec.ts | pass |
| Orchestration on_success -> navigate returnUrl | src/composables/use-sso-login.ts (forwards returnUrl to SSO init; backend performs the redirect) | use-sso-login.spec.ts; login-form.spec.ts | pass |
| Orchestration on_error -> show login-error | src/components/auth/login-form/login-form.vue | login-form.spec.ts | pass |
| Orchestration on_error -> toast (error, 5000ms) | login-form.vue (onMounted toast.error); src/lib/toast/* | login-form.spec.ts (message+variant); toast.spec.ts (duration override) | pass |
| Error state access_denied | src/lib/login-error.ts | login-error.spec.ts; login-form.spec.ts | pass |
| Error state missing_identifier | src/lib/login-error.ts | login-error.spec.ts; login-form.spec.ts | pass |
| Error state idp_unreachable | src/lib/login-error.ts | login-error.spec.ts; login-form.spec.ts | pass |
| LocaleToggle browser-locale default + EN fallback | src/lib/locale.ts; src/lib/i18n/use-i18n.ts (detectLocale) | locale.spec.ts; use-i18n.spec.ts | pass |
| Route /login (+ / -> /login) | src/router/index.ts | src/router/__tests__/router.spec.ts | pass |

**Contract operation coverage (STD-024 / STD-031):** none owned. UC-001's single operation `POST /auth/sso/callback` is a **consumed** upstream contract; its conformance is compile-time (typed generated client + the `Locale` <-> `AuthenticatedSession.languagePreference` binding in src/types/__tests__/contracts.spec.ts), per STD-037 Rule 16. No runtime conformance table applies to this slice.

| Operation | Contract (UC) | Conformance Test | Status |
|---|---|---|---|
| _(none owned — UC-001 consumed as upstream dependency)_ | UC-001 (upstream) | compile-time typed contract (STD-037 R16) | n/a |

## Section 2: Interpretation Log

| # | Interpretation | Risk | Reasoning | Spec Gap? |
|---|---|---|---|---|
| INT-001 | openapi-typescript peers TS 5.x; repo pins TS 6 — resolved via npm override, empirically verified | medium | STD-037 R15 mandates the tool; TS-6 generation + typecheck verified; clean install | No |
| INT-003 | No runtime fetch client for the consumed contract (server-side redirect flow); STD-037 R1-14 N/A, R16 conformance only | medium | Contract delivered via redirect+cookie; avoids speculative TanStack Query dep | No |
| INT-006 | Backend error indicator -> UI login-error-state mapping (contract codes + canonical names; idp_unreachable has no contract code) | medium | `/login?error=<code>` wire format & code->state mapping unspecified; defensible total function | **Yes** |
| INT-008 | SSO login-initiation path treated as env config (not in the contract) | medium | Contract defines only the callback; initiation endpoint absent from any contract | **Yes** |
| INT-009 | `/` redirects to `/login`; default returnUrl `/` — latent post-login loop once an authenticated route exists | low | App home unspecified for FT-001; reconcile when the first guarded route lands | **Yes** |
| INT-013 | Dutch (NL) copy authored (spec supplies none) | medium | Screen requires NL; translations should be content-reviewed before release | **Yes** |
| INT-014 | Toast built as custom `@/lib/toast` per inventory; its contract ref STD-012 is a Next.js placeholder — used STD-039 R18 as the Vue toast contract | low | Realization pinned by inventory (kind: custom); behaviour contract taken from STD-039 | **Yes** |
| INT-017 | Typography not tokenized (font-weight/family literals) — STD-036 R7 deviation | medium | No typography tokens in the compiled set; fix upstream in the token layers, not in code | **Yes** |

Lower-risk entries (INT-002, 004, 005, 007, 010, 011, 012, 015, 016, 018, 019, 020) are in `trace.yml`.

## Section 3: Standards Compliance Report

| Standard / Constraint | Checkpoint(s) | Where Applied | Deviations | Justification |
|---|---|---|---|---|
| STD-003 Naming Conventions | CP1-CP5 | kebab files, PascalCase multi-word components, SCREAMING_SNAKE consts, verb-first fns | None | — |
| STD-005 Performance Budgets | CP3, CP4, CP5 | build-time JS bundle budget gate (35.4 KB gzip < 200 KB); immediate interaction feedback | None (web-vitals synthetic owned by hub CI — INT-019) | — |
| STD-017 No Magic Values | CP1-CP5 | named consts for durations, budgets, query keys, paths; `--z-toast` var | None | — |
| STD-018 No Unused Dependencies | CP1-CP5 | added openapi-typescript + vue-router (both used); no vue-i18n / no TanStack Query | None | — |
| STD-019 Zero Warnings | CP1-CP5 | type-check/test/lint exit 0; advisories pinned; generated dir lint-ignored | None | — |
| STD-020 Service README | CP5 | README rewritten: Overview, Prerequisites, Getting Started, Profiles, Env Vars, Tests | None | — |
| STD-032 Comment Discipline | CP1-CP5 | no spec/standard IDs or narration in source; generated header exempt | None | — |
| STD-035 Scenario-Key Test Binding | CP1-CP5 | tests verify SCR-001 behavior (no owned Gherkin) — unkeyed per Rule 6 | None | — |
| STD-036 Vue Component Structure | CP3, CP4 | tiers view/feature/ui; domain dirs; co-located tests; colour/spacing/radius via var(--token) | **Yes (Rule 7)** | No typography tokens exist in the design system; font-weight/family literal — fix upstream (INT-017) |
| STD-037 Vue API Client & Query Composables | CP1, CP3, CP4 | R15 types generated from snapshot; R16 compile-time conformance | None (R1-14 N/A — no fetch) | Server-side SSO redirect flow; no runtime client |
| STD-038 Vue Form State & Validation | CP4 | error alert role=alert + aria-live=assertive | None (field-validation N/A) | SSO screen has no data-entry form (single action button) |
| STD-039 Vue Component Composition | CP2, CP3, CP4 | typed props/emits; ui pure; feature owns side effects; toast contract R18; config-driven mapping | None | — |
| STD-040 Vue View & Routing | CP3, CP4 | central lazy router; thin view delegates to feature; responsive narrow container | None | — |
| Constraint: no local credential path | CP4 | login page offers SSO only; no username/password field | None | — |

Every manifest standard and the feature constraint appears above; the single deviation (STD-036 Rule 7) is justified and routed upstream.

## Section 4: Metrics

| Metric | Value |
|---|---|
| Owned Gherkin scenarios | 0 (UC-001 is upstream_dependency) |
| SCR-001 elements/behaviors realized | 16 / 16 |
| SCR-001 elements with test coverage | 16 / 16 |
| Coverage % (owned screen) | 100% |
| Owned contract operations | 0 (UC-001 consumed) |
| Total tests (combined) | 124 passing |
| Total interpretations | 21 |
| High-risk interpretations | 0 |
| Medium-risk interpretations | 6 |
| Spec gaps flagged (for Phase 2) | 6 (INT-006, 008, 009, 013, 014, 017) |
| Self-corrections (review/debug fixes) | CP2 prototype-lookup bug; CP3 two test-harness fixes; CP4 vue-tsc prop typing; final-review 12 Minor (applied/logged); post-PR-review returnUrl defense-in-depth guard (INT-021) |
| Generation strategy / tier | Incremental / New |
| Checkpoints completed | 5 / 5 |

## Spec gaps to feed back to Phase 2

1. **INT-006 / INT-008** — Define the SSO **login-initiation path** and the **`/login?error=<code>` query-param wire format + error-code→UI-state mapping** in the UC-001 contract or SCR-001 (backend<->frontend seam is currently unspecified).
2. **INT-009** — App home / authenticated landing is unspecified; the `/`→`/login` redirect and default `returnUrl='/'` must be reconciled when the first guarded route lands (avoid post-login loop).
3. **INT-013** — NL copy was authored by the generator; needs product/native content review.
4. **INT-014** — The design-system inventory's `toast` contract references STD-012, which resolves to a Next.js standard (neutral-skeleton placeholder); pin a real Vue toast contract (STD-039 R18 was used).
5. **INT-017** — Design system has **no typography tokens**; add them to the token layers so font-weight/family can be tokenized (STD-036 Rule 7).
