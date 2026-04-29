import {
	AgenticEnvironment,
} from "@mozaik-ai/core"
import { MyParticipant } from "./participant"
import { MyInferenceHandler } from "./inference-handler"
import { MyMessageGenerator } from "./message-generator"
import { MyToolExecutor } from "./tool-executor"

const toolExecutor = new MyToolExecutor()
const messageGenerator = new MyMessageGenerator()
const inferenceHandler = new MyInferenceHandler()

const mijura = new MyParticipant("mijura", toolExecutor, messageGenerator, inferenceHandler)
const lotus = new MyParticipant("lotus", toolExecutor, messageGenerator, inferenceHandler)

const environment = new AgenticEnvironment()
environment.start()
mijura.join(environment)
lotus.join(environment)
mijura.sendMessage("Hello, how are you?", environment)
lotus.sendMessage("I'm fine, thank you!", environment)

environment.stop()
