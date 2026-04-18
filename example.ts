import { Context, Gpt54, InMemoryContextRepository, OpenAIResponses } from "@mozaik-ai/core"
import { UserMessage, DeveloperMessage } from "@mozaik-ai/core"
import { InferenceRequest } from "@mozaik-ai/core"
import "dotenv/config"
import { getBirdTypeTool } from "./utils/tools/get-bird-type"

async function main() {
	const message = UserMessage.create("Tell me a joke about birds")
	const developerMessage = DeveloperMessage.create(
		"You are a joke teller. You will be given a joke and you will need to tell it to the user.",
	)

	const projectId = `pr-${crypto.randomUUID()}`
	const contextRepository = new InMemoryContextRepository()
	const context = Context.create(projectId).addItem(developerMessage).addItem(message)

	await contextRepository.save(context)

	const openAiResponses = new OpenAIResponses()

	const model = new Gpt54()
	model.setReasoningEffort("medium")

	model.setTools([getBirdTypeTool])
	const request = new InferenceRequest(model, context)
	const response = await openAiResponses.infer(request)
	const newContextItems = response.contextItems
	context.applyModelOutput(newContextItems)

	await contextRepository.save(context)
}

main().catch((error) => {
	console.error(error)
})
