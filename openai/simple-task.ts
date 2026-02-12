import "dotenv/config"
import { Command, Agent } from "@mozaik-ai/core"

const command: Command = {
	messages: [
		{
			role: "system",
			content: "You are the weather assistent",
		},
	],
	task: "What is the weather in Serbia",
	model: "gpt-5",
}

const agent = new Agent(command)
const response = await agent.act()
console.log(response)
