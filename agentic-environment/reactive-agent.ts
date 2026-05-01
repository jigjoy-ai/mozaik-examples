import {
	BaseAgentParticipant,
	Participant,
	ContextItem,
	UserMessageItem,
	FunctionCallItem,
	AgenticEnvironment,
	ModelContext,
	GenerativeModel,
	InputItemSource,
	InferenceRunner,
	FunctionCallRunner,
} from "@mozaik-ai/core"

export class ReactiveAgent extends BaseAgentParticipant {
	constructor(
		inputSource: InputItemSource,
		inferenceRunner: InferenceRunner,
		functionCallRunner: FunctionCallRunner,
		private readonly environment: AgenticEnvironment,
		private readonly context: ModelContext,
		private readonly model: GenerativeModel,
	) {
		super(inputSource, inferenceRunner, functionCallRunner)
	}

	async onContextItem(source: Participant, item: ContextItem): Promise<void> {
		if (source === this) return

		this.context.addContextItem(item)

		if (item instanceof UserMessageItem) {
			this.runInference(this.environment, this.context, this.model)
			return
		}

		if (item instanceof FunctionCallItem) {
			this.executeFunctionCall(this.environment, item)
			return
		}
	}
}
