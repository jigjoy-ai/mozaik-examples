import { BaseAgentParticipant, ContextItem, FunctionCallRunner, InferenceRunner, InputItemSource, Participant } from "@mozaik-ai/core"

export class MyParticipant extends BaseAgentParticipant {
	private readonly name: string
	constructor(
		name: string,
		inputSource: InputItemSource,
		inferenceRunner: InferenceRunner,
		functionCallRunner: FunctionCallRunner,
	) {
		super(inputSource, inferenceRunner, functionCallRunner)
		this.name = name
	}

    async onContextItem(source: Participant, item: ContextItem): Promise<void> {
        console.log(`${this.name} received ContextItem`, item)
        return Promise.resolve()
    }
}
