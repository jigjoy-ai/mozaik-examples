import {
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
	AgenticEnvironment,
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
	private readonly name: string
	constructor(
		name: string,
		toolExecutor: ToolExecutor,
		messageGenerator: MessageSender,
		inferenceHandler: InferenceHandler,
	) {
		super(toolExecutor, messageGenerator, inferenceHandler)
		this.name = name
	}

	onFunctionCallOutput(participant: Participant, item: FunctionCallOutputItem): Promise<void> {
		console.log(`${this.name} received FunctionCallOutput`, item)
		return Promise.resolve()
	}
	onMessage(participant: Participant, message: string): Promise<void> {
		console.log(`${this.name} received Message`, message)
		return Promise.resolve()
	}
	onFunctionCall(participant: Participant, item: FunctionCallItem): Promise<void> {
		console.log(`${this.name} received FunctionCall`, item)
		return Promise.resolve()
	}
	onReasoning(participant: Participant, item: ReasoningItem): Promise<void> {
		console.log(`${this.name} received Reasoning`, item)
		return Promise.resolve()
	}
	onOutputMessage(participant: Participant, item: ModelMessageItem): Promise<void> {
		console.log(`${this.name} received OutputMessage`, item)
		return Promise.resolve()
	}
}

const toolExecutor = new MyToolExecutor()
const messageGenerator = new MyMessageGenerator()
const inferenceHandler = new MyInferenceHandler()

const environment = new AgenticEnvironment()
environment.start()
const participant = new MyParticipant("mijura", toolExecutor, messageGenerator, inferenceHandler)
const participant2 = new MyParticipant("lotus", toolExecutor, messageGenerator, inferenceHandler)
participant.join(environment)
participant2.join(environment)
participant.sendMessage("Hello, how are you?", environment)
participant2.sendMessage("I'm fine, thank you!", environment)

environment.stop()
