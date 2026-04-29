
import { FunctionCallItem, FunctionCallOutputItem, FunctionCallRunner } from "@mozaik-ai/core"

export class DefaultFunctionCallRunner implements FunctionCallRunner {
	async *run(functionCallItem: FunctionCallItem, signal?: AbortSignal): AsyncIterable<FunctionCallOutputItem> {
		yield FunctionCallOutputItem.create(functionCallItem.callId, "The weather in London is sunny.")
	}
}