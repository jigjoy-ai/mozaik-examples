import { Tool } from "@mozaik-ai/core"

export const getBirdTypeTool: Tool = {
	name: "get_bird_type",
	description: "Get the type of bird for a joke",
	type: "function",
	parameters: {
		type: "object",
		properties: {
			bird_type: { type: "string" },
		},
		required: ["bird_type"],
	},
	strict: true,
	invoke: async () => {
		return {
			bird_type: "pigeon",
		}
	},
}
