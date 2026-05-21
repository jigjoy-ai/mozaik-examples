# Mozaik Examples

This repository contains small, runnable TypeScript examples built with [`@mozaik-ai/core`](https://www.npmjs.com/package/@mozaik-ai/core).

The code currently focuses on three example projects:

- `agentic-environment/` — a minimal reactive environment with participants, shared context, inference, and a simple tool call
- `terminal-agent/` — a terminal-capable agent that can run shell commands and use the results to complete tasks
- `inference-interception/` — two streaming agents plus an observer; a safety reviewer intercepts the planner’s stream in real time

## Prerequisites

- Node.js 18+
- An OpenAI API key for examples that use `OpenAIInferenceRunner`

## Install

```bash
npm install
```

## Environment

Create a `.env` file in the project root:

```bash
OPENAI_API_KEY=your_api_key_here
```

## Examples

### 1. Agentic Environment (`agentic-environment/`)

A small example that demonstrates the core Mozaik runtime pattern:

- streaming structured input into an environment
- registering participants
- maintaining a shared `ModelContext`
- triggering inference when a user message arrives
- executing a function tool when the model emits a function call
- logging the transcript for visibility

#### Main files

- `agentic-environment/index.ts` — wires the environment, participants, model, tool runner, and input source together
- `agentic-environment/input-item-source.ts` — emits a developer message and a user question
- `agentic-environment/reactive-agent.ts` — reacts to user messages and function calls
- `agentic-environment/capital-of-france-tool.ts` — example tool returning `Paris`
- `agentic-environment/participant.ts` — simple participant that logs received items
- `agentic-environment/transcript-logger.ts` — logs all context items as JSON

#### Run

```bash
npx tsx agentic-environment/index.ts
```

### 2. Terminal Agent (`terminal-agent/`)

A more practical example that shows how to build an agent with a real tool.

This example exposes a `run_command` function so the model can:

- inspect files and directories
- read repository contents
- execute shell commands
- return structured command results containing `stdout`, `stderr`, and `exitCode`

The terminal agent demonstrates a multi-step tool-use loop:

1. a user message is added to context
2. the model runs inference
3. the model emits one or more function calls
4. the terminal tool executes those calls
5. function outputs are added back to context
6. inference runs again after pending calls finish

#### Main files

- `terminal-agent/index.ts` — entry point for the terminal-agent example
- `terminal-agent/agent.ts` — defines the terminal tool and agent behavior
- `terminal-agent/terminal.ts` — runs shell commands with `child_process.spawn`
- `terminal-agent/command-result.ts` — typed command result structure
- `terminal-agent/human.ts` — sample human input source
- `terminal-agent/README.md` — example-specific notes

#### Run

```bash
npx tsx terminal-agent/index.ts
```

### 3. Inference Interception (`inference-interception/`)

Shows **streaming semantic events** and **parallel inference** in one environment:

- a planner runs non-blocking streaming inference
- a safety reviewer watches `onExternalEvent` for risky phrases and starts its own run
- an observer logs events and completed model messages

Requires `@mozaik-ai/core` 3.10+.

#### Run

```bash
npm run inference-interception
```

See [`inference-interception/README.md`](inference-interception/README.md) for file layout and behavior.

## Repository Structure

```text
.
├── agentic-environment/
├── inference-interception/
├── terminal-agent/
├── package.json
├── purpose.md
└── README.md
```

## Build

Compile the TypeScript project:

```bash
npm run build
```

## Format

```bash
npm run format
```

## Notes

- This repository is primarily an examples and experimentation workspace.
- The root `package.json` includes general project scripts, but the simplest way to run the examples is directly with `tsx`.
- The terminal agent can run arbitrary shell commands, so use it carefully in trusted environments.
