import { Context, GPT54, OpenAIResponses } from "@mozaik-ai/core"
import { UserMessage, DeveloperMessage } from "@mozaik-ai/core"
import { InMemoryContextRepository } from "./in-memory-context-repository"
import "dotenv/config"
import { InferenceRequest } from "@mozaik-ai/core"

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

	const model = new GPT54()
	model.setReasoningEffort("medium")
	const request = new InferenceRequest(model, context)
	const newContextItems = await openAiResponses.infer(request)
	context.applyModelOutput(newContextItems)

	await contextRepository.save(context)
	const restoredContexts = await contextRepository.getByProjectId(projectId)
	console.log(restoredContexts)
}

main().catch((error) => {
	console.error(error)
})
