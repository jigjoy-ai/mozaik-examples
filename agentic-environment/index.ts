import { AgenticEnvironment, Gpt54, ModelContext, OpenAIInferenceRunner } from "@mozaik-ai/core"
import { MyParticipant } from "./participant"
import { DefaultFunctionCallRunner } from "./function-call-runner"
import { InputSource } from "./input-item-source"
import { capitalOfFranceTool } from "./capital-of-france-tool"
import { ReactiveAgent } from "./reactive-agent"
import { TranscriptLogger } from "./tanscript-logger"
import "dotenv/config"

const functionCallRunner = new DefaultFunctionCallRunner([capitalOfFranceTool])
const inputSource = new InputSource()
const inferenceRunner = new OpenAIInferenceRunner()

const mijura = new MyParticipant("mijura", inputSource, inferenceRunner, functionCallRunner)
const context = ModelContext.create("pr-1")
const model = new Gpt54()
const environment = new AgenticEnvironment()
const lotus = new ReactiveAgent(inputSource, inferenceRunner, functionCallRunner, environment, context, model)
const logger = new TranscriptLogger()
environment.start()
mijura.join(environment)
lotus.join(environment)
logger.join(environment)
mijura.streamInput(environment)
