/**
 * Anthropic Claude Examples
 *
 * Note: Requires ANTHROPIC_API_KEY in .env file
 * Get your API key from: https://console.anthropic.com/settings/keys
 */

import "dotenv/config"
import { Command, Agent } from "@mozaik-ai/core"

// Using Claude Opus 4.5 for complex reasoning
async function complexReasoningExample() {
	console.log("\n=== Complex Reasoning with Claude Opus 4.5 ===\n")

	const command: Command = {
		messages: [
			{
				role: "system",
				content: "You are an expert in software architecture and design patterns",
			},
		],
		model: "claude-opus-4.5",
	}

	const agent = new Agent(command)
	const response = await agent.act(
		"Compare and contrast the Strategy pattern vs the State pattern. When should I use each?",
	)
	console.log(response)
}

// Run examples
async function main() {
	try {
		await complexReasoningExample()
	} catch (error) {
		console.error("Error:", error)
	}
}

main()
