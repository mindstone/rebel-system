# Common Plugin Patterns

> The snippets below show the underlying patterns. For full production references, read the bundled plugins directly:
> - `rebel-system/plugins/pomodoro-timer/index.tsx` (display name: "Focus Timer") — minimal lifecycle + storage
> - `rebel-system/plugins/research-hub/index.tsx` — LLM + conversation composition
> - `rebel-system/plugins/sources-browser/index.tsx` (display name: "My Sources", `role: 'hero'`) — full hero/dashboard surface

## Stats Dashboard

Derive statistics from conversation data:

```tsx
import { useConversations } from '@rebel/plugin-api';
import { Card, Stack, Badge } from '@rebel/plugin-ui';

export default function QuickStats() {
  const { data: conversations } = useConversations();
  const activeCount = conversations.filter(c => c.isBusy).length;
  const today = new Date();
  const todayCount = conversations.filter(c =>
    new Date(c.updatedAt).toDateString() === today.toDateString()
  ).length;

  return (
    <Stack gap="md">
      <div style={{ padding: '1rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Quick Stats</h2>
        <Stack gap="sm">
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem' }}>Total conversations</span>
              <Badge>{conversations.length}</Badge>
            </div>
          </Card>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem' }}>Active now</span>
              <Badge variant={activeCount > 0 ? 'secondary' : 'outline'}>{activeCount}</Badge>
            </div>
          </Card>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem' }}>Updated today</span>
              <Badge>{todayCount}</Badge>
            </div>
          </Card>
        </Stack>
      </div>
    </Stack>
  );
}
```

## Timer with Lifecycle

Focus timer using `rebel.lifecycle.registerInterval()` for auto-cleanup. This is the underlying pattern behind the bundled "Focus Timer" plugin (`rebel-system/plugins/pomodoro-timer/index.tsx`); read that file for the full reference including session counters, completion animation, and `usePluginStorage` persistence.

```tsx
import { useEffect, useRef, useState } from 'react';
import { useRebel } from '@rebel/plugin-api';
import { Badge, Button, Card, Stack } from '@rebel/plugin-ui';

const WORK_SECONDS = 25 * 60;

function formatTime(s: number): string {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

export default function FocusTimer() {
  const rebel = useRebel();
  const [seconds, setSeconds] = useState(WORK_SECONDS);
  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);

  useEffect(() => { runningRef.current = running; }, [running]);

  useEffect(() => {
    rebel.lifecycle.registerInterval(() => {
      if (!runningRef.current) return;
      setSeconds(s => (s > 0 ? s - 1 : 0));
    }, 1000);
  }, [rebel]);

  useEffect(() => {
    if (seconds === 0 && running) setRunning(false);
  }, [seconds, running]);

  return (
    <Stack gap="md">
      <div style={{ padding: '1rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Focus Timer</h2>
        <Card>
          <Stack gap="sm">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Status</span>
              <Badge variant={running ? 'secondary' : 'outline'}>
                {running ? 'Running' : seconds === 0 ? 'Complete' : 'Paused'}
              </Badge>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>{formatTime(seconds)}</div>
          </Stack>
        </Card>
        <Stack gap="sm" direction="row">
          <Button onClick={() => setRunning(true)} disabled={running || seconds === 0}>Start</Button>
          <Button onClick={() => setRunning(false)} variant="secondary" disabled={!running}>Stop</Button>
          <Button onClick={() => { setRunning(false); setSeconds(WORK_SECONDS); }} variant="ghost">Reset</Button>
        </Stack>
      </div>
    </Stack>
  );
}
```

## Source Browser with Tabs

Browse memory sources with search, using Tabs for organization. This is the underlying pattern behind the bundled "My Sources" plugin (`rebel-system/plugins/sources-browser/index.tsx`, `role: 'hero'`); read that file for the full hero-class reference including entity filters, document preview, and pagination.

```tsx
import { useState } from 'react';
import { useSources, useSourceDocument, useClipboard } from '@rebel/plugin-api';
import { Card, Stack, Input, Badge, Tabs, TabsList, TabsTrigger, TabsContent, Button, LoadingCard } from '@rebel/plugin-ui';

export default function SourceBrowser() {
  const [query, setQuery] = useState('');
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const { sources, isLoading } = useSources({ query: query || undefined });
  const { document: doc } = useSourceDocument(selectedPath ?? '');
  const { copyText } = useClipboard();

  return (
    <Stack gap="md">
      <div style={{ padding: '1rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Sources</h2>
        <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search sources..." />
      </div>
      <Tabs defaultValue="list">
        <TabsList variant="underline">
          <TabsTrigger value="list">Browse</TabsTrigger>
          <TabsTrigger value="detail">Detail</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <div style={{ padding: '0 1rem 1rem' }}>
            {isLoading ? <LoadingCard /> : (
              <Stack gap="sm">
                {sources.map(s => (
                  <Card key={s.relativePath} onClick={() => setSelectedPath(s.relativePath)}>
                    <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{s.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                      {s.sourceType} · {new Date(s.occurredAt).toLocaleDateString()}
                    </div>
                    {s.participants.length > 0 && (
                      <div style={{ marginTop: '0.25rem' }}>
                        {s.participants.slice(0, 3).map(p => <Badge key={p} variant="outline">{p}</Badge>)}
                      </div>
                    )}
                  </Card>
                ))}
              </Stack>
            )}
          </div>
        </TabsContent>
        <TabsContent value="detail">
          <div style={{ padding: '0 1rem 1rem' }}>
            {doc ? (
              <Card>
                <h3 style={{ fontWeight: 600 }}>{doc.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{doc.summary}</p>
                <Button variant="ghost" onClick={() => copyText(doc.content)}>Copy content</Button>
              </Card>
            ) : (
              <Card><span style={{ color: 'var(--color-text-secondary)' }}>Select a source to view details</span></Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Stack>
  );
}
```

## Event-Driven Analytics

Track conversation patterns using lifecycle events:

```tsx
import { useState } from 'react';
import { useRebelEvent, usePluginStorage } from '@rebel/plugin-api';
import { Card, Stack, Badge } from '@rebel/plugin-ui';

export default function TurnTracker() {
  const [todayCount, setTodayCount] = usePluginStorage('today-turns', 0);
  const [lastTurn, setLastTurn] = useState<string | null>(null);

  useRebelEvent('turn:completed', (payload: any) => {
    setTodayCount(c => c + 1);
    setLastTurn(payload.assistantText?.slice(0, 100) ?? null);
  });

  return (
    <Stack gap="md">
      <div style={{ padding: '1rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Turn Tracker</h2>
        <Stack gap="sm">
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Turns today</span>
              <Badge>{todayCount}</Badge>
            </div>
          </Card>
          {lastTurn && (
            <Card>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Last response preview</span>
              <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>{lastTurn}...</p>
            </Card>
          )}
        </Stack>
      </div>
    </Stack>
  );
}
```

## Dialog Pattern

Use Dialog for confirmations or detail views:

```tsx
import { useState } from 'react';
import { useRebel } from '@rebel/plugin-api';
import { Button, Card, Stack, Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@rebel/plugin-ui';

export default function ActionPlugin() {
  const rebel = useRebel();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleAction = () => {
    rebel.ui.showToast('Action completed!', { variant: 'success' });
    setShowConfirm(false);
  };

  return (
    <Stack gap="md">
      <div style={{ padding: '1rem' }}>
        <Card>
          <Button onClick={() => setShowConfirm(true)}>Do something</Button>
        </Card>
      </div>
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent size="sm">
          <DialogHeader onClose={() => setShowConfirm(false)}>
            <DialogTitle>Confirm Action</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <p style={{ fontSize: '0.875rem' }}>Are you sure you want to proceed?</p>
          </DialogBody>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowConfirm(false)}>Cancel</Button>
            <Button onClick={handleAction}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Stack>
  );
}
```
