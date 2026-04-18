import { Context, DeveloperMessage, UserMessage } from "@mozaik-ai/core"
import agentLoop from "./agent-loop"

const message = UserMessage.create("Tell me a joke about birds")
const developerMessage = DeveloperMessage.create(
	"You are a joke teller. You will be given a joke and you will need to tell it to the user.",
)

const projectId = `pr-${crypto.randomUUID()}`
const context = Context.create(projectId).addItem(developerMessage).addItem(message)

async function main() {
	await agentLoop.apply(context)
	console.log(JSON.stringify(context.getItems(), null, 2))
}

main().catch((error) => {
	console.error(error)
})
