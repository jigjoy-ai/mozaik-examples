import { DeveloperMessageItem, InputItemSource, SystemMessageItem, UserMessageItem } from "@mozaik-ai/core";

export class HumanInputSource implements InputItemSource {
	async *stream(signal?: AbortSignal): AsyncIterable<UserMessageItem | DeveloperMessageItem | SystemMessageItem> {
		yield UserMessageItem.create(`Analyze this directory and write a detailed description of the project in a file called purpose.md.`)
	}
}