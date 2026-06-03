# Git Ocean — Master Implementation Plan

> 3D underwater world visualizing GitHub repositories as whales, sea creatures, kelp towers, and geographic ecosystems.

## Stack

| Layer | Technology |
|---|---|
| 3D Engine | Three.js (WebGL/WebGPU) |
| Frontend | React 19 + TypeScript + Vite 8 |
| Styling | Tailwind v4 + shadcn/ui + motion |
| Backend | Hono on Cloudflare Workers |
| Database | D1 (SQLite at edge) + Drizzle ORM |
| Auth | better-auth (Google OAuth + email) |
| Storage | R2 buckets |
| Data Fetching | TanStack Query v5 |
| Brand | Cyan `#06B6D4` primary, Sky `#0EA5E9` accent |

---

## Skill Library (231 Skills)

### Three.js & 3D Web (37 skills)
| Skill | Dir | Purpose |
|---|---|---|
| `threejs-webgl` | `3d-web-experience` | Main 3D rendering, WebGL/WebGPU |
| `threejs-fundamentals` | `threejs-fundamentals` | Scene setup, cameras, renderer |
| `threejs-core-scene-graph` | `threejs-core-scene-graph` | Object3D, Scene, Group, layers |
| `threejs-core-renderer` | `threejs-core-renderer` | WebGLRenderer, tone mapping, color management |
| `threejs-core-math` | `threejs-core-math` | Vector3, Matrix4, Quaternion, Euler |
| `threejs-core-raycaster` | `threejs-core-raycaster` | Mouse picking, hover, click detection |
| `threejs-geometry` | `threejs-geometry` | Built-in shapes, BufferGeometry, InstancedMesh |
| `threejs-syntax-geometries` | `threejs-syntax-geometries` | Geometry creation, disposal patterns |
| `threejs-materials` | `threejs-materials` | PBR, MeshPhysicalMaterial, textures |
| `threejs-syntax-materials` | `threejs-syntax-materials` | Material config, color space |
| `threejs-syntax-shaders` | `threejs-syntax-shaders` | ShaderMaterial, RawShaderMaterial, GLSL |
| `threejs-shaders` | `threejs-shaders` | Custom GLSL, vertex/fragment shaders |
| `threejs-textures` | `threejs-textures` | Texture types, UV mapping, env maps |
| `threejs-lighting` | `threejs-lighting` | Light types, shadows, IBL |
| `threejs-impl-lighting` | `threejs-impl-lighting` | All 7 light types, PMREMGenerator, HDR |
| `threejs-impl-shadows` | `threejs-impl-shadows` | Shadow maps, bias, acne fix |
| `threejs-impl-post-processing` | `threejs-impl-post-processing` | EffectComposer, bloom, SSAO, DOF |
| `threejs-postprocessing` | `threejs-postprocessing` | Post-processing pipeline |
| `threejs-impl-animation` | `threejs-impl-animation` | AnimationMixer, clips, crossfade |
| `threejs-animation` | `threejs-animation` | Keyframe, skeletal, morph targets |
| `threejs-impl-webgpu` | `threejs-impl-webgpu` | WebGPU renderer, TSL, compute shaders |
| `threejs-impl-physics` | `threejs-impl-physics` | cannon-es, Rapier physics |
| `threejs-impl-xr` | `threejs-impl-xr` | WebXR, VR/AR, controllers |
| `threejs-impl-audio` | `threejs-impl-audio` | AudioListener, PositionalAudio |
| `threejs-impl-drei` | `threejs-impl-drei` | Drei helpers for R3F |
| `threejs-impl-react-three-fiber` | `threejs-impl-react-three-fiber` | R3F patterns |
| `threejs-impl-ifc-viewer` | `threejs-impl-ifc-viewer` | IFC/BIM model loading |
| `threejs-syntax-loaders` | `threejs-syntax-loaders` | GLTFLoader, DRACOLoader, KTX2 |
| `threejs-loaders` | `threejs-loaders` | Asset loading patterns |
| `threejs-syntax-controls` | `threejs-syntax-controls` | OrbitControls, FlyControls |
| `threejs-interaction` | `threejs-interaction` | Raycasting, controls, input |
| `threejs-errors-performance` | `threejs-errors-performance` | Performance debugging, InstancedMesh |
| `threejs-errors-rendering` | `threejs-errors-rendering` | Black screen, invisible objects debug |
| `threejs-agents-scene-builder` | `threejs-agents-scene-builder` | Scene composition decisions |
| `threejs-agents-model-optimizer` | `threejs-agents-model-optimizer` | Model optimization, KTX2, Draco |
| `threejs-best-practices` | `three-best-practices` | General Three.js best practices |
| `r3f-best-practices` | `r3f-best-practices` | R3F specific best practices |

### Animation & Motion (11 skills)
| Skill | Dir | Purpose |
|---|---|---|
| `gsap-scrolltrigger` | `gsap-scrolltrigger` | GSAP timelines, ScrollTrigger, tweens |
| `motion-framer` | `motion-framer` | React animation, AnimatePresence, variants |
| `react-spring-physics` | `react-spring-physics` | Physics-based spring animations |
| `animejs` | `animejs` | JS animation engine, timeline, SVG |
| `lottie-animations` | `lottie-animations` | After Effects → JSON animations |
| `rive-interactive` | `rive-interactive` | State machine vector animations |
| `locomotive-scroll` | `locomotive-scroll` | Smooth scrolling, parallax |
| `barba-js` | `barba-js` | Page transitions |
| `scroll-reveal-libraries` | `scroll-reveal-libraries` | AOS scroll reveals |
| `lightweight-3d-effects` | `lightweight-3d-effects` | Zdog, Vanta.js, Vanilla-Tilt |
| `animated-component-libraries` | `animated-component-libraries` | Magic UI, React Bits components |

### React & Frontend (18 skills)
| Skill | Dir | Purpose |
|---|---|---|
| `react-patterns` | `react-patterns` | React 19 perf, composition, patterns |
| `react-best-practices` | `react-best-practices` | Vercel React best practices |
| `react-component-performance` | `react-component-performance` | Component perf diagnosis |
| `react-state-management` | `react-state-management` | Zustand, Jotai, Redux Toolkit, React Query |
| `react-ui-patterns` | `react-ui-patterns` | Loading states, error handling patterns |
| `react-native` | `react-native` | React Native + Expo |
| `frontend-design` | `frontend-design` | Production-grade frontend UI |
| `modern-web-design` | `modern-web-design` | 2024-2025 design trends |
| `senior-frontend` | `senior-frontend` | Senior frontend toolkit |
| `design-taste-frontend` | `design-taste-frontend` | High-agency design taste |
| `antigravity-design-expert` | `antigravity-design-expert` | Glassmorphism, weightless UI |
| `web-design-guidelines` | `web-design-guidelines` | UI compliance review |
| `ui-component` | `ui-component` | StyleSeed Toss components |
| `ui-pattern` | `ui-pattern` | Reusable UI patterns |
| `ui-tokens` | `ui-tokens` | Design token management |
| `ui-ux-pro-max` | `ui-ux-pro-max` | Comprehensive design guide |
| `ui-visual-validator` | `ui-visual-validator` | Visual validation, a11y |
| `tailwind-design-system` | `tailwind-design-system` | Tailwind design systems |

### Styling & Theme (6 skills)
| Skill | Dir | Purpose |
|---|---|---|
| `shadcn-ui` | `shadcn-ui` | shadcn/ui component installation |
| `tailwind-theme-builder` | `tailwind-theme-builder` | Tailwind v4 + dark mode setup |
| `tailwind-patterns` | `tailwind-patterns` | CSS-first Tailwind v4 patterns |
| `color-palette` | `color-palette` | Accessible color palette generation |
| `theme-factory` | `theme-factory` | Pre-set themes for artifacts |
| `taste-design` | `taste-design` | Premium design system for Stitch |

### Web Performance (7 skills)
| Skill | Dir | Purpose |
|---|---|---|
| `web-performance-optimization` | `web-performance-optimization` | Core Web Vitals, bundle size, caching |
| `performance-optimizer` | `performance-optimizer` | Performance bottleneck detection |
| `progressive-web-app` | `progressive-web-app` | PWA, service workers, offline, Workbox |
| `react-component-performance` | `react-component-performance` | Targeted React perf fixes |
| `threejs-errors-performance` | `threejs-errors-performance` | Three.js InstancedMesh, LOD, draw calls |
| `image-processing` | `image-processing` | Image resize, WebP, optimize |
| `production-audit` | `production-audit` | Production-readiness gap audit |

### Cloudflare & Backend (12 skills)
| Skill | Dir | Purpose |
|---|---|---|
| `cloudflare-worker-builder` | `cloudflare-worker-builder` | Scaffold Workers, Hono, bindings |
| `cloudflare-api` | `cloudflare-api` | Bulk DNS, D1, R2, KV, Queues via REST |
| `vite-flare-starter` | `vite-flare-starter` | Full-stack Cloudflare template |
| `hono-api-scaffolder` | `hono-api-scaffolder` | Hono route scaffolding, Zod validation |
| `d1-drizzle-schema` | `d1-drizzle-schema` | Drizzle ORM for D1, migration patterns |
| `d1-migration` | `d1-migration` | D1 migration workflow |
| `db-seed` | `db-seed` | Database seed scripts |
| `tanstack-start` | `tanstack-start` | Full-stack TanStack on Cloudflare |
| `vercel-cli-with-tokens` | `vercel-cli-with-tokens` | Vercel token-based deploy |
| `stripe-payments` | `stripe-payments` | Checkout, subscriptions, webhooks |
| `vercel-composition-patterns` | `vercel-composition-patterns` | React composition architecture |
| `next-cache-components` | `next-cache-components` | Next.js cache, PPR, cacheLife |

### Auth, DB & Data (8 skills)
| Skill | Dir | Purpose |
|---|---|---|
| `typescript-expert` | `typescript-expert` | TS type-level programming, monorepo |
| `typescript-advanced-types` | `typescript-advanced-types` | Generics, conditional types, mapped types |
| `typed-service-contracts` | `typed-service-contracts` | Spec & Handler pattern |
| `software-architecture` | `software-architecture` | Architecture quality guidance |
| `postgres` | — | (from references) PostgreSQL patterns |
| `fork-discipline` | `fork-discipline` | Multi-client boundary auditing |
| `senior-fullstack` | `senior-fullstack` | Fullstack toolkit |
| `testing-qa` | `testing-qa` | Unit, integration, E2E testing |

### Testing & QA (6 skills)
| Skill | Dir | Purpose |
|---|---|---|
| `vitest` | `vitest` | Vitest setup, config, mocking |
| `testing-qa` | `testing-qa` | Comprehensive test workflows |
| `ux-audit` | `ux-audit` | Usability walkthrough, scenario battery |
| `ux-extract` | `ux-extract` | UX pattern extraction from reference apps |
| `ux-compare` | `ux-compare` | Cross-app UX comparison |
| `responsiveness-check` | `responsiveness-check` | Viewport breakpoint testing |
| `design-review` | `design-review` | Visual design quality review |
| `onboarding-ux` | `onboarding-ux` | Onboarding flows, empty states, tooltips |
| `codex-review` | `codex-review` | Independent GPT-5/o3 code review |
| `web-design-guidelines` | `web-design-guidelines` | WCAG a11y, compliance audit |

### Browser Automation & Web Data (26 skills)
| Skill | Dir | Purpose |
|---|---|---|
| `agent-browser` | `agent-browser` | Browser automation for AI agents |
| `skyvern-browser-automation` | `skyvern-browser-automation` | AI browser automation |
| `firecrawl` | `firecrawl` | Web search, scrape, download |
| `firecrawl-search` | `firecrawl-search` | Web search with full content |
| `firecrawl-scrape` | `firecrawl-scrape` | Single URL extraction |
| `firecrawl-crawl` | `firecrawl-crawl` | Site-wide bulk extraction |
| `firecrawl-map` | `firecrawl-map` | Site URL discovery |
| `firecrawl-interact` | `firecrawl-interact` | Browser interaction (click, form, login) |
| `firecrawl-download` | `firecrawl-download` | Full site download |
| `firecrawl-agent` | `firecrawl-agent` | AI structured data extraction |
| `firecrawl-parse` | `firecrawl-parse` | Local file → markdown |
| `firecrawl-deep-research` | `firecrawl-deep-research` | Multi-source research synthesis |
| `firecrawl-knowledge-base` | `firecrawl-knowledge-base` | Knowledge base from web |
| `firecrawl-knowledge-ingest` | `firecrawl-knowledge-ingest` | JS-heavy/authenticated docs ingest |
| `firecrawl-qa` | `firecrawl-qa` | Exploratory QA testing |
| `firecrawl-seo-audit` | `firecrawl-seo-audit` | SEO audit |
| `firecrawl-company-directories` | `firecrawl-company-directories` | Company list extraction |
| `firecrawl-lead-gen` | `firecrawl-lead-gen` | Prospect list generation |
| `firecrawl-lead-research` | `firecrawl-lead-research` | Pre-meeting intelligence |
| `firecrawl-competitive-intel` | `firecrawl-competitive-intel` | Competitor monitoring |
| `firecrawl-market-research` | `firecrawl-market-research` | Market/financial research |
| `firecrawl-dashboard-reporting` | `firecrawl-dashboard-reporting` | Dashboard metrics extraction |
| `firecrawl-demo-walkthrough` | `firecrawl-demo-walkthrough` | Product walkthrough analysis |
| `firecrawl-research-papers` | `firecrawl-research-papers` | Academic/paper research |
| `firecrawl-shop` | `firecrawl-shop` | Product comparison shopping |
| `firecrawl-workflows` | `firecrawl-workflows` | Outcome-focused web data workflows |

### AI/ML & Agents (14 skills)
| Skill | Dir | Purpose |
|---|---|---|
| `brains-trust` | `brains-trust` | Multi-model second opinions |
| `deep-research` | `deep-research` | Research before building |
| `ai-image-generator` | `ai-image-generator` | Gemini/GPT image generation |
| `elevenlabs-agents` | `elevenlabs-agents` | Conversational voice AI agents |
| `google-agents-cli-adk-code` | `google-agents-cli-adk-code` | ADK agent code patterns |
| `google-agents-cli-scaffold` | `google-agents-cli-scaffold` | ADK project scaffolding |
| `google-agents-cli-deploy` | `google-agents-cli-deploy` | ADK deployment |
| `google-agents-cli-eval` | `google-agents-cli-eval` | ADK evaluation |
| `google-agents-cli-observability` | `google-agents-cli-observability` | ADK monitoring/tracing |
| `google-agents-cli-publish` | `google-agents-cli-publish` | ADK Gemini Enterprise publish |
| `google-agents-cli-workflow` | `google-agents-cli-workflow` | ADK development lifecycle |
| `mcp-builder` | `mcp-builder` | MCP server in Python/FastMCP |
| `subagent-driven-development` | `subagent-driven-development` | Multi-agent implementation |
| `opensrc` | `opensrc` | Dependency source code fetching |

### Google Workspace & Integration (7 skills)
| Skill | Dir | Purpose |
|---|---|---|
| `google-apps-script` | `google-apps-script` | Sheets/Workspace automation |
| `google-chat-messages` | `google-chat-messages` | Google Chat webhooks |
| `gws-setup` | `gws-setup` | Google Workspace CLI setup |
| `gws-install` | `gws-install` | gws multi-machine install |
| `firecrawl-build-scrape` | `firecrawl-build-scrape` | Firecrawl scrape integration |
| `firecrawl-build-search` | `firecrawl-build-search` | Firecrawl search integration |
| `firecrawl-build-interact` | `firecrawl-build-interact` | Firecrawl interact integration |
| `firecrawl-build-onboarding` | `firecrawl-build-onboarding` | Firecrawl credentials setup |
| `firecrawl-website-design-clone` | `firecrawl-website-design-clone` | Design extraction from sites |

### Content, SEO & Marketing (12 skills)
| Skill | Dir | Purpose |
|---|---|---|
| `landing-page` | `landing-page` | Single-page landing generation |
| `icon-set-generator` | `icon-set-generator` | Cohesive SVG icon sets |
| `favicon-gen` | `favicon-gen` | Favicon generation |
| `seo-local-business` | `seo-local-business` | JSON-LD, meta, robots, sitemap |
| `social-media-posts` | `social-media-posts` | Platform-specific social content |
| `product-showcase` | `product-showcase` | Marketing site from app screenshots |
| `app-docs` | `app-docs` | User documentation with screenshots |
| `walkthrough-video` | `walkthrough-video` | Remotion walkthrough videos |
| `remotion` | `remotion` | Video generation from Stitch |
| `project-docs` | `project-docs` | ARCHITECTURE.md, API docs, schema docs |
| `proposal-writer` | `proposal-writer` | Client proposals, SOW |
| `strategy-document` | `strategy-document` | SWOT, OKRs, business plans |

### Stitch Design System (8 skills)
| Skill | Dir | Purpose |
|---|---|---|
| `stitch-generate-design` | `stitch-generate-design` | Generate/edit screens via Stitch MCP |
| `stitch-manage-design-system` | `stitch-manage-design-system` | Design system CRUD in Stitch |
| `stitch-upload-to-stitch` | `stitch-upload-to-stitch` | Upload assets to Stitch project |
| `stitch-extract-design-md` | `stitch-extract-design-md` | Design system from source code |
| `stitch-extract-static-html` | `stitch-extract-static-html` | Static HTML extraction |
| `stitch-code-to-design` | `stitch-code-to-design` | Frontend code → Stitch design |
| `stitch-loop` | `stitch-loop` | Autonomous baton-passing build loop |
| `design-loop` | `design-loop` | Multi-page autonomous builder |
| `design-system` | `design-system` | Extract design system from website |
| `enhance-prompt` | `enhance-prompt` | UI prompt enhancement for Stitch |
| `react-components` | `react-components` | React components from Stitch designs |

### 3D Sub-Skills (10 skills)
| Skill | Dir | Purpose |
|---|---|---|
| `babylonjs-engine` | `babylonjs-engine` | Alternative 3D engine |
| `playcanvas-engine` | `playcanvas-engine` | Lightweight game engine |
| `pixijs-2d` | `pixijs-2d` | 2D WebGL sprite rendering |
| `shader-dev` | `shader-dev` | GLSL shader techniques |
| `ralph-gpu` | `ralph-gpu` | WebGPU shader library |
| `web3d-integration-patterns` | `web3d-integration-patterns` | Multi-library 3D patterns |
| `substance-3d-texturing` | `substance-3d-texturing` | PBR material texturing |
| `blender-web-pipeline` | `blender-web-pipeline` | Blender → glTF export |
| `aframe-webxr` | `aframe-webxr` | Declarative WebXR/VR |
| `spline-interactive` | `spline-interactive` | No-code 3D design |
| `spline-3d-integration` | `spline-3d-integration` | Spline → React embedding |

### Business English & Writing (6 skills)
| Skill | Dir | Purpose |
|---|---|---|
| `aussie-business-english` | `aussie-business-english` | EN-AU professional writing |
| `nz-business-english` | `nz-business-english` | EN-NZ professional writing |
| `uk-business-english` | `uk-business-english` | EN-GB professional writing |
| `us-business-english` | `us-business-english` | EN-US professional writing |
| `award-application` | `award-application` | Award/grant submissions |
| `resume-cover-letter` | `resume-cover-letter` | Resume/CV and cover letters |

### Project Management & Workflow (14 skills)
| Skill | Dir | Purpose |
|---|---|---|
| `product-manager` | `product-manager` | Senior PM with 30+ frameworks |
| `product-design` | `product-design` | Apple-level visual systems |
| `software-architecture` | `software-architecture` | Architecture quality |
| `brainstorming` | `brainstorming` | Creative exploration |
| `writing-plans` | `writing-plans` | Implementation plan generation |
| `roadmap` | `roadmap` | Phased delivery + execution |
| `executing-plans` | `executing-plans` | Plan execution with checkpoints |
| `finishing-a-development-branch` | `finishing-a-development-branch` | PR/merge decisions |
| `git-workflow` | `git-workflow` | PR prep, branch cleanup, merge |
| `github-release` | `github-release` | Sanitize, tag, publish releases |
| `receiving-code-review` | `receiving-code-review` | Handle review feedback |
| `requesting-code-review` | `requesting-code-review` | Verify before merge |
| `verification-before-completion` | `verification-before-completion` | Evidence before assertions |
| `project-health` | `project-health` | Config, audit, permissions, cleanup |

### Specialized (11 skills)
| Skill | Dir | Purpose |
|---|---|---|
| `parcel-tracking` | `parcel-tracking` | Australian parcel tracking |
| `skill-creator` | `skill-creator` | Create new skills |
| `skill-auditor` | `skill-auditor` | Audit skill library quality |
| `find-skills` | `find-skills` | Discover matching skills |
| `customize-opencode` | `customize-opencode` | opencode configuration |
| `ink` | `ink` | Terminal UI from JSON specs |
| `shopify-setup` | `shopify-setup` | Shopify CLI + API setup |
| `shopify-products` | `shopify-products` | Product CRUD via GraphQL |
| `shopify-content` | `shopify-content` | Pages, blog, nav, SEO |
| `wordpress-setup` | `wordpress-setup` | WP-CLI + REST API |
| `wordpress-content` | `wordpress-content` | Posts, pages, media, menus |
| `wordpress-elementor` | `wordpress-elementor` | Elementor page editing |
| `nemoclaw-setup` | `nemoclaw-setup` | NVIDIA NemoClaw sandbox |
| `team-update` | `team-update` | Project update to team chat |
| `terminal-bridge` | `terminal-bridge` | Active terminal tracking |
| `using-git-worktrees` | `using-git-worktrees` | Isolated dev workspaces |
| `next-upgrade` | `next-upgrade` | Next.js upgrade codemods |

### Web Artifacts & Builders (4 skills)
| Skill | Dir | Purpose |
|---|---|---|
| `web-artifacts-builder` | `web-artifacts-builder` | Powerful frontend artifacts |
| `react-three-fiber` | `react-three-fiber` | R3F scenes (declarative) |
| `references` | `references` | Shared references for skills |
| `threejs-skills` | `threejs-skills` | Three.js scene creation |

---

## Project Structure (32 Git Ocean files, 711 total source files)

### Git Ocean — Client Components (20 files)
```
src/client/components/
├── whale-entity.ts           # Procedural whale: body, fins, bioluminescent dots
├── creature-factory.ts       # 10 creature types + InstancedMesh swarms
├── creature-info-panel.tsx   # Slide-in card on creature click
├── creature-legend.tsx       # Toggleable legend for 10 creature types
├── kelp-tower.ts             # Segmented stalk + fronds, LOD-wrapped
├── ocean-scene.tsx           # Full-screen Three.js canvas, underwater fog
├── ocean-helpers.ts          # Water surface, particles, coral clusters
├── ocean-lighting.ts         # Hemisphere + DirectionalLight with shadows
├── ocean-floor.ts            # Vertex-colored sandy seafloor
├── ocean-composer.tsx        # Orchestrator: floor + towers + whales + creatures
├── ocean-layout.tsx          # Glassmorphism sidebar + panels
├── stats-panel.tsx           # Animated counters for ocean metrics
├── connect-github.tsx        # GitHub OAuth button
├── globe-scene.tsx           # 3D globe: SphereGeometry, day/night, atmosphere
├── globe-helpers.ts          # Grid sphere, sonar obelisks, language rings, colonies
├── globe-composer.tsx        # 24 country pins, obelisks, rings, connection lines
├── lod-system.ts             # LOD: high/medium/low detail levels, billboard sprites
├── obelisk-vote-panel.tsx    # Skin voting UI, epoch timer, skin browser
└── shared/                   # ErrorBoundary, ProtectedRoute, ScrollToTop
```

### Git Ocean — Hooks (3 files)
```
src/client/hooks/
├── use-ocean-data.ts         # Ocean state/repo/creature fetching
├── use-world-map-data.ts     # 24-country mock with language breakdowns
└── (shared hooks: useDebounce, useMediaQuery, useNotifications)
```

### Git Ocean — Pages (4 files)
```
src/client/pages/
├── ocean.tsx                 # Main 3D ocean view
├── world-map.tsx             # Geographic globe + country detail + colonies
├── git-dashboard.tsx         # Welcome/landing dashboard
└── git-settings.tsx          # Ocean preferences
```

### Git Ocean — Server (12 files)
```
src/server/
├── index.ts                  # Hono app, route registration (ocean, github, geography, obelisk)
├── db/git-ocean-schema.ts    # 8 tables: repos, states, creatures, world_map, github_connections, obelisk_skins, obelisk_votes, obelisk_epochs
├── routes/
│   ├── ocean.ts              # GET/PUT ocean state, creatures, repos
│   ├── github.ts             # OAuth connect, profile, repos, webhook
│   ├── geography.ts          # Countries, search, colonies, locate
│   └── obelisk.ts            # Skins CRUD, vote, epoch, active-skin
├── services/
│   ├── github-api.ts         # GraphQL client, token encryption (AES-256-GCM)
│   ├── repo-mapping.ts       # Metrics → creature/kelp/ocean-state mapping
│   ├── geocoding.ts          # 200+ city lookup, freeform parsing
│   ├── geographic-clusters.ts # Country/city clustering, language sorting
│   └── obelisk-service.ts    # Epoch management, vote tallying
├── middleware/
│   ├── auth.ts               # better-auth middleware
│   ├── optional-auth.ts      # Optional authentication
│   └── rate-limit.ts         # Rate limiting
└── lib/
    ├── crypto.ts             # AES-256-GCM encryption utilities
    ├── credentials.ts        # Credential management
    └── logger.ts             # Logging service
```

### Migrations (3 files)
```
drizzle/
├── 20260603000000_initial_git_ocean_tables.sql    # 5 base tables
├── 20260603030000_geographic_data_layer.sql        # City, language, confidence
└── 20260603040000_obelisk_voting.sql               # Skins, votes, epochs
```

### Config & Deploy (6 files)
```
├── public/
│   ├── sw.js                 # Service worker (cache-first static, network-first API)
│   └── manifest.json         # PWA: name, colors, icons
├── index.html                # Theme-color meta, PWA manifest link
├── vite.config.ts            # manualChunks: three, three-addons, ocean-3d, globe-3d, ui
├── vitest.config.ts          # Cloudflare worker test pool, D1/R2 bindings
├── wrangler.jsonc            # Worker config, D1, R2, OAuth secrets
├── .dev.vars                 # Local secrets: auth secret, GitHub OAuth
└── docs/
    ├── GIT_OCEAN_PLAN.md     # Per-task implementation plan
    └── GIT_OCEAN_MASTER_PLAN.md  # This file — master skill/plan document
```

---

## Phases & Status

### Phase 0: Foundation ✅ DONE
| # | Task | Skill Used | Files |
|---|---|---|---|
| 1 | Scaffold from vite-flare-starter, rebrand to git-ocean | `vite-flare-starter` | All |
| 2 | Git init + remote | `git-workflow` | — |
| 3 | Dependencies (pnpm) | — | `package.json` |
| 4 | 52 base migrations | `d1-drizzle-schema`, `d1-migration` | `drizzle/` |
| 5 | `.dev.vars` with brand config | — | `.dev.vars` |
| 6 | Drizzle ORM + D1 config | `d1-drizzle-schema` | `git-ocean-schema.ts` |
| 7 | TypeScript strict + Biome lint | `typescript-expert` | `tsconfig.json` |
| 8 | Vitest + Cloudflare test pool | `vitest` | `vitest.config.ts` |
| 9 | Database schema: 5 tables | `d1-drizzle-schema` | `git-ocean-schema.ts` |
| 10 | API routes: ocean state, creatures, repos | `hono-api-scaffolder` | `routes/ocean.ts` |
| 11 | Frontend pages: ocean, dashboard, settings, world | `frontend-design`, `react-patterns` | `pages/*.tsx` |

### Phase 1: Single-User Ocean ✅ DONE
| # | Task | Skill Used | Files |
|---|---|---|---|
| 1A | Ocean scene (fog, water shader, particles) | `threejs-fundamentals`, `threejs-core-scene-graph`, `threejs-shaders` | `ocean-scene.tsx`, `ocean-helpers.ts` |
| 1B | Ocean lighting | `threejs-impl-lighting`, `threejs-impl-shadows` | `ocean-lighting.ts` |
| 1C | Ocean floor | `threejs-syntax-geometries` | `ocean-floor.ts` |
| 1D | Whale entity (procedural geometry) | `threejs-syntax-geometries`, `threejs-syntax-materials` | `whale-entity.ts` |
| 1E | 10 creature types | `threejs-geometry`, `threejs-syntax-materials` | `creature-factory.ts` |
| 1F | Kelp towers | `threejs-syntax-geometries` | `kelp-tower.ts` |
| 1G | Scene composer + animation loop | `threejs-impl-animation` | `ocean-composer.tsx` |
| 1H | Glassmorphism layout | `antigravity-design-expert`, `shadcn-ui` | `ocean-layout.tsx` |
| 1I | Stats panel | `frontend-design`, `motion-framer` | `stats-panel.tsx` |
| 1J | Creature info panel | `frontend-design` | `creature-info-panel.tsx` |
| 1K | Creature legend | `frontend-design` | `creature-legend.tsx` |
| 1L | GitHub connect button | `frontend-design` | `connect-github.tsx` |
| 1M | Page transitions | `motion-framer` | `animations/` |

### Phase 2: World Map ✅ DONE
| # | Task | Skill Used | Files |
|---|---|---|---|
| 2A-1 | 3D globe (SphereGeometry + textures) | `threejs-syntax-geometries`, `threejs-textures` | `globe-scene.tsx` |
| 2A-2 | Day/night cycle lighting | `threejs-impl-lighting` | `globe-scene.tsx` |
| 2A-3 | Atmosphere glow shader + clouds | `threejs-impl-post-processing`, `shader-dev` | `globe-helpers.ts` |
| 2A-4 | Country border outlines | `threejs-syntax-geometries`, `threejs-shaders` | `globe-helpers.ts` |
| 2A-5 | Pin markers (instanced mesh) | `threejs-syntax-geometries` | `globe-composer.tsx` |
| 2A-6 | Language district heat maps | `threejs-shaders`, `threejs-materials` | `globe-helpers.ts` |
| 2A-7 | Globe controls + zoom | `threejs-syntax-controls` | `globe-scene.tsx` |
| 2B-8 | Geocode GitHub locations | `hono-api-scaffolder` | `services/geocoding.ts` |
| 2B-9 | Capital cluster aggregation | `d1-drizzle-schema` | `services/geographic-clusters.ts` |
| 2B-10 | City proximity clustering | — | `services/geographic-clusters.ts` |
| 2B-11 | Language district sorting | — | `services/geographic-clusters.ts` |
| 2B-12 | Deep ocean colonies | — | `services/geographic-clusters.ts` |
| 2B-13 | Sonar obelisks | `threejs-syntax-geometries` | `globe-helpers.ts` |
| 2B-14 | Obelisk skin voting | `shadcn-ui`, `hono-api-scaffolder` | `routes/obelisk.ts`, `obelisk-vote-panel.tsx`, `obelisk-service.ts` |
| 2C-15 | 5 zoom levels | `threejs-syntax-controls` | `globe-scene.tsx` |
| 2C-16 | Country detail panel | `frontend-design` | `world-map.tsx` |
| 2C-17 | Ocean colonies panel | `frontend-design` | `world-map.tsx` |

### Phase 3: Multiplayer ❌ NOT STARTED
| # | Task | Skill Used | Files Needed |
|---|---|---|---|
| 3A-1 | WebSocket via Durable Objects | `cloudflare-worker-builder` | `src/server/durable-objects/websocket-gateway.ts`, `wrangler.jsonc` |
| 3A-2 | User presence broadcast (pos, quat, vel) | `hono-api-scaffolder` | `src/server/services/presence.ts` |
| 3A-3 | Dead reckoning + lerp for remote users | `threejs-core-math` | `src/client/components/remote-avatar.ts` |
| 3A-4 | Avatar rendering for other users | `whale-entity.ts` (reuse) | `src/client/components/remote-avatar.ts` |
| 3A-5 | Ocean zone partitioning (spatial grid) | — | `src/server/services/spatial-grid.ts` |
| 3B-6 | Shared ocean view (teleport to friend) | `shadcn-ui` | `src/client/pages/friend-ocean.tsx` |
| 3B-7 | Visit other users' oceans | `creature-factory.ts` (reuse) | `src/server/routes/visit.ts` |
| 3B-8 | Creature gifts / interactions | `creature-factory.ts` | `src/server/services/gifts.ts` |
| 3B-9 | Chat overlay (whale song messages) | `shadcn-ui`, `react-patterns` | `src/client/components/ocean-chat.tsx` |
| 3C-10 | Metro stations at obelisks | `threejs-syntax-geometries` | `globe-helpers.ts` (extend) |
| 3C-11 | Fast travel between stations | `threejs-impl-animation` | `src/client/components/metro-travel.tsx` |
| 3C-12 | Commuter visualization | `threejs-textures`, `shader-dev` | `src/client/components/metro-commuters.ts` |

### Phase 4A: Performance 🔶 PARTIAL (4/7)
| # | Task | Skill Used | Status |
|---|---|---|---|
| 1 | InstancedMesh for swarms | `threejs-errors-performance` | ✅ Done |
| 2 | LOD system (creatures + kelp) | `threejs-agents-model-optimizer` | ✅ Done |
| 3 | **WebGPU renderer fallback** | `threejs-impl-webgpu` | ❌ Pending |
| 4 | **WebWorkers for orbital math** | `senior-frontend` | ❌ Pending |
| 5 | **KTX2/Basis texture compression** | `threejs-agents-model-optimizer` | ❌ Pending |
| 6 | Bundle optimization + code splitting | `web-performance-optimization` | ✅ Done |
| 7 | PWA (service worker, manifest) | `progressive-web-app` | ✅ Done |

### Phase 4B: Real GitHub API 🔶 PARTIAL (4/6)
| # | Task | Skill Used | Status |
|---|---|---|---|
| 8 | GitHub OAuth flow | `hono-api-scaffolder`, `auth` | ✅ Done |
| 9 | GraphQL API client | `hono-api-scaffolder` | ✅ Done |
| 10 | Webhook receiver | `cloudflare-worker-builder` | ✅ Done |
| 11 | Data→3D mapping service | `creature-factory.ts` | ✅ Done |
| 12 | **Rate-limit KV caching** | `cloudflare-worker-builder` | ❌ Pending |
| 13 | **GitHub Actions on kelp towers** | `threejs-materials` | ❌ Pending |

### Phase 4C: Testing & QA ❌ NOT STARTED (0/7)
| # | Task | Skill Used | Status |
|---|---|---|---|
| 14 | Integration tests (API endpoints) | `vitest`, `testing-qa` | ❌ Pending |
| 15 | 3D scene unit tests | `vitest`, `testing-qa` | ❌ Pending |
| 16 | UX walkthrough | `ux-audit` | ❌ Pending |
| 17 | Responsiveness check | `responsiveness-check` | ❌ Pending |
| 18 | WCAG accessibility audit | `web-design-guidelines` | ❌ Pending |
| 19 | Visual design review | `design-review` | ❌ Pending |
| 20 | Independent code review (Codex) | `codex-review` | ❌ Pending |

### Phase 4D: Deploy & Ship ❌ NOT STARTED (0/10)
| # | Task | Skill Used | Status |
|---|---|---|---|
| 21 | Production D1 + R2 resources | `cloudflare-worker-builder` | ❌ Pending |
| 22 | Deploy to Cloudflare Workers | `vercel-cli-with-tokens`, `cloudflare-worker-builder` | ❌ Pending |
| 23 | Custom domain + SSL | `cloudflare-api` | ❌ Pending |
| 24 | Generate project docs | `project-docs` | ❌ Pending |
| 25 | User documentation | `app-docs` | ❌ Pending |
| 26 | Product showcase | `product-showcase` | ❌ Pending |
| 27 | Demo walkthrough video | `walkthrough-video` | ❌ Pending |
| 28 | GitHub release + changelog | `github-release` | ❌ Pending |
| 29 | SEO, OG images, sitemap | `seo-local-business`, `ai-image-generator` | ❌ Pending |
| 30 | Beta launch announcement | `social-media-posts` | ❌ Pending |

---

## Creature-to-GitHub Metric Mapping

| Creature | Data Point | Orbit | Geometry |
|---|---|---|---|
| **Dolphin** (pod) | Core contributors | Innermost, fast | Elongated body + beak, pod 2-5 |
| **Jellyfish** (swarm) | Watchers | Outermost, slow | Dome cap + 8 tentacles, translucent |
| **Turtle** (individual) | Merged PRs | Calm spiral | Oval body + shell + 4 legs |
| **Barracuda** (individual) | Open issues | Erratic figure-8 | Long thin body, silver flash |
| **Octopus** (individual) | Open PRs | Mid | Round body + 8 wavy arms |
| **Manta Ray** (individual) | Dependents | Wide ellipse | Flat diamond, wingspan = dep count |
| **Seahorse** (individual) | Releases | Anchored to kelp | S-curve, upright |
| **Crab** (individual) | Stalled issues | Base crawl | 8 legs + 2 claws, sideways |
| **Anglerfish** (individual) | Security alerts | Deep/bottom | Glowing lure, dark body |
| **Starfish** (individual) | Resolved security | Seafloor crawl | 5-arm star, regenerating |

## Kelp Tower Encoding

| Part | Metric |
|---|---|
| Trunk height | Total commits |
| Frond density | Lifetime contributors |
| Age rings | Repo age |
| Glow animation | Last push recency |
| Barnacle ring | Has homepage |
| Coral polyp density | Has project boards |

---

## Architecture Decisions

1. **Keplerian orbital physics** — creatures orbit whales with per-group parameters (radius, speed, inclination, eccentricity)
2. **Three nested motion scales** — creatures orbit whale, whale orbits kelp tower, tower sways with current
3. **InstancedMesh for swarms** — render thousands in single draw call (implemented for jellyfish, barracuda, dolphin)
4. **LOD system** — 3 detail levels: high (64 segments), medium (32), low (16 flat color / billboard sprite)
5. **Dual-canvas pipeline** — primary for 3D, secondary for GLSL post-processing
6. **Frustum culling + fog** — natural LOD, deep water hides distant objects
7. **Discrete zoom levels** — 5 levels: world(10), continent(7), country(4.5), city(3), detail(2) with OrbitControls snap
8. **AES-256-GCM** — GitHub OAuth token encryption at rest
9. **7-day epochs** — obelisk skin voting cycles with tallied winners per country
10. **Data ethics** — public data + high abstraction = visible to all; private data = owner only

## Critical Blockers

| Block | Impact | Resolution |
|---|---|---|
| GitHub OAuth env vars not set | Cannot test /api/github/connect flow | Set `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` in `.dev.vars` + `wrangler.jsonc` |
| No `account_id` in wrangler.jsonc | Cannot deploy or use Durable Objects | Add Cloudflare account ID to config |
| KTX2 compression needs tooling | Cannot optimize textures for WebGPU | Install `@gltf-transform/cli` or `ktx-software` |
| Durable Objects not configured | Phase 3 multiplayer entirely blocked | Add `[[durable_objects.bindings]]` to wrangler |

## Git Log
```
e1d6037 Phase 4A: Performance optimization — InstancedMesh, LOD, bundle, PWA, treeshaken imports
9e3dd82 Phase 2B: Geographic data layer + globe (obelisks, rings, colonies, zoom)
f52476f Phase 4B: GitHub OAuth, GraphQL, webhook, repo-to-creature mapping
3c48bce Phase 2: Interactive 3D World Map globe
609fc64 Initial commit: Git Ocean — 3D underwater GitHub visualization
```
