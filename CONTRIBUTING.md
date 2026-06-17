# Contributing to Git Ocean

Git Ocean is not a standard web dashboard; it is a highly structured WebGL data visualization engine. To keep the 3D scene optimized and the codebase clean, all contributions must adhere to a strict set of architectural and conceptual rules.

If you want to contribute, read this document fully. PRs that violate the core design laws or performance budgets will be rejected.

---

## 1. The Core Design Law: The Marine Biologist Test

Git Ocean maps raw GitHub data to an underwater ecosystem using strict scientific hierarchies. 

[span_0](start_span)Every visual element must be scientifically or technically explainable within the underwater world's own logic[span_0](end_span). [span_1](start_span)Fantasy and sci-fi influences are allowed only if they follow real physics, biology, or engineering principles[span_1](end_span).

Before you submit a PR for a new feature or creature, it must pass this test:
> **[span_2](start_span)"How would a marine biologist or underwater engineer explain this existing?"**[span_2](end_span)

* **Allowed:** Keplerian orbital mechanics, bioluminescence triggered by stress/activity, magnetohydrodynamic propulsion for transit tubes.
* **Not Allowed:** Magic glowing without biological reason, physically impossible movements, or unexplainable teleportation. If it requires magic, redesign it.

---

## 2. Development Protocol: Visual Render First

[span_3](start_span)We operate on a **Visual Render First** sequence[span_3](end_span). 

[span_4](start_span)Do not wire up the live GitHub GraphQL API when building new 3D visual changes or creatures[span_4](end_span). 
1. Build the Three.js/WebGL geometry and GLSL shaders using **mock data** first.
2. Verify the Keplerian orbital math and visual frame rates.
3. Only after the visual component is perfect should you wire it to the API data pipeline. 

This prevents burning GitHub API rate limits during heavy shader iteration. Use `npm run dev:mock` for all local visual development.

---

## 3. Architectural Boundaries (DDD)

The codebase is strictly separated into Domain-Driven Design contexts. Do not bleed logic between these domains:

* **GitHub Data Context:** Handles OAuth, GraphQL fetching, and API rate limiting. This domain knows *nothing* about 3D rendering.
* **Ocean Ecosystem Context:** Takes abstract data and converts it into marine entities (Trophic Levels 1-5). It handles the math for Keplerian orbits and creature instancing. 
* **World Map Context:** Handles geographic chunking, inverted heightmaps, and the Level 1/2/3 clustering hierarchy. 

---

## 4. Performance Budgets

WebGL on the browser is unforgiving. Your code must respect these constraints:
* **Draw Calls:** Use `InstancedMesh` for any grouped creatures (e.g., Krill swarms, Dolphin pods). Do not add individual meshes in loops.
* **LOD (Level of Detail):** Distance fog and water turbidity must naturally hide distant objects. Implement frustum culling aggressively.
* **Math Offloading:** Do not run heavy Keplerian orbital math on the main thread. Use Web Workers.
* **Frame Rate:** The scene must maintain 60 FPS on standard modern hardware.

---

## 5. Submitting a Pull Request

When you are ready to submit a PR, ensure it meets the following criteria:
1. **Scope:** One feature or bug fix per PR. Do not submit massive, multi-domain overhauls.
2. **Context:** Explain *why* you are making the change, citing the specific API endpoint or marine metaphor used.
3. **Screenshots/Video:** If you are changing WebGL output or shaders, you MUST include a screen recording of the change running at 60 FPS.
4. **Tests:** Ensure existing tests pass and add new ones for data-to-creature mapping logic.

### Commit Standards
Use conventional commits for clear history tracking:
* `feat:` (New feature or marine entity)
* `fix:` (Bug fix in API or rendering logic)
* `perf:` (Performance improvements, shader optimizations)
* `chore:` (Dependencies, build process changes)

---

By submitting a PR, you agree to license your contribution under the MIT License.
