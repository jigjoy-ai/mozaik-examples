import "dotenv/config"
import {
	AgenticEnvironment,
	DeveloperMessageItem,
	FunctionCallItem,
	FunctionCallRunner,
	InferenceRunner,
	ModelContext,
	Tool,
	UserMessageItem,
	FunctionCallOutputItem,
	GenerativeModel,
	BaseAgent,
} from "@mozaik-ai/core"
import { Terminal } from "./terminal"

const terminal = new Terminal()
export const terminalTools: Tool[] = [
	{
		name: "run_command",
		description: "Run a command in the terminal.",
		parameters: {
			type: "object",
			properties: {
				command: { type: "string", description: "The command to run in the terminal." },
				cwd: { type: "string", description: "The current working directory." },
			},
			required: ["command", "cwd"],
		},
		strict: true,
		type: "function",
		invoke: async (args: { command: string; cwd: string }) => {
			console.log(`Running command: ${args.command} in directory: ${args.cwd}`)
			console.log("--------------------------------")
			const result = await terminal.runCommand(args.command, args.cwd)
			return result
		},
	},
]

const developerMessage = DeveloperMessageItem.create(`You are a terminal agent. 

You can run commands in the terminal to help the user with their request. 
Do not ask any questions to the user. Just run the commands and return the result.

Tools:
- run_command: Run a command in the terminal. You can use this tool to run any command in the terminal.
`)

export class TerminalAgent extends BaseAgent {
	private pendingCalls = new Set<string>()

	constructor(
		inferenceRunner: InferenceRunner,
		functionCallRunner: FunctionCallRunner,
		private readonly environment: AgenticEnvironment,
		private readonly context: ModelContext,
		private readonly model: GenerativeModel,
	) {
		super(inferenceRunner, functionCallRunner)
	}

	async onMessage(message: string): Promise<void> {
		console.log("Message received: ", message)
		this.context.addContextItem(developerMessage).addContextItem(UserMessageItem.create(message))
		this.runInference(this.environment, this.context, this.model)
	}

	onFunctionCall(item: FunctionCallItem): Promise<void> {
		this.pendingCalls.add(item.callId)
		this.context.addContextItem(item)
		this.executeFunctionCall(this.environment, item)
		return Promise.resolve()
	}

	onFunctionCallOutput(item: FunctionCallOutputItem): Promise<void> {
		this.context.addContextItem(item)
		this.pendingCalls.delete(item.callId)
		if (this.pendingCalls.size === 0) {
			this.runInference(this.environment, this.context, this.model)
		}
		return Promise.resolve()
	}
}
