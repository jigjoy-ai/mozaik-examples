import { DeveloperMessageItem, InputItemSource, SystemMessageItem, UserMessageItem } from "@mozaik-ai/core";

export class HumanInputSource implements InputItemSource {
	async *stream(signal?: AbortSignal): AsyncIterable<UserMessageItem | DeveloperMessageItem | SystemMessageItem> {
		yield UserMessageItem.create(`Check the purpose.md and resolve inconsistencies that are described in the file.`)
	}
}