import { RuntimeContext } from "@/mozaik/src/domain/agent-loop/loop"
import { InferenceResponse, InferenceVisitor } from "@mozaik-ai/core"

export class TimeCounter implements InferenceVisitor {
	startTime: number = 0
	totalDuration: number = 0
	onStart(context: RuntimeContext): Promise<void> {
		this.startTime = Date.now()
		return Promise.resolve()
	}
	afterInference(inferenceResponse: InferenceResponse): Promise<void> {
		const endTime = Date.now()
		const duration = endTime - this.startTime
		console.log(`Inference duration: ${duration / 1000}s`)
		this.totalDuration += duration
		return Promise.resolve()
	}
	getTotalDuration(): number {
		return this.totalDuration / 1000
	}
}
