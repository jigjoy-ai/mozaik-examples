/**
 * Anthropic Claude Examples
 *
 * Note: Requires ANTHROPIC_API_KEY in .env file
 * Get your API key from: https://console.anthropic.com/settings/keys
 */

import "dotenv/config"
import { Agent, Command } from "@jigjoy-io/mosaic"

// Multi-turn conversation with Claude Haiku 4.5
async function conversationExample() {
	console.log("\n=== Multi-turn Conversation with Claude Haiku 4.5 ===\n")

	const command: Command = {
		messages: [
			{ role: "system", content: "You are an expert TypeScript developer" },
			{ role: "user", content: "What are generics in TypeScript?" },
			{ role: "assistant", content: "Generics in TypeScript allow you to write reusable, type-safe code..." },
		],
		model: "claude-haiku-4.5",
	}

	const agent = new Agent(command)
	const response = await agent.act("Can you show me a practical example?")
	console.log(response)
}

// Run examples
async function main() {
	try {
		await conversationExample()
	} catch (error) {
		console.error("Error:", error)
	}
}

main()
