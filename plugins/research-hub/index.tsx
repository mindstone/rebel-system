import { useMemo, useState, useCallback } from 'react';
import { useConversations, useRebel, useMemorySearch, usePluginStorage } from '@rebel/plugin-api';
import { Badge, Button, Card, Input, Stack } from '@rebel/plugin-ui';

const MAX_RECENT_SEARCHES = 8;

function ScoreBar({ score }: { score: number }) {
  const pct = Math.min(100, Math.round(score * 100));
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <div style={{
        flex: 1, height: '4px', borderRadius: '2px',
        background: 'var(--color-bg-tertiary)', overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', width: `${pct}%`, borderRadius: '2px',
          background: pct > 70 ? '#22c55e' : pct > 40 ? 'var(--color-accent)' : 'var(--color-text-secondary)',
          transition: 'width 0.3s ease',
        }} />
      </div>
      <span style={{ fontSize: '0.625rem', color: 'var(--color-text-secondary)', minWidth: '28px', textAlign: 'right' }}>
        {pct}%
      </span>
    </div>
  );
}

export default function ResearchHub() {
  const { data: conversations } = useConversations();
  const rebel = useRebel();
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = usePluginStorage<string[]>('recent-searches', []);
  const { results, isLoading, error, status } = useMemorySearch(query);

  const handleSearch = useCallback((term: string) => {
    setQuery(term);
    if (term.trim()) {
      setRecentSearches(
        [term.trim(), ...recentSearches.filter(s => s !== term.trim())].slice(0, MAX_RECENT_SEARCHES),
      );
    }
  }, [recentSearches, setRecentSearches]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      handleSearch(query);
    }
  }, [query, handleSearch]);

  const relatedConversations = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const words = q.split(/\s+/).filter(w => w.length > 2);
    if (words.length === 0) return [];
    return conversations
      .filter(c => {
        const title = (c.title || '').toLowerCase();
        return words.some(w => title.includes(w));
      })
      .slice(0, 5);
  }, [conversations, query]);

  const showResults = query.trim().length > 0;

  return (
    <Stack gap="md">
      <div style={{ padding: '1rem 1rem 0' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>Research Hub</h2>
        <p style={{
          color: 'var(--color-text-secondary)', fontSize: '0.8125rem',
          margin: '0.25rem 0 0',
        }}>
          Search your workspace knowledge, then jump into a conversation to discuss what you find.
        </p>
      </div>

      <div style={{ padding: '0 1rem 1rem' }}>
        <Stack gap="sm">
          <Card>
            <Stack gap="sm">
              <Input
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search your files and memories..."
              />
              {query.trim() && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                    {isLoading ? 'Searching...' : `${results.length} result${results.length !== 1 ? 's' : ''}`}
                  </span>
                  {query.trim() && (
                    <Button variant="ghost" onClick={() => setQuery('')}>Clear</Button>
                  )}
                </div>
              )}
            </Stack>
          </Card>

          {error && (
            <Card>
              <div style={{ color: 'var(--color-text-error, #dc2626)', fontSize: '0.8125rem' }}>
                {error}
              </div>
            </Card>
          )}

          {showResults && results.length > 0 && (
            <>
              <div style={{
                fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase',
                letterSpacing: '0.06em', color: 'var(--color-text-secondary)',
                padding: '0.25rem 0',
              }}>
                Files &amp; Knowledge
              </div>
              {results.map((r, i) => (
                <Card key={`${r.filePath}-${i}`}>
                  <div style={{ marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                      {r.title || r.filePath.split('/').pop()}
                    </span>
                  </div>
                  <div style={{
                    fontSize: '0.75rem', color: 'var(--color-text-secondary)',
                    marginBottom: '6px', lineHeight: 1.4,
                    display: '-webkit-box', WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {r.snippet || r.filePath}
                  </div>
                  <ScoreBar score={r.score} />
                </Card>
              ))}
            </>
          )}

          {showResults && relatedConversations.length > 0 && (
            <>
              <div style={{
                fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase',
                letterSpacing: '0.06em', color: 'var(--color-text-secondary)',
                padding: '0.5rem 0 0.25rem',
              }}>
                Related Conversations
              </div>
              {relatedConversations.map(c => (
                <Card key={c.id} onClick={() => rebel.conversations.open(c.id)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                        {c.title || 'Untitled'}
                      </div>
                      <div style={{
                        fontSize: '0.6875rem', color: 'var(--color-text-secondary)',
                        marginTop: '2px',
                      }}>
                        {new Date(c.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                    {c.isBusy && <Badge variant="secondary">Active</Badge>}
                  </div>
                </Card>
              ))}
            </>
          )}

          {showResults && !isLoading && status === 'index_not_ready' && (
            <Card>
              <p style={{
                color: 'var(--color-text-secondary)', fontSize: '0.8125rem',
                margin: 0, textAlign: 'center', padding: '0.5rem 0',
              }}>
                Your workspace is being indexed. Search will be available shortly.
              </p>
            </Card>
          )}

          {showResults && !isLoading && status === 'embedding_not_ready' && (
            <Card>
              <p style={{
                color: 'var(--color-text-secondary)', fontSize: '0.8125rem',
                margin: 0, textAlign: 'center', padding: '0.5rem 0',
              }}>
                Search is warming up. This usually takes a few seconds after launch.
              </p>
            </Card>
          )}

          {showResults && !isLoading && status === 'error' && !error && (
            <Card>
              <p style={{
                color: 'var(--color-text-secondary)', fontSize: '0.8125rem',
                margin: 0, textAlign: 'center', padding: '0.5rem 0',
              }}>
                Something went wrong with search. Try again in a moment.
              </p>
            </Card>
          )}

          {showResults && !isLoading && status === 'ok' && results.length === 0 && relatedConversations.length === 0 && (
            <Card>
              <p style={{
                color: 'var(--color-text-secondary)', fontSize: '0.8125rem',
                margin: 0, textAlign: 'center', padding: '0.5rem 0',
              }}>
                No results found. Try different keywords.
              </p>
            </Card>
          )}

          {!showResults && recentSearches.length > 0 && (
            <>
              <div style={{
                fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase',
                letterSpacing: '0.06em', color: 'var(--color-text-secondary)',
                padding: '0.25rem 0', display: 'flex', justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span>Recent Searches</span>
                <Button variant="ghost" onClick={() => setRecentSearches([])}>
                  Clear
                </Button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {recentSearches.map(term => (
                  <span
                    key={term}
                    onClick={() => { setQuery(term); handleSearch(term); }}
                    style={{
                      padding: '4px 10px', borderRadius: '9999px',
                      fontSize: '0.75rem', cursor: 'pointer',
                      background: 'var(--color-bg-tertiary)',
                      color: 'var(--color-text-secondary)',
                      border: '1px solid var(--color-border)',
                      transition: 'background 0.15s ease, color 0.15s ease',
                    }}
                    onMouseEnter={e => {
                      (e.target as HTMLSpanElement).style.background = 'var(--color-accent)';
                      (e.target as HTMLSpanElement).style.color = '#fff';
                    }}
                    onMouseLeave={e => {
                      (e.target as HTMLSpanElement).style.background = 'var(--color-bg-tertiary)';
                      (e.target as HTMLSpanElement).style.color = 'var(--color-text-secondary)';
                    }}
                  >
                    {term}
                  </span>
                ))}
              </div>
            </>
          )}

          {!showResults && recentSearches.length === 0 && (
            <Card>
              <p style={{
                color: 'var(--color-text-secondary)', fontSize: '0.8125rem',
                margin: 0, textAlign: 'center', padding: '1rem 0',
              }}>
                Search your workspace files and memories to find what you need, then jump into a conversation to act on it.
              </p>
            </Card>
          )}
        </Stack>
      </div>
    </Stack>
  );
}
