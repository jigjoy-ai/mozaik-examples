import {
	AsyncAction,
	BaseCondition,
	Context,
	FunctionCall,
	FunctionCallOutput,
	Gpt54,
	InferenceRequest,
	ModelMessage,
	OpenAIResponses,
} from "@mozaik-ai/core"
import { Loop } from "@mozaik-ai/core"
import { getBirdTypeTool } from "../utils/tools/get-bird-type"

import "dotenv/config"

export class LoopCondition extends BaseCondition<Context> {
	isSatisfiedBy(context: Context): boolean {
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
const model = new Gpt54()
model.setReasoningEffort("medium")
model.setTools([getBirdTypeTool])

export class InferenceAction implements AsyncAction<Context> {
	async apply(context: Context): Promise<Context> {
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
		return context
	}
}
const action: AsyncAction<Context> = new InferenceAction()

const agentLoop = new Loop({ condition, action })
export default agentLoop
