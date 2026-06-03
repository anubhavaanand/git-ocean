# Git Ocean — Enterprise Execution Order

> Production-grade delivery sequence with dependencies, quality gates, and go/no-go checks.

## Legend
- **S** = Sprint number
- **P** = Priority (P0=blocker, P1=critical, P2=important, P3=nice-to-have)
- **T** = Estimated time
- **Gate** = Quality check required before next sprint

---

## SPRINT 0: Foundation & Blockers ✅ DONE

| Step | Task | P | Files | Skills |
|---|---|---|---|---|
| 0.1 | Scaffold project, rebrand to git-ocean | P0 | All | `vite-flare-starter` |
| 0.2 | Git init + remote on `github.com/anubhavaanand/git-ocean` | P0 | — | `git-workflow` |
| 0.3 | Dependencies, 52 migrations, D1/Drizzle | P0 | `package.json`, `drizzle/` | `d1-drizzle-schema`, `d1-migration` |
| 0.4 | TypeScript strict, Biome, Vitest | P0 | `tsconfig.json`, `vitest.config.ts` | `typescript-expert`, `vitest` |
| 0.5 | DB schema: 5 tables + API routes | P0 | `git-ocean-schema.ts`, `routes/ocean.ts` | `hono-api-scaffolder` |
| 0.6 | 4 frontend pages scaffold | P0 | `pages/ocean.tsx`, `pages/world-map.tsx` | `frontend-design` |
| **Gate** | `tsc --noEmit` + `vite build` pass | | | |

## SPRINT 1: Core 3D Ocean ✅ DONE

| Step | Task | P | Files | Skills |
|---|---|---|---|---|
| 1.1 | Ocean scene (fog, water shader, particles) | P0 | `ocean-scene.tsx`, `ocean-helpers.ts` | `threejs-fundamentals`, `threejs-shaders` |
| 1.2 | Ocean lighting + shadows | P0 | `ocean-lighting.ts` | `threejs-impl-lighting`, `threejs-impl-shadows` |
| 1.3 | Vertex-colored seafloor | P0 | `ocean-floor.ts` | `threejs-syntax-geometries` |
| 1.4 | Procedural whale entity | P0 | `whale-entity.ts` | `threejs-geometry`, `threejs-materials` |
| 1.5 | 10 creature types factory | P0 | `creature-factory.ts` | `threejs-syntax-geometries` |
| 1.6 | Kelp towers | P0 | `kelp-tower.ts` | `threejs-syntax-geometries` |
| 1.7 | Scene composer + animation loop | P0 | `ocean-composer.tsx` | `threejs-impl-animation` |
| 1.8 | UI layer (layout, stats, info, legend, connect) | P1 | `ocean-layout.tsx`, `stats-panel.tsx`, etc. | `antigravity-design-expert`, `shadcn-ui` |
| **Gate** | Scene renders at 60fps, all 10 creatures visible | | | |

## SPRINT 2: World Map Globe ✅ DONE

| Step | Task | P | Files | Skills |
|---|---|---|---|---|
| 2.1 | 3D globe with textures + day/night | P0 | `globe-scene.tsx` | `threejs-textures`, `threejs-impl-lighting` |
| 2.2 | Atmosphere glow shader + clouds | P1 | `globe-helpers.ts` | `threejs-impl-post-processing`, `shader-dev` |
| 2.3 | Country outlines + 24 pin markers | P0 | `globe-helpers.ts`, `globe-composer.tsx` | `threejs-syntax-geometries` |
| 2.4 | Geo data layer (geocode, cluster, language) | P0 | `services/geocoding.ts`, `services/geographic-clusters.ts` | `hono-api-scaffolder` |
| 2.5 | Sonar obelisks | P1 | `globe-helpers.ts` | `threejs-geometry` |
| 2.6 | Language heat rings + ocean colonies | P1 | `globe-helpers.ts` | `threejs-shaders` |
| 2.7 | Obelisk skin voting (7-day epochs) | P2 | `obelisk-service.ts`, `obelisk-vote-panel.tsx` | `shadcn-ui`, API routes |
| 2.8 | 5 zoom levels + country detail panel | P1 | `world-map.tsx` | `threejs-syntax-controls`, `frontend-design` |
| **Gate** | Globe interactive, pins clickable, voting works | | | |

## SPRINT 3: Performance & API Hardening ✅ DONE

| Step | Task | P | Files | Skills |
|---|---|---|---|---|
| 3.1 | GitHub OAuth + GraphQL + webhook | P0 | `github.ts`, `github-api.ts` | `hono-api-scaffolder` |
| 3.2 | Repo-to-creature mapping service | P0 | `repo-mapping.ts` | — |
| 3.3 | InstancedMesh for swarms | P1 | `creature-factory.ts` | `threejs-errors-performance` |
| 3.4 | LOD system (3 levels + billboards) | P1 | `lod-system.ts`, `kelp-tower.ts` | `threejs-agents-model-optimizer` |
| 3.5 | Bundle optimization (manualChunks) | P1 | `vite.config.ts` | `web-performance-optimization` |
| 3.6 | PWA (service worker + manifest) | P2 | `sw.js`, `manifest.json` | `progressive-web-app` |
| **Gate** | `tsc --noEmit`, `vite build`, Lighthouse 85+ perf | | | |

---

## 🔷 SPRINT 4: Quality Infrastructure (4C Tests)

| Step | Task | P | Est. | Skills |
|---|---|---|---|---|
| 4.1 | **Fix blockers**: set up `account_id` in wrangler, OAuth env vars | P0 | 15m | `cloudflare-worker-builder` |
| 4.2 | Integration tests for all API routes (ocean, github, geography, obelisk) | P1 | 2h | `vitest`, `testing-qa`, `@cloudflare/vitest-pool-workers` |
| 4.3 | Unit tests: creature factory (orbital math, LOD distances) | P1 | 1h | `vitest` |
| 4.4 | Unit tests: geocoding (freeform parsing, confidence scoring) | P1 | 1h | `vitest` |
| 4.5 | Unit tests: repo-mapping (metrics→creature mapping) | P1 | 30m | `vitest` |
| 4.6 | Unit tests: obelisk-service (epoch management, vote tallying) | P1 | 30m | `vitest` |
| 4.7 | Unit tests: github-api (token encryption, GraphQL parsing) | P1 | 1h | `vitest` |
| **Gate** | All tests pass, coverage ≥ 70% on git-ocean server code | | | |

## 🔷 SPRINT 5: Enterprise Hardening (4A + 4B Remaining)

| Step | Task | P | Est. | Skills |
|---|---|---|---|---|
| 5.1 | **WebGPU renderer fallback** for high-end machines | P1 | 3h | `threejs-impl-webgpu` |
| 5.2 | **WebWorkers**: offload creature orbital math off main thread | P2 | 2h | `senior-frontend`, Web Workers API |
| 5.3 | **KTX2/Basis texture compression** for globe + environment | P2 | 2h | `threejs-agents-model-optimizer`, `@gltf-transform/cli` |
| 5.4 | **Rate-limit KV caching**: avoid GitHub API 403s | P1 | 1h | `cloudflare-worker-builder`, KV bindings |
| 5.5 | **GitHub Actions status** as kelp tower glow color | P2 | 2h | `threejs-materials`, webhook integration |
| 5.6 | **Error boundaries** for all 3D canvases (graceful fallback) | P1 | 30m | `shared/ErrorBoundary.tsx` |
| 5.7 | **Sentry/RUM integration** for production monitoring | P2 | 1h | `sentry.ts` |
| **Gate** | Lighthouse 90+ perf, no console errors, 60fps on mid-range GPU | | | |

## 🔷 SPRINT 6: UX & Design Polish (4C Continuation)

| Step | Task | P | Est. | Skills |
|---|---|---|---|---|
| 6.1 | **UX walkthrough** — full scenario battery (11 flows) | P1 | 2h | `ux-audit` |
| 6.2 | **Responsiveness check** — all breakpoints | P1 | 1h | `responsiveness-check` |
| 6.3 | **WCAG accessibility audit** — axe-core, keyboard nav, contrast | P1 | 2h | `web-design-guidelines`, `ui-visual-validator` |
| 6.4 | **Visual design review** — layout, typography, spacing | P2 | 1h | `design-review` |
| 6.5 | **Codex independent review** — GPT-5/o3 second opinion | P2 | 30m | `codex-review` |
| 6.6 | Fix all findings from audits (prioritized by severity) | P1 | 3h | Various |
| **Gate** | All audit findings fixed or documented as won't-fix | | | |

## 🔷 SPRINT 7: Multiplayer Foundation (3A)

| Step | Task | P | Est. | Skills |
|---|---|---|---|---|
| 7.1 | **Durable Object WebSocket gateway** | P1 | 4h | `cloudflare-worker-builder`, `hono-api-scaffolder` |
| 7.2 | **User presence broadcast** (position, quaternion, velocity) | P1 | 2h | WebSocket protocol design |
| 7.3 | **Dead reckoning + linear interpolation** for remote users | P1 | 3h | `threejs-core-math` |
| 7.4 | **Avatar rendering** for other users in same zone | P1 | 2h | `whale-entity.ts` (reuse) |
| 7.5 | **Ocean zone partitioning** (spatial grid for scaling) | P2 | 2h | — |
| **Gate** | Two browser windows can see each other's avatars | | | |

## 🔷 SPRINT 8: Multiplayer Collaboration (3B)

| Step | Task | P | Est. | Skills |
|---|---|---|---|---|
| 8.1 | Shared ocean view / teleport to friend | P1 | 2h | `shadcn-ui`, API |
| 8.2 | Visit other users' oceans (view their repos as creatures) | P2 | 3h | `creature-factory.ts` (reuse) |
| 8.3 | Creature gifts / interactions between users | P2 | 3h | API, creature factory |
| 8.4 | Chat overlay (whale song messages) | P2 | 3h | `shadcn-ui`, `react-patterns` |
| **Gate** | End-to-end: invite → visit → chat → gift flow works | | | |

## 🔷 SPRINT 9: Metro System (3C)

| Step | Task | P | Est. | Skills |
|---|---|---|---|---|
| 9.1 | Metro stations at obelisk locations | P2 | 3h | `threejs-geometry` |
| 9.2 | Fast travel: loading screen + camera animation | P2 | 3h | `threejs-impl-animation` |
| 9.3 | Commuter particles (users traveling between cities) | P3 | 2h | `threejs-textures`, `shader-dev` |
| **Gate** | Click metro station → animate travel → arrive at destination | | | |

## 🔷 SPRINT 10: Deploy & Ship (4D)

| Step | Task | P | Est. | Skills |
|---|---|---|---|---|
| 10.1 | Provision production D1 + R2 | P0 | 30m | `cloudflare-worker-builder` |
| 10.2 | Deploy to Cloudflare Workers | P0 | 30m | `vercel-cli-with-tokens` |
| 10.3 | Custom domain + SSL + CDN | P1 | 1h | `cloudflare-api` |
| 10.4 | Generate ARCHITECTURE.md, API_ENDPOINTS.md, DATABASE_SCHEMA.md | P1 | 1h | `project-docs` |
| 10.5 | User documentation with screenshots | P2 | 2h | `app-docs` |
| 10.6 | Product showcase landing page | P2 | 3h | `product-showcase` |
| 10.7 | Demo walkthrough video (Remotion) | P3 | 3h | `walkthrough-video` |
| 10.8 | GitHub release + changelog | P2 | 30m | `github-release` |
| 10.9 | SEO: OG images, meta tags, sitemap | P2 | 1h | `seo-local-business`, `ai-image-generator` |
| 10.10 | Beta launch announcement (social) | P3 | 1h | `social-media-posts` |
| **Gate** | Deployed, documented, announced | | | |

---

## Enterprise Quality Gates Summary

| Sprint | Gate Check |
|---|---|
| 0-3 | `tsc --noEmit`, `vite build` pass on every commit |
| 4 | All tests pass, coverage ≥ 70% |
| 5 | Lighthouse 90+, 60fps on mid-range GPU |
| 6 | All audit findings resolved |
| 7 | Multiplayer: 2 users see each other |
| 8 | Full collaboration flow works |
| 9 | Metro travel end-to-end |
| 10 | Deployed, docs published, release live |

## Sprint Dependency Graph

```
Sprint 0 ─── Sprint 1 ─── Sprint 2 ─── Sprint 3
                                                │
                                                ▼
                                          Sprint 4 (Tests)
                                                │
                                          ┌─────┴─────┐
                                          ▼           ▼
                                    Sprint 5     Sprint 6
                                    (Perf/API)   (UX/Audit)
                                          │           │
                                          └─────┬─────┘
                                                ▼
                                          Sprint 7 (MP Base)
                                                │
                                          Sprint 8 (MP Collab)
                                                │
                                          Sprint 9 (Metro)
                                                │
                                          Sprint 10 (Ship)
```

## Blockers Log

| # | Blocker | Blocks | Needs |
|---|---|---|---|
| B1 | No `account_id` in wrangler.jsonc | Sprint 4-10 | Cloudflare dashboard → Workers & Pages → copy account ID |
| B2 | `GITHUB_CLIENT_ID`/`GITHUB_CLIENT_SECRET` not set | Sprint 4 tests | GitHub OAuth App → generate credentials → `.dev.vars` |
| B3 | No Durable Objects binding | Sprint 7-9 | Add `[[durable_objects.bindings]]` to wrangler + account_id |
| B4 | No R2 bucket created for production | Sprint 10 | `wrangler r2 bucket create git-ocean-avatars` |
| B5 | KTX2 compressor not installed | Sprint 5.3 | `npm install -g @gltf-transform/cli` |
