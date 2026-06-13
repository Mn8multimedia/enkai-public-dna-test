# Enkai SDK Integration Notes

## Purpose
This file documents the integration surface for future Enkai SDK consumers.
It is served as a static asset from the running application.

---

## Roadmap: From Prototype to SDK

### Phase 1 — Core Library (`@enkai/core`)
**Status:** Reference implementation complete (this repo)

```typescript
// Target API surface
import { createDNA, forkDNA, compareDNA, buildLineageForest } from '@enkai/core';
import type { DNAObject, DNAType, LineageNode } from '@enkai/core';
```

Planned additions:
- Zod-based runtime schema validation
- Storage provider interface (localStorage / IndexedDB / REST)
- Event emitter for registry mutations
- Signed provenance (SHA-256 content hash on creation)

---

### Phase 2 — Synapse Asset Registry
A cloud-native registry that:
- Stores DNA containers with full version history
- Enforces immutability (containers are append-only)
- Issues signed provenance certificates
- Exposes a GraphQL API: `query { dna(id: "...") { ... } }`

---

### Phase 3 — Enkai SDK Reference Viewer
```tsx
// Embeddable UI widget
import { DNALibrary } from '@enkai/ui';

function MyApp() {
  return (
    <DNALibrary
      registry={myDNAContainers}
      onFork={(source, fork) => syncToServer(fork)}
      theme="dark"
    />
  );
}
```

---

## DNA Container Versioning Strategy

DNA containers use **semantic versioning** (major.minor.patch):
- `patch` — parameter tuning only
- `minor` — new parameters added (backward compatible)
- `major` — schema change or type migration

Forks always start at `1.0.0` (they are new root versions of their own lineage).

---

## Zero Payload Branching

The core invariant of the Enkai framework:
> A fork operation MUST NOT copy, reference, or embed binary/media payloads.

This ensures:
- Forks are instantaneous (O(1) parameter copy)
- Lineage graphs scale without storage penalties
- DNA containers are transmissible as pure JSON

---

## Interoperability

DNA containers are designed to be:
- **JSON-serialisable** — no cyclic references, no functions
- **Schema-versioned** — `version` field enables migration
- **Self-describing** — `type` field allows discriminated union parsing
- **Provenance-complete** — `parentId` enables full ancestry reconstruction

---

*Enkai Framework SDK Notes — v0.1.0*
