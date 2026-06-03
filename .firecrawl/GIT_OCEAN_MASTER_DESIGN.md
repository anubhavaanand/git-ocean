**🌊 GIT OCEAN**

Master Design & Implementation Document

_Your GitHub Universe — Visualised as a Living Ocean World_

Version 1.0 \| Project: anubhavaanand/git-ocean

Stack: Three.js · Cloudflare Workers · D1 · Durable Objects · Hono · Drizzle

# **1\. Core Design Principle**

Every visual element in Git Ocean must be scientifically or technically explainable within the underwater world's own logic. Fantasy and sci-fi influences are allowed only if they follow real physics, biology, or engineering principles — just extrapolated or futuristic.

### **The "Explain It" Test**

Before any visual element is added, it must answer: "How would a marine biologist or underwater engineer explain this existing?" If the answer is satisfying — it's in. If it requires magic — redesign it until it's explainable.

### **Scientific Justifications — Already Locked**

| **Element** | **Scientific Justification** |
| --- | --- |
| Kelp towers | Giant kelp (Macrocystis pyrifera) grows to 60m toward light from seafloor — real species |
| Whale songs per language | Whale dialects are real, regional, culturally transmitted — documented in humpbacks |
| Bioluminescent glow on active repos | Deep sea bioluminescence — stress/activity-triggered light production, 90% of deep creatures |
| Keplerian orbital mechanics | Scaled to underwater fluid dynamics — gravitational analog via hydrodynamic drag |
| Sonar obelisk pulse rings | Low-frequency sonar pressure waves — visualised as expanding ring wavefronts |
| Metro tubes | Pressure vessel with magnetohydrodynamic propulsion — real experimental submarine tech |
| Chunk loading fog | Deep ocean light attenuation — real, light disappears beyond 200m (photic zone boundary) |
| Language colony terrain | Real seafloor geology: trenches, ridges, abyssal plains, continental shelves |
| Silicon wafer tower | Silicon dioxide (SiO2) extracted from real ocean sediment — deep sea mineral mining |

# **2\. World Architecture**

## **2.1 Five Zoom Levels**

| **Level** | **View** | **What Becomes Visible** |
| --- | --- | --- |
| 1 | World | Major station lights across ocean floor, obelisk beacons, metro tube network |
| 2 | Country | Capital station, city pockets, obelisk detail, language district outlines |
| 3 | City | Language districts, kelp tower density, individual towers |
| 4 | Tower | Individual repo kelp tower, whale orbiting, creature groups visible |
| 5 | Whale | Full repo data, all 71+ data points, creature detail, identity embedded in whale |

## **2.2 Geographic Clustering Hierarchy**

_→ Level 1 — Capital Cluster: Same country → same capital station zone_

_→ Level 2 — City Proximity: Within capital zone, users cluster by nearest city_

_→ Level 3 — Language District: Within same city pocket, sub-clusters by primary language_

_→ Unlocated users → deep ocean scatter → grouped into language colonies_

Language district order within city (center = most global users, edge = rarest):

_→ Center: JavaScript → Python → Java → TypeScript → C/C++ → Go → Rust → Niche (outer edge)_

## **2.3 Deep Ocean Language Colonies**

Unlocated GitHub users are scattered in deep ocean zones, clustered by primary language. Each colony has distinct seafloor terrain:

| **Colony Name** | **Terrain Type** | **Visual Character** |
| --- | --- | --- |
| The Python Trench | Wide deep trench | Broad, welcoming, extremely dense population |
| The JavaScript Current | Fast-moving mid-water current zone | Chaotic, fast-moving water shaders, massive |
| The Rust Ridge | Sharp dramatic rock formations | Precise, angular, sparse but intensely structured |
| The Go Shelf | Clean continental shelf | Minimal, efficient, flat organised terrain |
| The C++ Abyss | Deep ancient geological formation | Deep, ancient-looking, intimidating scale |
| The TypeScript Plateau | Elevated structured plateau | Organised, elevated, clearly bounded |
| The Ruby Cove | Warm shallow cove | Small, warm-lit, tight community feel |
| Others | Assigned by geological analog | Each language gets terrain matching its culture |

## **2.4 Community Obelisk — Silicon Wafer Tower (Default)**

Each capital cluster has a central landmark that represents the collective health of that entire developer community. It doubles as the metro station base.

Scientific justification: Silicon dioxide (SiO2) is literally extracted from ocean floor sediment in real deep sea mineral mining operations. The tower is what happens when you build upward from that source. Bottom = raw geological silicon ore. Top = refined crystalline wafer.

| **Dimension** | **Data Source** | **Visual Expression** |
| --- | --- | --- |
| Height | Total repositories in cluster | Taller = more repos, visible from across ocean |
| Width/Girth | Total contributions in cluster | Wider = more active community |
| Glow intensity | Contribution activity this month | Brighter = recently active |
| Sonar ring frequency | Commit frequency cluster-wide | More rings = more active right now |
| Surface texture density | Unique contributors count | More contributors = more complex surface |
| Color tint | Dominant language of cluster | Python=blue, JS=yellow, Rust=orange... |

### **Obelisk Skin Voting System**

_→ Voting epoch = 7 days_

_→ One vote per user per epoch_

_→ Leading skin = preview shimmer on current obelisk during epoch_

_→ Epoch end → animated transformation event visible to all online users_

_→ Previous winning skins permanently etched as relief carvings at obelisk base_

_→ Each skin must pass the scientific justification test_

_→ Each skin option shown with a one-line scientific explanation in voting UI_

_→ City-specific skin options — culturally and technically themed per location_

## **2.5 Metro System**

Pressure vessel tubes with magnetohydrodynamic (MHD) propulsion — real experimental submarine technology. Tubes connect all capital stations and extend express lines to deep ocean language colonies.

| **Feature** | **Phase** | **Description** |
| --- | --- | --- |
| Tube geometry | Phase 1 | Decorative glass-shader torus visible in world, physically plausible pressure vessel |
| Station = obelisk base | Phase 1 | Metro station entrance IS the obelisk base — unified structure |
| Functional travel | Phase 2 | Click station → camera tween along spline to destination |
| Live traveler orbs | Phase 2 | Other users traveling visible as glowing orbs inside tube |
| Express lines | Phase 2 | Geographic station ↔ station + deep ocean language colony lines |
| Traveler hover | Phase 2 | Hover orb → see GitHub handle + destination |

# **3\. GitHub Data — All 71 Endpoints by Level**

## **🟢 Level 1 — Public (No Auth Required) — 38 Points**

These power the world map, cluster formation, obelisk sizing, and all public ocean views. No OAuth needed — anyone can explore.

| **#** | **Data Point** | **API Endpoint** | **Used For** |
| --- | --- | --- | --- |
| 1 | Repo name | GET /repos/{o}/{r} | Whale name tag |
| 2 | Description | GET /repos/{o}/{r} | Whale tooltip |
| 3 | Primary language | GET /repos/{o}/{r} | Whale song dialect + skin |
| 4 | Language breakdown % | GET /repos/{o}/{r}/languages | Zooxanthellae skin pattern |
| 5 | Topics/tags | GET /repos/{o}/{r}/topics | Sea anemone clusters on whale |
| 6 | Topics count | GET /repos/{o}/{r}/topics | Anemone density |
| 7 | Stars count | GET /repos/{o}/{r} | Dinoflagellate swarm density |
| 8 | Forks count | GET /repos/{o}/{r} | Whale calf count |
| 9 | Watchers count | GET /repos/{o}/{r} | Moon jellyfish count |
| 10 | Open issues count | GET /repos/{o}/{r} | Barracuda school count |
| 11 | Repo size KB | GET /repos/{o}/{r} | Whale body size |
| 12 | Created at | GET /repos/{o}/{r} | Barnacle density + age rings |
| 13 | Updated at | GET /repos/{o}/{r} | Kelp tower sway frequency |
| 14 | Pushed at | GET /repos/{o}/{r} | Sailfish burst frequency |
| 15 | Default branch name | GET /repos/{o}/{r} | Whale dorsal fin marking |
| 16 | License type | GET /repos/{o}/{r} | Whale skin texture |
| 17 | Has wiki | GET /repos/{o}/{r} | Sponge on kelp trunk |
| 18 | Has pages | GET /repos/{o}/{r} | Sea Lion surfacing (breaks water) |
| 19 | Has discussions | GET /repos/{o}/{r} | Sea urchin cluster presence |
| 20 | Has projects | GET /repos/{o}/{r} | Coral polyp density on kelp |
| 21 | Has downloads | GET /repos/{o}/{r} | Lanternfish vertical migration |
| 22 | Has issues enabled | GET /repos/{o}/{r} | Barracuda zone activation |
| 23 | Is fork | GET /repos/{o}/{r} | Clownfish present in anemone |
| 24 | Fork source repo | GET /repos/{o}/{r} | Clownfish host anemone = source |
| 25 | Is archived | GET /repos/{o}/{r} | Sponge overgrowth on whale |
| 26 | Is disabled | GET /repos/{o}/{r} | Whale partially buried in sediment |
| 27 | Is template | GET /repos/{o}/{r} | Portuguese Man O War attached |
| 28 | Visibility | GET /repos/{o}/{r} | Bioluminescent patches on whale |
| 29 | Homepage URL | GET /repos/{o}/{r} | Barnacle ring on kelp trunk |
| 30 | Contributors list | GET /repos/{o}/{r}/contributors | Dolphin pod composition |
| 31 | Contributors count | GET /repos/{o}/{r}/contributors | Dolphin pod size |
| 32 | Release count | GET /repos/{o}/{r}/releases | Feather star count on kelp |
| 33 | Latest release version | GET /repos/{o}/{r}/releases/latest | Feather star crown marking |
| 34 | Pre-release vs stable | GET /repos/{o}/{r}/releases | Seahorse anchor vs float |
| 35 | Days since last release | GET /repos/{o}/{r}/releases/latest | Herring school density |
| 36 | Commit activity weekly | GET /repos/{o}/{r}/stats/commit\_activity | Dolphin orbit speed |
| 37 | Code freq additions/deletions | GET /repos/{o}/{r}/stats/code\_frequency | Krill density + color |
| 38 | Community health % | GET /repos/{o}/{r}/community/profile | Water clarity around whale |

## **🔵 Level 2 — Standard OAuth (public\_repo + Metadata scopes) — 22 Points**

Unlocked with one GitHub login click. Powers the richer personal ocean experience.

| **#** | **Data Point** | **API Endpoint** | **Used For** |
| --- | --- | --- | --- |
| 39 | Participation ratio | GET /repos/{o}/{r}/stats/participation | Herring school split ratio |
| 40 | Commit punch card | GET /repos/{o}/{r}/stats/punch\_card | Whale activity cycle rhythm |
| 41 | Top contributor dominance | GET /repos/{o}/{r}/contributors | Cuttlefish skin pattern |
| 42 | Bot vs human ratio | Derived from contributors list | Tuna school vs dolphin ratio |
| 43 | New contributors this month | GET /repos/{o}/{r}/contributors | Spinner dolphin count |
| 44 | Total branches count | GET /repos/{o}/{r}/branches | Grouper territorial count |
| 45 | Protected branches count | GET /repos/{o}/{r}/branches (protected filter) | Spine-marked grouper count |
| 46 | Deployments count | GET /repos/{o}/{r}/deployments | Swordfish strike events |
| 47 | Environments list | GET /repos/{o}/{r}/environments | Depth rings on kelp trunk |
| 48 | Open PRs count | GET /repos/{o}/{r}/pulls?state=open | Octopus arm count |
| 49 | Merged PRs count | GET /repos/{o}/{r}/pulls?state=closed | Leatherback turtle count |
| 50 | Avg PR/issue close time | Derived from issues+PRs timestamps | Nautilus shell spiral tightness |
| 51 | Open milestones count | GET /repos/{o}/{r}/milestones?state=open | Giant squid appearance freq |
| 52 | Closed milestones count | GET /repos/{o}/{r}/milestones?state=closed | Basking shark pass count |
| 53 | Labels count + types | GET /repos/{o}/{r}/labels | Feather star color variants |
| 54 | Discussions open count | GET /repos/{o}/{r}/discussions (GraphQL) | Sea urchin spiny cluster count |
| 55 | Discussions closed count | GET /repos/{o}/{r}/discussions (GraphQL) | Copepod settled layer density |
| 56 | Has contributing guide | GET /repos/{o}/{r}/community/profile | Cleaner wrasse station on kelp |
| 57 | Has code of conduct | GET /repos/{o}/{r}/community/profile | Sea anemone at tower base |
| 58 | Has issue template | GET /repos/{o}/{r}/contents/.github | Giant isopod cluster |
| 59 | Has PR template | GET /repos/{o}/{r}/contents/.github | Nudibranch on kelp |
| 60 | Dependents count | GraphQL dependency graph | Hammerhead school count |

## **🔴 Level 3 — Elevated OAuth (Owner Only, Never Public) — 11 Points**

Requires explicit elevated permissions. Personal data — always and only visible to the repo owner. Never shown for other users' oceans regardless of any setting.

| **#** | **Data Point** | **API Endpoint** | **Used For** |
| --- | --- | --- | --- |
| 61 | Traffic views count | GET /repos/{o}/{r}/traffic/views | Copepod haze density in water column |
| 62 | Traffic clones count | GET /repos/{o}/{r}/traffic/clones | Amphipod surge at kelp base |
| 63 | Referring sites | GET /repos/{o}/{r}/traffic/popular/referrers | Herring school approach direction |
| 64 | Dependabot alerts | GET /repos/{o}/{r}/dependabot/alerts | Moray eel emergence count |
| 65 | Secret scanning status | GET /repos/{o}/{r}/secret-scanning/alerts | Anglerfish lure at kelp base |
| 66 | Advanced security status | GET /repos/{o}/{r} (security\_and\_analysis) | Vampire squid defensive cloak |
| 67 | Secret scanning push protection | GET /repos/{o}/{r} (security\_and\_analysis) | Vampire squid arm tip glow |
| 68 | Security advisories open | GET /repos/{o}/{r}/security-advisories | Lionfish spine fan severity |
| 69 | Used-by count | GraphQL (owner context) | Hammerhead outer school layer |
| 70 | README quality/length | GET /repos/{o}/{r}/readme (Contents read) | Brain coral + basking shark size |
| 71 | CI/CD workflow status | GET /repos/{o}/{r}/actions/workflows | Tube worm glow + kelp color |

### **Data Ethics Framework**

_→ Public data + high abstraction = safe to show for anyone_

_→ Public data + low abstraction = owner only_

_→ Private data + any abstraction = owner only always_

_→ Security data = never public regardless of abstraction level_

_→ Abstraction is the safety mechanism — a krill swarm reveals nothing to an attacker_

### **GraphQL Preferred — One Query Replaces 8 REST Calls**

POST https://api.github.com/graphql — Fetch name, stars, forks, language, issues, PRs, releases, discussions, topics, dates, size, booleans in one shot.

_→ Rate limit: 5000 points/hour authenticated. Cache TTL: 1hr stats, 24hr static fields._

_→ Stats endpoints (commit\_activity, code\_frequency) return HTTP 202 on first call — retry after 1-2 seconds._

# **4\. The Repo Whale**

The repository itself. Center of the solar system. Everything orbits it. Trophic Level 5 — Apex. The whale does not orbit anything except the kelp tower (slow galactic drift).

| **Whale Species** | **Repo Type** | **Visual Character** | **When Assigned** |
| --- | --- | --- | --- |
| Blue Whale | Large active public repo | Largest, slow majestic drift, low frequency song | size > 50MB, stars > 100, active |
| Humpback Whale | Popular community repo | Complex song dialect, social, migratory pattern | contributors > 20, stars > 500 |
| Sperm Whale | Deep complex codebase | Deep diver, solitary, echolocating | size > 100MB, low star count, high complexity |
| Orca | Fast aggressive high-velocity repo | Pack-like behavior, highest intelligence marking | commits/week > 50, multiple active contributors |
| Whale Shark | Massive but barely active / archived | Giant, filter feeder, barely moves, gentle | size > 50MB, pushed\_at > 6 months ago |

Identity — embedded in whale skin (not orbiting):

| **Feature on Whale** | **Data Point** | **How It Looks** |
| --- | --- | --- |
| Zooxanthellae skin pattern | Language breakdown % | Skin color = language mix gradient, polyglot = multicolor |
| Barnacles on skin | Repo age | Density increases with age, old repos encrusted |
| Remora fish on belly | Dependencies count | One per major dependency, count = dep count |
| Sea anemone clusters | Topics/tags | One anemone per topic, color = tag category |
| Whale skin texture | License type | MIT=smooth, GPL=rough, Apache=scaled, unlicensed=scarred |
| Bioluminescent patches | Public vs private | Public=glowing patches, private=dark matte |
| Feather star / Crinoid growth | File count | Fan density on skin = file count |
| Sponge overgrowth | Archived status | Archived = beautiful sponge colony covers whale, still |
| Clownfish in anemone | Forked from source | Clownfish always inside the source anemone |
| Portuguese Man O War | Is template | Colonial organism attached — others clone its structure |
| Dorsal fin marking | Default branch name | Plain=main, aged=master, custom=unique pattern |
| Water clarity | Community health % | Crystal clear=high health, murky=low health |
| Disabled posture | Is disabled | Whale partially buried in seafloor sediment |
| Vampire Squid cloak | Advanced security enabled | Red cloak wraps whale defensively, bioluminescent arm tips |

# **5\. The Seven Orbital Groups**

Three nested orbital scales simultaneously: Creatures orbit whale (planetary), Whale orbits kelp tower (solar system), Kelp tower sways with current (galactic drift). All motion follows Keplerian physics principles.

## **Orbital Parameters — Keplerian Framework**

| **Parameter** | **Controls** | **Formula Basis** |
| --- | --- | --- |
| Orbital radius | Relationship intimacy — Builders close, Admirers far | Semi-major axis a — fixed per group |
| Orbital speed | Repo activity level — high commits = faster orbits | v = sqrt(GM/r) — activity as gravitational proxy |
| Orbital inclination | Group type — each group on different tilted plane | Inclination i — unique per group (0°-75°) |
| Eccentricity | Repo health — healthy=circular, problematic=elliptical | e = 0.0 (healthy) to 0.8 (critical problems) |
| Whale mass (G proxy) | Codebase size — bigger whale = stronger pull | M proportional to repo size in KB |

## **GROUP 1 — BUILDERS**

Trophic 4–5 \| Innermost orbit \| Fast circular \| Purposeful intelligent coordination

| **Creature** | **Trophic** | **Data Point** | **Visual Behavior** | **Level** |
| --- | --- | --- | --- | --- |
| Bottlenose Dolphin | 4–5 | Core human contributors | Pod size=contributor count, echolocation ping=CI/CD scan, unique whistle per contributor | L1 |
| Spinner Dolphin | 4–5 | New contributors this month | Acrobatic spinning entry into orbit, energetic, slightly outer than bottlenose pod | L2 |
| Sailfish | 4 | Commit streak | Fastest fish — burst streak appearance only, disappears immediately when streak breaks | L1 |
| Bluefin Tuna school | 4 | Bot contributors | Perfectly synchronized mechanical school, no individual personality, count=bot count | L2 |
| Cuttlefish | 4 | Top contributor dominance ratio | Skin pattern complexity=dominance distribution, single flat color=one dominant contributor | L2 |
| Krill swarm | 2→4 | Code freq additions/deletions | Swarm density=net additions, color shifts red when deletions dominate | L1 |
| Swordfish | 4 | Deployments count | Fast decisive single strike past whale per deployment event, resets and repeats | L2 |
| Herring school | 3 | Participation ratio owner vs community | School visibly splits into two sub-schools, size ratio=owner vs community split | L2 |

## **GROUP 2 — ADMIRERS**

Trophic 2–3 \| Outermost orbit \| Slowest \| Passive drifters \| Most visually ethereal

| **Creature** | **Trophic** | **Data Point** | **Visual Behavior** | **Level** |
| --- | --- | --- | --- | --- |
| Moon Jellyfish | 2 | Watchers | Passive pulse drift, translucent glow, wide outer orbit, count=watcher count | L1 |
| Lion's Mane Jellyfish | 2 | Sponsors | Larger golden amber tint, trailing tendril length=sponsorship tier | L1 |
| Bioluminescent Dinoflagellates | 1→2 | Stars | Swarm of blue sparks orbiting slowly, one spark=one star, density=star count | L1 |
| Sea Sparkle / Noctiluca | 1→2 | Trending status | Full bloom pulse glow when trending, dims completely when not, visible world-wide | L1 |
| Salps | 2 | Pinned status | Transparent colonial chain always at top of orbital plane when pinned | L1 |
| Copepods | 2 | Traffic views (owner only) | Most abundant barely-visible haze in water column, density=view count | L3 |

## **GROUP 3 — OFFSPRING**

Trophic 4–5 \| Trailing elliptical orbit \| Independent but connected \| Mid orbital plane

| **Creature** | **Trophic** | **Data Point** | **Visual Behavior** | **Level** |
| --- | --- | --- | --- | --- |
| Whale Calf | 5 | Forks | Smaller whale trailing in parent exact slipstream, inherits parent song dialect | L1 |
| Manta Ray | 4–5 | Dependents count | Wide wingspan long elliptical orbit, one per major dependent | L1 |
| Hammerhead school | 4 | Used-by count | Loose school circling at distance, electroreception sweep=dependency scan | L1 |
| Flying Fish | 3→4 | Mentions in other repos | Briefly breaks surface, glides, returns — each appearance=one mention event | L1 |
| Amphipod surge | 2 | Traffic clones (owner only) | Sudden density surge at kelp base on clone event, settles after | L3 |

## **GROUP 4 — PROBLEMS**

Trophic 3–4 \| Erratic elliptical \| Chaotic unpredictable \| Eccentricity increases with severity

| **Creature** | **Trophic** | **Data Point** | **Visual Behavior** | **Level** |
| --- | --- | --- | --- | --- |
| Barracuda | 4 | Open issues | Erratic figure-8 orbit, silver flash, sharp directional changes, count=open issues | L1 |
| Giant Pacific Octopus | 4 | Open PRs general | Multiple arms=multiple PRs, each arm color=PR age, tentacle speed=PR urgency | L2 |
| Lionfish | 3–4 | Security advisories open | Venomous spines fanned, red glow intensity=severity, slow threatening drift | L3 |
| Moray Eel | 3–4 | Dependabot alerts | Emerges from kelp tower crevices periodically, lurking retreat behavior | L3 |
| Mantis Shrimp | 3–4 | Critical open PRs | Hypercolor flash, fastest strike near whale surface, agitated circling | L2 |
| Arrow Worms | 3 | Bug-labeled issues | Transparent nearly invisible until close, voracious micro-swarm, count=bug count | L1 |
| Decorator Crab | 3 | Stalled/slow issues | Extremely slow dragging debris, camouflaged, easy to miss, size=issue age | L2 |
| Giant Squid | 4–5 | Open milestones | Rare deep appearance, only surfaces when milestone nears completion, retreats after | L2 |

## **GROUP 5 — RESOLUTIONS**

Trophic 2–3 \| Calm spiral outward then return \| Ancient wisdom \| Most peaceful group

| **Creature** | **Trophic** | **Data Point** | **Visual Behavior** | **Level** |
| --- | --- | --- | --- | --- |
| Leatherback Sea Turtle | 2–3 | Merged PRs | Deep slow drift outward after each merge, ancient satisfied movement | L2 |
| Green Sea Turtle | 2–3 | Closed issues | Peaceful grazing orbit, long-lived calm circular presence | L1 |
| Nautilus | 2–3 | Avg issue close time | Chambered shell ring count=time, tight spiral=fast close, loose=slow | L2 |
| Cleaner Wrasse | 3 | Test coverage | Swims along whale body surface, coverage %=how much of whale surface cleaned | L3 |
| Starfish | 2 | Resolved security advisories | Slow benthic crawl on seafloor below whale, regenerating posture=fixed vuln | L3 |
| Basking Shark | 4\* | Closed milestones | Passive open-mouth filter feeding pass=milestone absorbed, size=milestone significance | L2 |

_→ \*Basking Shark is trophic 4 but behaviorally passive — filter feeding, non-threatening. Justified placement in Resolutions._

## **GROUP 6 — IDENTITY (Embedded in Whale)**

Not orbiting. Physically part of the whale. Read by zooming into whale surface at zoom level 5.

See Section 4 — The Repo Whale identity table above for complete feature list.

## **GROUP 7 — LEGACY (The Kelp Tower)**

Structural/Sessile \| Benthic anchored \| Not orbiting \| The foundation everything orbits around

| **Feature** | **Data Point** | **Visual Expression** | **Level** |
| --- | --- | --- | --- |
| Kelp trunk height | Commit history length | Tower height = total commit history | L1 |
| Kelp frond density | Lifetime contributor count | Bushy canopy=many contributors, sparse=solo | L1 |
| Brain Coral at base | README quality | Surface pattern complexity=README richness | L1 |
| Black Smoker Tube Worms | CI/CD pipelines active | Hydrothermal base glow, active=glowing, inactive=dark | L2 |
| Sea Urchin clusters | Open Discussions count | Spiny scattered at base, count=open discussions | L2 |
| Feather Star on branches | Release count | One crinoid per major release | L1 |
| Amphipods at base | Download count | Density=download volume, surge on new release | L1 |
| Phytoplankton glow at canopy | Last release recency | Recent=bright green glow, fades with time since release | L1 |
| Age rings on trunk | Repo age | Like tree rings, visible when zoomed close | L1 |
| Sponge on trunk | Has Wiki | Present=wiki exists, absent=bare trunk | L1 |
| Barnacle ring on trunk | Has homepage | Distinct horizontal band=homepage exists | L1 |
| Parrotfish grazing trunk | Has changelog | Grazes and deposits calcium carbonate record=changelog | L1 |
| Seahorse anchored to kelp | Pre-release vs stable | Anchored tail=stable, free-floating near kelp=pre-release | L1 |
| Basking shark shadow | README length | Shadow size under tower=README volume | L1 |
| Copepod settled layer | Closed Discussions | Dense settled layer at seafloor, density=closed count | L2 |
| Herring school near tower | Referring sites | School appears from outside zone, direction=referrer source | L3 |
| Grouper territorial pairs | Total branches count | Each grouper claims a kelp branch | L2 |
| Spine-marked grouper | Protected branches | Same grouper with warning coloration=protected | L2 |
| Sea Lion surfacing | Has Pages | Only creature breaking the water surface=public website | L1 |
| Cleaner Wrasse station | Contributing guide exists | Visible cleaning station on trunk, invites others in | L2 |
| Sea Anemone at base | Code of conduct | Boundary anemone at base entrance, stings violators | L2 |
| Giant Isopod cluster | Has issue template | Deep sea scavengers that organize debris=structured template | L2 |
| Nudibranch on kelp | Has PR template | Colorful highly-specific patterns=structured PR template | L2 |
| Coral polyp density | Has projects | Dense polyp growth=active project boards | L2 |
| Lanternfish migration | Has downloads enabled | Diel vertical migration=downloads available toggle | L1 |
| Anglerfish lure at base | Security scanning active | Deep in kelp base, glowing lure=actively scanning | L3 |

# **6\. Ambient World Life**

Not tied to any data point. Exist to make the ocean feel inhabited and alive. Scientifically placed per zone.

| **Creature** | **Zone** | **Scientific Role** |
| --- | --- | --- |
| Pilot Fish | Swimming between whale and kelp | Follow large creatures — represents repo-to-tower connection |
| Comb Jellyfish (Ctenophore) | Open water everywhere | Bioluminescent rainbow cilia — pure visual beauty, no data |
| Viperfish | Deep language colonies only | Deep dark ambush predator — fits abyss aesthetic perfectly |
| Telescope Octopus | Mid-water open ocean | Transparent, huge eyes — represents undiscovered/unvisited repos |
| Giant Isopod (scavenger) | Seafloor between towers | Scavenging between repos, ancient slow deep sea crustacean |
| Whale Fall Ecosystem | Where archived repos once stood | Dead whale on seafloor becomes ecosystem — archived repo ghost |
| Firefly Squid | Near active clusters at night | Mass bioluminescent display near high-activity zones |

# **7\. Phase Plan**

|  | **Phase 1 — Personal Dashboard** | **Phase 2 — Full Multiplayer** |
| --- | --- | --- |
| Repos visible | Yours + following + followers only | Entire GitHub world |
| Real-time presence | No — static snapshots from API | Yes — live orbs, metro travelers |
| Metro system | Decorative/props only | Fully functional MHD travel |
| Geographic world | Your zone + nearby following | Full world map all zones |
| Infrastructure | GitHub API + Cloudflare Workers + D1 | WebSockets + Durable Objects + chunked world |
| OAuth requirement | Required for all users (no anonymous) | Same + elevated for Level 3 features |
| Phase 1 social | Followers/following populate your ocean | Full community presence |

# **8\. Files to Update in Codebase**

Sprints 0–3 are complete. The following files need updating to reflect this full design document.

| **File** | **What to Update** | **Priority** |
| --- | --- | --- |
| repo-mapping.ts | Replace placeholder creature mapping with all 71 data points → creature assignments from Section 5 | P0 |
| creature-factory.ts | Replace 10 placeholder creatures with all 85 creatures/features from Sections 4-6, add Keplerian orbital math | P0 |
| github-api.ts | Add Level 1/2/3 tiered fetching, GraphQL preferred query, progressive enhancement by level | P0 |
| geographic-clusters.ts | Implement 3-level clustering (capital→city→language district), deep ocean language colony zones | P0 |
| ocean-floor.ts | Add language colony terrain variations (Python Trench, JS Current, Rust Ridge etc.) | P1 |
| kelp-tower.ts | Update to encode all 26 legacy data points from Section 5 Group 7 | P1 |
| whale-entity.ts | Update to encode all 14 identity features from Section 5 Group 6 as embedded skin features | P1 |
| globe-helpers.ts | Update obelisk to silicon wafer tower default, implement 7-day epoch voting, city pocket sub-zones | P1 |
| obelisk-service.ts | Implement full voting epoch system, legacy skin etch history, city-specific skin options | P2 |
| ocean-composer.tsx | Add three-scale nested orbital motion (creature→whale→kelp), Keplerian physics parameters | P1 |

# **9\. Recommended GraphQL Query (Level 1 + 2)**

query RepoData($owner: String!, $name: String!) {
repository(owner: $owner, name: $name) {
name description stargazerCount forkCount
watchers { totalCount }
primaryLanguage { name }
languages(first: 10) { edges { node { name } size } }
issues(states: OPEN) { totalCount }
pullRequests(states: OPEN) { totalCount }
releases(first: 1) { totalCount nodes { isPrerelease tagName publishedAt } }
discussions { totalCount }
repositoryTopics(first: 20) { nodes { topic { name } } }
defaultBranchRef { name }
createdAt pushedAt updatedAt diskUsage
isArchived isDisabled isFork isTemplate hasWikiEnabled
hasProjectsEnabled hasDiscussionsEnabled
licenseInfo { name } homepageUrl visibility
milestones(states: OPEN) { totalCount }
labels(first: 100) { totalCount }
deployments { totalCount }
branchProtectionRules { totalCount }
}
}

# **10\. Current Blockers (from Sprint Plan)**

| **#** | **Blocker** | **Blocks** | **Resolution** |
| --- | --- | --- | --- |
| B1 | No account\_id in wrangler.jsonc | Sprint 4–10 | Cloudflare dashboard → Workers & Pages → copy account ID |
| B2 | GITHUB\_CLIENT\_ID/SECRET not set | Sprint 4 tests | GitHub OAuth App → generate credentials → .dev.vars |
| B3 | No Durable Objects binding | Sprint 7–9 | Add \[\[durable\_objects.bindings\]\] to wrangler + account\_id |
| B4 | No R2 bucket for production | Sprint 10 | wrangler r2 bucket create git-ocean-avatars |
| B5 | KTX2 compressor not installed | Sprint 5.3 | npm install -g @gltf-transform/cli |

**GIT OCEAN — Master Design Document**

_github.com/anubhavaanand/git-ocean \| Built with Three.js + Cloudflare Workers + D1_