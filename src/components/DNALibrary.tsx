import React, { useState, useMemo, useCallback } from 'react';
import type { DNAObject, DNAType } from '../types/dna';
import { searchDNA, filterByType, filterByTag, getChildren, saveDNA } from '../lib/dnaOps';
import { DNA_TYPE_COLORS, DNA_TYPE_ICONS } from '../lib/uiHelpers';
import AssetCard from './AssetCard';
import MetadataViewer from './MetadataViewer';
import LineageGraph from './LineageGraph';
import ForkHistory from './ForkHistory';
import VersionTimeline from './VersionTimeline';
import DNAComparison from './DNAComparison';
import { ForkModal, CreateDNAModal } from './Modals';

interface DNALibraryProps {
  initialRegistry: DNAObject[];
}

type SidebarView = 'lineage' | 'timeline';
type DetailView = 'metadata' | 'forkHistory';

const DNA_TYPES: DNAType[] = ['FractalDNA', 'FluidDNA', 'MissionDNA', 'EventDNA', 'SceneDNA', 'MorphDNA', 'HistoryDNA'];

const DNALibrary: React.FC<DNALibraryProps> = ({ initialRegistry }) => {
  const [registry, setRegistry] = useState<DNAObject[]>(initialRegistry);
  const [selectedId, setSelectedId] = useState<string | null>(initialRegistry[0]?.id ?? null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<DNAType | 'All'>('All');
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [sidebarView, setSidebarView] = useState<SidebarView>('lineage');
  const [detailView, setDetailView] = useState<DetailView>('metadata');
  const [forkSource, setForkSource] = useState<DNAObject | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [compareState, setCompareState] = useState<{ a: DNAObject; b: DNAObject } | null>(null);
  const [saved, setSaved] = useState(false);

  const selectedDNA = useMemo(
    () => registry.find((d) => d.id === selectedId) ?? null,
    [registry, selectedId],
  );

  const filteredRegistry = useMemo(() => {
    let result = registry;
    if (typeFilter !== 'All') result = filterByType(result, typeFilter);
    if (tagFilter) result = filterByTag(result, tagFilter);
    if (search.trim()) result = searchDNA(result, search);
    return result;
  }, [registry, typeFilter, tagFilter, search]);


  const handleSelectDNA = useCallback((dna: DNAObject) => {
    setSelectedId(dna.id);
  }, []);

  const handleFork = useCallback((dna: DNAObject) => {
    setForkSource(dna);
  }, []);

  const handleForkConfirm = useCallback((newDNA: DNAObject) => {
    const updated = [...registry, newDNA];
    setRegistry(updated);
    setSelectedId(newDNA.id);
    setForkSource(null);
  }, [registry]);

  const handleCreate = useCallback((newDNA: DNAObject) => {
    const updated = [...registry, newDNA];
    setRegistry(updated);
    setSelectedId(newDNA.id);
    setShowCreateModal(false);
  }, [registry]);

  const handleSave = useCallback(() => {
    saveDNA(registry);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [registry]);

  const childCount = useCallback(
    (id: string) => getChildren(id, registry).length,
    [registry],
  );

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#010409', color: '#e6edf3', overflow: 'hidden' }}>
      {/* ── Left Sidebar ── */}
      <div
        style={{
          width: '260px',
          flexShrink: 0,
          borderRight: '1px solid #21262d',
          display: 'flex',
          flexDirection: 'column',
          background: '#0d1117',
        }}
      >
        {/* Logo / brand */}
        <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid #21262d' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <span style={{ fontSize: '22px' }}>⬡</span>
            <span style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '-0.02em', color: '#e6edf3' }}>
              Enkai
            </span>
            <span
              style={{
                fontSize: '10px',
                background: '#161b22',
                border: '1px solid #30363d',
                color: '#8b949e',
                padding: '1px 6px',
                borderRadius: '4px',
                letterSpacing: '0.06em',
              }}
            >
              DNA
            </span>
          </div>
          <p style={{ fontSize: '11px', color: '#6e7681', margin: 0 }}>
            Public Reference Implementation
          </p>
        </div>

        {/* Sidebar nav */}
        <div style={{ padding: '10px', borderBottom: '1px solid #21262d' }}>
          {(
            [
              { key: 'lineage', label: 'Lineage Graph', icon: '⎇' },
              { key: 'timeline', label: 'Timeline', icon: '⏱' },
            ] as { key: SidebarView; label: string; icon: string }[]
          ).map((item) => (
            <button
              key={item.key}
              onClick={() => setSidebarView(item.key)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                borderRadius: '6px',
                background: sidebarView === item.key ? '#21262d' : 'transparent',
                border: 'none',
                color: sidebarView === item.key ? '#e6edf3' : '#8b949e',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: sidebarView === item.key ? 600 : 400,
                textAlign: 'left',
                marginBottom: '2px',
              }}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </div>

        {/* Sidebar content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '14px' }}>
          {sidebarView === 'lineage' ? (
            <LineageGraph
              registry={registry}
              selectedId={selectedId}
              onSelect={handleSelectDNA}
            />
          ) : (
            <VersionTimeline
              registry={registry}
              selectedId={selectedId}
              onSelect={handleSelectDNA}
            />
          )}
        </div>

        {/* Save status */}
        <div style={{ padding: '12px', borderTop: '1px solid #21262d' }}>
          <button
            onClick={handleSave}
            style={{
              width: '100%',
              background: saved ? '#1a3a1a' : '#161b22',
              border: `1px solid ${saved ? '#3fb950' : '#30363d'}`,
              color: saved ? '#3fb950' : '#8b949e',
              padding: '7px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              transition: 'all 0.2s',
            }}
          >
            {saved ? '✓ Saved to Browser' : '⬇ Save Registry'}
          </button>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <div
          style={{
            padding: '14px 20px',
            borderBottom: '1px solid #21262d',
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            background: '#0d1117',
            flexShrink: 0,
          }}
        >
          {/* Search */}
          <div style={{ position: 'relative', flex: '1', maxWidth: '340px' }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6e7681', fontSize: '14px' }}>
              ⌕
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search DNA containers…"
              style={{
                width: '100%',
                background: '#010409',
                border: '1px solid #30363d',
                borderRadius: '6px',
                color: '#e6edf3',
                fontSize: '13px',
                padding: '8px 12px 8px 32px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as DNAType | 'All')}
            style={{
              background: '#010409',
              border: '1px solid #30363d',
              borderRadius: '6px',
              color: '#e6edf3',
              fontSize: '13px',
              padding: '8px 10px',
              cursor: 'pointer',
            }}
          >
            <option value="All">All Types</option>
            {DNA_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <div style={{ flex: 1 }} />

          {/* Actions */}
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              background: '#1f6feb22',
              border: '1px solid #1f6feb',
              color: '#58a6ff',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            + New DNA
          </button>

          <div style={{ fontSize: '12px', color: '#6e7681' }}>
            {filteredRegistry.length} of {registry.length}
          </div>
        </div>

        {/* Type chips */}
        <div
          style={{
            padding: '10px 20px',
            display: 'flex',
            gap: '6px',
            flexWrap: 'wrap',
            borderBottom: '1px solid #21262d',
            background: '#0d1117',
            flexShrink: 0,
          }}
        >
          <TypeChip
            label="All"
            active={typeFilter === 'All'}
            onClick={() => setTypeFilter('All')}
          />
          {DNA_TYPES.filter((t) => registry.some((d) => d.type === t)).map((t) => (
            <TypeChip
              key={t}
              label={t}
              active={typeFilter === t}
              onClick={() => setTypeFilter(typeFilter === t ? 'All' : t)}
              color={DNA_TYPE_COLORS[t]}
              icon={DNA_TYPE_ICONS[t]}
              count={registry.filter((d) => d.type === t).length}
            />
          ))}

          {tagFilter && (
            <button
              onClick={() => setTagFilter(null)}
              style={{
                background: '#1a1a1a',
                border: '1px solid #555',
                color: '#ccc',
                padding: '3px 8px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '11px',
              }}
            >
              ✕ #{tagFilter}
            </button>
          )}
        </div>

        {/* Grid */}
        <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
          {filteredRegistry.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#8b949e' }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>⬡</div>
              <div style={{ fontSize: '18px', fontWeight: 600 }}>No DNA containers found</div>
              <div style={{ fontSize: '14px', marginTop: '8px' }}>Try adjusting your search or filters.</div>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '14px',
              }}
            >
              {filteredRegistry.map((dna) => (
                <AssetCard
                  key={dna.id}
                  dna={dna}
                  isSelected={dna.id === selectedId}
                  isParent={dna.parentId === null}
                  isChild={dna.parentId !== null}
                  childCount={childCount(dna.id)}
                  onClick={handleSelectDNA}
                  onFork={handleFork}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Right Detail Panel ── */}
      {selectedDNA && (
        <div
          style={{
            width: '420px',
            flexShrink: 0,
            borderLeft: '1px solid #21262d',
            display: 'flex',
            flexDirection: 'column',
            background: '#0d1117',
            overflow: 'hidden',
          }}
        >
          {/* Detail nav */}
          <div style={{ display: 'flex', borderBottom: '1px solid #21262d', flexShrink: 0 }}>
            {(
              [
                { key: 'metadata', label: 'Details' },
                { key: 'forkHistory', label: 'Fork History' },
              ] as { key: DetailView; label: string }[]
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setDetailView(tab.key)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: detailView === tab.key ? '2px solid #1f6feb' : '2px solid transparent',
                  color: detailView === tab.key ? '#58a6ff' : '#8b949e',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: detailView === tab.key ? 600 : 400,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflow: 'auto' }}>
            {detailView === 'metadata' ? (
              <MetadataViewer
                dna={selectedDNA}
                registry={registry}
                onSelectDNA={handleSelectDNA}
                onFork={handleFork}
              />
            ) : (
              <div style={{ padding: '16px' }}>
                <ForkHistory
                  dna={selectedDNA}
                  registry={registry}
                  onSelectDNA={handleSelectDNA}
                  onCompare={(a, b) => setCompareState({ a, b })}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      {forkSource && (
        <ForkModal
          source={forkSource}
          onConfirm={handleForkConfirm}
          onClose={() => setForkSource(null)}
        />
      )}

      {showCreateModal && (
        <CreateDNAModal
          registry={registry}
          onConfirm={handleCreate}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {compareState && (
        <DNAComparison
          dnaA={compareState.a}
          dnaB={compareState.b}
          onClose={() => setCompareState(null)}
          onSelectDNA={(d) => { setSelectedId(d.id); setCompareState(null); }}
        />
      )}
    </div>
  );
};

// ─── Helper components ────────────────────────────────────────────────────────

interface TypeChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
  color?: { bg: string; text: string; border: string };
  icon?: string;
  count?: number;
}

const TypeChip: React.FC<TypeChipProps> = ({ label, active, onClick, color, icon, count }) => (
  <button
    onClick={onClick}
    style={{
      background: active ? (color?.bg ?? '#21262d') : 'transparent',
      border: `1px solid ${active ? (color?.border ?? '#8b949e') : '#30363d'}`,
      color: active ? (color?.text ?? '#e6edf3') : '#8b949e',
      padding: '4px 12px',
      borderRadius: '20px',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: active ? 600 : 400,
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      transition: 'all 0.15s',
    }}
  >
    {icon && <span>{icon}</span>}
    {label}
    {count !== undefined && (
      <span style={{ opacity: 0.7, fontSize: '11px' }}>({count})</span>
    )}
  </button>
);

export default DNALibrary;
