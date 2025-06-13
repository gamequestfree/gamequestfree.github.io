export class Action_Damage_Shoot extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)

		this.SetVars({
			Count: 1,
			Spawning: 2,
		})

		this.spawnedUID = []
	}

	OnAdded() {
		for (let i = 0; i < this.Count; i++) {
			const spawning = this.runtime.spawnManager.SpawnChara(this.Spawning, this.player.inst.x, this.player.inst.y)
			if (spawning) {
				this.spawnedUID.push(spawning.uid)
			}
		}
	}

	OnRemoved() {
		Stats.AddTo(this.Stat_From, -this.valueToGive)
	}

	GetInfo() {
		this.text = this.TranslateKey()
		this.ReplaceColor("0", this.Count, "green")
		this.Replace("1", this.Spawning)
		return this.text
	}
}
