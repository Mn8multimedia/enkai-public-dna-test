import type {
  DNAObject,
  FractalDNA,
  FluidDNA,
  MissionDNA,
  EventDNA,
} from '../types/dna';

// ─────────────────────────────────────────────────────────────────────────────
// Root DNA objects (parentId === null)
// ─────────────────────────────────────────────────────────────────────────────

const mandelbrotRoot: FractalDNA = {
  id: 'dna-fractal-001',
  name: 'Mandelbrot Classic',
  type: 'FractalDNA',
  version: '1.0.0',
  createdAt: '2024-01-15T09:00:00Z',
  updatedAt: '2024-01-15T09:00:00Z',
  parentId: null,
  author: 'Enkai Core Team',
  description:
    'Classic Mandelbrot set centered at the origin. The foundational fractal reference for all Enkai FractalDNA containers.',
  tags: ['fractal', 'mandelbrot', 'reference', 'mathematics', 'complex-plane'],
  parameters: {
    algorithm: 'mandelbrot',
    maxIterations: 256,
    zoom: 1.0,
    centerX: 0,
    centerY: 0,
    colorPalette: 'classic-blue',
    escapeRadius: 2.0,
  },
};

const mandelbrotDeepZoom: FractalDNA = {
  id: 'dna-fractal-002',
  name: 'Mandelbrot Deep Zoom – Seahorse Valley',
  type: 'FractalDNA',
  version: '1.0.0',
  createdAt: '2024-02-03T14:22:00Z',
  updatedAt: '2024-02-03T14:22:00Z',
  parentId: 'dna-fractal-001',
  author: 'Enkai Core Team',
  description:
    'Forked from Mandelbrot Classic. Zoomed into the Seahorse Valley region with increased iteration depth for higher detail.',
  tags: ['fractal', 'mandelbrot', 'seahorse-valley', 'deep-zoom'],
  parameters: {
    algorithm: 'mandelbrot',
    maxIterations: 1024,
    zoom: 450.0,
    centerX: -0.743643887037158,
    centerY: 0.131825904205330,
    colorPalette: 'ocean-twilight',
    escapeRadius: 2.0,
  },
};

const juliaFork: FractalDNA = {
  id: 'dna-fractal-003',
  name: 'Julia Set – Douady Rabbit',
  type: 'FractalDNA',
  version: '1.0.0',
  createdAt: '2024-03-10T11:05:00Z',
  updatedAt: '2024-03-10T11:05:00Z',
  parentId: 'dna-fractal-001',
  author: 'Dr. Sofia Reyes',
  description:
    'Forked from Mandelbrot Classic. Switched algorithm to Julia using the Douady rabbit constant for a trifoliate structure.',
  tags: ['fractal', 'julia', 'douady-rabbit', 'complex-dynamics'],
  parameters: {
    algorithm: 'julia',
    maxIterations: 512,
    zoom: 1.5,
    centerX: 0,
    centerY: 0,
    colorPalette: 'neon-forest',
    escapeRadius: 2.0,
    juliaConstantReal: -0.123,
    juliaConstantImag: 0.745,
  },
};

const juliaVariant: FractalDNA = {
  id: 'dna-fractal-004',
  name: 'Julia Set – Siegel Disk',
  type: 'FractalDNA',
  version: '1.1.0',
  createdAt: '2024-04-01T08:30:00Z',
  updatedAt: '2024-04-02T16:00:00Z',
  parentId: 'dna-fractal-003',
  author: 'Dr. Sofia Reyes',
  description:
    'Second-generation fork of Douady Rabbit. Uses Siegel disk constant; exhibits near-circular rotation symmetry.',
  tags: ['fractal', 'julia', 'siegel-disk', 'rotation-symmetry'],
  parameters: {
    algorithm: 'julia',
    maxIterations: 512,
    zoom: 1.5,
    centerX: 0,
    centerY: 0,
    colorPalette: 'solar-flare',
    escapeRadius: 2.0,
    juliaConstantReal: -0.391,
    juliaConstantImag: -0.587,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// FluidDNA lineage
// ─────────────────────────────────────────────────────────────────────────────

const morphogenRoot: FluidDNA = {
  id: 'dna-fluid-001',
  name: 'Morphogen BaseFlow',
  type: 'FluidDNA',
  version: '1.0.0',
  createdAt: '2024-01-20T10:00:00Z',
  updatedAt: '2024-01-20T10:00:00Z',
  parentId: null,
  author: 'Enkai Sim Lab',
  description:
    'Root morphogenetic fluid simulation. Models Turing reaction-diffusion patterns in a bounded domain.',
  tags: ['fluid', 'morphogen', 'turing', 'reaction-diffusion', 'simulation'],
  parameters: {
    viscosity: 0.1,
    density: 1.0,
    turbulence: 0.05,
    flowRate: 2.5,
    temperature: 293.15,
    colorGradient: 'viridis',
    particleCount: 10000,
    boundaryCondition: 'periodic',
  },
};

const turbulentFork: FluidDNA = {
  id: 'dna-fluid-002',
  name: 'Morphogen Turbulent Storm',
  type: 'FluidDNA',
  version: '1.0.0',
  createdAt: '2024-02-14T15:40:00Z',
  updatedAt: '2024-02-14T15:40:00Z',
  parentId: 'dna-fluid-001',
  author: 'Kenji Tanaka',
  description:
    'High-turbulence fork of BaseFlow. Raises turbulence coefficient and particle density to simulate storm-cell dynamics.',
  tags: ['fluid', 'morphogen', 'turbulence', 'storm', 'high-energy'],
  parameters: {
    viscosity: 0.02,
    density: 1.3,
    turbulence: 0.85,
    flowRate: 12.0,
    temperature: 310.0,
    colorGradient: 'plasma',
    particleCount: 50000,
    boundaryCondition: 'open',
  },
};

const cryogenicFork: FluidDNA = {
  id: 'dna-fluid-003',
  name: 'Morphogen Cryogenic Laminar',
  type: 'FluidDNA',
  version: '1.0.0',
  createdAt: '2024-03-05T09:15:00Z',
  updatedAt: '2024-03-05T09:15:00Z',
  parentId: 'dna-fluid-001',
  author: 'Enkai Sim Lab',
  description:
    'Cold-temperature fork of BaseFlow. Near-zero turbulence laminar flow for cryogenic research visualization.',
  tags: ['fluid', 'morphogen', 'cryogenic', 'laminar', 'low-temperature'],
  parameters: {
    viscosity: 0.8,
    density: 0.7,
    turbulence: 0.001,
    flowRate: 0.3,
    temperature: 77.0,
    colorGradient: 'cool-blues',
    particleCount: 5000,
    boundaryCondition: 'closed',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// MissionDNA lineage
// ─────────────────────────────────────────────────────────────────────────────

const warbirdsRoot: MissionDNA = {
  id: 'dna-mission-001',
  name: 'Warbirds – Operation Cobalt Dawn',
  type: 'MissionDNA',
  version: '1.0.0',
  createdAt: '2024-01-25T07:00:00Z',
  updatedAt: '2024-01-25T07:00:00Z',
  parentId: null,
  author: 'Enkai XR Studio',
  description:
    'Root mission DNA for a WWII Pacific theater bombing raid. Defines theater, aircraft roster, and operational parameters.',
  tags: ['warbirds', 'mission', 'wwii', 'pacific', 'bombing'],
  parameters: {
    theater: 'Pacific – Marianas',
    era: 'World War II – 1944',
    objectives: ['Destroy airfield', 'Neutralize AA batteries', 'Return to carrier'],
    aircraftTypes: ['B-29 Superfortress', 'P-38 Lightning', 'F6F Hellcat'],
    altitudeRangeMin: 20000,
    altitudeRangeMax: 32000,
    weatherCondition: 'partly-cloudy',
    threatLevel: 'high',
    duration: 480,
  },
};

const nightRaidFork: MissionDNA = {
  id: 'dna-mission-002',
  name: 'Warbirds – Cobalt Dawn Night Variant',
  type: 'MissionDNA',
  version: '1.0.0',
  createdAt: '2024-02-20T18:00:00Z',
  updatedAt: '2024-02-20T18:00:00Z',
  parentId: 'dna-mission-001',
  author: 'Enkai XR Studio',
  description:
    'Forked from Cobalt Dawn. Night-raid variant with lower altitude approach and different aircraft loadout.',
  tags: ['warbirds', 'mission', 'wwii', 'pacific', 'night-raid'],
  parameters: {
    theater: 'Pacific – Marianas',
    era: 'World War II – 1944',
    objectives: ['Suppress radar', 'Destroy fuel depot', 'Exfiltrate recon team'],
    aircraftTypes: ['B-29 Superfortress', 'PBY Catalina', 'F6F Hellcat'],
    altitudeRangeMin: 5000,
    altitudeRangeMax: 15000,
    weatherCondition: 'clear-night',
    threatLevel: 'extreme',
    duration: 600,
  },
};

const koreanEraFork: MissionDNA = {
  id: 'dna-mission-003',
  name: 'Warbirds – MiG Alley Intercept',
  type: 'MissionDNA',
  version: '1.0.0',
  createdAt: '2024-03-18T11:30:00Z',
  updatedAt: '2024-03-18T11:30:00Z',
  parentId: 'dna-mission-001',
  author: 'Marcus Osei',
  description:
    'Era-shifted fork from WWII to Korean War. Jet-era intercept mission over the Yalu River.',
  tags: ['warbirds', 'mission', 'korean-war', 'jet-age', 'intercept'],
  parameters: {
    theater: 'Korean Peninsula – Yalu River',
    era: 'Korean War – 1950',
    objectives: ['Intercept MiG formations', 'Escort B-29s', 'Maintain air superiority'],
    aircraftTypes: ['F-86 Sabre', 'B-29 Superfortress'],
    altitudeRangeMin: 25000,
    altitudeRangeMax: 40000,
    weatherCondition: 'overcast',
    threatLevel: 'extreme',
    duration: 120,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// EventDNA lineage
// ─────────────────────────────────────────────────────────────────────────────

const historyXRRoot: EventDNA = {
  id: 'dna-event-001',
  name: 'HistoryXR – Moon Landing 1969',
  type: 'EventDNA',
  version: '1.0.0',
  createdAt: '2024-01-30T12:00:00Z',
  updatedAt: '2024-01-30T12:00:00Z',
  parentId: null,
  author: 'HistoryXR Foundation',
  description:
    'Root EventDNA for the Apollo 11 lunar landing. Encodes location, participants, and XR reconstruction metadata.',
  tags: ['historyXR', 'apollo', 'moon-landing', 'space', '1969', 'reconstruction'],
  parameters: {
    location: 'Sea of Tranquility, Moon',
    coordinates: { lat: 0.674, lng: 23.473 },
    startDate: '1969-07-20T20:17:00Z',
    endDate: '1969-07-21T17:54:00Z',
    participants: ['Neil Armstrong', 'Buzz Aldrin', 'Michael Collins'],
    mediaType: 'volumetric-capture',
    xrFormat: 'EnkaiXR-v1',
    reconstructionAccuracy: 0.94,
  },
};

const geminiEraFork: EventDNA = {
  id: 'dna-event-002',
  name: 'HistoryXR – Gemini 4 EVA 1965',
  type: 'EventDNA',
  version: '1.0.0',
  createdAt: '2024-02-25T10:00:00Z',
  updatedAt: '2024-02-25T10:00:00Z',
  parentId: 'dna-event-001',
  author: 'HistoryXR Foundation',
  description:
    'Forked from Moon Landing. Earlier spaceflight era – first American spacewalk. Lower reconstruction accuracy due to limited archival footage.',
  tags: ['historyXR', 'gemini', 'EVA', 'spacewalk', '1965'],
  parameters: {
    location: 'Low Earth Orbit',
    coordinates: { lat: 0.0, lng: 0.0 },
    startDate: '1965-06-03T15:45:00Z',
    endDate: '1965-06-03T15:57:00Z',
    participants: ['Ed White', 'James McDivitt'],
    mediaType: 'photogrammetry',
    xrFormat: 'EnkaiXR-v1',
    reconstructionAccuracy: 0.71,
  },
};

const civilRightsFork: EventDNA = {
  id: 'dna-event-003',
  name: 'HistoryXR – March on Washington 1963',
  type: 'EventDNA',
  version: '1.0.0',
  createdAt: '2024-04-05T14:00:00Z',
  updatedAt: '2024-04-05T14:00:00Z',
  parentId: 'dna-event-001',
  author: 'Dr. Amara Diallo',
  description:
    'Domain-shifted fork from the Moon Landing root. Encodes the March on Washington and MLK I Have a Dream speech as an XR historical reconstruction.',
  tags: ['historyXR', 'civil-rights', 'washington', '1963', 'social-history'],
  parameters: {
    location: 'Lincoln Memorial, Washington D.C.',
    coordinates: { lat: 38.8893, lng: -77.0502 },
    startDate: '1963-08-28T10:00:00Z',
    endDate: '1963-08-28T17:00:00Z',
    participants: ['Martin Luther King Jr.', 'John Lewis', 'Philip Randolph'],
    mediaType: 'neural-upscale',
    xrFormat: 'EnkaiXR-v1',
    reconstructionAccuracy: 0.88,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Master registry export
// ─────────────────────────────────────────────────────────────────────────────

export const DNA_REGISTRY: DNAObject[] = [
  mandelbrotRoot,
  mandelbrotDeepZoom,
  juliaFork,
  juliaVariant,
  morphogenRoot,
  turbulentFork,
  cryogenicFork,
  warbirdsRoot,
  nightRaidFork,
  koreanEraFork,
  historyXRRoot,
  geminiEraFork,
  civilRightsFork,
];

export {
  mandelbrotRoot,
  mandelbrotDeepZoom,
  juliaFork,
  juliaVariant,
  morphogenRoot,
  turbulentFork,
  cryogenicFork,
  warbirdsRoot,
  nightRaidFork,
  koreanEraFork,
  historyXRRoot,
  geminiEraFork,
  civilRightsFork,
};
