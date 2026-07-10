# Xai — Intelligence Workspace

An interactive product experience for **Xai**, visually explaining how it turns raw data into structured insight and automated action. Built for the RacoAI frontend challenge.

**Narrative:** raw data → structured intelligence → actionable insight → AI automation — told through a particle system that literally reorganizes itself as you scroll.

---

## 1. Product Overview

Single-page product experience with five sections:

1. **Hero** — a chaotic particle cloud that resolves into a structured sphere as you scroll, framing "raw data becoming intelligence" as a felt experience, not a claim.
2. **Intelligence Flow** — a pinned, scroll-scrubbed GSAP timeline where a second particle system moves through four visual states (scattered → grid → network → action) in sync with three stage cards (Ingest, Analyze, Generate Insight).
3. **Dashboard Preview** — a realistic SaaS dashboard mock (sidebar, KPIs, charts, activity table/feed) — what using Xai daily actually looks like.
4. **Automation Workflow** — the pipeline (Data Input → AI Processing → Decision Engine → Automation) with a scroll-drawn connector line, plus two real example automations.
5. **Intelligence Core** — the closing "signature" interaction: a neural sphere that expands on hover and lights up its connections on click.

## 2. Technical Approach

- **Next.js 14 App Router**, single route (`src/app/page.tsx`) — this is one continuous product narrative, not a multi-page site, so extra routes would add navigation cost without adding clarity.
- **Boldness is spent in one place.** Per the brief's own emphasis on restraint: the two particle systems and the neural sphere are where the visual risk lives. The dashboard, cards, and nav are deliberately calm glassmorphism — quiet neighbors to the signature moments, not competing with them.
- **Three animation systems, each doing the job it's best at:**
  - **Three.js / React Three Fiber** — both particle systems and the neural sphere. Custom GLSL shaders (not `three`'s built-in materials) draw the soft, additive-blended glow per point.
  - **GSAP + ScrollTrigger** — the one place a true scroll-scrubbed, pinned timeline is needed (Intelligence Flow). `gsap.context()` scopes every animation for clean teardown on unmount.
  - **Framer Motion** — everything else: page/text entrances, `whileInView` reveals, layout animations (the sidebar's active-item indicator), and the SVG `pathLength` draw-on in Automation Workflow. Reaching for GSAP there too would be redundant machinery for what Framer already does natively.
- **Reduced motion is threaded everywhere**, not bolted on: `useReducedMotion()` gates the sphere's rotation/interpolation, GSAP's ScrollTrigger creation, and the boot sequence — each falls back to its resolved *static* state (not "no visual," an actually-finished-looking version).
- **Performance:** heavy 3D components are `dynamic(..., { ssr: false })` so they never touch the server bundle or block first paint of the text above them; every 3D component is wrapped in an `ErrorBoundary` so a WebGL failure degrades to a text fallback instead of a blank page; particle geometry/sizes are `useMemo`'d once, not recreated per frame.

### A note on scope decisions

The brief's type list mentioned `Order`/`Product`/`Payment` — those don't apply to an AI workspace, so `src/types/index.ts` swaps them for `DataSource`/`Automation`/`WorkflowStep`, which the app actually uses. Every exported type is imported somewhere; nothing is declared as unused scaffolding.

## 3. Tech Stack

Next.js 14 · TypeScript · Tailwind CSS · Framer Motion · GSAP + ScrollTrigger · Three.js via React Three Fiber + drei · Recharts · lucide-react

## 4. Folder Structure

```
src/
├── app/
│   ├── layout.tsx        # fonts, metadata, global ErrorBoundary, skip link
│   └── page.tsx          # boot sequence + section composition
├── components/
│   ├── Hero/              (Hero.tsx, IntelligenceSphere.tsx)
│   ├── Flow/               (IntelligenceFlow.tsx, ParticleCanvas.tsx, FlowCard.tsx)
│   ├── Dashboard/         (Dashboard, Sidebar, Header, KpiCards, Charts, ActivityTable, ActivityFeed)
│   ├── Automation/        (AutomationWorkflow.tsx)
│   ├── IntelligenceCore/  (IntelligenceCoreSection.tsx, NeuralSphere.tsx)
│   ├── Navbar.tsx, Footer.tsx, LoadingScreen.tsx, ErrorBoundary.tsx
├── hooks/    useReducedMotion, useMousePosition, useScrollProgress
├── data/     mockData.ts — every KPI/table/automation value, typed
├── types/    index.ts
└── lib/      utils.ts (cn helper)
```

## 5. Animation & Interaction Decisions

- **Hero sphere:** particles start as a random volumetric cloud (raw data) and lerp frame-by-frame toward a Fibonacci-lattice sphere surface (structured data) as `useScrollProgress` advances — an even, "designed" point distribution reads as *structured* in a way a plain grid-in-3D-space wouldn't.
- **Flow particles:** four hand-authored layouts (scatter → grid → clustered "network" → five action slots) blended across three scroll segments, so each transition is legible on its own rather than one long blur toward the end state.
- **Neural sphere:** hover both speeds the idle rotation and eases node scale up (`uScale` shader uniform) — a felt "waking up," not just a color change. Click toggles connection-line opacity via lerp, so it glows in rather than snapping.
- **Recharts note:** the "Data Processing" bar chart deliberately uses the *default* (horizontal-category) layout rather than `layout="vertical"`, since mixing a vertical `BarChart` with certain other chart types in the same tree is a known Recharts 2.x issue that generates colliding internal SVG keys — sidestepped at the design stage rather than patched after the fact.

## 6. Accessibility

- Skip-to-content link, semantic `<header>`/`<nav>`/`<table>`, `aria-current` on the active sidebar item, `aria-label` on icon-only buttons and both 3D canvases (`role="img"`).
- Every animated component checks `useReducedMotion()` and renders its finished/static state rather than nothing.
- Keyboard: workspace switcher and automation step cards are fully focusable/operable (`tabIndex`, `onFocus`/`onBlur` mirroring hover), with visible focus rings (`focus-visible:ring-2`).
- Global `prefers-reduced-motion` CSS fallback in `globals.css` catches any pure-CSS transition the JS-level hook doesn't reach.

## 7. Local Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build   # production build
npm run lint    # ESLint
```

## 8. Deployment (Vercel or Netlify — both free)

**Vercel (recommended for Next.js):**
1. Push this repo to GitHub.
2. vercel.com → New Project → import the repo → framework preset auto-detects Next.js → Deploy.
3. No environment variables needed — everything is static/mock data.

**Netlify:**
1. netlify.com → Add new site → import from GitHub.
2. Build command: `npm run build`; publish directory: `.next` (Netlify's Next.js runtime plugin handles the rest automatically once detected).

Both platforms' build servers have full internet access, so `next/font/google` (Inter, JetBrains Mono) fetches and self-hosts correctly at build time — this only needs manual attention in network-restricted environments.

## 9. Testing Performed

- `npm run build` — clean production build, zero TypeScript errors, all routes static-rendered.
- `npm run lint` — zero ESLint warnings.
- Full 5-phase incremental build verification (each phase validated independently before the next was added).
- Manual review of all R3F/shader code against React Three Fiber's type definitions (TypeScript's structural checking against `@react-three/fiber`'s JSX intrinsics catches most real API misuse — invalid `attach` targets, wrong constructor `args` shapes, etc.).

**Not verified (sandbox network limitations, not code issues):** actual WebGL rendering in a browser and `next/font/google`'s build-time fetch both require outbound network access this build environment doesn't have. Both are standard, well-supported operations that will work normally on Vercel/Netlify — worth a quick visual smoke-test after your first deploy, as with any project.

## 10. What I'd Improve With More Time

- Record the short Loom/YouTube walkthrough the challenge asks for (not something I can produce here)
- Push to a public GitHub repo and complete the actual Vercel/Netlify deploy (needs your accounts)
- A companion Figma file with the component/variant system the design deliverable asks for
- Real nearest-neighbor connection logic for the neural sphere (currently index-based, which looks right but isn't spatially computed)
- `prefers-contrast` support alongside `prefers-reduced-motion`

## 11. Fix Pass — Making Every Button Real

A second pass fixed the gap between "looks like a product" and "is a product": navbar links now scroll-spy and smooth-scroll to real sections (`#product`, `#how-it-works`, `#workspace`, `#automations`); Hero's two CTAs open real modals (trial signup with success state, 3-step demo walkthrough); the dashboard sidebar now actually switches between **7 fully-built tabs** (Overview, Data Sources, AI Models, Insights, Automations, Reports, Settings), each backed by `src/lib/mockApi.ts` — async functions with simulated latency and in-memory mutation, so Run/Pause/Connect/Save actions genuinely persist for the session. A `ToastProvider` and `Modal`/`Drawer`/`Skeleton`/`Switch` primitives in `components/UI/` back every interaction. See the chat response for the full before/after breakdown.

## 12. If You're Testing an Update and Something Looks Old

If you replace this folder with a newer zip while an old copy exists (or a dev server / browser tab is still open from before), you can end up looking at stale content — Next.js caches aggressively in `.next`, and browsers cache JS bundles by default. If a fix doesn't seem to have landed:

```bash
# from a completely fresh extraction of the new zip:
rm -rf node_modules .next
npm install
npm run dev
```
Then hard-refresh the browser tab (Ctrl+Shift+R / Cmd+Shift+R) or open it in a fresh incognito window. This guarantees you're seeing the current code, not a cached build.
#   X a i - I n t e l l i g e n c e - W o r k s p a c e  
 