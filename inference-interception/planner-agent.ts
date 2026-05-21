import {
	AgenticEnvironment,
	BaseAgent,
	ModelContext,
	UserMessageItem,
	ModelMessageItem,
	SemanticEvent,
	Participant,
	InferenceRunner,
	FunctionCallRunner,
	GenerativeModel,
} from "@mozaik-ai/core"

export class PlannerAgent extends BaseAgent {
	private inferenceAbort?: AbortController

	constructor(
		inferenceRunner: InferenceRunner,
		functionCallRunner: FunctionCallRunner,
		private readonly environment: AgenticEnvironment,
		private readonly context: ModelContext,
		private readonly model: GenerativeModel,
	) {
		super(inferenceRunner, functionCallRunner)
	}

	/** Stops the in-flight planner stream; consumed by SafetyReviewerAgent on intercept. */
	abortCurrentInference(reason?: string) {
		if (!this.inferenceAbort) return
		console.log("[planner] aborting stream", reason ? `— ${reason}` : "")
		this.inferenceAbort.abort()
		this.inferenceAbort = undefined
	}

	private startInference() {
		this.inferenceAbort?.abort()
		this.inferenceAbort = new AbortController()
		// Pass signal through to InferenceRunner — streaming stops when aborted.
		this.runInference(
			this.environment,
			this.context,
			this.model,
			this.inferenceAbort.signal,
		)
	}

	async onMessage(message: string) {
		this.context.addContextItem(UserMessageItem.create(message))

		// Non-blocking inference.
		// While this is running, other participants can still receive events.
		this.startInference()
	}

	async onExternalModelMessage(source: Participant, item: ModelMessageItem) {
		// If another agent sends a completed correction or intervention,
		// Planner can incorporate it into its own context.
		this.context.addContextItem(item)

		// Optionally re-run with the new information.
		this.startInference()
	}

	async onInternalEvent(_event: SemanticEvent<unknown>) {
		// Planner can observe its own stream events if needed,
		// but it does not need UI or logging logic here.
	}
}
