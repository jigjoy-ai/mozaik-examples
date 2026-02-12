import "dotenv/config"
import { promises as fs } from "fs"
import { Agent, Command, Tool } from "@mozaik-ai/core"

const tools: Tool[] = [
	{
		name: "read_file",
		description: "Read text content from a file.",
		schema: {
			type: "object",
			properties: {
				filename: { type: "string" },
			},
			required: ["filename"],
		},
		async invoke({ filename }) {
			const content = await fs.readFile(filename, "utf8")
			return { content }
		},
	},
]

async function runReadFileExample() {
	const command: Command = {
		model: "gpt-5.1",
		tools,
		messages: [
			{
				role: "system",
				content: "Read files from disk using the tool and summarize their contents.",
			},
		],
		task: "Read the file trip-checklist.txt and tell me what items are on the checklist.",
	}

	const agent = new Agent(command)
	const response = await agent.act()
	console.log(JSON.stringify(response, null, 2))
}

runReadFileExample().catch((error) => {
	console.error("Read-file tool example failed:", error)
})
