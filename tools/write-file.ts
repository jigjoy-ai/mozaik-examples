import "dotenv/config"
import { promises as fs } from "fs"
import { Agent, Command, Tool } from "@mozaik-ai/core"

const tools: Tool[] = [
	{
		name: "write_file",
		description: "Write text to a file.",
		schema: {
			type: "object",
			properties: {
				filename: { type: "string" },
				content: { type: "string" },
			},
			required: ["filename", "content"],
		},
		async invoke({ filename, content }) {
			await fs.writeFile(filename, content, "utf8")
			return { ok: true }
		},
	},
]

const command: Command = {
	model: "gpt-5-mini",
	task: "Write a short summary about tool calling and save it to output.txt",
	tools: tools,
}

const agent = new Agent(command)
await agent.act()
