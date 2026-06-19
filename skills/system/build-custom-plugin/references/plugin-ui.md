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
