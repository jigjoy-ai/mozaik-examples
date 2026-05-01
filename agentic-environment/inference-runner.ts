import {
	InferenceRunner,
	InferenceRequest,
	ModelContext,
	GenerativeModel,
	OpenAIResponses,
	ReasoningItem,
	FunctionCallItem,
	ModelMessageItem,
} from "@mozaik-ai/core"

type InferenceItem = ReasoningItem | FunctionCallItem | ModelMessageItem

export class OpenAIInferenceRunner implements InferenceRunner {
	private readonly runtime = new OpenAIResponses()

	async *run(context: ModelContext, model: GenerativeModel, signal?: AbortSignal): AsyncIterable<InferenceItem> {
		const response = await this.runtime.infer(new InferenceRequest(model, context))
		for (const item of response.contextItems) {
			yield item as InferenceItem
		}
	}
}
