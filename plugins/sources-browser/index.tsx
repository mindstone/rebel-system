import { useState, useMemo, useEffect, useCallback, type ReactElement } from 'react';
import { useSources, useSourceDocument, useRebel, useClipboard } from '@rebel/plugin-api';
import { Card, Stack, Button, Badge, Input, Select } from '@rebel/plugin-ui';

// ── Helpers ──────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function getDateRangeFor(preset: string): { after?: string; before?: string } | undefined {
  if (preset === 'all') return undefined;
  const now = new Date();
  const fmt = (d: Date) => d.toISOString().split('T')[0];
  if (preset === 'today') return { after: fmt(now) };
  if (preset === 'week') {
    const d = new Date(now);
    d.setDate(d.getDate() - 7);
    return { after: fmt(d) };
  }
  if (preset === 'month') {
    const d = new Date(now);
    d.setDate(d.getDate() - 30);
    return { after: fmt(d) };
  }
  return undefined;
}

function weekAgoStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return d.toISOString().split('T')[0];
}

function truncateText(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trimEnd() + '\u2026';
}

function jaccardSimilarity(a: string[], b: string[]): number {
  const setA = new Set(a.map((v) => v.trim().toLowerCase()).filter(Boolean));
  const setB = new Set(b.map((v) => v.trim().toLowerCase()).filter(Boolean));

  if (setA.size === 0 || setB.size === 0) return 0;

  let intersection = 0;
  setA.forEach((value) => {
    if (setB.has(value)) intersection += 1;
  });

  const union = new Set([...setA, ...setB]).size;
  return union > 0 ? intersection / union : 0;
}

function extractSpaceName(relativePath: string): string | null {
  const segments = relativePath.split('/');
  const memoryIndex = segments.indexOf('memory');
  if (memoryIndex > 0) return segments.slice(0, memoryIndex).join('/');
  return null;
}

const SYSTEM_COLORS: Record<string, string> = {
  recall: '#8b5cf6',
  fathom: '#3b82f6',
  plaud: '#06b6d4',
  otter: '#22c55e',
  manual: '#94a3b8',
  notion: '#f97316',
  google: '#ea4335',
  microsoft: '#00a4ef',
};

function systemColor(system: string): string {
  return SYSTEM_COLORS[system.toLowerCase()] || 'var(--color-accent)';
}

const SOURCE_TYPE_ICONS: Record<string, string> = {
  meeting: '\ud83d\udcac',
  recording: '\ud83c\udfa4',
  email: '\u2709\ufe0f',
  note: '\ud83d\udcdd',
  document: '\ud83d\udcc4',
};

function sourceTypeIcon(type: string): string {
  return SOURCE_TYPE_ICONS[type.toLowerCase()] || '\ud83d\udcc1';
}

const DATE_PRESETS = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
];

const SOURCE_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'meeting', label: 'Meetings' },
  { value: 'recording', label: 'Recordings' },
  { value: 'email', label: 'Emails' },
  { value: 'note', label: 'Notes' },
  { value: 'document', label: 'Documents' },
];

type SortOption = 'relevance' | 'recent' | 'oldest' | 'alphabetical';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'alphabetical', label: 'A \u2192 Z' },
  { value: 'relevance', label: 'Relevance' },
];

// ── Context Menu ─────────────────────────────────────────────────────────

interface ContextMenuItem {
  label: string;
  onClick: () => void;
}

interface ContextMenuState {
  x: number;
  y: number;
  items: ContextMenuItem[];
}

function ContextMenuOverlay({ menu, onClose }: { menu: ContextMenuState; onClose: () => void }) {
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      onClose();
      e.stopPropagation();
    };
    document.addEventListener('click', handle, true);
    document.addEventListener('contextmenu', handle, true);
    return () => {
      document.removeEventListener('click', handle, true);
      document.removeEventListener('contextmenu', handle, true);
    };
  }, [onClose]);

  const menuStyle: Record<string, unknown> = {
    position: 'fixed' as const,
    left: menu.x,
    top: menu.y,
    zIndex: 99999,
    minWidth: '180px',
    background: 'var(--color-bg)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
    padding: '4px 0',
    fontSize: '0.8125rem',
  };

  return (
    <div style={menuStyle}>
      {menu.items.map((item) => (
        <div
          key={item.label}
          onClick={(e) => { e.stopPropagation(); item.onClick(); onClose(); }}
          style={{
            padding: '6px 12px',
            cursor: 'pointer',
            color: 'var(--color-text)',
            transition: 'background 0.1s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'var(--color-bg-tertiary)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
          }}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
}

// ── Markdown Renderer ────────────────────────────────────────────────────

function renderInlineMarkdown(text: string): (string | ReactElement)[] {
  const parts: (string | ReactElement)[] = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyIdx = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) {
      parts.push(<strong key={keyIdx++}>{match[2]}</strong>);
    } else if (match[3]) {
      parts.push(<em key={keyIdx++}>{match[3]}</em>);
    } else if (match[4]) {
      parts.push(
        <code key={keyIdx++} style={{
          background: 'var(--color-bg-tertiary)',
          padding: '1px 4px', borderRadius: '3px',
          fontSize: '0.8em',
        }}>
          {match[4]}
        </code>
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

function MarkdownContent({ text }: { text: string }) {
  const elements = useMemo(() => {
    const lines = text.split('\n');
    const result: ReactElement[] = [];
    let i = 0;
    let key = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Code block
      if (line.trimStart().startsWith('```')) {
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].trimStart().startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        i++; // skip closing ```
        result.push(
          <pre key={key++} style={{
            background: 'var(--color-bg-tertiary)',
            padding: '10px 12px', borderRadius: '6px',
            fontSize: '0.8125rem', lineHeight: 1.5,
            overflowX: 'auto', margin: '8px 0',
            fontFamily: 'monospace',
          }}>
            {codeLines.join('\n')}
          </pre>
        );
        continue;
      }

      // Heading
      const headingMatch = line.match(/^(#{1,4})\s+(.+)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const sizes = ['1.125rem', '1rem', '0.9375rem', '0.875rem'];
        result.push(
          <div key={key++} style={{
            fontSize: sizes[level - 1] || '0.875rem',
            fontWeight: 600, color: 'var(--color-text)',
            margin: `${level <= 2 ? 12 : 8}px 0 4px`,
          }}>
            {renderInlineMarkdown(headingMatch[2])}
          </div>
        );
        i++;
        continue;
      }

      // List item
      if (/^[-*]\s+/.test(line.trim())) {
        const listItems: string[] = [];
        while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
          listItems.push(lines[i].trim().replace(/^[-*]\s+/, ''));
          i++;
        }
        result.push(
          <ul key={key++} style={{
            margin: '6px 0', paddingLeft: '1.25rem',
            lineHeight: 1.7,
          }}>
            {listItems.map((item, li) => (
              <li key={li} style={{ marginBottom: '2px' }}>
                {renderInlineMarkdown(item)}
              </li>
            ))}
          </ul>
        );
        continue;
      }

      // Horizontal rule
      if (/^---+$/.test(line.trim())) {
        result.push(
          <hr key={key++} style={{
            border: 'none',
            borderTop: '1px solid var(--color-border)',
            margin: '8px 0',
          }} />
        );
        i++;
        continue;
      }

      // Empty line
      if (line.trim() === '') {
        i++;
        continue;
      }

      // Paragraph
      const paraLines: string[] = [line];
      i++;
      while (i < lines.length && lines[i].trim() !== '' && !lines[i].match(/^#{1,4}\s/) && !lines[i].trimStart().startsWith('```') && !/^[-*]\s+/.test(lines[i].trim())) {
        paraLines.push(lines[i]);
        i++;
      }
      result.push(
        <p key={key++} style={{ margin: '6px 0', lineHeight: 1.7 }}>
          {renderInlineMarkdown(paraLines.join(' '))}
        </p>
      );
    }

    return result;
  }, [text]);

  return (
    <div style={{ fontSize: '0.8125rem', color: 'var(--color-text)' }}>
      {elements}
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────

interface SourceEntry {
  relativePath: string;
  title: string;
  sourceType: string;
  sourceSystem: string;
  occurredAt: string;
  participants: string[];
  summary: string;
  keyTakeaways: string[];
  durationMinutes?: number;
  description: string;
  sourceUrl?: string;
  relevanceScore?: number;
}

function SystemPill({ system }: { system: string }) {
  const bg = systemColor(system);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 8px', borderRadius: '9999px',
      fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.03em',
      color: '#fff', background: bg, lineHeight: '1.6',
      textTransform: 'uppercase',
    }}>
      {capitalise(system)}
    </span>
  );
}

function SpacePill({ spaceName }: { spaceName: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 8px', borderRadius: '9999px',
      fontSize: '0.625rem', fontWeight: 500, letterSpacing: '0.02em',
      color: 'var(--color-text-secondary)',
      background: 'var(--color-bg-tertiary)',
      border: '1px solid var(--color-border)',
      lineHeight: '1.6',
    }}>
      {spaceName}
    </span>
  );
}

function ParticipantChips({ participants, max }: { participants: string[]; max: number }) {
  const shown = participants.slice(0, max);
  const remaining = participants.length - max;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
      {shown.map((name) => (
        <span
          key={name}
          style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '2px 8px', borderRadius: '9999px',
            fontSize: '0.6875rem', fontWeight: 500,
            background: 'var(--color-bg-tertiary)',
            color: 'var(--color-text-secondary)',
            border: '1px solid var(--color-border)',
          }}
        >
          {name}
        </span>
      ))}
      {remaining > 0 && (
        <span style={{
          fontSize: '0.6875rem', color: 'var(--color-text-tertiary)',
          fontWeight: 500,
        }}>
          +{remaining}
        </span>
      )}
    </div>
  );
}

function DatePresetPills({
  selected, onChange,
}: { selected: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
      {DATE_PRESETS.map((preset) => {
        const isActive = selected === preset.value;
        return (
          <span
            key={preset.value}
            onClick={() => onChange(preset.value)}
            style={{
              padding: '3px 10px', borderRadius: '9999px',
              fontSize: '0.6875rem', fontWeight: 500, cursor: 'pointer',
              background: isActive ? 'var(--color-accent)' : 'var(--color-bg-tertiary)',
              color: isActive ? '#fff' : 'var(--color-text-secondary)',
              border: `1px solid ${isActive ? 'var(--color-accent)' : 'var(--color-border)'}`,
              transition: 'background 0.15s ease, color 0.15s ease',
              userSelect: 'none' as const,
            }}
          >
            {preset.label}
          </span>
        );
      })}
    </div>
  );
}

function StatsBar({ total, thisWeek, isLoading }: {
  total: number;
  thisWeek: number;
  isLoading: boolean;
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
      <Card>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '1.5rem', fontWeight: 700,
            color: 'var(--color-text)',
            lineHeight: 1.2,
          }}>
            {isLoading ? '\u2013' : total}
          </div>
          <div style={{
            fontSize: '0.6875rem', fontWeight: 500,
            color: 'var(--color-text-secondary)',
            marginTop: '2px', textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Total Sources
          </div>
        </div>
      </Card>
      <Card>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '1.5rem', fontWeight: 700,
            color: thisWeek > 0 ? '#22c55e' : 'var(--color-text)',
            lineHeight: 1.2,
          }}>
            {isLoading ? '\u2013' : thisWeek}
          </div>
          <div style={{
            fontSize: '0.6875rem', fontWeight: 500,
            color: 'var(--color-text-secondary)',
            marginTop: '2px', textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            This Week
          </div>
        </div>
      </Card>
    </div>
  );
}

function SourceCard({ source, onClick, onContextMenu }: {
  source: SourceEntry;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}) {
  const snippet = truncateText(source.summary || source.description || 'No summary available.', 160);
  const icon = sourceTypeIcon(source.sourceType);
  const spaceName = extractSpaceName(source.relativePath);

  return (
    <div
      title={source.relativePath}
      onContextMenu={onContextMenu}
    >
      <Card onClick={onClick}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', gap: '8px', marginBottom: '6px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: '1rem', flexShrink: 0 }}>{icon}</span>
            <span style={{
              fontSize: '0.875rem', fontWeight: 600,
              color: 'var(--color-text)', lineHeight: 1.3,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {source.title || 'Untitled Source'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexShrink: 0 }}>
            {spaceName && <SpacePill spaceName={spaceName} />}
            <SystemPill system={source.sourceSystem} />
          </div>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          fontSize: '0.6875rem', color: 'var(--color-text-secondary)',
          marginBottom: '8px', flexWrap: 'wrap',
        }}>
          <span>{formatShortDate(source.occurredAt)}</span>
          <span style={{ opacity: 0.4 }}>&middot;</span>
          <span>{capitalise(source.sourceType)}</span>
          {source.durationMinutes != null && source.durationMinutes > 0 && (
            <>
              <span style={{ opacity: 0.4 }}>&middot;</span>
              <span>{formatDuration(source.durationMinutes)}</span>
            </>
          )}
          {source.relevanceScore != null && (
            <>
              <span style={{ opacity: 0.4 }}>&middot;</span>
              <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
                {Math.round(source.relevanceScore * 100)}% match
              </span>
            </>
          )}
        </div>

        {source.participants.length > 0 && (
          <div style={{ marginBottom: '8px' }}>
            <ParticipantChips participants={source.participants} max={3} />
          </div>
        )}

        <div style={{
          fontSize: '0.8125rem', color: 'var(--color-text-secondary)',
          lineHeight: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical' as const,
          overflow: 'hidden',
        }}>
          {snippet}
        </div>
      </Card>
    </div>
  );
}

function RelatedSources({
  currentPath, source, onSelect,
}: {
  currentPath: string;
  source: SourceEntry;
  onSelect: (source: SourceEntry) => void;
}) {
  const semanticQuery = useMemo(() => {
    const title = source.title?.trim() || '';
    const context = source.summary?.trim().slice(0, 200)
      || source.description?.trim().slice(0, 200)
      || '';
    const query = [title, context].filter(Boolean).join('\n\n').trim();
    return query || null;
  }, [source.title, source.summary, source.description]);

  const skipSearch = !semanticQuery;
  const searchParams = useMemo(
    () => (skipSearch ? { limit: 0 } : { query: semanticQuery ?? '', limit: 12 }),
    [skipSearch, semanticQuery],
  );
  const { sources, isLoading } = useSources(searchParams);

  const related = useMemo(() => {
    if (!semanticQuery) return [];

    return sources
      .filter((s) => s.relativePath !== currentPath)
      .map((s) => {
        const semanticScore = s.relevanceScore ?? 0;
        const participantScore = jaccardSimilarity(source.participants, s.participants);
        const combinedScore = (semanticScore * 0.8) + (participantScore * 0.2);
        return { source: s, combinedScore, semanticScore };
      })
      .sort((a, b) => (
        b.combinedScore - a.combinedScore
        || b.semanticScore - a.semanticScore
      ))
      .slice(0, 4)
      .map((entry) => entry.source);
  }, [sources, currentPath, semanticQuery, source.participants]);

  if (skipSearch || isLoading || related.length === 0) return null;

  return (
    <div>
      <div style={{
        fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase',
        letterSpacing: '0.06em', color: 'var(--color-text-secondary)',
        marginBottom: '8px',
      }}>
        Related Sources
      </div>
      <Stack gap="sm">
        {related.map((s) => (
          <Card key={s.relativePath} onClick={() => onSelect(s)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                  <span style={{ fontSize: '0.875rem' }}>{sourceTypeIcon(s.sourceType)}</span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-text)' }}>
                    {s.title || 'Untitled'}
                  </span>
                </div>
                <div style={{
                  fontSize: '0.6875rem', color: 'var(--color-text-secondary)', marginTop: '2px',
                  paddingLeft: '1.375rem',
                }}>
                  {formatShortDate(s.occurredAt)}
                  {s.durationMinutes != null && s.durationMinutes > 0 && ` \u00b7 ${formatDuration(s.durationMinutes)}`}
                </div>
              </div>
              <SystemPill system={s.sourceSystem} />
            </div>
          </Card>
        ))}
      </Stack>
    </div>
  );
}

function DetailView({
  source, onBack, onNavigateToSource, onOpenInLibrary, onShowContextMenu,
}: {
  source: SourceEntry;
  onBack: () => void;
  onNavigateToSource: (s: SourceEntry) => void;
  onOpenInLibrary: (relativePath: string) => void;
  onShowContextMenu: (e: React.MouseEvent, items: ContextMenuItem[]) => void;
}) {
  const { document: doc, isLoading, error } = useSourceDocument(source.relativePath);
  const [showFullContent, setShowFullContent] = useState(false);
  const { copyText } = useClipboard();
  const rebel = useRebel();

  const displayDoc = doc || source;
  const content = doc?.content || '';
  const isLongContent = content.length > 500;
  const spaceName = extractSpaceName(source.relativePath);

  const handleDetailContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const items: ContextMenuItem[] = [
      { label: 'Open in Library', onClick: () => onOpenInLibrary(source.relativePath) },
      { label: 'Copy Title', onClick: () => { copyText(displayDoc.title || 'Untitled'); rebel.ui.showToast('Title copied'); } },
      { label: 'Copy Path', onClick: () => { copyText(source.relativePath); rebel.ui.showToast('Path copied'); } },
    ];
    if (displayDoc.summary) {
      items.push({ label: 'Copy Summary', onClick: () => { copyText(displayDoc.summary); rebel.ui.showToast('Summary copied'); } });
    }
    if (displayDoc.sourceUrl) {
      items.push({ label: 'Copy Source URL', onClick: () => { copyText(displayDoc.sourceUrl ?? ''); rebel.ui.showToast('URL copied'); } });
    }
    onShowContextMenu(e, items);
  }, [source, displayDoc, copyText, rebel, onOpenInLibrary, onShowContextMenu]);

  return (
    <Stack gap="md">
      <div style={{
        padding: '1rem 1rem 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <Button variant="ghost" onClick={onBack}>
          {'\u2190'} Back
        </Button>
        <Button variant="ghost" onClick={() => onOpenInLibrary(source.relativePath)}>
          Open in Library
        </Button>
      </div>

      <div style={{ padding: '0 1rem 1rem' }}>
        <Stack gap="sm">
          {/* Title and metadata */}
          <div onContextMenu={handleDetailContextMenu}>
            <Card>
              <div style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '1.25rem' }}>{sourceTypeIcon(displayDoc.sourceType)}</span>
                  <h2 style={{
                    fontSize: '1.125rem', fontWeight: 700,
                    margin: 0, lineHeight: 1.3,
                    color: 'var(--color-text)',
                  }}>
                    {displayDoc.title || 'Untitled Source'}
                  </h2>
                </div>
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                flexWrap: 'wrap', marginBottom: '12px',
              }}>
                <SystemPill system={displayDoc.sourceSystem} />
                <Badge variant="outline">{capitalise(displayDoc.sourceType)}</Badge>
                {spaceName && <SpacePill spaceName={spaceName} />}
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                  {formatDate(displayDoc.occurredAt)}
                </span>
                {displayDoc.durationMinutes != null && displayDoc.durationMinutes > 0 && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                    &middot; {formatDuration(displayDoc.durationMinutes)}
                  </span>
                )}
              </div>

              {/* File path */}
              <div style={{
                fontSize: '0.6875rem', color: 'var(--color-text-tertiary)',
                marginBottom: displayDoc.participants.length > 0 ? '12px' : 0,
                fontFamily: 'monospace',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}
                title={source.relativePath}
              >
                {source.relativePath}
              </div>

              {displayDoc.participants.length > 0 && (
                <div>
                  <div style={{
                    fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase',
                    letterSpacing: '0.05em', color: 'var(--color-text-tertiary)',
                    marginBottom: '6px',
                  }}>
                    Participants
                  </div>
                  <ParticipantChips participants={displayDoc.participants} max={10} />
                </div>
              )}
            </Card>
          </div>

          {isLoading && (
            <Card>
              <div style={{
                textAlign: 'center', padding: '1rem 0',
                color: 'var(--color-text-secondary)', fontSize: '0.8125rem',
              }}>
                Loading full document{'\u2026'}
              </div>
            </Card>
          )}

          {error && (
            <Card>
              <div style={{
                color: 'var(--color-text-error, #dc2626)', fontSize: '0.8125rem',
              }}>
                {error}
              </div>
            </Card>
          )}

          {displayDoc.summary && (
            <Card>
              <div style={{
                fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase',
                letterSpacing: '0.06em', color: 'var(--color-text-secondary)',
                marginBottom: '8px',
              }}>
                Summary
              </div>
              <div style={{
                fontSize: '0.8125rem', color: 'var(--color-text)',
                lineHeight: 1.6,
              }}>
                {displayDoc.summary}
              </div>
            </Card>
          )}

          {displayDoc.keyTakeaways && displayDoc.keyTakeaways.length > 0 && (
            <Card>
              <div style={{
                fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase',
                letterSpacing: '0.06em', color: 'var(--color-text-secondary)',
                marginBottom: '8px',
              }}>
                Key Takeaways
              </div>
              <ul style={{
                margin: 0, paddingLeft: '1.25rem',
                fontSize: '0.8125rem', color: 'var(--color-text)',
                lineHeight: 1.7,
              }}>
                {displayDoc.keyTakeaways.map((item, i) => (
                  <li key={i} style={{ marginBottom: '4px' }}>{item}</li>
                ))}
              </ul>
            </Card>
          )}

          {content && (
            <Card>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: showFullContent ? '10px' : 0,
              }}>
                <div style={{
                  fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase',
                  letterSpacing: '0.06em', color: 'var(--color-text-secondary)',
                }}>
                  Full Content
                </div>
                {isLongContent && (
                  <Button variant="ghost" onClick={() => setShowFullContent(!showFullContent)}>
                    {showFullContent ? 'Collapse' : 'Expand'}
                  </Button>
                )}
              </div>
              {(showFullContent || !isLongContent) && (
                <div style={{ maxHeight: '500px', overflow: 'auto' }}>
                  <MarkdownContent text={content} />
                </div>
              )}
              {!showFullContent && isLongContent && (
                <div style={{
                  fontSize: '0.8125rem', color: 'var(--color-text-secondary)',
                  lineHeight: 1.6, marginTop: '4px',
                }}>
                  {truncateText(content, 200)}
                </div>
              )}
            </Card>
          )}

          {displayDoc.sourceUrl && (
            <Card>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  flex: 1, minWidth: 0,
                }}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', flexShrink: 0 }}>
                    Source:
                  </span>
                  <span style={{
                    fontSize: '0.8125rem', color: 'var(--color-accent)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {displayDoc.sourceUrl}
                  </span>
                </div>
              </div>
            </Card>
          )}

          <RelatedSources
            currentPath={source.relativePath}
            source={source}
            onSelect={onNavigateToSource}
          />
        </Stack>
      </div>
    </Stack>
  );
}

// ── Sort Helper ──────────────────────────────────────────────────────────

function sortSources(sources: SourceEntry[], sortBy: SortOption): SourceEntry[] {
  if (sortBy === 'relevance') return sources;
  const sorted = [...sources];
  if (sortBy === 'recent') {
    sorted.sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
  } else if (sortBy === 'oldest') {
    sorted.sort((a, b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime());
  } else if (sortBy === 'alphabetical') {
    sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  }
  return sorted;
}

// ── Main Component ───────────────────────────────────────────────────────

export default function SourcesBrowser() {
  const rebel = useRebel();
  const { copyText } = useClipboard();
  const [selectedSource, setSelectedSource] = useState<SourceEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [datePreset, setDatePreset] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  const weekAgo = useMemo(() => weekAgoStr(), []);
  const { totalCount: totalSourceCount, isLoading: statsLoading } = useSources({ limit: 1 });
  const { totalCount: weekSourceCount } = useSources({
    dateRange: { after: weekAgo },
    limit: 1,
  });

  const mainParams = useMemo(() => {
    const p: {
      query?: string;
      sourceTypes?: string[];
      dateRange?: { after?: string; before?: string };
      limit?: number;
    } = { limit: 50 };

    if (searchQuery.trim()) p.query = searchQuery.trim();
    if (typeFilter) p.sourceTypes = [typeFilter];

    const range = getDateRangeFor(datePreset);
    if (range) p.dateRange = range;

    return p;
  }, [searchQuery, typeFilter, datePreset]);

  const { sources, totalCount, isLoading, error } = useSources(mainParams);

  const effectiveSortBy = searchQuery.trim() && sortBy !== 'relevance' ? sortBy : (searchQuery.trim() ? 'relevance' : sortBy);
  const sortedSources = useMemo(
    () => sortSources(sources, effectiveSortBy),
    [sources, effectiveSortBy],
  );

  const handleOpenInLibrary = useCallback((relativePath: string) => {
    rebel.navigate.toLibrary(relativePath);
  }, [rebel]);

  const handleShowContextMenu = useCallback((e: React.MouseEvent, items: ContextMenuItem[]) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, items });
  }, []);

  const handleSourceContextMenu = useCallback((e: React.MouseEvent, source: SourceEntry) => {
    e.preventDefault();
    const items: ContextMenuItem[] = [
      { label: 'Open in Library', onClick: () => handleOpenInLibrary(source.relativePath) },
      { label: 'Copy Title', onClick: () => { copyText(source.title || 'Untitled'); rebel.ui.showToast('Title copied'); } },
      { label: 'Copy Path', onClick: () => { copyText(source.relativePath); rebel.ui.showToast('Path copied'); } },
    ];
    if (source.summary) {
      items.push({ label: 'Copy Summary', onClick: () => { copyText(source.summary); rebel.ui.showToast('Summary copied'); } });
    }
    setContextMenu({ x: e.clientX, y: e.clientY, items });
  }, [handleOpenInLibrary, copyText, rebel]);

  const closeContextMenu = useCallback(() => setContextMenu(null), []);

  if (selectedSource) {
    return (
      <>
        <DetailView
          source={selectedSource}
          onBack={() => setSelectedSource(null)}
          onNavigateToSource={setSelectedSource}
          onOpenInLibrary={handleOpenInLibrary}
          onShowContextMenu={handleShowContextMenu}
        />
        {contextMenu && <ContextMenuOverlay menu={contextMenu} onClose={closeContextMenu} />}
      </>
    );
  }

  const hasFilters = searchQuery.trim() || typeFilter || datePreset !== 'all';
  const hasSearch = !!searchQuery.trim();

  return (
    <>
      <Stack gap="md">
        <div style={{ padding: '1rem 1rem 0' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>Sources Browser</h2>
          <p style={{
            color: 'var(--color-text-secondary)', fontSize: '0.8125rem',
            margin: '0.25rem 0 0',
          }}>
            Browse and search your meeting notes, recordings, and imported sources.
          </p>
        </div>

        <div style={{ padding: '0 1rem 1rem' }}>
          <Stack gap="sm">
            <StatsBar
              total={totalSourceCount}
              thisWeek={weekSourceCount}
              isLoading={statsLoading}
            />

            <Card>
              <Stack gap="sm">
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search sources..."
                    />
                  </div>
                  <div style={{ minWidth: '120px' }}>
                    <Select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                    >
                      {SOURCE_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </Select>
                  </div>
                </div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  flexWrap: 'wrap', gap: '8px',
                }}>
                  <DatePresetPills selected={datePreset} onChange={setDatePreset} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{
                      fontSize: '0.6875rem', color: 'var(--color-text-tertiary)',
                      fontWeight: 500, whiteSpace: 'nowrap',
                    }}>
                      Sort:
                    </span>
                    <Select
                      value={effectiveSortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                    >
                      {SORT_OPTIONS.filter(o => o.value !== 'relevance' || hasSearch).map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </Select>
                  </div>
                </div>
              </Stack>
            </Card>

            {hasFilters && !isLoading && (
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                fontSize: '0.75rem', color: 'var(--color-text-secondary)',
                padding: '0 2px',
              }}>
                <span>
                  {totalCount} result{totalCount !== 1 ? 's' : ''}
                  {searchQuery.trim() ? ` for \u201c${searchQuery.trim()}\u201d` : ''}
                </span>
                <span
                  onClick={() => {
                    setSearchQuery('');
                    setTypeFilter('');
                    setDatePreset('all');
                    setSortBy('recent');
                  }}
                  style={{
                    cursor: 'pointer',
                    color: 'var(--color-accent)',
                    fontWeight: 500,
                  }}
                >
                  Clear filters
                </span>
              </div>
            )}

            {isLoading && (
              <Card>
                <div style={{
                  textAlign: 'center', padding: '1.5rem 0',
                  color: 'var(--color-text-secondary)', fontSize: '0.8125rem',
                }}>
                  {searchQuery.trim() ? 'Searching\u2026' : 'Loading sources\u2026'}
                </div>
              </Card>
            )}

            {error && (
              <Card>
                <div style={{
                  color: 'var(--color-text-error, #dc2626)', fontSize: '0.8125rem',
                }}>
                  {error}
                </div>
              </Card>
            )}

            {!isLoading && sortedSources.length > 0 && sortedSources.map((source) => (
              <SourceCard
                key={source.relativePath}
                source={source}
                onClick={() => setSelectedSource(source)}
                onContextMenu={(e) => handleSourceContextMenu(e, source)}
              />
            ))}

            {!isLoading && !error && sources.length === 0 && (
              <Card>
                <div style={{
                  textAlign: 'center', padding: '2rem 0',
                }}>
                  <div style={{
                    fontSize: '2rem', marginBottom: '12px', opacity: 0.8,
                  }}>
                    {hasFilters ? '\ud83d\udd0d' : '\ud83d\udcc2'}
                  </div>
                  <div style={{
                    fontSize: '0.875rem', fontWeight: 600,
                    color: 'var(--color-text)', marginBottom: '6px',
                  }}>
                    {hasFilters ? 'No matching sources' : 'No sources yet'}
                  </div>
                  <div style={{
                    fontSize: '0.8125rem',
                    color: 'var(--color-text-secondary)',
                    maxWidth: '280px', margin: '0 auto', lineHeight: 1.5,
                  }}>
                    {hasFilters
                      ? 'Try adjusting your search or filters.'
                      : 'Sources will appear here when you add meeting notes, recordings, or other imports to your workspace.'}
                  </div>
                  {hasFilters && (
                    <div style={{ marginTop: '12px' }}>
                      <Button variant="ghost" onClick={() => {
                        setSearchQuery('');
                        setTypeFilter('');
                        setDatePreset('all');
                        setSortBy('recent');
                      }}>
                        Clear all filters
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </Stack>
        </div>
      </Stack>
      {contextMenu && <ContextMenuOverlay menu={contextMenu} onClose={closeContextMenu} />}
    </>
  );
}
