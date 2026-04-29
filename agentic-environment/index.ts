import {
	AgenticEnvironment,
} from "@mozaik-ai/core"
import { MyParticipant } from "./participant"
import { DefaultFunctionCallRunner } from "./function-call-runner"
import { DefaultInferenceRunner } from "./inference-runner"
import { InputSource } from "./input-item-source"

const functionCallRunner = new DefaultFunctionCallRunner()
const inputSource = new InputSource()
const inferenceRunner = new DefaultInferenceRunner()

const mijura = new MyParticipant("mijura", inputSource, inferenceRunner, functionCallRunner)
const lotus = new MyParticipant("lotus", inputSource, inferenceRunner, functionCallRunner)

const environment = new AgenticEnvironment()
environment.start()
mijura.join(environment)
lotus.join(environment)
mijura.streamInput(environment)

environment.stop()
