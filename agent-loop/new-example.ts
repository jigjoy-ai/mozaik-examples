import {
	Agent,
	AgentRuntime,
	Context,
	DeveloperMessage,
	Gpt54,
	InferenceResponse,
	InferenceVisitor,
	UserMessage,
} from "@mozaik-ai/core"
import { getBirdTypeTool } from "../utils/tools/get-bird-type"
import { RuntimeContext } from "@/mozaik/src/domain/agent-loop/loop"
import "dotenv/config"

class TimeCounter implements InferenceVisitor {
	startTime: number = 0
	onStart(context: RuntimeContext): Promise<void> {
		this.startTime = Date.now()
		return Promise.resolve()
	}
	afterInference(inferenceResponse: InferenceResponse): Promise<void> {
		const endTime = Date.now()
		const duration = endTime - this.startTime
		console.log(`Inference duration: ${duration / 1000}s`)
		return Promise.resolve()
	}
}

export class MyAgent extends Agent {
	constructor(agentRuntime: AgentRuntime) {
		super(agentRuntime)
		// Workaround for unbound callbacks in @mozaik-ai/core Agent constructor.
		// AgentRuntime keeps only one handler per hook id, so re-registering overwrites the buggy one.
		agentRuntime.on("BEFORE_INFERENCE" as any, this.beforeInference.bind(this))
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
const agentRuntime = new AgentRuntime()
const agent = new MyAgent(agentRuntime)

agent.setInferenceVisitor(new TimeCounter())
const messageText = "Tell me a joke about birds"
const message = UserMessage.create(messageText)
const developerMessage = DeveloperMessage.create(
	"You are a joke teller. You will be given a joke and you will need to tell it to the user.",
)

const projectId = `pr-${crypto.randomUUID()}`
const context = Context.create(projectId).addItem(developerMessage).addItem(message)

const model = new Gpt54()
model.setReasoningEffort("high")
model.setTools([getBirdTypeTool])

agent.run(messageText, model, context)

while (true) {
	await new Promise((resolve) => setTimeout(resolve, 1000))
}
