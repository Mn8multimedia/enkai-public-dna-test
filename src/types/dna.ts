// ─────────────────────────────────────────────────────────────────────────────
// Enkai DNA Schema – Core Type Definitions
// ─────────────────────────────────────────────────────────────────────────────

/** All first-class DNA container types in the Enkai registry. */
export type DNAType =
  | 'FractalDNA'
  | 'FluidDNA'
  | 'MissionDNA'
  | 'EventDNA'
  | 'SceneDNA'
  | 'MorphDNA'
  | 'HistoryDNA';

/** Semantic version string, e.g. "1.0.0" */
export type SemVer = string;

/**
 * The canonical DNA container.
 * Every DNA object in the Enkai framework must conform to this interface.
 * Parameters are intentionally `Record<string, unknown>` so that each
 * DNA type can extend the base contract without re-declaring common fields.
 */
export interface DNAObject {
  /** Globally unique identifier (UUID v4). */
  id: string;
  /** Human-readable name. */
  name: string;
  /** Discriminated type tag. */
  type: DNAType;
  /** ISO-8601 creation timestamp. */
  createdAt: string;
  /** ISO-8601 last-update timestamp. */
  updatedAt: string;
  /** `null` for root objects; the `id` of the parent when forked. */
  parentId: string | null;
  /** Searchable classification tags. */
  tags: string[];
  /** Creator identity string. */
  author: string;
  /** Human-readable description of this container. */
  description: string;
  /** Semantic version of this container. */
  version: SemVer;
  /**
   * The payload of this DNA – only lightweight scalar/structural data.
   * No binary, no media, no large assets (Zero Payload Branching principle).
   */
  parameters: Record<string, unknown>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Typed parameter interfaces for each first-class DNA type
// ─────────────────────────────────────────────────────────────────────────────

export interface FractalDNAParameters extends Record<string, unknown> {
  algorithm: string;
  maxIterations: number;
  zoom: number;
  centerX: number;
  centerY: number;
  colorPalette: string;
  escapeRadius: number;
  juliaConstantReal?: number;
  juliaConstantImag?: number;
}

export interface FluidDNAParameters extends Record<string, unknown> {
  viscosity: number;
  density: number;
  turbulence: number;
  flowRate: number;
  temperature: number;
  colorGradient: string;
  particleCount: number;
  boundaryCondition: 'open' | 'closed' | 'periodic';
}

export interface MissionDNAParameters extends Record<string, unknown> {
  theater: string;
  era: string;
  objectives: string[];
  aircraftTypes: string[];
  altitudeRangeMin: number;
  altitudeRangeMax: number;
  weatherCondition: string;
  threatLevel: 'low' | 'medium' | 'high' | 'extreme';
  duration: number;
}

export interface EventDNAParameters extends Record<string, unknown> {
  location: string;
  coordinates: { lat: number; lng: number };
  startDate: string;
  endDate: string;
  participants: string[];
  mediaType: string;
  xrFormat: string;
  reconstructionAccuracy: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Typed DNA variants (discriminated unions for exhaustive type-checking)
// ─────────────────────────────────────────────────────────────────────────────

export interface FractalDNA extends DNAObject {
  type: 'FractalDNA';
  parameters: FractalDNAParameters;
}

export interface FluidDNA extends DNAObject {
  type: 'FluidDNA';
  parameters: FluidDNAParameters;
}

export interface MissionDNA extends DNAObject {
  type: 'MissionDNA';
  parameters: MissionDNAParameters;
}

export interface EventDNA extends DNAObject {
  type: 'EventDNA';
  parameters: EventDNAParameters;
}

export type TypedDNA = FractalDNA | FluidDNA | MissionDNA | EventDNA | DNAObject;

// ─────────────────────────────────────────────────────────────────────────────
// Registry & lineage helpers
// ─────────────────────────────────────────────────────────────────────────────

/** A node in a rendered lineage tree. */
export interface LineageNode {
  dna: DNAObject;
  children: LineageNode[];
  depth: number;
}

/** Summary diff entry produced by compareDNA(). */
export interface DNADiff {
  field: string;
  before: unknown;
  after: unknown;
}

/** An operation recorded in a DNA's history. */
export type DNAOperation = 'create' | 'fork' | 'update' | 'tag';

export interface DNAHistoryEntry {
  operation: DNAOperation;
  timestamp: string;
  actor: string;
  note: string;
}
