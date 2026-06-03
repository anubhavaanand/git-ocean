# Git Ocean — Full Implementation Plan

> 3D underwater world visualizing GitHub repositories as sea creatures, kelp towers, and oceanic ecosystems.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript + Vite 8 |
| 3D Engine | Three.js (imperative, high-perf) |
| Styling | Tailwind v4 + shadcn/ui + motion |
| Backend | Hono on Cloudflare Workers |
| Database | D1 (SQLite at edge) + Drizzle ORM |
| Auth | better-auth (Google OAuth + email) |
| Storage | R2 buckets |
| Data Fetching | TanStack Query v5 |
| Brand | Cyan `#06B6D4` primary, Sky `#0EA5E9` accent |

---

## Phase 0: Foundation ✅ DONE

- [x] Scaffold project from vite-flare-starter, rebrand to git-ocean
- [x] Git init + remote at `github.com/anubhavaanand/git-ocean`
- [x] Install all dependencies (pnpm)
- [x] 52 base migrations applied locally
- [x] `.dev.vars` with auth secret, brand config
- [x] Drizzle ORM + D1 config
- [x] TypeScript strict mode, linting (Biome)
- [x] Vitest test setup
- [x] `tsc --noEmit` and `vite build` both pass

### Database Schema (5 Git Ocean tables)

| Table | Purpose |
|---|---|
| `git_ocean_repositories` | Connected GitHub repos with stars/forks/issues/PRs |
| `git_ocean_states` | Per-user ocean state (whale size, color, depth) |
| `git_ocean_creatures` | Spawned creatures with type, position, scale, level |
| `git_ocean_world_map` | Geographic contribution data per country |
| `git_ocean_github_connections` | Encrypted OAuth tokens per user |

### API Routes

| Method | Path | Description |
|---|---|---|
| GET | `/api/ocean/state` | Current user's ocean state |
| PUT | `/api/ocean/state` | Update ocean preferences |
| GET | `/api/ocean/creatures` | List user's creatures |
| GET | `/api/ocean/repos` | List connected repos |
| POST | `/api/github/connect` | Store GitHub OAuth token |
| GET | `/api/github/profile` | Fetch GitHub user profile |
| GET | `/api/github/repos` | List repos for connected user |

### Frontend Pages

| Route | Component | Description |
|---|---|---|
| `/ocean` | OceanPage | Main 3D ocean view |
| `/dashboard` | GitDashboardPage | Welcome/landing page |
| `/settings` | GitSettingsPage | Ocean preferences |
| `/world` | WorldMapPage | Geographic map (Phase 2) |

---

## Phase 1: Single-User Ocean ✅ DONE

### 1A: Ocean Scene Foundation

| Component | File | Description |
|---|---|---|
| OceanScene | `ocean-scene.tsx` | Full-screen Three.js canvas with underwater fog, water surface shader, particles |
| OceanHelpers | `ocean-helpers.ts` | Water surface (vertex displacement), ambient particles, coral clusters |
| OceanLighting | `ocean-lighting.ts` | HemisphereLight + DirectionalLight with shadows |
| OceanFloor | `ocean-floor.ts` | Vertex-colored sandy seafloor plane |

### 1B: Whale Entity

| Component | File | Description |
|---|---|---|
| WhaleEntity | `whale-entity.ts` | Procedural whale: body, tail fin, dorsal fin, pectoral fins, eye, 12 bioluminescent dots. Orbital movement with tangent-facing. |

### 1C: Creature System (10 types)

| Creature | GitHub Metric | Geometry |
|---|---|---|
| Dolphin | Core contributors | Pod of 2-5, elongated body, beak |
| Jellyfish | Watchers | Dome cap + 8 tentacles, translucent |
| Turtle | Merged PRs | Oval body + shell + 4 legs, slow drift |
| Barracuda | Open issues | Long thin body, erratic figure-8 orbit |
| Octopus | Open PRs | Round body + 8 wavy tentacles |
| Manta Ray | Dependents | Flat diamond, wide elliptical orbit |
| Seahorse | Releases | S-curve body, upright, anchored to kelp |
| Crab | Stalled issues | Small, 8 legs + 2 claws, sideways |
| Anglerfish | Security alerts | Glowing lure, dark body |
| Starfish | Resolved security | 5-arm star, slow benthic crawl |

### 1D: Kelp Tower

| Component | File | Description |
|---|---|---|
| KelpTower | `kelp-tower.ts` | Segmented stalk + translucent fronds, sway animation. Height = commit history, density = contributors |

### 1E: Scene Composition

| Component | File | Description |
|---|---|---|
| OceanComposer | `ocean-composer.tsx` | Orchestrates floor + towers + whales + creatures. Manages animation loop and cleanup. |

### 1F: UI Layer

| Component | File | Description |
|---|---|---|
| OceanLayout | `ocean-layout.tsx` | Glassmorphism sidebar + top bar + floating panels |
| StatsPanel | `stats-panel.tsx` | Animated counters for ocean metrics |
| CreatureInfoPanel | `creature-info-panel.tsx` | Slide-in info card on creature click |
| CreatureLegend | `creature-legend.tsx` | Toggleable legend mapping all 10 types |
| ConnectGitHub | `connect-github.tsx` | GitHub OAuth button with state |
| PageTransition | `animations/page-transitions.tsx` | Fade + slide route transitions |
| StaggerFade | `animations/stagger-fade.tsx` | Staggered list reveals |
| FloatAnimation | `animations/float-animation.tsx` | Gentle bobbing animation |
| GlowPulse | `animations/glow-pulse.tsx` | Bioluminescent glow pulse |

---

## Phase 2: World Map ⏳ NOT STARTED

### 2A: Geographic Globe

| # | Task | Skill | Dependencies |
|---|---|---|---|
| 1 | Create 3D globe with Three.js (SphereGeometry + Earth textures) | `threejs-geometry`, `threejs-textures` | Phase 1 complete |
| 2 | Day/night cycle lighting rotating around globe | `threejs-impl-lighting` | Globe base |
| 3 | Atmosphere glow shader + cloud layer post-processing | `threejs-impl-post-processing`, `shader-dev` | Globe base |
| 4 | Country border outlines on globe surface | `threejs-syntax-geometries`, `shader-dev` | Globe base |
| 5 | Pin markers for capital clusters (instanced mesh) | `threejs-syntax-geometries` | Country borders |
| 6 | Language district visual heat map per city | `shader-dev`, `threejs-materials` | City clusters |
| 7 | Globe controls: rotate, zoom to country, orbit constraints | `threejs-syntax-controls` | Globe base |

### 2B: Geographic Data Layer

| # | Task | Skill | Dependencies |
|---|---|---|---|
| 8 | Geocode GitHub profile locations (freeform → lat/lng) | Backend API | None |
| 9 | Capital cluster aggregation (users grouped by country) | `d1-drizzle-schema` (extend world_map) | Geocoding |
| 10 | City proximity clustering within countries | Backend service | Capital clusters |
| 11 | Language district sorting within cities | Backend service | City clusters |
| 12 | Deep ocean colonies for unlocated users | Backend service | None |
| 13 | Sonar obelisk landmarks per capital cluster | `threejs-geometry` | Capital clusters |
| 14 | Obelisk skin voting system (7-day epochs) | `shadcn-ui`, API routes | Obelisks |

### 2C: World Map UI

| # | Task | Skill | Dependencies |
|---|---|---|---|
| 15 | 5 zoom levels: World → Country → City → Tower → Whale | `threejs-syntax-controls`, `react-patterns` | Globe |
| 16 | Country detail panel on click (contributors, repos, language) | `frontend-design`, `shadcn-ui` | Zoom |
| 17 | Ocean colonies panel for unlocated users | `frontend-design` | Deep ocean |

---

## Phase 3: Multiplayer ⏳ NOT STARTED

### 3A: Real-Time Presence

| # | Task | Skill | Dependencies |
|---|---|---|---|
| 1 | WebSocket connection via Durable Objects | `cloudflare-worker-builder` | Phase 2 complete |
| 2 | User presence (position, quaternion, velocity broadcast) | `hono-api-scaffolder` | WebSocket |
| 3 | Dead reckoning + linear interpolation for other users | `threejs-core-math` | Presence |
| 4 | Avatar rendering for other users in same ocean zone | `whale-entity.ts` (reuse) | Presence |
| 5 | Ocean zone partitioning (spatial grid) | Backend service | Presence |

### 3B: Collaboration

| # | Task | Skill | Dependencies |
|---|---|---|---|
| 6 | Shared ocean view (teleport to friend's location) | API routes, UI | Presence |
| 7 | Visit other users' oceans (view their repos as creatures) | `shadcn-ui`, API | Auth |
| 8 | Creature gifts / interactions between users | `creature-factory.ts` | Visit |
| 9 | Chat overlay in ocean (whale song messages) | `react-patterns`, `shadcn-ui` | Presence |

### 3C: Metro System

| # | Task | Skill | Dependencies |
|---|---|---|---|
| 10 | Metro station at each capital cluster obelisk | `threejs-geometry` | Phase 2 |
| 11 | Fast travel between stations (loading screen + camera animation) | `threejs-impl-animation` | Stations |
| 12 | Commuter visualization (users traveling between cities) | `threejs-textures`, particles | Metro |

---

## Phase 4: Polish & Ship ⏳ NOT STARTED

### 4A: Performance

| # | Task | Skill | Dependencies |
|---|---|---|---|
| 1 | InstancedMesh conversion for all swarms | `threejs-errors-performance` | Phase 1 |
| 2 | LOD system for distant creatures + kelp towers | `threejs-agents-model-optimizer` | Phase 1 |
| 3 | WebGPU renderer fallback for high-end machines | `threejs-impl-webgpu` | Phase 1 |
| 4 | WebWorkers for orbital math off main thread | `react-patterns` | Phase 1 |
| 5 | Texture compression (KTX2/Basis) | `threejs-agents-model-optimizer` | Phase 1 |
| 6 | Bundle optimization, code splitting | `web-performance-optimization` | All |
| 7 | PWA: service worker, offline mode, install prompt | `progressive-web-app` | Build |

### 4B: Real GitHub API Integration

| # | Task | Skill | Dependencies |
|---|---|---|---|
| 8 | GitHub OAuth flow (redirect + token exchange) | API routes, auth | Phase 0 |
| 9 | GraphQL API client on server (fetch repos, stars, issues, PRs) | `hono-api-scaffolder` | Auth |
| 10 | Webhook receiver for real-time events (push, star, fork) | API routes | Auth |
| 11 | Data → 3D mapping service (metrics → creature spawning) | Backend service | API client |
| 12 | Rate limit handling with Cloudflare KV caching | `cloudflare-worker-builder` | API client |
| 13 | GitHub Actions status on kelp towers | `threejs-materials` | Webhooks |

### 4C: Testing & QA

| # | Task | Skill | Dependencies |
|---|---|---|---|
| 14 | Integration tests for all API endpoints | `vitest` | Phase 0 |
| 15 | 3D scene unit tests (creature factory, orbital math) | `vitest` | Phase 1 |
| 16 | UX walkthrough of every screen and flow | `ux-audit` | All |
| 17 | Responsiveness check at all breakpoints | `responsiveness-check` | All |
| 18 | WCAG accessibility audit | `web-design-guidelines` | All |
| 19 | Visual design quality review | `design-review` | All |
| 20 | Independent code review (GPT-5 via Codex) | `codex-review` | All |

### 4D: Deploy & Ship

| # | Task | Skill | Dependencies |
|---|---|---|---|
| 21 | Set up Cloudflare D1 + R2 resources for production | `cloudflare-worker-builder` | All |
| 22 | Deploy to Cloudflare Workers | `vercel-cli-with-tokens` | All |
| 23 | Configure custom domain + SSL | N/A | Deploy |
| 24 | Generate ARCHITECTURE.md, API_ENDPOINTS.md, DATABASE_SCHEMA.md | `project-docs` | All |
| 25 | User documentation with screenshots | `app-docs` | All |
| 26 | Product showcase landing page | `product-showcase` | All |
| 27 | Demo walkthrough video | `walkthrough-video` | All |
| 28 | GitHub release + changelog | `github-release` | All |
| 29 | SEO meta tags, sitemap, OG images | `seo-local-business` | Public site |
| 30 | Beta launch announcement | `social-media-posts` | Release |

---

## Creature-to-GitHub Mapping (Reference)

### The Whale (Repo Entity)

| Metric | Visual Encoding |
|---|---|
| Codebase size (KB) | Body size |
| Primary language | Body color / song dialect |
| Commit frequency | Migration speed |
| Stars | Bioluminescent dot count |
| Total contributors | Pod affinity (social vs solitary) |
| Repo age | Barnacle coverage |
| License type | Skin texture |
| Public/Private | Glowing vs matte patches |
| Archived status | Sponge overgrowth |
| Fork source | Clownfish in host anemone |
| Community health % | Water clarity around whale |
| Topics/tags | Sea anemone clusters |
| Dependencies | Remora fish attached to belly |
| File count | Crinoid/feather star fans |

### Orbital Creatures (10 types mapped to metrics)

| Creature | Data Point | Orbit | Behavior |
|---|---|---|---|
| **Dolphin** (pod) | Core contributors | Innermost, fast | Pod size = contributor count |
| **Jellyfish** (swarm) | Watchers | Outermost, slow | Pulse glow = watcher presence |
| **Turtle** (individual) | Merged PRs | Calm spiral outward | Ancient, peaceful drift |
| **Barracuda** (individual) | Open issues | Erratic figure-8 | Silver flash = urgent issue |
| **Octopus** (individual) | Open PRs | Mid, multi-arm | Arm color = PR age |
| **Manta Ray** (individual) | Dependents | Wide ellipse | Wingspan = dep count |
| **Seahorse** (individual) | Releases | Anchored to kelp | Gesture posture = pre-release |
| **Crab** (individual) | Stalled issues | Slow base crawl | Camouflaged, easy to miss |
| **Anglerfish** (individual) | Security alerts | Deep/bottom | Lure glow = active alert |
| **Starfish** (individual) | Resolved security | Seafloor crawl | Regenerating posture |

### Kelp Tower (Legacy Group)

| Part | Metric |
|---|---|
| Trunk height | Total commits |
| Frond density | Lifetime contributors |
| Age rings | Repo age |
| Sponge growth | Has wiki |
| Barnacle ring | Has homepage |
| Sea lion presence | Has GitHub Pages |
| Coral polyp density | Has project boards |
| Phytoplankton glow | Last release recency |

### World Map Data (71 data points across 3 tiers)

| Tier | Auth | Data Points | Examples |
|---|---|---|---|
| L1 — Public | None | 38 | Profile, repos, stars, language, location |
| L2 — Standard | OAuth (`public_repo`) | 22 | PRs, milestones, labels, branches |
| L3 — Elevated | OAuth (sensitive) | 11 | Traffic, security alerts, CI/CD, Dependabot |

---

## Architecture Decisions (recorded)

1. **Keplerian orbital physics** — creatures orbit whales with per-group parameters (radius, speed, inclination, eccentricity)
2. **Three nested motion scales** — creatures orbit whale, whale orbits kelp tower, tower sways with current
3. **InstancedMesh for swarms** — render thousands of fish in single draw call
4. **Modified Boids algorithm** — rotated cohesion vectors for non-spherical school shapes
5. **Dual-canvas pipeline** — primary for 3D, secondary for GLSL post-processing
6. **Frustum culling + fog** — natural LOD, deep water hides distant objects
7. **Abstraction as safety** — the more transformed into creature behavior, the safer to show publicly
8. **Data ethics** — public data + high abstraction = visible to all; private data = owner only always
