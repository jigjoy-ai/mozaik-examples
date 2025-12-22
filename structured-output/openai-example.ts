import 'dotenv/config'
import { Agent, Command } from '@jigjoy-io/mosaic'

import z from 'zod'

const mealPlanSchema = z.object({
    calories: z.number(),
    meals: z.array(
        z.object({
            name: z.string(),
            description: z.string(),
            ingredients: z.array(z.string()).min(3)
        })
    ).length(1),
    shoppingList: z.array(z.string())
})

const request: Command = {
    model: 'gpt-5-mini',
    task: 'Create a 1-day vegetarian meal plan with breakfast, lunch, and dinner.',
    structuredOutput: mealPlanSchema
}

const agent = new Agent(request)

const response = await agent.act()
const result = mealPlanSchema.parse(response)

console.log(result)
