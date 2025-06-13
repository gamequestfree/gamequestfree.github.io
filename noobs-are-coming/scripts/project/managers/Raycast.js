export class Raycast {
	constructor(runtime) {
		this.runtime = runtime
		this.runtime.events.addEventListener("OnGameStart", (e) => this.OnGameStart(e))
	}

	OnGameStart(e) {
		this.LOS = this.runtime.objects["LOS"].getFirstInstance().behaviors?.["LOS"]
		//if (this.LOS) window.alert("LOS found")
	}

	get range() {
		return this.LOS.range
	}
	set range(val) {
		this.LOS.range = val
	}

	TryFromInstToInst(inst1, inst2, range = 0) {
		if (range === 0) return false
		if (range) {
			this.LOS.range = range
		}
		return this.LOS.hasLOSBetweenPositions(inst1.x, inst1.y, 0, inst2.x, inst2.y)
	}
}
