## Mosaic Examples

This example project showcases how to use @jigjoy-io/mosaic to send unified requests when interacting with both OpenAI and Anthropic models.

### Prerequisites
- Node.js 18+

### Install

```bash
npm install
```

### Environment
Create a `.env` in the project root and add any provider API keys you plan to use (e.g., `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`). The examples load env vars via `dotenv`.

### Run
- Quick start (runs the Anthropic simple prompt example):

```bash
npm run dev
```

- Build and run the compiled `index.ts`:

```bash
npm run build
node dist/index.js
```

- Run any example directly (without building) using `tsx`:

```bash
npx tsx anthropic/simple-prompt.ts
npx tsx anthropic/vision.ts
npx tsx anthropic/multi-turn-conversation.ts
npx tsx anthropic/complex-reasoning.ts
npx tsx openai/simple-prompt.ts
npx tsx structured-output/anthropic-example.ts
npx tsx structured-output/openai-example.ts
npx tsx tools/write-file.ts
npx tsx parallel/parallel-agents.ts
```

### Project Structure
- `anthropic/` — Anthropic-specific examples
- `openai/` — OpenAI-specific examples
- `parallel/` — Parallel execution examples using Promise.all()
- `tools/` — Tool-calling examples