import React, { useState } from 'react';
import type { DNAObject } from '../types/dna';
import { DNA_TYPE_COLORS, DNA_TYPE_ICONS, formatDateTime, shortId } from '../lib/uiHelpers';

interface ForkHistoryProps {
  dna: DNAObject;
  registry: DNAObject[];
  onSelectDNA: (dna: DNAObject) => void;
  onCompare: (a: DNAObject, b: DNAObject) => void;
}

const ForkHistory: React.FC<ForkHistoryProps> = ({ dna, registry, onSelectDNA, onCompare }) => {
  const [compareTarget, setCompareTarget] = useState<string | null>(null);

  // Build the full fork chain: root → current, plus all descendants
  const allRelated = getRelatedChain(dna, registry);

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ color: '#e6edf3', fontSize: '15px', fontWeight: 700, margin: '0 0 4px' }}>
          Fork History
        </h3>
        <p style={{ color: '#8b949e', fontSize: '12px', margin: 0 }}>
          {allRelated.length} container{allRelated.length !== 1 ? 's' : ''} in this lineage
        </p>
      </div>

      {compareTarget && (
        <div
          style={{
            background: '#161b22',
            border: '1px solid #30363d',
            borderRadius: '6px',
            padding: '10px 14px',
            marginBottom: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '12px', color: '#8b949e' }}>
            Select a second DNA to compare with <strong style={{ color: '#e6edf3' }}>{registry.find(d => d.id === compareTarget)?.name}</strong>
          </span>
          <button
            onClick={() => setCompareTarget(null)}
            style={{ background: 'transparent', border: 'none', color: '#8b949e', cursor: 'pointer', fontSize: '14px' }}
          >
            ✕
          </button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        {allRelated.map((entry, i) => {
          const colors = DNA_TYPE_COLORS[entry.dna.type] ?? DNA_TYPE_COLORS.FractalDNA;
          const isCurrent = entry.dna.id === dna.id;

          return (
            <div
              key={entry.dna.id}
              style={{
                display: 'flex',
                alignItems: 'stretch',
                gap: '0',
              }}
            >
              {/* Timeline column */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '28px',
                  flexShrink: 0,
                  paddingTop: '14px',
                }}
              >
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: isCurrent ? colors.border : '#21262d',
                    border: `2px solid ${isCurrent ? colors.text : '#30363d'}`,
                    flexShrink: 0,
                    zIndex: 1,
                  }}
                />
                {i < allRelated.length - 1 && (
                  <div
                    style={{
                      flex: 1,
                      width: '2px',
                      background: '#21262d',
                      minHeight: '16px',
                    }}
                  />
                )}
              </div>

              {/* Entry card */}
              <div
                style={{
                  flex: 1,
                  margin: '4px 0 4px 10px',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  background: isCurrent ? `${colors.bg}cc` : '#0d1117',
                  border: `1px solid ${isCurrent ? colors.border : '#21262d'}`,
                  cursor: 'pointer',
                }}
                onClick={() => {
                  if (compareTarget && compareTarget !== entry.dna.id) {
                    const a = registry.find((d) => d.id === compareTarget);
                    if (a) onCompare(a, entry.dna);
                    setCompareTarget(null);
                  } else {
                    onSelectDNA(entry.dna);
                  }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: colors.text, fontSize: '14px' }}>
                      {DNA_TYPE_ICONS[entry.dna.type]}
                    </span>
                    <div>
                      <div style={{ fontSize: '13px', color: isCurrent ? '#e6edf3' : '#c9d1d9', fontWeight: isCurrent ? 600 : 400 }}>
                        {entry.dna.name}
                        {isCurrent && (
                          <span style={{ marginLeft: '8px', fontSize: '10px', color: colors.text, background: colors.bg, padding: '1px 5px', borderRadius: '3px', border: `1px solid ${colors.border}` }}>
                            CURRENT
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '11px', color: '#6e7681', fontFamily: 'monospace' }}>
                        #{shortId(entry.dna.id)} · {entry.operation}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    <span style={{ fontSize: '11px', color: '#6e7681' }}>
                      {formatDateTime(entry.dna.createdAt)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCompareTarget(entry.dna.id);
                      }}
                      title="Compare"
                      style={{
                        background: 'transparent',
                        border: `1px solid #30363d`,
                        color: '#8b949e',
                        padding: '2px 7px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '11px',
                      }}
                    >
                      ⇄
                    </button>
                  </div>
                </div>
                <p style={{ color: '#8b949e', fontSize: '12px', margin: '6px 0 0', lineHeight: 1.4 }}>
                  {entry.dna.description.length > 90
                    ? entry.dna.description.slice(0, 87) + '…'
                    : entry.dna.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Build the related chain: ancestors + current + all descendants
// ─────────────────────────────────────────────────────────────────────────────

interface ChainEntry {
  dna: DNAObject;
  operation: string;
}

function getRelatedChain(dna: DNAObject, registry: DNAObject[]): ChainEntry[] {
  const map = new Map(registry.map((d) => [d.id, d]));

  // Walk up to root
  const ancestors: DNAObject[] = [];
  let current: DNAObject | undefined = dna;
  while (current) {
    ancestors.unshift(current);
    current = current.parentId ? map.get(current.parentId) : undefined;
  }

  // Walk down descendants (BFS)
  const descendants: DNAObject[] = [];
  const queue = [dna.id];
  const visited = new Set<string>();
  while (queue.length) {
    const id = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);
    const children = registry.filter((d) => d.parentId === id);
    children.forEach((child) => {
      descendants.push(child);
      queue.push(child.id);
    });
  }

  // Merge: ancestors (without dna), dna, descendants
  const chain: DNAObject[] = [
    ...ancestors.filter((a) => a.id !== dna.id),
    dna,
    ...descendants,
  ];

  return chain.map((d) => ({
    dna: d,
    operation: d.parentId === null ? 'create' : 'fork',
  }));
}

export default ForkHistory;
