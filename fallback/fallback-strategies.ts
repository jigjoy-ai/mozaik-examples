/**
 * Fallback Strategies Example
 *
 * Minimal example of a fallback strategy across different providers using setModel().
 * Tries Anthropic first, and on error falls back to OpenAI inside a single try/catch.
 */

import "dotenv/config"
import { MozaikAgent, MozaikRequest } from "@mozaik-ai/core"

const request: MozaikRequest = {
	messages: [
		{
			role: "user",
			content: "Explain why it can be useful to have a fallback between AI providers.",
		},
	],
	model: "claude-sonnet-4.5",
}

const agent = new MozaikAgent(request)

try {
	console.log("Calling Anthropic (primary)...")
	const primary = await agent.act()
	console.log(primary)
} catch (error) {
	console.warn("Primary model failed, falling back to OpenAI...")
	agent.setModel("gpt-5")
	const fallback = await agent.act()
	console.log(fallback)
}
