/**
 * Anthropic Claude Examples
 *
 * Note: Requires ANTHROPIC_API_KEY in .env file
 * Get your API key from: https://console.anthropic.com/settings/keys
 */

import "dotenv/config"
import { Agent, Command } from "@jigjoy-io/mosaic"

// Simple prompt with Claude Sonnet 4.5
async function simpleExample() {
	console.log("\n=== Simple Claude Sonnet 4.5 Example ===\n")

	const command: Command = {
		messages: [
			{
				role: "system",
				content: "You are a helpful AI assistant specialized in explaining complex topics simply",
			},
		],
		model: "claude-sonnet-4.5",
	}

	const agent = new Agent(command)
	const prompt = "Explain quantum entanglement in 2-3 sentences for a beginner"

	let response = await agent.act(prompt)
	console.log(response)
}

// Run examples
async function main() {
	try {
		await simpleExample()
	} catch (error) {
		console.error("Error:", error)
	}
}

main()
