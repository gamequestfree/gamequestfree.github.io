export class Action_Spawn_Potion_Random extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)
	}

	OnAdded() {
		/*
		for (let i = 0; i < this.Count; i++) {
			const spawning = this.runtime.spawnManager.SpawnChara(this.Spawning, this.player.inst.x, this.player.inst.y)
			if (spawning) {
				this.spawnedUID.push(spawning.uid)
			}
		}*/
	}
}
