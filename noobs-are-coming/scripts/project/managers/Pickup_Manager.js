export class Pickup_Manager {
	constructor(runtime) {
		this.runtime = runtime

		this.runtime.events.addEventListener("On_Wave_End", (e) => this.On_Wave_End())

		this.runtime.pickups
	}

	On_Wave_End() {
		//! Test

		const orbs = this.runtime.objects["Orb"].getAllInstances()
		for (const orb of orbs) {
			orb.destroy()
		}
	}
}
