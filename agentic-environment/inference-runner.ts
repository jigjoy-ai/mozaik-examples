import { FunctionCallItem, GenerativeModel, ModelContext, ModelMessageItem, ReasoningItem, InferenceRunner } from "@mozaik-ai/core"

export class DefaultInferenceRunner implements InferenceRunner {
	async *run(context: ModelContext, model: GenerativeModel, signal?: AbortSignal): AsyncIterable<ReasoningItem | FunctionCallItem | ModelMessageItem> {
		yield ModelMessageItem.rehydrate({
			text: "The weather in London is sunny.",
		})
	}
}