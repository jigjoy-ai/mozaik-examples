import { BaseObserver, Participant, SemanticEvent, ModelMessageItem } from "@mozaik-ai/core"

export class RuntimeObserver extends BaseObserver {
	async onExternalEvent(source: Participant, event: SemanticEvent<unknown>) {
		// Stream/runtime events go here.
		// This can drive UI, tracing, metrics, or debugging.
		console.log("[event]", source.constructor.name, event.type)
	}

	async onExternalModelMessage(source: Participant, item: ModelMessageItem) {
		// Produced context items go here.
		// This is not mixed with token-level streaming.
		console.log("[model_message]", source.constructor.name, item.toJSON())
	}
}
