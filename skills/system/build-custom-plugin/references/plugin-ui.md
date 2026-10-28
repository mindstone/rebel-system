# Plugin UI Reference (`@rebel/plugin-ui`)

> **Canonical source:** `src/renderer/features/plugins/declarations/rebel-plugin-ui.d.ts`

All components are themed and work in both light and dark modes.

## Layout

### Stack
Flexbox layout container.
```tsx
<Stack gap="md" direction="column">  {/* or "row" */}
  <Card>...</Card>
  <Card>...</Card>
</Stack>
```
Props: `gap` ('sm'|'md'|'lg'), `direction` ('column'|'row'), `children`

## Core Components

### Button
```tsx
<Button variant="default" onClick={handleClick} disabled={false}>
  Click me
</Button>
```
Props: `variant` ('default'|'secondary'|'ghost'|'destructive'), `onClick`, `disabled`, `children`

### Card
```tsx
<Card onClick={handleClick} className="custom-class">
  <span>Content here</span>
</Card>
```
Props: `onClick`, `className`, `children`

### Input
```tsx
<Input value={text} onChange={e => setText(e.target.value)} placeholder="Search..." type="text" />
```
Props: `value`, `onChange`, `placeholder`, `disabled`, `type`

### Textarea
```tsx
<Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Write notes..." rows={4} />
```
Props: `value`, `onChange`, `placeholder`, `disabled`, `rows`

### Badge
```tsx
<Badge variant="secondary">Active</Badge>
```
Props: `variant` ('default'|'secondary'|'destructive'|'outline'), `children`

### Select
```tsx
<Select value={selected} onChange={e => setSelected(e.target.value)}>
  <option value="a">Option A</option>
  <option value="b">Option B</option>
</Select>
```
Props: `value`, `onChange`, `children`, `disabled`

## Feedback Components

### LoadingCard
Centered spinner in a card. No props.
```tsx
if (isLoading) return <LoadingCard />;
```

### ErrorCard
Themed error display.
```tsx
<ErrorCard title="Something went wrong" message="Could not load data." />
```
Props: `title`, `message`

## Tabs

```tsx
<Tabs defaultValue="overview">
  <TabsList variant="underline">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="details">Details</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Overview content</TabsContent>
  <TabsContent value="details">Details content</TabsContent>
</Tabs>
```

- **Tabs:** `defaultValue`, `value`, `onValueChange`, `children`
- **TabsList:** `variant` ('default'|'pills'|'underline'), `children`
- **TabsTrigger:** `value` (required), `children`
- **TabsContent:** `value` (required), `children`

## Dialog

```tsx
const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open Dialog</Button>
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent size="md">
    <DialogHeader onClose={() => setOpen(false)}>
      <DialogTitle>Confirm Action</DialogTitle>
      <DialogDescription>Are you sure?</DialogDescription>
    </DialogHeader>
    <DialogBody>
      <p>Dialog body content here.</p>
    </DialogBody>
    <DialogFooter>
      <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      <Button onClick={handleConfirm}>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

- **Dialog:** `open`, `onOpenChange`, `children`
- **DialogContent:** `size` ('sm'|'md'|'lg'), `children`
- **DialogHeader:** `onClose`, `children`
- **DialogTitle/Description/Body/Footer:** `children`

## Charts and data

Import these components from `@rebel/plugin-ui`. Charts follow the theme and load their drawing library on demand. Labels and titles are plain text.

### Chart
Draw one of eight types: `line`, `bar`, `area`, `combo`, `scatter`, `heatmap`, `pie`, `funnel`.
Props: `chart: ChartSpec`, `height?` (280), `className?`.

```tsx
<Chart chart={{ type: 'line', title: 'Revenue', categories: ['Jan', 'Feb'], series: [{ name: 'Revenue', values: [120, 135] }], format: { style: 'currency', currency: 'USD', decimals: 0 } }} />
```

Line, bar, area and combo use categories and equal-length series values (`number | null`). Combo series may set `type: 'bar' | 'line'` and `axis: 'left' | 'right'`. Scatter uses series of `[x, y]` points. Heatmap uses `xCategories`, `yCategories` and rows of values (one per y category). Pie and funnel use `slices: { label, value }[]`. Chart and table sections accept `width: 'half' | 'full'` (full by default).

### KpiTile
Show a key figure and optional change. Props: `tile` with `label`, `value`, optional `format`, `change`, `trend: 'up' | 'down' | 'flat'`, `sentiment: 'good' | 'bad' | 'neutral'`. Sentiment controls colour independently of direction.

```tsx
<KpiTile tile={{ label: 'Sales cycle', value: '28 days', change: '4 days fewer vs Q2', trend: 'down', sentiment: 'good' }} />
```

### Dashboard
Arrange tiles, charts and tables in responsive cards. Props: `view` with `title`, optional `subtitle` and `sections`.

```tsx
<Dashboard view={{ title: 'Monthly overview', sections: [
  { type: 'kpis', tiles: [{ label: 'Deals', value: 24 }] },
  { type: 'bar', title: 'Deals by region', categories: ['North', 'South'], series: [{ name: 'Deals', values: [14, 10] }] },
  { type: 'table', columns: [{ label: 'Region' }, { label: 'Deals', align: 'right' }], rows: [['North', 14], ['South', 10]] }
] }} />
```

### DataTable
Sort, filter and page through records. Props: `columns: { key, label, sortable?, align?, format? }[]`, `rows: Record<string, string | number>[]`, `pageSize?` (10). Sorting uses raw values. Missing cells show “—”. There is no row-click callback.

```tsx
<DataTable columns={[{ key: 'name', label: 'Name', sortable: true }]} rows={[{ name: 'Ada' }]} pageSize={10} />
```

### BarChart
Shortcut for labelled bars, including negative values. Props: `data: { label, value, color? }[]`, `height?` (220), `showLabels?` (true).

```tsx
<BarChart data={[{ label: 'Jan', value: 120 }, { label: 'Feb', value: -35 }]} />
```

### LineChart
Shortcut for a line with optional dots. Props: `data: { label, value }[]`, `height?` (220), `showDots?` (true), `color?`.

```tsx
<LineChart data={[{ label: 'Jan', value: 120 }, { label: 'Feb', value: 135 }]} showDots={false} />
```

### PieChart
Shortcut for a pie with a label, value and percentage legend. Props: `data: { label, value, color? }[]`, `size?` (220), `showLabels?` (true). Non-positive or non-finite slices are omitted.

```tsx
<PieChart data={[{ label: 'North', value: 60 }, { label: 'South', value: 40 }]} />
```

Formats use `{ style: 'number' | 'percent', decimals? }` or `{ style: 'currency', currency, decimals? }`. Currency requires a three-letter code, such as `USD`. Percent values are fractions (`0.25` means 25%). `decimals` is 0–4. Shortcut colours accept CSS literals or a custom property such as `var(--color-chart-1)`. Standard chart specs use the shared palette and have no colour field.
