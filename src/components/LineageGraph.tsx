import React from 'react';
import type { DNAObject } from '../types/dna';
import type { LineageNode } from '../types/dna';
import { buildLineageForest, flattenLineage } from '../lib/dnaOps';
import { DNA_TYPE_COLORS, DNA_TYPE_ICONS, shortId } from '../lib/uiHelpers';

interface LineageGraphProps {
  registry: DNAObject[];
  selectedId: string | null;
  onSelect: (dna: DNAObject) => void;
}

const INDENT_WIDTH = 28;

const LineageGraph: React.FC<LineageGraphProps> = ({ registry, selectedId, onSelect }) => {
  const forest = buildLineageForest(registry);
  const flatNodes = flattenLineage(forest);

  return (
    <div style={{ fontFamily: 'monospace', fontSize: '13px' }}>
      <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '16px', color: '#8b949e' }}>⎇</span>
        <span style={{ fontSize: '12px', color: '#8b949e', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Lineage Graph — {registry.length} containers
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {flatNodes.map((node) => (
          <LineageRow
            key={node.dna.id}
            node={node}
            forest={forest}
            isSelected={node.dna.id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
};

// ─── Row renderer ─────────────────────────────────────────────────────────────

interface LineageRowProps {
  node: LineageNode;
  forest: LineageNode[];
  isSelected: boolean;
  onSelect: (dna: DNAObject) => void;
}

const LineageRow: React.FC<LineageRowProps> = ({ node, forest, isSelected, onSelect }) => {
  const { dna, depth } = node;
  const colors = DNA_TYPE_COLORS[dna.type] ?? DNA_TYPE_COLORS.FractalDNA;
  const icon = DNA_TYPE_ICONS[dna.type] ?? '◈';

  // Build tree prefix characters
  const prefix = buildPrefix(node, forest);

  return (
    <div
      onClick={() => onSelect(dna)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(dna)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 10px',
        borderRadius: '6px',
        cursor: 'pointer',
        background: isSelected ? `${colors.bg}cc` : 'transparent',
        border: isSelected ? `1px solid ${colors.border}` : '1px solid transparent',
        transition: 'background 0.12s',
      }}
    >
      {/* Indentation prefix */}
      <span
        style={{
          color: '#30363d',
          whiteSpace: 'pre',
          userSelect: 'none',
          lineHeight: 1,
          marginLeft: `${depth * INDENT_WIDTH}px`,
        }}
      >
        {prefix}
      </span>

      {/* Type icon */}
      <span style={{ color: colors.text, fontSize: '15px', flexShrink: 0 }}>{icon}</span>

      {/* Name */}
      <span
        style={{
          color: isSelected ? '#e6edf3' : '#c9d1d9',
          fontWeight: isSelected ? 600 : 400,
          flex: 1,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {dna.name}
      </span>

      {/* Short ID */}
      <span style={{ color: '#6e7681', fontSize: '11px', flexShrink: 0 }}>#{shortId(dna.id)}</span>

      {/* Fork badge */}
      {dna.parentId === null && (
        <span
          style={{
            fontSize: '10px',
            color: colors.text,
            background: colors.bg,
            padding: '1px 6px',
            borderRadius: '3px',
            border: `1px solid ${colors.border}`,
            flexShrink: 0,
          }}
        >
          ROOT
        </span>
      )}
    </div>
  );
};

// ─── Prefix builder (Git-style tree characters) ───────────────────────────────

function buildPrefix(node: LineageNode, forest: LineageNode[]): string {
  if (node.depth === 0) return '';

  // Find this node's parent and siblings
  const allNodes = flattenLineage(forest);
  const parentNode = allNodes.find(
    (n) => n.dna.id === node.dna.parentId,
  );
  if (!parentNode) return '── ';

  const siblings = parentNode.children;
  const isLast = siblings[siblings.length - 1].dna.id === node.dna.id;

  return isLast ? '└─ ' : '├─ ';
}

export default LineageGraph;
