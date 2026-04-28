import {
	Agent,
	AgentSociety,
	DeveloperMessageItem,
	Gpt54,
	ModelContext,
	RuntimeContext,
	SystemMessageItem,
	UserMessageItem,
} from "@mozaik-ai/core"
import "dotenv/config"

const systemMessage = SystemMessageItem.create("Whatever user ask or tell, you returning the empty string!")
const userMessage = UserMessageItem.create("What is the capital of France?")
const developerMessage = DeveloperMessageItem.create("You are a helpful assistant.")

const context = ModelContext.create(`pr-${crypto.randomUUID()}`)
	.addContextItem(developerMessage)
	.addContextItem(systemMessage)
	.addContextItem(userMessage)

const model = new Gpt54()
model.setReasoningEffort("high")

export class MyAgent extends Agent {
	constructor() {
		super()

		this.runtime.on("AFTER_INFERENCE" as any, (context: RuntimeContext) => {
			console.log(JSON.stringify(context.inferenceResponse))
			return Promise.resolve()
		})
	}
}

const agent = new MyAgent()

const society = new AgentSociety("Society")
society.start()
society.join(agent)
society.enter("", model, context)
