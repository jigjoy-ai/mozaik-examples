import { AgenticEnvironment, BaseHumanParticipant, DefaultFunctionCallRunner, Gpt54, ModelContext, OpenAIInferenceRunner } from "@mozaik-ai/core"
import { HumanInput } from "./human"
import { TerminalAgent, TerminalAgentInputSource, terminalTools } from "./agent"

const environment = new AgenticEnvironment()
const inputSource = new TerminalAgentInputSource('')
const inferenceRunner = new OpenAIInferenceRunner()
const functionCallRunner = new DefaultFunctionCallRunner(terminalTools)
const context = ModelContext.create("terminal-agent")
const model = new Gpt54()
model.setTools(terminalTools)
model.setReasoningEffort("high")

const agent = new TerminalAgent(inputSource, inferenceRunner, functionCallRunner, environment, context, model)
const human = new BaseHumanParticipant(new HumanInput())
human.join(environment)
agent.join(environment)

environment.start()
human.streamInput(environment)