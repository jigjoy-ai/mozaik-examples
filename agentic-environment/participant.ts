import { FunctionCallItem, FunctionCallOutputItem, InferenceHandler, MessageSender, ModelMessageItem, Participant, ReasoningItem, ToolExecutor } from "@mozaik-ai/core"

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
