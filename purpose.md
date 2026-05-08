# Project Purpose

## Overview

This repository is a small TypeScript/Node.js collection of examples built around `@mozaik-ai/core`. Its main purpose is to demonstrate how to construct **agent-driven applications** that operate inside an event-based environment, receive conversational context, call tools, and react to model output.

Although the root `README.md` describes a different example (`standup-comedy/`), the code currently present in the repository is centered on **two concrete example projects**:

1. **`agentic-environment/`** — a minimal demonstration of an agentic runtime with participants, shared context, inference, and a simple function tool.
2. **`terminal-agent/`** — a more practical example where an AI agent is given a `run_command` tool so it can inspect files, execute shell commands, and automate repository tasks.

Taken together, the repository appears intended as a sandbox for learning and experimenting with the Mozaik AI framework’s core primitives:

- participants joining a shared environment
- streaming input into that environment
- maintaining model context
- triggering inference when new items arrive
- executing tool/function calls emitted by the model
- wiring concrete tools into agent workflows

## Primary Goal of the Repository

The core purpose of this project is to show how to build **tool-using AI agents** on top of Mozaik’s abstractions rather than as one-off scripts. Instead of directly calling a model and parsing a response, these examples structure the problem around:

- an **environment** that coordinates participants
- **input sources** that emit developer/user/system messages
- **agent participants** that decide when to run inference
- **function call runners** that execute tools
- **models** that can produce tool calls as part of reasoning

This makes the repository useful as a reference for anyone who wants to understand how to:

- build reactive agents
- expose tools to models in a typed way
- process context items incrementally
- connect model inference with real-world side effects like terminal execution

## Technologies Used

- **Language:** TypeScript
- **Runtime target:** Node.js (ES2022 / ES modules)
- **Core framework:** `@mozaik-ai/core`
- **Environment variable loading:** `dotenv`
- **Schema/validation support:** `zod`
- **Build tooling:** TypeScript compiler (`tsc`)
- **Formatting:** Prettier

The repository is configured as an ES module project via `"type": "module"` in `package.json`.

## Repository Structure

### `agentic-environment/`
This folder contains a minimal example of a shared agentic environment.

#### `agentic-environment/index.ts`
This is the entry point for the example. It assembles the major framework pieces:

- an `AgenticEnvironment`
- a `DefaultFunctionCallRunner`
- an `OpenAIInferenceRunner`
- a `ModelContext`
- a `Gpt54` model
- multiple participants (`MyParticipant`, `ReactiveAgent`, and `TranscriptLogger`)

The file demonstrates how participants are joined to the environment, how the environment is started, and how input begins streaming into the system.

#### `agentic-environment/reactive-agent.ts`
This is the most instructive file in the example. It defines a `ReactiveAgent` class that extends `BaseAgentParticipant`.

Its role is to react to incoming context items:

- when it receives a `UserMessageItem`, it adds the item to model context and triggers inference
- when it receives a `FunctionCallItem`, it executes the requested tool
- it ignores items coming from itself to avoid feedback loops

This shows the intended reactive pattern for Mozaik agents: update context, inspect item type, and either infer or execute.

#### `agentic-environment/input-item-source.ts`
Defines a simple `InputSource` that yields:

- a developer message: “You are a helpful assistant.”
- a user message asking for the capital of France

This demonstrates how conversations can be modeled as a stream of context items rather than a single monolithic prompt.

#### `agentic-environment/capital-of-france-tool.ts`
Defines a very small function tool, `get_capital_of_france`, which always returns `{ capital: "Paris" }`.

This tool exists primarily as a teaching example for:

- declaring tool metadata
- defining a strict parameter schema
- wiring the tool into a `DefaultFunctionCallRunner`
- allowing a model to satisfy a user request through tool use

#### `agentic-environment/participant.ts`
Defines `MyParticipant`, a very simple subclass of `BaseAgentParticipant` that logs received context items.

Its purpose is educational: it illustrates the minimum shape of a participant and how participants can observe the environment without necessarily doing inference or tool execution.

#### `agentic-environment/tanscript-logger.ts`
Defines `TranscriptLogger`, a passive participant that logs every context item as JSON.

This is useful for debugging, observability, and understanding how data flows through the environment.

### `terminal-agent/`
This folder contains the more application-like example in the repository: an AI terminal operator.

#### High-level purpose
The terminal-agent example is designed to let a model act like a shell-capable assistant. It exposes a `run_command` tool so the agent can:

- inspect directories
- read files
- execute shell commands
- return structured command results

This is effectively a prototype of a repository-analysis or automation agent.

#### `terminal-agent/terminal.ts`
Implements the `Terminal` class, which is the operational core of this example.

Its `runCommand` method:

- spawns a child process using Node’s `child_process.spawn`
- executes the provided command in a specified working directory
- captures `stdout`
- captures `stderr`
- records the exit code
- returns a structured `CommandResult`

It also appends a success or failure message to the captured output. This makes the tool output easy for both humans and models to interpret.

#### `terminal-agent/command-result.ts`
Defines the `CommandResult` interface:

- `success`
- `stdout`
- `stderr`
- `exitCode`

This gives the terminal tool a consistent typed response format.

#### `terminal-agent/agent.ts`
This is the main logic for the terminal agent.

It contains three important parts:

##### 1. Tool declaration
The file declares `terminalTools`, currently containing one tool:

- `run_command(command, cwd)`

The tool is exposed to the model with a JSON-schema-like parameter definition and is implemented by calling `terminal.runCommand(...)`.

##### 2. Agent behavior
It defines `TerminalAgent`, which extends `BaseAgentParticipant`.

This agent:

- injects a developer instruction telling the model it is a terminal agent
- stores incoming items in `ModelContext`
- triggers inference when it receives a user message
- executes tool calls when it receives a `FunctionCallItem`
- tracks pending function calls in a `Set`
- reruns inference once all pending tool calls have returned

This is a more complete example than `ReactiveAgent` because it handles the multi-step loop of:

1. user request
2. model emits tool call(s)
3. tool executes
4. results are added back into context
5. model continues reasoning using the tool output

##### 3. Input source
The file also defines `TerminalAgentInputSource`, which emits a single user instruction asking the agent to analyze the current directory and write a detailed description to `purpose.md`.

This makes the example self-hosting in spirit: the terminal agent is set up to inspect and describe a repository by using its own command-running tool.

#### `terminal-agent/index.ts`
This is the entry point for the terminal-agent example.

It creates and wires together:

- the environment
- the terminal agent input source
- the inference runner
- the function call runner
- the model context
- the `Gpt54` model
- a human participant
- the terminal agent participant

The model is configured with:

- the `run_command` tool
- a high reasoning effort setting

The environment is then started and input streaming begins.

#### `terminal-agent/human.ts`
Defines `HumanInputSource`, which currently emits the same repository-analysis instruction as `TerminalAgentInputSource`.

This appears to be a simple placeholder or duplication for testing how human-originated input flows into the environment.

#### `terminal-agent/README.md`
Provides a concise explanation of the terminal-agent example and confirms its intended use case: allowing an AI to operate as a terminal user for automation and repository inspection tasks.

## Architectural Pattern Demonstrated

Across both examples, the repository demonstrates a shared architecture:

1. **Input is streamed** into the system as structured items.
2. **Participants** receive those items through `onContextItem(...)`.
3. **Agents** decide whether to:
   - update context
   - run inference
   - execute a function/tool call
4. **Tools** perform side effects or retrieve information.
5. **Outputs** are fed back into the environment so the model can continue reasoning.

This architecture is important because it separates concerns cleanly:

- message generation comes from input sources
- orchestration comes from the environment
- reasoning comes from the model and inference runner
- real-world interaction comes from tools

## Educational Value

This repository is best understood as an **examples and experimentation project**, not as a polished end-user application.

Its value lies in showing:

- how to compose Mozaik framework primitives
- how to define custom tools
- how to create agent subclasses with distinct behaviors
- how to manage inference loops in response to context updates
- how to connect LLM reasoning with external execution environments like a terminal

Someone studying this code would come away with a practical sense of how to build:

- assistants that react to user input
- tool-using agents
- automation-oriented AI workflows
- environment-based multi-participant systems

## Current State and Notable Inconsistencies

There are signs that the repository is in an experimental or evolving state:

- The root `README.md` describes a `standup-comedy/` example that is not present in the directory.
- `package.json` includes a `dev` script pointing to `./anthropic/complex-reasoning.ts`, which is also not present.
- The codebase currently contains `agentic-environment/` and `terminal-agent/` as the actual examples.
- The file `tanscript-logger.ts` appears to contain a typo in its filename and likely was intended to be `transcript-logger.ts`.
- Both `terminal-agent/agent.ts` and `terminal-agent/human.ts` emit the same example instruction, suggesting the code is set up for experimentation rather than finalized production behavior.

These inconsistencies do not prevent understanding the project’s intent. Instead, they reinforce that this repository is a working example space where ideas are being tried, adjusted, and iterated on.

## Overall Purpose Statement

In summary, this repository exists to demonstrate how to build **agentic, tool-enabled AI workflows** with `@mozaik-ai/core`. Its strongest example is a terminal-capable agent that can run shell commands and use the results as part of its reasoning process. The supporting `agentic-environment` example shows the lower-level building blocks of the same idea in a simpler form.

The project is therefore best described as a **TypeScript example suite for experimenting with Mozaik AI agents, shared environments, model context handling, and tool execution**.
