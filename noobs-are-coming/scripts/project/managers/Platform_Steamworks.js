export class Platform_Steamworks {
	constructor(runtime) {
		this.runtime = runtime

		const inst = runtime.objects["Steamworks"]?.getFirstInstance()

		if (inst) {
			this.inst = inst
			console.error("steamworks Inst", inst)
		}
	}

	async Achieve_Get(id) {
		await this.inst.unlockAchievement(id)
	}

	async Achieve_Clear(id) {
		await this.inst.clearAchievement(id)
	}
}
