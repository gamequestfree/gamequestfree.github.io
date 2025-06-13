//!WIP

export default class Effect_LevelUp extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)

		this.SetVars({
			type: 1,
			Value: "value",
		})

		this.gained = 0
	}

	OnAdded() {
		this.player.stats.Stat_Add(this.Stat, this.Value, this.IsPermanent())
	}

	OnRemoved() {
		this.player.stats.Stat_Add(this.Stat, -this.Value, this.IsPermanent())
		this.PopInfo(-this.Value)
	}

	IsPermanentButGained() {
		if (!this.parent) return false
		if (!this.IsPermanent()) return false
		return true
	}

	GetInfo() {
		return this.text
	}
}
