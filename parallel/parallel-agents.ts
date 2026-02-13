import "dotenv/config"
import { MozaikAgent, MozaikRequest, Message } from "@mozaik-ai/core"

const messages: Message[] = [
	{
		role: "system",
		content: "You are a helpful AI assistant specialized in technology and programming",
	},
]
// Create OpenAI agent configuration
const openaiRequest: MozaikRequest = {
	messages: messages,
	model: "gpt-5.1",
}

// Create Anthropic agent configuration
const anthropicRequest: MozaikRequest = {
	messages: messages,
	model: "claude-sonnet-4.5",
}

const openaiMozaikAgent = new MozaikAgent(openaiRequest)
const anthropicMozaikAgent = new MozaikAgent(anthropicRequest)

const task = "What are the key differences between TypeScript and JavaScript? Provide a concise answer."

console.log("MozaikAgents working in parallel...")
const [openaiResponse, anthropicResponse] = await Promise.all([
	openaiMozaikAgent.act(task),
	anthropicMozaikAgent.act(task),
])
console.log("MozaikAgents finished with reasoning.")

function wordCount(text: string): number {
	return text.trim().split(/\s+/).length
}

console.log("GPT words:", wordCount(openaiResponse))
console.log("Claude words:", wordCount(anthropicResponse))
