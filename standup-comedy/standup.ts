import { AgentRuntime, Context, DeveloperMessage, Gpt54, UserMessage } from "@mozaik-ai/core"
import { getBirdTypeTool } from "../utils/tools/get-bird-type"
import { AgentSociety } from "./agent-society"
import { JokeTellerAgent } from "./joke-teller"
import { TimeCounter } from "./time-counter"
import "dotenv/config"

const agentRuntime = new AgentRuntime()
const agent = new JokeTellerAgent(agentRuntime)

agent.setInferenceVisitor(new TimeCounter())
const messageText = "Tell me a joke about birds"
const message = UserMessage.create(messageText)
const developerMessage = DeveloperMessage.create(
	"You are a joke teller. You will be given a joke and you will need to tell it to the user.",
)

const projectId = `pr-${crypto.randomUUID()}`
const context = Context.create(projectId).addItem(developerMessage).addItem(message)

const model = new Gpt54()
model.setReasoningEffort("high")
model.setTools([getBirdTypeTool])

const society = new AgentSociety("Society")
society.start()
society.join(agent)
society.enter(messageText, model, context)
