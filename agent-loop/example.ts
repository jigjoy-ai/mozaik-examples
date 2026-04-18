import { Context, DeveloperMessage, Gpt54, Loop, UserMessage } from "@mozaik-ai/core"
import { getBirdTypeTool } from "../utils/tools/get-bird-type"
import { inferenceAction, loopCondition } from "./agent-loop"

const message = UserMessage.create("Tell me a joke about birds")
const developerMessage = DeveloperMessage.create(
	"You are a joke teller. You will be given a joke and you will need to tell it to the user.",
)

const projectId = `pr-${crypto.randomUUID()}`
const context = Context.create(projectId).addItem(developerMessage).addItem(message)

async function main() {
	const model = new Gpt54()
	model.setReasoningEffort("medium")
	model.setTools([getBirdTypeTool])
	const agentLoop = new Loop({ condition: loopCondition, action: inferenceAction })
	await agentLoop.apply({ context, model })
	console.log(JSON.stringify(context.getItems(), null, 2))
}

main().catch((error) => {
	console.error(error)
})
