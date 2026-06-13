import React, { useState, useCallback } from 'react';
import type { DNAObject, DNAType } from '../types/dna';
import { createDNA, forkDNA } from '../lib/dnaOps';
import { DNA_TYPE_COLORS } from '../lib/uiHelpers';

interface ForkModalProps {
  source: DNAObject;
  onConfirm: (newDNA: DNAObject) => void;
  onClose: () => void;
}

const DNA_TYPES: DNAType[] = ['FractalDNA', 'FluidDNA', 'MissionDNA', 'EventDNA', 'SceneDNA', 'MorphDNA', 'HistoryDNA'];

export const ForkModal: React.FC<ForkModalProps> = ({ source, onConfirm, onClose }) => {
  const [name, setName] = useState(`${source.name} (Fork)`);
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState(`Forked from "${source.name}"`);

  const handleConfirm = useCallback(() => {
    const newDNA = forkDNA(source, {
      name: name.trim() || `${source.name} (Fork)`,
      author: author.trim() || source.author,
      description: description.trim() || `Forked from "${source.name}"`,
    });
    onConfirm(newDNA);
  }, [source, name, author, description, onConfirm]);

  const colors = DNA_TYPE_COLORS[source.type] ?? DNA_TYPE_COLORS.FractalDNA;

  return (
    <ModalShell title="Fork DNA Container" onClose={onClose}>
      <div style={{ marginBottom: '16px', padding: '10px 14px', background: `${colors.bg}80`, border: `1px solid ${colors.border}`, borderRadius: '6px' }}>
        <div style={{ fontSize: '11px', color: '#8b949e', marginBottom: '4px' }}>FORKING FROM</div>
        <div style={{ fontSize: '14px', color: '#e6edf3', fontWeight: 600 }}>{source.name}</div>
        <div style={{ fontSize: '11px', color: colors.text }}>{source.type}</div>
      </div>

      <FormField label="Fork Name" required>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
          placeholder="Fork name..."
        />
      </FormField>

      <FormField label="Your Name / Handle">
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          style={inputStyle}
          placeholder={source.author}
        />
      </FormField>

      <FormField label="Description">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
          placeholder="Describe your fork..."
        />
      </FormField>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
        <button onClick={onClose} style={secondaryBtnStyle}>Cancel</button>
        <button onClick={handleConfirm} style={{ ...primaryBtnStyle, borderColor: colors.border, color: colors.text }}>
          ⑂ Create Fork
        </button>
      </div>
    </ModalShell>
  );
};

interface CreateDNAModalProps {
  onConfirm: (newDNA: DNAObject) => void;
  onClose: () => void;
  registry: DNAObject[];
}

export const CreateDNAModal: React.FC<CreateDNAModalProps> = ({ onConfirm, onClose }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<DNAType>('FractalDNA');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');

  const colors = DNA_TYPE_COLORS[type];

  const handleConfirm = useCallback(() => {
    if (!name.trim()) { setError('Name is required'); return; }
    if (!author.trim()) { setError('Author is required'); return; }
    const newDNA = createDNA({
      name: name.trim(),
      type,
      author: author.trim(),
      description: description.trim(),
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      parameters: {},
    });
    onConfirm(newDNA);
  }, [name, type, author, description, tags, onConfirm]);

  return (
    <ModalShell title="Create DNA Container" onClose={onClose}>
      <FormField label="Name" required>
        <input
          value={name}
          onChange={(e) => { setName(e.target.value); setError(''); }}
          style={inputStyle}
          placeholder="My DNA Container"
          autoFocus
        />
      </FormField>

      <FormField label="Type">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as DNAType)}
          style={{ ...inputStyle, cursor: 'pointer' }}
        >
          {DNA_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </FormField>

      <FormField label="Author" required>
        <input
          value={author}
          onChange={(e) => { setAuthor(e.target.value); setError(''); }}
          style={inputStyle}
          placeholder="Your name or handle"
        />
      </FormField>

      <FormField label="Description">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ ...inputStyle, minHeight: '72px', resize: 'vertical' }}
          placeholder="Describe this DNA container..."
        />
      </FormField>

      <FormField label="Tags (comma-separated)">
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          style={inputStyle}
          placeholder="fractal, mathematics, example"
        />
      </FormField>

      {error && (
        <p style={{ color: '#f85149', fontSize: '13px', margin: '0 0 12px' }}>{error}</p>
      )}

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
        <button onClick={onClose} style={secondaryBtnStyle}>Cancel</button>
        <button onClick={handleConfirm} style={{ ...primaryBtnStyle, borderColor: colors.border, color: colors.text }}>
          + Create DNA
        </button>
      </div>
    </ModalShell>
  );
};

// ─── Shared Modal Shell ───────────────────────────────────────────────────────

const ModalShell: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({
  title,
  onClose,
  children,
}) => (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(1, 4, 9, 0.85)',
      zIndex: 200,
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
        maxWidth: '480px',
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: '18px 24px', borderBottom: '1px solid #21262d', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: '#e6edf3', fontSize: '16px', fontWeight: 700, margin: 0 }}>{title}</h2>
        <button onClick={onClose} style={{ background: 'transparent', border: '1px solid #30363d', color: '#8b949e', width: '30px', height: '30px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>✕</button>
      </div>
      <div style={{ padding: '20px 24px' }}>{children}</div>
    </div>
  </div>
);

const FormField: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({ label, required, children }) => (
  <div style={{ marginBottom: '14px' }}>
    <label style={{ display: 'block', fontSize: '12px', color: '#8b949e', marginBottom: '6px', fontWeight: 600, letterSpacing: '0.04em' }}>
      {label}{required && <span style={{ color: '#f85149' }}> *</span>}
    </label>
    {children}
  </div>
);

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#010409',
  border: '1px solid #30363d',
  borderRadius: '6px',
  color: '#e6edf3',
  fontSize: '14px',
  padding: '8px 12px',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

const primaryBtnStyle: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid',
  padding: '8px 18px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 700,
  fontSize: '13px',
};

const secondaryBtnStyle: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid #30363d',
  color: '#8b949e',
  padding: '8px 18px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '13px',
};
