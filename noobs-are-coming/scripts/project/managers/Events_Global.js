import { EventDispatcher } from "./EventDispatcher.js"

export class Events_Global extends EventDispatcher {
	constructor(runtime) {
		super(runtime)
	}

	dispatchEvent(e) {
		const players = this.runtime.players

		for (const player of players) {
			player.events.dispatchEvent(e)
		}

		// Call dispatcher directly to avoid recursion
		this.dispatcher.dispatchEvent(e)
	}
}
