import { useMemo } from 'react';
import DNALibrary from './components/DNALibrary';
import { DNA_REGISTRY } from './data/dnaRegistry';
import { loadDNA } from './lib/dnaOps';
import type { DNAObject } from './types/dna';

function App() {
  const initialRegistry = useMemo<DNAObject[]>(() => {
    const persisted = loadDNA();
    if (persisted && persisted.length > 0) return persisted;
    return DNA_REGISTRY;
  }, []);

  return <DNALibrary initialRegistry={initialRegistry} />;
}

export default App;
