import "dotenv/config"
import { AgenticEnvironment, BaseAgentParticipant, ContextItem, DeveloperMessageItem, FunctionCallItem, FunctionCallRunner, InferenceRunner, InputItemSource, ModelContext, Participant, SystemMessageItem, Tool, UserMessageItem, FunctionCallOutputItem, GenerativeModel } from "@mozaik-ai/core"
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
		invoke: async (args: { command: string, cwd: string }) => {
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

export class TerminalAgent extends BaseAgentParticipant {
	private pendingCalls = new Set<string>()

	constructor(inputSource: InputItemSource, inferenceRunner: InferenceRunner, functionCallRunner: FunctionCallRunner, private readonly environment: AgenticEnvironment, private readonly context: ModelContext, private readonly model: GenerativeModel) {
		super(inputSource, inferenceRunner, functionCallRunner)
	}

	async onContextItem(source: Participant, item: ContextItem): Promise<void> {
		if (source === this) {
			this.context.addContextItem(item)
		}

		console.log("ContextItem", item)

		if (item instanceof UserMessageItem) {
			this.context.addContextItem(developerMessage)
			this.context.addContextItem(item)
			this.runInference(this.environment, this.context, this.model)
			return
		}

		if (item instanceof FunctionCallItem) {
			this.pendingCalls.add(item.callId)
			this.executeFunctionCall(this.environment, item)
			return
		}

		if (item instanceof FunctionCallOutputItem) {
			this.pendingCalls.delete(item.callId)
			if (this.pendingCalls.size === 0) {
				this.runInference(this.environment, this.context, this.model)
			}
			return
		}
	}
}

export class TerminalAgentInputSource implements InputItemSource {

	constructor(private readonly message: string) {
	}

	async *stream(signal?: AbortSignal): AsyncIterable<UserMessageItem | DeveloperMessageItem | SystemMessageItem> {
		yield UserMessageItem.create(this.message)
	}
}
