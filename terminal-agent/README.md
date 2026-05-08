# @mozaik-ai/terminal

A small terminal-agent project that lets an AI act as a terminal operator. It exposes a tool for running shell commands programmatically and returning structured results (stdout, stderr, exit code). The agent is built on top of Mozaik AI core primitives and is intended for automation tasks where an AI needs to inspect the repository, run commands, and modify files.

Key points
- Project name: @mozaik-ai/terminal
- Purpose: Provide a terminal tool that an AI agent can use to run commands in a shell and capture results.
- Language: TypeScript (Node.js)
- Entry point: src/index.ts

Features
- Run arbitrary shell commands via a typed tool (run_command)
- Captures stdout, stderr, and exit code
- Simple Terminal class that spawns child processes and returns CommandResult objects

How it works (high level)
- src/index.ts wires up a MozaikAgent with a single tool: run_command
- The tool schema requires { command, cwd } and invokes Terminal.runCommand
- Terminal.runCommand uses child_process.spawn (with shell: true) to execute commands and collect output

Run locally
1. Install dependencies:
   npm install
2. Start the agent (development):
   npm start

Project structure (selected)
- package.json         — project metadata and scripts
- src/index.ts         — agent entrypoint, tool registration, and example request
- src/terminal.ts      — Terminal class that runs commands and returns CommandResult
- src/types            — shared TypeScript types (CommandResult)
- .env                 — environment variables (optional)

Notes and safety
- The tool runs arbitrary shell commands in the provided cwd. Be careful when running in sensitive environments.
- This project is intended for controlled automation and experimentation with terminal-capable agents.

License
- See repository/LICENSE (not provided in this repo snapshot)

