import { Context, Gpt54, OpenAIResponses } from "@mozaik-ai/core"
import { UserMessage, DeveloperMessage } from "@mozaik-ai/core"
import { InMemoryContextRepository } from "./in-memory-context-repository"
import "dotenv/config"
import { InferenceRequest } from "@mozaik-ai/core"
import { Tool } from "@mozaik-ai/core"

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

	const tool: Tool = {
		name: "get_bird_type",
		description: "Get the type of bird for a joke",
		type: "function",
		parameters: {
			type: "object",
			properties: {
				bird_type: { type: "string" },
			},
			required: ["bird_type"],
		},
		strict: true,
		invoke: async () => {
			return {
				bird_type: "pigeon",
			}
		},
	}
	model.setTools([tool])
	const request = new InferenceRequest(model, context)
	const response = await openAiResponses.infer(request)
	const newContextItems = response.contextItems
	context.applyModelOutput(newContextItems)

	await contextRepository.save(context)
	const restoredContexts = await contextRepository.getByProjectId(projectId)
	console.log(JSON.stringify(restoredContexts, null, 2))
	console.log(response.tokenUsage)
}

main().catch((error) => {
	console.error(error)
})
