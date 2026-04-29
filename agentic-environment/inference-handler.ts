import { FunctionCallItem, GenerativeModel, InferenceHandler, ModelContext, ModelMessageItem, ReasoningItem } from "@mozaik-ai/core"

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