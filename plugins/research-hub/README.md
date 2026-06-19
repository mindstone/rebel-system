# Research Hub

A search bar that looks across the things Rebel already knows about — your files, your memories, your past conversations — and tells you which ones are most likely to be relevant.

## What it does

- Searches your workspace files and memories semantically (meaning, not just keywords)
- Surfaces conversations that touched on the same topic, in case you want to pick one back up
- Remembers your recent searches so you don't have to type the same thing twice

## When to use it

When you remember the gist of something but not where you wrote it down. When you're starting fresh on a topic and want a fast skim of what you already know. When "did past-you ever look into this?" is the question.

## Data and control

This plugin only searches data that's already in your workspace. It doesn't send anything to the internet and doesn't share results with anyone. Recent searches are stored locally and only on your machine. Turn it off, edit it, fork it, or delete your copy from the Library lens whenever you want.

## For tinkerers

This started as a Rebel built-in plugin. Your editable copy is at `Chief-of-Staff/plugins/research-hub/`. The source uses `useMemorySearch` and `useConversations` — useful starting points if you want to build your own search-anything UI. Yours to edit, fork, or delete.
