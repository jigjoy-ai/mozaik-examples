import {
	AsyncAction,
	BaseCondition,
	Context,
	FunctionCall,
	FunctionCallOutput,
	GenerativeModel,
	Gpt54,
	InferenceRequest,
	ModelMessage,
	OpenAIResponses,
} from "@mozaik-ai/core"
import { Loop } from "@mozaik-ai/core"
import { getBirdTypeTool } from "../utils/tools/get-bird-type"

import "dotenv/config"

export class LoopCondition extends BaseCondition<{ context: Context; model: any }> {
	isSatisfiedBy({ context, model }: { context: Context; model: any }): boolean {
		console.log(context)
		const items = context.getItems()
		const lastItem = items[items.length - 1]
		if (lastItem instanceof ModelMessage) {
			return false
		}
		return true
	}
}

const condition = new LoopCondition()

export class InferenceAction implements AsyncAction<{ context: Context; model: any }> {
	async apply({
		context,
		model,
	}: {
		context: Context
		model: any
	}): Promise<{ context: Context; model: GenerativeModel }> {
		const request = new InferenceRequest(model, context)
		const openAiResponses = new OpenAIResponses()
		const response = await openAiResponses.infer(request)
		const newContextItems = response.contextItems
		context.applyModelOutput(newContextItems)

		const lastItem = newContextItems[newContextItems.length - 1]

		if (lastItem instanceof FunctionCall) {
			const callId = lastItem.callId
			const result = await getBirdTypeTool.invoke({})
			context.addItem(FunctionCallOutput.create(callId, result.bird_type))
		}
		return { context, model }
	}
}
const action: AsyncAction<{ context: Context; model: any }> = new InferenceAction()

const agentLoop = new Loop({ condition, action })
export default agentLoop
