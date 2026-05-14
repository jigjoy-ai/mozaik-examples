import {
	AgenticEnvironment,
	Gpt54,
	ModelContext,
	OpenAIInferenceRunner,
	DefaultFunctionCallRunner,
	InputStream,
	BaseHumanParticipant,
} from "@mozaik-ai/core"
import { capitalOfFranceTool } from "./capital-of-france-tool"
import { ReactiveAgent } from "./reactive-agent"
import { TranscriptLogger } from "./transcript-logger"
import "dotenv/config"

class InputSource implements InputStream {
	async *stream(signal?: AbortSignal): AsyncIterable<string> {
		yield "What is the capital of France?"
	}
}

const functionCallRunner = new DefaultFunctionCallRunner([capitalOfFranceTool])
const inputSource = new InputSource()
const inferenceRunner = new OpenAIInferenceRunner()

const context = ModelContext.create("pr-1")
const model = new Gpt54()
model.setTools([capitalOfFranceTool])

const environment = new AgenticEnvironment()
const lotus = new ReactiveAgent(inputSource, inferenceRunner, functionCallRunner, environment, context, model)
const logger = new TranscriptLogger()
environment.start()
lotus.join(environment)
logger.join(environment)

lotus.onMessage("What is the capital of France?")
