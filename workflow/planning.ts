import { Command, PlanningAgent, Workflow } from "@jigjoy-io/mosaic"
import "dotenv/config"

const command: Command = {
	model: "gpt-5",
}
const planner = new PlanningAgent(command)
const workflow: Workflow = await planner.planFromGoal("Implement login functionality ")
console.log(workflow)
// await workflow.execute()
