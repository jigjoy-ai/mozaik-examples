import { MozaikRequest, PlanningAgent, ReasoningEffort, Workflow } from "@mozaik-ai/core"
import "dotenv/config"

const request: MozaikRequest = {
	model: "gpt-5.4",
	reasoningEffort: ReasoningEffort.HIGH,
}
const planner = new PlanningAgent(request)
const workflow: Workflow = await planner.planFromGoal("Implement login functionality ")
console.log(workflow)
// await workflow.execute()
