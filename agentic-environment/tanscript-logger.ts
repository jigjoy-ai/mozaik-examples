import { Participant, ContextItem } from "@mozaik-ai/core"

export class TranscriptLogger extends Participant {
	async onContextItem(source: Participant, item: ContextItem): Promise<void> {
		console.log(`[${source.constructor.name}]`, item.toJSON())
	}
}
