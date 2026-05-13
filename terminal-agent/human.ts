import { InputStream } from "@mozaik-ai/core"

export class HumanInput implements InputStream {
	async *stream(signal?: AbortSignal): AsyncIterable<string> {
		yield `Update purpose.md to reflect the changes in the directory.`
	}
}