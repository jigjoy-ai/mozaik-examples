import { AgentRuntime, ModelContext, DeveloperMessage, Gpt54, UserMessage, AgentSociety, ModelMessage } from "@mozaik-ai/core"
import { getBirdTypeTool } from "../utils/tools/get-bird-type"
import { JokeTellerAgent } from "./joke-teller"
import { TimeCounter } from "./time-counter"
import "dotenv/config"

const agentRuntime = new AgentRuntime()
const agent = new JokeTellerAgent(agentRuntime)

agent.setInferenceVisitor(new TimeCounter())
const outputMessage = ModelMessage.rehydrate({ text: "Why did the pigeon quit his job? Because he was tired of working for breadcrumbs." })
const messageText = "Tell me a joke about cars"
const message = UserMessage.create(messageText)
const developerMessage = DeveloperMessage.create(
	"You are a joke teller. You will be given a joke and you will need to tell it to the user.",
)

const projectId = `pr-${crypto.randomUUID()}`
const context = ModelContext.create(projectId).addContextItem(outputMessage).addContextItem(developerMessage).addContextItem(message)

const model = new Gpt54()
model.setReasoningEffort("high")
model.setTools([getBirdTypeTool])

const society = new AgentSociety("Society")
society.start()
society.join(agent)
society.enter(messageText, model, context)
