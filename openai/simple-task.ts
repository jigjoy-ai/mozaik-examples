import "dotenv/config"
import { MozaikRequest, MozaikAgent } from "@mozaik-ai/core"

const request: MozaikRequest = {
	messages: [
		{
			role: "system",
			content: "You are the weather assistent",
		},
	],
	task: "What is the weather in Serbia",
	model: "gpt-5",
}

const agent = new MozaikAgent(request)
const response = await agent.act()
console.log(response)
