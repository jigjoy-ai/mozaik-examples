## Mozaik Examples

This repository contains **a single, up-to-date example** for the latest major version of `@mozaik-ai/core` (v2+), reflecting the library’s new architecture.

The example demonstrates how to:

- define a custom `GenerativeModel` adapter (OpenAI `responses` API in this repo)
- build a `Context` (developer + user messages)
- persist/restore context via a `ContextRepository` (in-memory in this repo)

### Prerequisites

- Node.js 18+

### Install

```bash
npm install
```

### Environment

Create a `.env` file in the project root and add your provider credentials as needed. This example uses OpenAI:

```bash
OPENAI_API_KEY=...
```

### Run

Run the example directly with `tsx`:

```bash
npx tsx example.ts
```

### Files

- `example.ts` — runnable example
- `in-memory-context-repository.ts` — minimal `ContextRepository` implementation used by the example
