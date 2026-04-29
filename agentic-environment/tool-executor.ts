import { FunctionCallItem, FunctionCallOutputItem, ToolExecutor } from "@mozaik-ai/core";

export class MyToolExecutor implements ToolExecutor {
	async *produce(functionCallItem: FunctionCallItem, signal?: AbortSignal): AsyncIterable<FunctionCallOutputItem> {
		throw new Error("Method not implemented.")
	}
}