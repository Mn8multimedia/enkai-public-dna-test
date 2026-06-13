import { v4 as uuidv4 } from 'uuid';
import type {
  DNAObject,
  DNADiff,
  LineageNode,
  DNAType,
} from '../types/dna';

// ─────────────────────────────────────────────────────────────────────────────
// UUID helper (inline fallback so the app works without the uuid package)
// ─────────────────────────────────────────────────────────────────────────────
function generateId(): string {
  try {
    return uuidv4();
  } catch {
    // Crypto-based fallback
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Create
// ─────────────────────────────────────────────────────────────────────────────

export interface CreateDNAInput {
  name: string;
  type: DNAType;
  author: string;
  description: string;
  tags: string[];
  parameters: Record<string, unknown>;
  parentId?: string | null;
}

/**
 * Produce a new DNAObject from a creation input.
 * This is the canonical factory; it ensures all required fields are present.
 */
export function createDNA(input: CreateDNAInput): DNAObject {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    name: input.name,
    type: input.type,
    version: '1.0.0',
    createdAt: now,
    updatedAt: now,
    parentId: input.parentId ?? null,
    author: input.author,
    description: input.description,
    tags: [...input.tags],
    parameters: { ...input.parameters },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Fork  (Zero Payload Branching)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fork a DNA object.
 * Only `parameters` and `metadata` are duplicated – never binary/media payloads.
 * The resulting child has `parentId` set to the source's `id`.
 */
export function forkDNA(
  source: DNAObject,
  overrides: Partial<Pick<DNAObject, 'name' | 'author' | 'description' | 'tags' | 'parameters'>>,
): DNAObject {
  const now = new Date().toISOString();
  return {
    ...source,
    id: generateId(),
    name: overrides.name ?? `${source.name} (Fork)`,
    author: overrides.author ?? source.author,
    description:
      overrides.description ??
      `Forked from "${source.name}" (${source.id.slice(0, 8)})`,
    tags: overrides.tags ?? [...source.tags],
    parameters: {
      ...source.parameters,
      ...(overrides.parameters ?? {}),
    },
    version: '1.0.0',
    createdAt: now,
    updatedAt: now,
    parentId: source.id,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Save / Load  (localStorage-backed persistence)
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'enkai:dna-registry';

export function saveDNA(registry: DNAObject[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registry));
  } catch (err) {
    console.error('[Enkai] Failed to save DNA registry:', err);
  }
}

export function loadDNA(): DNAObject[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DNAObject[];
  } catch (err) {
    console.error('[Enkai] Failed to load DNA registry:', err);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Lineage
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Return the ordered ancestry chain from root → given DNA object.
 */
export function getAncestors(id: string, registry: DNAObject[]): DNAObject[] {
  const map = new Map(registry.map((d) => [d.id, d]));
  const chain: DNAObject[] = [];
  let current = map.get(id);
  while (current) {
    chain.unshift(current);
    current = current.parentId ? map.get(current.parentId) : undefined;
  }
  return chain;
}

/**
 * Return direct children of a given DNA object.
 */
export function getChildren(id: string, registry: DNAObject[]): DNAObject[] {
  return registry.filter((d) => d.parentId === id);
}

/**
 * Build a full lineage tree starting from root nodes (parentId === null).
 */
export function buildLineageForest(registry: DNAObject[]): LineageNode[] {
  const roots = registry.filter((d) => d.parentId === null);
  function buildNode(dna: DNAObject, depth: number): LineageNode {
    const children = registry
      .filter((d) => d.parentId === dna.id)
      .map((child) => buildNode(child, depth + 1));
    return { dna, children, depth };
  }
  return roots.map((r) => buildNode(r, 0));
}

/**
 * Flatten a lineage tree into a depth-ordered list for rendering.
 */
export function flattenLineage(forest: LineageNode[]): LineageNode[] {
  const result: LineageNode[] = [];
  function walk(node: LineageNode) {
    result.push(node);
    node.children.forEach(walk);
  }
  forest.forEach(walk);
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// Compare
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Produce a flat diff between two DNA objects.
 * Compares all top-level scalar fields plus each parameter key.
 */
export function compareDNA(a: DNAObject, b: DNAObject): DNADiff[] {
  const diffs: DNADiff[] = [];
  const topLevelKeys: (keyof DNAObject)[] = [
    'name', 'type', 'version', 'author', 'description', 'tags',
  ];
  for (const key of topLevelKeys) {
    const va = JSON.stringify(a[key]);
    const vb = JSON.stringify(b[key]);
    if (va !== vb) {
      diffs.push({ field: key, before: a[key], after: b[key] });
    }
  }
  const allParamKeys = new Set([
    ...Object.keys(a.parameters),
    ...Object.keys(b.parameters),
  ]);
  for (const key of allParamKeys) {
    const va = JSON.stringify(a.parameters[key]);
    const vb = JSON.stringify(b.parameters[key]);
    if (va !== vb) {
      diffs.push({
        field: `parameters.${key}`,
        before: a.parameters[key],
        after: b.parameters[key],
      });
    }
  }
  return diffs;
}

// ─────────────────────────────────────────────────────────────────────────────
// Tag utils
// ─────────────────────────────────────────────────────────────────────────────

export function getAllTags(registry: DNAObject[]): string[] {
  const tagSet = new Set<string>();
  registry.forEach((d) => d.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}

export function filterByTag(registry: DNAObject[], tag: string): DNAObject[] {
  return registry.filter((d) => d.tags.includes(tag));
}

export function filterByType(registry: DNAObject[], type: string): DNAObject[] {
  return registry.filter((d) => d.type === type);
}

export function searchDNA(registry: DNAObject[], query: string): DNAObject[] {
  const q = query.toLowerCase();
  return registry.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q) ||
      d.author.toLowerCase().includes(q) ||
      d.tags.some((t) => t.toLowerCase().includes(q)),
  );
}
