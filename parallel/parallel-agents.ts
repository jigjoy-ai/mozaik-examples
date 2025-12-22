
import 'dotenv/config'
import { Agent, Command, Message } from '@jigjoy-io/mosaic'

const messages: Message[] = [{
    role: 'system',
    content: 'You are a helpful AI assistant specialized in technology and programming'
}]
// Create OpenAI agent configuration
const openaiRequest: Command = {
    messages: messages,
    model: 'gpt-5'
}

// Create Anthropic agent configuration
const anthropicRequest: Command = {
    messages: messages,
    model: 'claude-sonnet-4.5'
}

const openaiAgent = new Agent(openaiRequest)
const anthropicAgent = new Agent(anthropicRequest)

const task = 'What are the key differences between TypeScript and JavaScript? Provide a concise answer.'

console.log("Agents working in parallel...")
const [openaiResponse, anthropicResponse] = await Promise.all([
    openaiAgent.act(task),
    anthropicAgent.act(task)
])
console.log("Agents finished with reasoning.")


function wordCount(text: string): number {
    return text.trim().split(/\s+/).length
}

console.log('OpenAI words:', wordCount(openaiResponse))
console.log('Anthropic words:', wordCount(anthropicResponse))
