import { defineRuntime, RuntimeState } from "@mozaik-ai/core"

export class Conversation {
	private constructor(
		private turns: number,
		private inFlight: number,
		private readonly maxTurns: number,
		private closed: boolean,
	) {}

	getTurns(): number {
		return this.turns
	}

	getMaxTurns(): number {
		return this.maxTurns
	}

	canStartTurn(): boolean {
		return !this.closed && this.turns + this.inFlight < this.maxTurns
	}

	startTurn(): boolean {
		if (!this.canStartTurn()) {
			return false
		}

		this.inFlight++
		return true
	}

	endTurn(): number {
		if (this.inFlight > 0) {
			this.inFlight--
		}

		if (this.turns < this.maxTurns) {
			this.turns++
		}

		return this.turns
	}

	isComplete(): boolean {
		return this.turns >= this.maxTurns
	}

	isSettled(): boolean {
		return this.isComplete() && this.inFlight === 0
	}

	tryClose(): boolean {
		if (this.closed || !this.isSettled()) {
			return false
		}

		this.closed = true
		return true
	}

	static init(maxTurns: number): Conversation {
		return new Conversation(0, 0, maxTurns, false)
	}
}

export class EnvironmentState extends RuntimeState {
	constructor(public readonly conversation: Conversation) {
		super()
	}
}

export const { initializeRuntime, resolveRuntime, resolveParticipant, join, leave, sendMessage, sendEvent, runLoop } =
	defineRuntime<EnvironmentState>()
