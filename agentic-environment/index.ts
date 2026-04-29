import {
	Environment,
	FunctionCallItem,
	FunctionCallOutputItem,
	GenerativeModel,
	InferenceHandler,
	MessageSender,
	ModelContext,
	ModelMessageItem,
	ReasoningItem,
	ToolExecutor,
	Participant,
} from "@mozaik-ai/core"

export class MyToolExecutor implements ToolExecutor {
	async *produce(functionCallItem: FunctionCallItem, signal?: AbortSignal): AsyncIterable<FunctionCallOutputItem> {
		throw new Error("Method not implemented.")
	}
}

export class MyMessageGenerator implements MessageSender {
	async *stream(message: string, signal?: AbortSignal): AsyncIterable<string> {
		yield message
	}
}

export class MyInferenceHandler implements InferenceHandler {
	async *produce(
		context: ModelContext,
		model: GenerativeModel,
		signal?: AbortSignal,
	): AsyncIterable<ReasoningItem | FunctionCallItem | ModelMessageItem> {
		yield ModelMessageItem.rehydrate({
			text: "The weather in London is sunny.",
		})
	}
}

export class MyParticipant extends Participant {
	onFunctionCallOutput(participant: Participant, item: FunctionCallOutputItem): Promise<void> {
		console.log("onFunctionCallOutput", item)
		return Promise.resolve()
	}
	onMessage(participant: Participant, message: string): Promise<void> {
		console.log("onMessage", message)
		return Promise.resolve()
	}
	onFunctionCall(participant: Participant, item: FunctionCallItem): Promise<void> {
		console.log("onFunctionCall", item)
		return Promise.resolve()
	}
	onReasoning(participant: Participant, item: ReasoningItem): Promise<void> {
		console.log("onReasoning", item)
		return Promise.resolve()
	}
	onOutputMessage(participant: Participant, item: ModelMessageItem): Promise<void> {
		console.log("onOutputMessage", item)
		return Promise.resolve()
	}
	constructor() {
		super()
	}
}

const toolExecutor = new MyToolExecutor()
const messageGenerator = new MyMessageGenerator()
const inferenceHandler = new MyInferenceHandler()

const environment = new Environment(toolExecutor, messageGenerator, inferenceHandler)
environment.start()
const participant = new MyParticipant()
const participant2 = new MyParticipant()
environment.join(participant)
environment.join(participant2)
environment.sendMessage(participant, "Hello, how are you?")
