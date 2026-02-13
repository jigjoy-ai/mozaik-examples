import { MozaikRequest, PlanningMozaikAgent, Workflow } from "@mozaik-ai/core"
import "dotenv/config"

const request: MozaikRequest = {
	model: "gpt-5",
}
const planner = new PlanningMozaikAgent(request)
const workflow: Workflow = await planner.planFromGoal("Implement login functionality ")
console.log(workflow)
// await workflow.execute()
