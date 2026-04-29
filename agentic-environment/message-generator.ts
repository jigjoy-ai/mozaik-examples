import { MessageSender } from "@mozaik-ai/core"

export class MyMessageGenerator implements MessageSender {
	async *stream(message: string, signal?: AbortSignal): AsyncIterable<string> {
		yield message
	}
}