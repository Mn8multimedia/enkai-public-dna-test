import type { DNAType } from '../types/dna';

export const DNA_TYPE_COLORS: Record<DNAType, { bg: string; text: string; border: string }> = {
  FractalDNA: { bg: '#1a0a3e', text: '#b47cff', border: '#7c3aed' },
  FluidDNA:   { bg: '#0a1f3e', text: '#60c4ff', border: '#0ea5e9' },
  MissionDNA: { bg: '#1e0a0a', text: '#ff7c7c', border: '#dc2626' },
  EventDNA:   { bg: '#0a2e1a', text: '#4dffaa', border: '#16a34a' },
  SceneDNA:   { bg: '#1e1a0a', text: '#ffd700', border: '#ca8a04' },
  MorphDNA:   { bg: '#1a1e0a', text: '#a3e635', border: '#65a30d' },
  HistoryDNA: { bg: '#1a0a1a', text: '#f0abfc', border: '#a855f7' },
};

export const DNA_TYPE_ICONS: Record<DNAType, string> = {
  FractalDNA: '◈',
  FluidDNA:   '≋',
  MissionDNA: '✦',
  EventDNA:   '◎',
  SceneDNA:   '⬡',
  MorphDNA:   '⌬',
  HistoryDNA: '⧖',
};

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function shortId(id: string): string {
  return id.slice(-8).toUpperCase();
}
