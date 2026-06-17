<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=020d1a&height=200&section=header&text=Git%20Ocean&fontSize=60&fontColor=4ac29a&animation=twinkling" width="100%"/>

# 🌊 Git Ocean

**Your GitHub profile, visualized as a scientifically accurate 3D marine ecosystem.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?logo=three.js)](https://threejs.org/)
[![React](https://img.shields.io/badge/React-18.0-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare)](https://workers.cloudflare.com/)
[![GitHub GraphQL](https://img.shields.io/badge/GitHub-GraphQL-181717?logo=github)](https://docs.github.com/en/graphql)

<p align="center">
  <kbd><b><a href="#-the-core-metaphor">Architecture</a></b></kbd> •
  <kbd><b><a href="#-orbital-physics--math">Physics</a></b></kbd> •
  <kbd><b><a href="#-tech-stack">Tech Stack</a></b></kbd> •
  <kbd><b><a href="#-installation--execution">Run Locally</a></b></kbd>
</p>

> **The Design Law:** Every visual element must be scientifically or technically explainable within the underwater world's own logic. Fantasy is allowed only if it follows real physics, biology, or engineering principles.

</div>

---

## 🧬 The Core Metaphor

Git Ocean maps **71 GitHub data points** to **85 specific marine behaviors** across 7 trophic levels. There is no arbitrary data placement; everything follows a strict marine biology and physics hierarchy.

<div align="center">

| GitHub Entity | Marine Metaphor | Visual Behavior |
| :--- | :--- | :--- |
| **Repository** | **Apex Whale** | Size = codebase size. Dialect/Song = primary language. |
| **Commit History** | **Giant Kelp Tower** | Height = total commits. Frond density = contributor count. |
| **Builders (Contributors)** | **Trophic 4-5 Hunters** | Dolphins orbit tightly. Pod size = human contributors. |
| **Admirers (Stars/Watchers)** | **Passive Drifters** | Bioluminescent dinoflagellates and jellyfish in slow, outer orbits. |
| **Problems (Issues/PRs)** | **Mesopredators** | Barracudas and Mantis Shrimp in erratic, elliptical orbits. |
| **CI/CD Workflows** | **Kelp Caustics** | Pulsing green for success, red/dark for failure. |

</div>

---

## 🪐 Orbital Physics & Math

Creatures do not move randomly. The marine ecosystem is governed by a 3-scale nested Keplerian orbital system driven by repository metrics.

<details>
<summary><b>🔭 View Orbital Mechanics (Click to expand)</b></summary>

<br>

The repository (Whale) acts as the central gravitational mass, anchoring the planetary orbits of the surrounding marine life. The standard orbital velocity is calculated using:

$$v = \sqrt{G \frac{M}{r}}$$

* **Mass ($M$):** Dictated by the codebase size (KB). Larger codebases exert a stronger gravitational pull, forcing tighter, faster orbits.
* **Radius ($r$):** Dictated by the *Trophic Level* relationship. Builders (Trophic 4-5) maintain a tight inner orbit ($r$ is small). Admirers (Trophic 2) drift in a wide, slow outer orbit ($r$ is large).
* **Eccentricity:** Dictated by repository health. A healthy repo maintains near-circular orbits. High open-issue counts or failing CI/CD pipelines warp the orbits into chaotic, elliptical trajectories.

</details>

<details>
<summary><b>🗺️ View Geographic Chunking (Click to expand)</b></summary>

<br>

Git Ocean renders a global map using inverted real-world heightmaps (land becomes seafloor topography).
* **Level 1 (Capital Station):** Users cluster by nearest real-world capital (e.g., Delhi, SF, Berlin).
* **Level 2 (Language District):** Within a city, users cluster geographically by their primary language (Python Trench, JavaScript Current).
* **Level 3 (Metro System):** A functional magnetohydrodynamic tube network connects major open-source hubs across the global map.

</details>

---

## 🛠 Tech Stack

<div align="center">
  <img src="https://skillicons.dev/icons?i=react,threejs,ts,vite,tailwind,cloudflare,graphql" />
</div>

* **Frontend Engine:** React 18, Three.js, React Three Fiber (R3F), WebGL / GLSL Shaders.
* **Data Pipeline:** GitHub GraphQL API (for batching REST endpoints), tiered OAuth fetching (L1/L2/L3 permissions).
* **Backend & Edge:** Cloudflare Workers (Edge compute), Cloudflare D1 (Database for voting/world state), Durable Objects (WebSocket multiplayer presence).
* **Performance:** Instanced mesh rendering, Frustum culling, Web Workers for off-thread orbital Keplerian math.

---

## 🚀 Installation & Execution

To run Git Ocean locally, you need the Antigravity CLI and a registered GitHub OAuth App.

### 1. Environment Setup

Clone the repository and set up your Edge environment variables:

```bash
git clone [https://github.com/AnubhavAnand/git-ocean.git](https://github.com/AnubhavAnand/git-ocean.git)
cd git-ocean
npm install
