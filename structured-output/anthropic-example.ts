import "dotenv/config"
import { z } from "zod"
import { Agent, Command } from "@mozaik-ai/core"

const bugReportSchema = z.object({
	title: z.string(),
	severity: z.enum(["low", "medium", "high"]),
	summary: z.string(),
	reproductionSteps: z.array(z.string()).min(2),
	suggestedFix: z.string(),
})

const command: Command = {
	model: "claude-sonnet-4.5",
	messages: [
		{
			role: "system",
			content: "You are a senior QA engineer who writes concise bug reports.",
		},
	],
	task: "Turn the following testing notes into a bug report: App freezes after clicking export twice quickly.",
	structuredOutput: bugReportSchema,
}

const agent = new Agent(command)
const response = await agent.act()
const result = bugReportSchema.parse(response.data)
console.log(result)
