# Enkai DNA — Public Reference Implementation

> *"State, worlds, simulations, and creative assets can be represented as lightweight DNA containers that can be versioned, shared, forked, restored, and rendered."*

This repository is the **first public reference implementation** of the Enkai Framework's core DNA concept. It is not a game, not a website clone — it is a proof-of-concept for **DNA-based asset versioning**.

---

## What is a DNA Container?

A **DNA container** is a lightweight, JSON-serialisable object that encodes the *identity*, *provenance*, *lineage*, and *parameters* of a creative or simulation asset — without embedding binary or media payloads.

Think:
- **GitHub** for creative state
- **Git** for worlds
- **Version control** for realities

---

## Core Concepts

### Zero Payload Branching
Forking a DNA object duplicates **only parameters and metadata**. No large assets, no media files, no binary storage. The fork is instantaneous and self-contained.

### Lineage Tracking
Every DNA object carries a `parentId`. The framework reconstructs the full ancestry chain from any object back to its root, producing a Git-style commit graph.

### DNA Types
| Type | Symbol | Description |
|------|--------|-------------|
| `FractalDNA` | ◈ | Mathematical fractal parameter sets |
| `FluidDNA` | ≋ | Fluid simulation configurations |
| `MissionDNA` | ✦ | XR/sim mission scenarios |
| `EventDNA` | ◎ | Historical event reconstructions |
| `SceneDNA` | ⬡ | Scene/world state snapshots |
| `MorphDNA` | ⌬ | Morphogenetic pattern configs |
| `HistoryDNA` | ⧖ | Historical record containers |

---

## DNA Object Schema

Every DNA container must conform to:

```typescript
interface DNAObject {
  id: string;           // UUID v4
  name: string;
  type: DNAType;
  version: string;      // Semantic version, e.g. "1.0.0"
  createdAt: string;    // ISO-8601
  updatedAt: string;    // ISO-8601
  parentId: string | null;  // null = root container
  author: string;
  description: string;
  tags: string[];
  parameters: Record<string, unknown>;  // Type-specific payload
}
```

---

## Example DNA Datasets

### Mandelbrot FractalDNA Lineage
```
◈ Mandelbrot Classic               [ROOT]
├─ ◈ Mandelbrot Deep Zoom – Seahorse Valley
└─ ◈ Julia Set – Douady Rabbit
    └─ ◈ Julia Set – Siegel Disk
```

### Morphogen FluidDNA Lineage
```
≋ Morphogen BaseFlow               [ROOT]
├─ ≋ Morphogen Turbulent Storm
└─ ≋ Morphogen Cryogenic Laminar
```

### Warbirds MissionDNA Lineage
```
✦ Warbirds – Operation Cobalt Dawn [ROOT]
├─ ✦ Warbirds – Cobalt Dawn Night Variant
└─ ✦ Warbirds – MiG Alley Intercept
```

### HistoryXR EventDNA Lineage
```
◎ HistoryXR – Moon Landing 1969   [ROOT]
├─ ◎ HistoryXR – Gemini 4 EVA 1965
└─ ◎ HistoryXR – March on Washington 1963
```

---

## Core Operations

```typescript
// Create a new DNA container
createDNA(input: CreateDNAInput): DNAObject

// Fork (Zero Payload Branching)
forkDNA(source: DNAObject, overrides: Partial<DNAObject>): DNAObject

// Persist to browser storage
saveDNA(registry: DNAObject[]): void
loadDNA(): DNAObject[] | null

// Lineage
getAncestors(id: string, registry: DNAObject[]): DNAObject[]
getChildren(id: string, registry: DNAObject[]): DNAObject[]
buildLineageForest(registry: DNAObject[]): LineageNode[]

// Compare
compareDNA(a: DNAObject, b: DNAObject): DNADiff[]
```

---

## Architecture

```
src/
├── types/
│   └── dna.ts              # Core schema & typed parameter interfaces
├── data/
│   └── dnaRegistry.ts      # Example DNA datasets (13 containers)
├── lib/
│   ├── dnaOps.ts           # Create, fork, save, load, lineage, compare
│   └── uiHelpers.ts        # Type colours, icons, formatters
└── components/
    ├── DNALibrary.tsx       # Main shell: search, filter, grid
    ├── AssetCard.tsx        # Individual DNA container card
    ├── MetadataViewer.tsx   # Detail panel: overview, parameters, lineage
    ├── LineageGraph.tsx     # Git-style lineage tree
    ├── ForkHistory.tsx      # Ancestry + fork timeline
    ├── VersionTimeline.tsx  # Chronological event timeline
    ├── DNAComparison.tsx    # Side-by-side diff viewer
    └── Modals.tsx           # Fork and Create modals
```

---

## Getting Started

```bash
npm install
npm run dev      # Development server
npm run build    # Production build
npm run lint     # ESLint
```

---

## Future SDK Integration Notes

This reference implementation is designed to evolve into:

### Enkai Library (`@enkai/core`)
- Export `createDNA`, `forkDNA`, `compareDNA` as the core SDK
- Add schema validation with Zod
- Add storage adapters (localStorage → IndexedDB → cloud)

### Synapse Asset Registry
- Replace local state with a REST/GraphQL backend
- Add real-time collaboration via WebSockets
- DNA containers become server-authoritative with signed provenance

### Enkai SDK Reference Viewer
- Embed the UI as `<DNALibrary registry={...} />` in any React app
- Export as a standalone Web Component for framework-agnostic use
- Add a CLI tool: `enkai fork <id>`, `enkai diff <a> <b>`

### Extended DNA Types
Future first-class types planned:
- `AudioDNA` — music/sound synthesis parameter sets
- `AvatarDNA` — character/persona state
- `SimDNA` — physics simulation seeds
- `WorldDNA` — scene + entity composition graphs

---

## Design Language

- **High contrast** — no dark-on-dark failures
- **Large readable typography** — no tiny gray text
- **Colour-coded by type** — instant visual identification
- **Git-style lineage** — familiar provenance metaphor
- **GitHub-inspired palette** — enterprise-grade familiarity

---

*Enkai Framework — v0.1.0-alpha · Public Reference*
