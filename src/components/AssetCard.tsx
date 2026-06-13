import React from 'react';
import type { DNAObject } from '../types/dna';
import { DNA_TYPE_COLORS, DNA_TYPE_ICONS, formatDate, shortId } from '../lib/uiHelpers';

interface AssetCardProps {
  dna: DNAObject;
  isSelected?: boolean;
  isParent?: boolean;
  isChild?: boolean;
  childCount?: number;
  onClick: (dna: DNAObject) => void;
  onFork?: (dna: DNAObject) => void;
}

const AssetCard: React.FC<AssetCardProps> = ({
  dna,
  isSelected = false,
  isParent = false,
  isChild = false,
  childCount = 0,
  onClick,
  onFork,
}) => {
  const colors = DNA_TYPE_COLORS[dna.type] ?? DNA_TYPE_COLORS.FractalDNA;
  const icon = DNA_TYPE_ICONS[dna.type] ?? '◈';

  const cardStyle: React.CSSProperties = {
    background: isSelected
      ? `linear-gradient(135deg, ${colors.bg} 0%, #0d1117 100%)`
      : '#0d1117',
    border: `1px solid ${isSelected ? colors.border : '#21262d'}`,
    borderRadius: '10px',
    padding: '20px',
    cursor: 'pointer',
    transition: 'all 0.18s ease',
    boxShadow: isSelected
      ? `0 0 0 1px ${colors.border}, 0 4px 20px rgba(0,0,0,0.5)`
      : '0 2px 8px rgba(0,0,0,0.3)',
    position: 'relative',
    overflow: 'hidden',
  };

  return (
    <div
      style={cardStyle}
      onClick={() => onClick(dna)}
      role="button"
      aria-selected={isSelected}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(dna)}
    >
      {/* Accent bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '3px',
          height: '100%',
          background: colors.border,
          borderRadius: '10px 0 0 10px',
        }}
      />

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '22px', color: colors.text }}>{icon}</span>
          <div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: colors.text,
                textTransform: 'uppercase',
                background: colors.bg,
                padding: '2px 8px',
                borderRadius: '4px',
                border: `1px solid ${colors.border}`,
              }}
            >
              {dna.type}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {isParent && (
            <span style={{ fontSize: '10px', color: '#8b949e', background: '#161b22', padding: '2px 6px', borderRadius: '4px', border: '1px solid #30363d' }}>
              ROOT
            </span>
          )}
          {isChild && (
            <span style={{ fontSize: '10px', color: '#8b949e', background: '#161b22', padding: '2px 6px', borderRadius: '4px', border: '1px solid #30363d' }}>
              FORK
            </span>
          )}
          {childCount > 0 && (
            <span style={{ fontSize: '10px', color: '#8b949e', background: '#161b22', padding: '2px 6px', borderRadius: '4px', border: '1px solid #30363d' }}>
              {childCount} {childCount === 1 ? 'fork' : 'forks'}
            </span>
          )}
        </div>
      </div>

      {/* Name */}
      <h3 style={{ color: '#e6edf3', fontSize: '15px', fontWeight: 600, margin: '0 0 6px 0', lineHeight: 1.3 }}>
        {dna.name}
      </h3>

      {/* Description */}
      <p style={{ color: '#8b949e', fontSize: '13px', lineHeight: 1.5, margin: '0 0 12px 0' }}>
        {dna.description.length > 100 ? dna.description.slice(0, 97) + '…' : dna.description}
      </p>

      {/* Tags */}
      {dna.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '12px' }}>
          {dna.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: '11px',
                color: '#8b949e',
                background: '#161b22',
                padding: '2px 7px',
                borderRadius: '20px',
                border: '1px solid #30363d',
              }}
            >
              {tag}
            </span>
          ))}
          {dna.tags.length > 4 && (
            <span style={{ fontSize: '11px', color: '#8b949e' }}>+{dna.tags.length - 4}</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #21262d', paddingTop: '10px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span style={{ fontSize: '11px', color: '#8b949e' }}>
            <span style={{ color: '#6e7681' }}>by </span>{dna.author}
          </span>
          <span style={{ fontSize: '11px', color: '#6e7681' }}>{formatDate(dna.createdAt)}</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: '#6e7681', fontFamily: 'monospace' }}>
            #{shortId(dna.id)}
          </span>
          {onFork && (
            <button
              onClick={(e) => { e.stopPropagation(); onFork(dna); }}
              style={{
                fontSize: '11px',
                color: colors.text,
                background: 'transparent',
                border: `1px solid ${colors.border}`,
                padding: '3px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
              title="Fork this DNA"
            >
              Fork
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetCard;
