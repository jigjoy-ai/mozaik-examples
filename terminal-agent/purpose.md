# Project Purpose

## Overview

This repository is a compact TypeScript example of a **terminal-capable AI agent** built with `@mozaik-ai/core`. Its purpose is to show how an LLM-driven agent can be connected to a local runtime, given access to a real shell command tool, and allowed to inspect or modify the working directory in response to a natural-language request.

The project is not a general-purpose application or a production-hardened agent platform. It is best understood as a **reference implementation** or **example project** that demonstrates the core building blocks of a tool-using agent:

- an event-driven runtime,
- a human participant,
- an agent participant,
- a terminal tool,
- a model/tool execution loop,
- and console-visible tracing of tool calls and final answers.

In other words, this codebase exists to illustrate how to build an agent that can do more than chat: it can **take action in a terminal**, observe the results, and continue reasoning from those results.

## Primary Goal

The main goal of the project is to demonstrate a simple but realistic pattern for **agentic automation**:

1. a user sends an instruction,
2. the runtime delivers the event,
3. the agent invokes a model with access to tools,
4. the model decides when to call a tool,
5. the tool runs a shell command,
6. the output is captured in structured form,
7. the runtime feeds the result back into the loop,
8. the model eventually produces a final answer.

That pattern is the heart of many practical AI agents. This repository strips it down to a small, understandable implementation.

## What the Agent Is Meant to Do

The agent is explicitly configured to behave like a terminal operator. Its instruction says:

- it can run commands in the terminal,
- it should use terminal commands to help with the user's request,
- it should not ask the user questions,
- it should just run commands and return results.

This makes the project useful for demonstrating tasks such as:

- inspecting a codebase,
- listing files and directories,
- reading source files,
- gathering information before answering,
- writing or updating files,
- supporting local development automation.

The sample invocation in `src/main.ts` proves that intent directly: when the program starts, it sends the agent the message:

> Analyze this directory and write a detailed description of the project in a file called purpose.md.

So the repository is both:

- the **subject of analysis**, and
- the **execution environment** the agent can operate in.

## High-Level Architecture

The project is organized around a small runtime with two participants:

- a **user participant** that acts like the human/operator side,
- an **agent participant** that owns the model instruction and tool access.

The agent has one tool: `run_command`.

That tool delegates to a `Terminal` class, which executes shell commands with Node's `child_process.spawn`, captures `stdout`, `stderr`, and exit code, and returns a normalized result object.

The runtime itself comes from `@mozaik-ai/core` and is wrapped in a small local helper module so the rest of the project can use functions like:

- `initializeRuntime`
- `join`
- `sendMessage`
- `runLoop`

This gives the codebase a clean separation between:

- runtime setup,
- participant definitions,
- event handling,
- tool registration,
- low-level terminal execution.

## Source Layout and Responsibilities

### `src/main.ts`

This is the executable entry point for the example.

Responsibilities:

- loads environment variables with `dotenv/config`,
- imports the user and agent participants,
- initializes the runtime with `EnvironmentState`,
- joins both participants to the runtime,
- sends the initial natural-language task into the system.

This file acts as the demo launcher. It is intentionally small because most behavior lives in the participants and runtime loop.

### `src/runtime.ts`

This module defines and exports the runtime API for the project.

It:

- creates `EnvironmentState` as a subclass of `RuntimeState`,
- calls `defineRuntime<EnvironmentState>()`,
- re-exports the generated runtime helpers.

Those helpers include:

- `initializeRuntime`
- `resolveRuntime`
- `resolveParticipant`
- `join`
- `leave`
- `sendMessage`
- `sendEvent`
- `runLoop`

Its purpose is to centralize runtime creation so the rest of the project can import a shared runtime interface.

### `src/command-result.ts`

This file defines the `CommandResult` TypeScript interface.

It standardizes the shape of a terminal command result:

- `success: boolean`
- `stdout: string`
- `stderr: string`
- `exitCode: number`

This gives the terminal tool a predictable return type that fits well into a tool-calling workflow.

### `src/terminal.ts`

This module contains the low-level shell execution logic.

The `Terminal` class exposes `runCommand(command, cwd, contextMessage?)`, which:

- parses the command string into command and args,
- spawns a child process,
- runs with `shell: true`,
- collects `stdout` incrementally,
- collects `stderr` incrementally,
- listens for process errors,
- resolves with a `CommandResult` when the command completes.

It also appends a success or failure message to the output, making command results more readable when printed.

This class is the bridge between the abstract tool system and the real operating system.

### `src/participants/agent/index.ts`

This file defines the AI agent participant.

It uses `createAgent` from `@mozaik-ai/core` and configures:

- the agent's name,
- its instruction,
- its available tools,
- its event handlers.

The instruction makes the agent terminal-focused and action-oriented. The agent is intentionally narrow and practical rather than conversational.

### `src/participants/agent/tools.ts`

This file registers the agent's tools.

Right now there is exactly one tool:

- `run_command`

The tool declaration includes:

- a description,
- a JSON-schema-like parameter definition,
- strict validation,
- an async `invoke` function.

The `invoke` function logs the command being executed and then calls `Terminal.runCommand(...)`.

This is the key integration point where the model gains operational ability.

### `src/participants/agent/situations/message-sent.ts`

This file defines the agent's reaction to runtime events.

It contains:

- `MessageSentSpecification`, which matches `message.sent` events,
- `InferenceProcessor`, which turns the event into a model inference request.

The processor:

- extracts the incoming message,
- reads the agent memory context,
- selects model `gpt-5.4`,
- sets `reasoningEffort: "high"`,
- attaches the tool set,
- calls `runLoop(...)`.

This file is important because it shows the project is not just “call a model once.” It is an event-triggered agent loop that can use tools iteratively.

### `src/participants/user/index.ts`

This module defines the human-side participant using `createHuman`.

In this example, the user is not an interactive REPL or UI component. Instead, it is a runtime participant whose main job is to render useful events to the console.

That makes the system easy to observe while keeping the implementation simple.

### `src/participants/user/situations/function-call-started.ts`

This handler reacts to `function_call.started` events and prints:

- the tool name,
- the tool arguments.

Its role is visibility: it shows when the model has decided to act.

### `src/participants/user/situations/function-call-completed.ts`

This handler reacts to `function_call.completed` events and prints:

- the tool result.

This lets the operator see exactly what came back from a command execution.

### `src/participants/user/situations/model-answer.ts`

This handler reacts to `model.answer` events and prints:

- the final answer text.

Together, the three user-side handlers make the runtime behavior transparent in the console.

## Execution Flow

When the project runs, the behavior is roughly:

1. `src/main.ts` starts the runtime.
2. The user participant and agent participant join.
3. A user message is sent into the runtime.
4. The agent's `message.sent` situation matches that event.
5. The agent builds an inference request and calls `runLoop(...)`.
6. The model may choose to call `run_command`.
7. The tool runs a real shell command in the specified working directory.
8. The command output is returned as structured data.
9. The runtime continues until the model produces a final answer.
10. The user participant logs tool calls, tool outputs, and the final answer.

This end-to-end path is the main concept the repository exists to demonstrate.

## Technology Stack

The project uses:

- **TypeScript**
- **Node.js**
- **ES modules** (`"type": "module"`)
- **`@mozaik-ai/core`** for runtime, participants, tools, events, and agent loops
- **`dotenv`** for environment loading
- **`tsx`** for running TypeScript directly in development

The TypeScript configuration is strict and modern:

- `target: ES2022`
- `module: ESNext`
- `moduleResolution: bundler`
- `strict: true`
- `noEmit: true`

This indicates the repository is geared toward local development and clarity rather than a compiled build pipeline.

## Package and Run Model

`package.json` shows this is a small private project with a single main script:

- `npm start` → `tsx src/main.ts`

That reinforces the idea that this repository is an executable example rather than a packaged library with multiple entrypoints.

## Design Qualities

### Minimal
The codebase is small and focused. There is very little abstraction beyond what is needed to show the runtime and tool loop.

### Demonstrative
Nearly every file exists to illustrate one part of the pattern: event handling, tool registration, shell execution, or console rendering.

### Extensible
Although only one tool is present, the architecture supports adding more tools with the same pattern. Examples might include:

- file editing tools,
- HTTP request tools,
- search tools,
- git helpers,
- test runners.

### Agentic rather than chat-only
The project is designed around an LLM that can observe, act, and continue. That is a more capable pattern than a single prompt-response exchange.

## Safety and Operational Considerations

This project is intentionally powerful and should be understood accordingly.

### Arbitrary command execution
The `run_command` tool can execute arbitrary shell commands in any provided working directory.

### Shell enabled
Because execution uses `spawn(..., { shell: true })`, the implementation prioritizes convenience and broad shell compatibility.

### No visible sandboxing
There is no built-in evidence here of:

- command allowlists,
- path restrictions,
- approval gates,
- resource limits,
- security sandboxing.

That means the repository should be treated as a **prototype/example** suitable for controlled environments, not as a secure production agent runner.

## Observations About Documentation

The existing `README.md` describes the project correctly at a high level, but some file references appear outdated. For example, it mentions `src/index.ts`, while the actual entry point in this repository is `src/main.ts`, and the agent/user logic is organized under `src/participants/...`.

So the source code is the most accurate description of the current project structure.

## Overall Purpose Summary

In summary, this repository exists to demonstrate how to build a **terminal-enabled AI agent** using Mozaik's runtime and tool abstractions.

Its purpose is to serve as a practical example of:

- event-driven agent orchestration,
- model-triggered tool use,
- structured command execution,
- terminal-based local automation,
- and iterative reasoning over tool results.

If someone wants to learn how an LLM can be given real operational capability inside a local Node.js program, this project is a concise and effective example of that pattern.
