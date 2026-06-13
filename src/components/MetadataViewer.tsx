import React, { useState } from 'react';
import type { DNAObject } from '../types/dna';
import { DNA_TYPE_COLORS, DNA_TYPE_ICONS, formatDateTime, shortId } from '../lib/uiHelpers';
import { getAncestors, getChildren } from '../lib/dnaOps';

interface MetadataViewerProps {
  dna: DNAObject;
  registry: DNAObject[];
  onSelectDNA: (dna: DNAObject) => void;
  onFork: (dna: DNAObject) => void;
}

const MetadataViewer: React.FC<MetadataViewerProps> = ({ dna, registry, onSelectDNA, onFork }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'parameters' | 'lineage'>('overview');
  const colors = DNA_TYPE_COLORS[dna.type] ?? DNA_TYPE_COLORS.FractalDNA;
  const icon = DNA_TYPE_ICONS[dna.type] ?? '◈';

  const ancestors = getAncestors(dna.id, registry);
  const children = getChildren(dna.id, registry);
  const parent = dna.parentId ? registry.find((d) => d.id === dna.parentId) : null;

  const tabs: { key: 'overview' | 'parameters' | 'lineage'; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'parameters', label: 'Parameters' },
    { key: 'lineage', label: `Lineage (${ancestors.length})` },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${colors.bg} 0%, #0d1117 100%)`,
          borderBottom: `1px solid ${colors.border}`,
          padding: '24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <span style={{ fontSize: '40px', color: colors.text, lineHeight: 1 }}>{icon}</span>
            <div>
              <div style={{ marginBottom: '6px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    color: colors.text,
                    textTransform: 'uppercase',
                    background: colors.bg,
                    padding: '3px 10px',
                    borderRadius: '4px',
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  {dna.type}
                </span>
                <span style={{ marginLeft: '8px', fontSize: '11px', color: '#6e7681', fontFamily: 'monospace' }}>
                  v{dna.version}
                </span>
              </div>
              <h2 style={{ color: '#e6edf3', fontSize: '22px', fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
                {dna.name}
              </h2>
              <p style={{ color: '#8b949e', fontSize: '13px', margin: '6px 0 0', fontFamily: 'monospace' }}>
                ID: {dna.id}
              </p>
            </div>
          </div>
          <button
            onClick={() => onFork(dna)}
            style={{
              background: colors.bg,
              border: `1px solid ${colors.border}`,
              color: colors.text,
              padding: '8px 18px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '13px',
              letterSpacing: '0.05em',
            }}
          >
            ⑂ Fork DNA
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #21262d', background: '#0d1117' }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '12px 20px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.key ? `2px solid ${colors.border}` : '2px solid transparent',
              color: activeTab === tab.key ? colors.text : '#8b949e',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: activeTab === tab.key ? 600 : 400,
              transition: 'color 0.15s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Section title="Description">
              <p style={{ color: '#c9d1d9', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>
                {dna.description}
              </p>
            </Section>

            <Section title="Identity">
              <MetaRow label="ID" value={dna.id} mono />
              <MetaRow label="Short ID" value={`#${shortId(dna.id)}`} mono />
              <MetaRow label="Version" value={`v${dna.version}`} mono />
              <MetaRow label="Author" value={dna.author} />
              <MetaRow label="Created" value={formatDateTime(dna.createdAt)} />
              <MetaRow label="Updated" value={formatDateTime(dna.updatedAt)} />
              <MetaRow label="Parent" value={dna.parentId ? `#${shortId(dna.parentId)}` : 'ROOT'} mono />
            </Section>

            {dna.tags.length > 0 && (
              <Section title="Tags">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {dna.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: '12px',
                        color: colors.text,
                        background: colors.bg,
                        padding: '4px 10px',
                        borderRadius: '20px',
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {(parent || children.length > 0) && (
              <Section title="Relationships">
                {parent && (
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '12px', color: '#8b949e', marginBottom: '4px' }}>PARENT</div>
                    <RelationChip dna={parent} onSelect={onSelectDNA} />
                  </div>
                )}
                {children.length > 0 && (
                  <div>
                    <div style={{ fontSize: '12px', color: '#8b949e', marginBottom: '6px' }}>
                      FORKS ({children.length})
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {children.map((c) => (
                        <RelationChip key={c.id} dna={c} onSelect={onSelectDNA} />
                      ))}
                    </div>
                  </div>
                )}
              </Section>
            )}
          </div>
        )}

        {activeTab === 'parameters' && (
          <Section title={`Parameters (${Object.keys(dna.parameters).length})`}>
            <div
              style={{
                background: '#010409',
                border: '1px solid #21262d',
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            >
              {Object.entries(dna.parameters).map(([key, value], i) => (
                <div
                  key={key}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    padding: '10px 16px',
                    borderTop: i > 0 ? '1px solid #21262d' : 'none',
                  }}
                >
                  <span style={{ color: '#79c0ff', fontFamily: 'monospace', fontSize: '13px', minWidth: '140px', flexShrink: 0 }}>
                    {key}
                  </span>
                  <span style={{ color: '#a5d6ff', fontFamily: 'monospace', fontSize: '13px', wordBreak: 'break-all' }}>
                    {typeof value === 'string'
                      ? `"${value}"`
                      : Array.isArray(value)
                      ? `[${(value as unknown[]).map((v) => `"${v}"`).join(', ')}]`
                      : typeof value === 'object' && value !== null
                      ? JSON.stringify(value, null, 0)
                      : String(value)}
                  </span>
                  <span style={{ color: '#6e7681', fontSize: '11px', marginLeft: 'auto', flexShrink: 0 }}>
                    {Array.isArray(value) ? 'array' : typeof value}
                  </span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {activeTab === 'lineage' && (
          <Section title="Ancestry Chain">
            <div style={{ position: 'relative' }}>
              {ancestors.map((ancestor, i) => (
                <div key={ancestor.id} style={{ display: 'flex', alignItems: 'stretch', gap: '0' }}>
                  {/* Connector */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '24px', flexShrink: 0 }}>
                    <div
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: ancestor.id === dna.id ? colors.border : '#30363d',
                        border: `2px solid ${ancestor.id === dna.id ? colors.text : '#8b949e'}`,
                        flexShrink: 0,
                        marginTop: '14px',
                      }}
                    />
                    {i < ancestors.length - 1 && (
                      <div style={{ flex: 1, width: '2px', background: '#30363d', minHeight: '20px' }} />
                    )}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      marginBottom: '4px',
                      borderRadius: '6px',
                      background: ancestor.id === dna.id ? colors.bg : 'transparent',
                      border: ancestor.id === dna.id ? `1px solid ${colors.border}` : '1px solid transparent',
                      cursor: ancestor.id === dna.id ? 'default' : 'pointer',
                    }}
                    onClick={() => ancestor.id !== dna.id && onSelectDNA(ancestor)}
                  >
                    <div style={{ fontSize: '11px', color: '#6e7681', fontFamily: 'monospace', marginBottom: '2px' }}>
                      {i === 0 ? 'ROOT' : `DEPTH ${i}`}
                    </div>
                    <div style={{ fontSize: '14px', color: '#e6edf3', fontWeight: 600 }}>
                      {ancestor.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#8b949e', fontFamily: 'monospace' }}>
                      #{shortId(ancestor.id)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h4
      style={{
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: '#8b949e',
        margin: '0 0 10px 0',
        paddingBottom: '6px',
        borderBottom: '1px solid #21262d',
      }}
    >
      {title}
    </h4>
    {children}
  </div>
);

const MetaRow: React.FC<{ label: string; value: string; mono?: boolean }> = ({ label, value, mono }) => (
  <div style={{ display: 'flex', gap: '12px', padding: '5px 0', borderBottom: '1px solid #161b22' }}>
    <span style={{ fontSize: '12px', color: '#6e7681', minWidth: '80px', flexShrink: 0 }}>{label}</span>
    <span style={{ fontSize: '13px', color: '#c9d1d9', fontFamily: mono ? 'monospace' : 'inherit', wordBreak: 'break-all' }}>
      {value}
    </span>
  </div>
);

const RelationChip: React.FC<{ dna: DNAObject; onSelect: (d: DNAObject) => void }> = ({ dna, onSelect }) => {
  const colors = DNA_TYPE_COLORS[dna.type] ?? DNA_TYPE_COLORS.FractalDNA;
  return (
    <div
      onClick={() => onSelect(dna)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 12px',
        background: '#161b22',
        border: `1px solid ${colors.border}40`,
        borderRadius: '6px',
        cursor: 'pointer',
      }}
    >
      <span style={{ color: colors.text, fontSize: '14px' }}>{DNA_TYPE_ICONS[dna.type]}</span>
      <div>
        <div style={{ fontSize: '13px', color: '#e6edf3' }}>{dna.name}</div>
        <div style={{ fontSize: '11px', color: '#6e7681', fontFamily: 'monospace' }}>#{shortId(dna.id)}</div>
      </div>
    </div>
  );
};

export default MetadataViewer;
