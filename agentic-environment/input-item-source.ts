import { DeveloperMessageItem, SystemMessageItem, InputItemSource, UserMessageItem } from "@mozaik-ai/core"

export class InputSource implements InputItemSource {
	async *stream(signal?: AbortSignal): AsyncIterable<UserMessageItem | DeveloperMessageItem | SystemMessageItem> {
		yield DeveloperMessageItem.create("You are a helpful assistant.")
        yield UserMessageItem.create("Hello, how are you?")
	}
}