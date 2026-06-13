import React from 'react';
import type { DNAObject } from '../types/dna';
import { DNA_TYPE_COLORS, DNA_TYPE_ICONS, formatDate, shortId } from '../lib/uiHelpers';

interface VersionTimelineProps {
  registry: DNAObject[];
  selectedId: string | null;
  onSelect: (dna: DNAObject) => void;
}

const VersionTimeline: React.FC<VersionTimelineProps> = ({ registry, selectedId, onSelect }) => {
  // Sort by creation date ascending
  const sorted = [...registry].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  // Group by month
  const groups = groupByMonth(sorted);

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ color: '#e6edf3', fontSize: '15px', fontWeight: 700, margin: '0 0 4px' }}>
          Version Timeline
        </h3>
        <p style={{ color: '#8b949e', fontSize: '12px', margin: 0 }}>
          All {registry.length} DNA containers across time
        </p>
      </div>

      {groups.map((group) => (
        <div key={group.label} style={{ marginBottom: '20px' }}>
          {/* Month label */}
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#8b949e',
              marginBottom: '8px',
              paddingBottom: '4px',
              borderBottom: '1px solid #21262d',
            }}
          >
            {group.label}
          </div>

          {/* Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {group.items.map((dna) => {
              const colors = DNA_TYPE_COLORS[dna.type] ?? DNA_TYPE_COLORS.FractalDNA;
              const isSelected = dna.id === selectedId;
              return (
                <div
                  key={dna.id}
                  onClick={() => onSelect(dna)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && onSelect(dna)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '7px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    background: isSelected ? `${colors.bg}cc` : 'transparent',
                    border: `1px solid ${isSelected ? colors.border : 'transparent'}`,
                    transition: 'background 0.12s',
                  }}
                >
                  <span style={{ color: colors.text, fontSize: '14px', flexShrink: 0 }}>
                    {DNA_TYPE_ICONS[dna.type]}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '13px',
                        color: isSelected ? '#e6edf3' : '#c9d1d9',
                        fontWeight: isSelected ? 600 : 400,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {dna.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6e7681' }}>
                      {dna.author}
                    </div>
                  </div>
                  <div style={{ flexShrink: 0, textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: '#6e7681', fontFamily: 'monospace' }}>
                      #{shortId(dna.id)}
                    </div>
                    <div style={{ fontSize: '10px', color: '#6e7681' }}>
                      {formatDate(dna.createdAt)}
                    </div>
                  </div>
                  {dna.parentId === null ? (
                    <span
                      style={{
                        fontSize: '10px',
                        color: colors.text,
                        background: colors.bg,
                        padding: '1px 5px',
                        borderRadius: '3px',
                        border: `1px solid ${colors.border}`,
                        flexShrink: 0,
                      }}
                    >
                      ROOT
                    </span>
                  ) : (
                    <span
                      style={{
                        fontSize: '10px',
                        color: '#8b949e',
                        background: '#161b22',
                        padding: '1px 5px',
                        borderRadius: '3px',
                        border: '1px solid #30363d',
                        flexShrink: 0,
                      }}
                    >
                      FORK
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

interface MonthGroup {
  label: string;
  items: DNAObject[];
}

function groupByMonth(items: DNAObject[]): MonthGroup[] {
  const map = new Map<string, DNAObject[]>();
  items.forEach((dna) => {
    const d = new Date(dna.createdAt);
    const label = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(dna);
  });
  return Array.from(map.entries()).map(([label, items]) => ({ label, items }));
}

export default VersionTimeline;
