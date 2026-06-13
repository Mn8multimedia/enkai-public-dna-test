import React from 'react';
import type { DNAObject } from '../types/dna';
import { compareDNA } from '../lib/dnaOps';
import { DNA_TYPE_COLORS, DNA_TYPE_ICONS, formatDate, shortId } from '../lib/uiHelpers';

interface DNAComparisonProps {
  dnaA: DNAObject;
  dnaB: DNAObject;
  onClose: () => void;
  onSelectDNA: (dna: DNAObject) => void;
}

const DNAComparison: React.FC<DNAComparisonProps> = ({ dnaA, dnaB, onClose, onSelectDNA }) => {
  const diffs = compareDNA(dnaA, dnaB);
  const unchanged = Object.keys(dnaA.parameters).length + 6 - diffs.length;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(1, 4, 9, 0.85)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          background: '#0d1117',
          border: '1px solid #30363d',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '860px',
          maxHeight: '85vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #21262d',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h2 style={{ color: '#e6edf3', fontSize: '18px', fontWeight: 700, margin: 0 }}>
              DNA Comparison
            </h2>
            <p style={{ color: '#8b949e', fontSize: '12px', margin: '4px 0 0' }}>
              {diffs.length} difference{diffs.length !== 1 ? 's' : ''} · {unchanged} unchanged fields
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid #30363d',
              color: '#8b949e',
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Subject headers */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            borderBottom: '1px solid #21262d',
          }}
        >
          {[dnaA, dnaB].map((dna, i) => {
            const colors = DNA_TYPE_COLORS[dna.type] ?? DNA_TYPE_COLORS.FractalDNA;
            return (
              <div
                key={dna.id}
                style={{
                  padding: '14px 20px',
                  background: `${colors.bg}80`,
                  borderRight: i === 0 ? '1px solid #21262d' : 'none',
                  cursor: 'pointer',
                }}
                onClick={() => onSelectDNA(dna)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: colors.text, fontSize: '18px' }}>
                    {DNA_TYPE_ICONS[dna.type]}
                  </span>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#e6edf3' }}>
                      {dna.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6e7681', fontFamily: 'monospace' }}>
                      #{shortId(dna.id)} · {formatDate(dna.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Diff rows */}
        <div style={{ overflow: 'auto', flex: 1 }}>
          {diffs.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#8b949e' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>✓</div>
              <div style={{ fontSize: '16px', fontWeight: 600 }}>DNA containers are identical</div>
              <div style={{ fontSize: '13px', marginTop: '4px' }}>No parameter or metadata differences found.</div>
            </div>
          ) : (
            diffs.map((diff, i) => (
              <div
                key={diff.field}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '160px 1fr 1fr',
                  borderBottom: '1px solid #161b22',
                  background: i % 2 === 0 ? '#010409' : 'transparent',
                }}
              >
                <div
                  style={{
                    padding: '10px 16px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    color: '#79c0ff',
                    borderRight: '1px solid #21262d',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {diff.field}
                </div>
                <DiffCell value={diff.before} variant="before" />
                <DiffCell value={diff.after} variant="after" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const DiffCell: React.FC<{ value: unknown; variant: 'before' | 'after' }> = ({ value, variant }) => {
  const isAfter = variant === 'after';
  return (
    <div
      style={{
        padding: '10px 16px',
        borderRight: isAfter ? 'none' : '1px solid #21262d',
        background: isAfter ? 'rgba(46, 160, 67, 0.06)' : 'rgba(248, 81, 73, 0.06)',
      }}
    >
      <span
        style={{
          fontSize: '12px',
          fontFamily: 'monospace',
          color: isAfter ? '#3fb950' : '#f85149',
          wordBreak: 'break-all',
        }}
      >
        {isAfter ? '+ ' : '- '}
        {typeof value === 'undefined'
          ? 'undefined'
          : typeof value === 'object'
          ? JSON.stringify(value)
          : String(value)}
      </span>
    </div>
  );
};

export default DNAComparison;
