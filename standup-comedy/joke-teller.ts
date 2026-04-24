import { RuntimeContext } from "@/mozaik/src/domain/agent-loop/loop"
import { Agent, AgentRuntime } from "@mozaik-ai/core"

export class JokeTellerAgent extends Agent {
	constructor(agentRuntime: AgentRuntime) {
		super(agentRuntime)
		// Workaround for unbound callbacks in @mozaik-ai/core Agent constructor.
		// AgentRuntime keeps only one handler per hook id, so re-registering overwrites the buggy one.
		agentRuntime.on("BEFORE_INFERENCE" as any, this.onStart.bind(this))
		agentRuntime.on("AFTER_INFERENCE" as any, this.afterInference.bind(this))
		agentRuntime.on("BEFORE_FUNCTION_CALL" as any, this.beforeFunctionCall.bind(this))
		agentRuntime.on("AFTER_FUNCTION_CALL" as any, this.afterFunctionCall.bind(this))
		agentRuntime.on("BEFORE_MODEL_MESSAGE" as any, this.beforeModelMessage.bind(this))
		agentRuntime.on("AFTER_MODEL_MESSAGE" as any, this.afterModelMessage.bind(this))
		agentRuntime.on("ON_ERROR" as any, this.onError.bind(this))
	}

	async afterModelMessage(context: RuntimeContext): Promise<void> {
		console.log("afterModelMessage")
		console.log(JSON.stringify(context.inferenceResponse))
		return Promise.resolve()
	}

	async onError(context: RuntimeContext): Promise<void> {
		console.error(context)
		return Promise.resolve()
	}

	async beforeModelMessage(context: RuntimeContext): Promise<void> {
		console.log("beforeModelMessage")
		return Promise.resolve()
	}

	async beforeFunctionCall(context: RuntimeContext): Promise<void> {
		console.log("beforeFunctionCall")
		return Promise.resolve()
	}
}
