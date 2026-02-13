import "dotenv/config"
import { promises as fs } from "fs"
import { MozaikAgent, MozaikRequest, Tool } from "@mozaik-ai/core"

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

const request: MozaikRequest = {
	model: "gpt-5-mini",
	task: "Write a short summary about tool calling and save it to output.txt",
	tools: tools,
}

const agent = new MozaikAgent(request)
await agent.act()
