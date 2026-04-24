## Mozaik Examples

This repository contains runnable examples for `@mozaik-ai/core`.

## Standup Comedy (`standup-comedy/`)

This example focuses on **core framework concepts**:

- **Non-blocking agent execution**: an `AgentSociety` starts a lightweight loop and agents are triggered without blocking your process on a single synchronous call.
- **Visiting the agent loop**: it shows an easy way to “visit” inference by attaching an `InferenceVisitor`.
  - The included `TimeCounter` visitor measures and prints inference duration, and keeps a running total.
- **Hooking into lifecycle**: `JokeTellerAgent` registers runtime hook handlers so you can observe/extend the agent loop at key points.

### Prerequisites

- Node.js 18+

### Install

```bash
npm install
```

### Environment

Create a `.env` file in the project root and add your provider credentials as needed. The standup example uses OpenAI:

```bash
OPENAI_API_KEY=...
```

### Run

Run the standup example directly with `tsx`:

```bash
npx tsx standup-comedy/standup.ts
```

### Files

- `standup-comedy/standup.ts` — entrypoint wiring runtime, agent, visitor, model, and context
- `standup-comedy/joke-teller.ts` — agent implementation + runtime hook handlers
- `standup-comedy/time-counter.ts` — `InferenceVisitor` timer example
- `standup-comedy/agent-society.ts` — minimal non-blocking “society” loop/orchestration
