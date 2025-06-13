//!revertable ?

export class Action_Convert extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)

		this.SetVars({
			Count: 1,
			Spawning: 2,
		})
	}

	OnAdded() {
		this.valueToGive = ((Stats.Get(this.Stat_From) * this.PercentToConvert) / 100 / this.ForEach) * this.Give
		Stats.AddTo(this.Stat_To, this.valueToGive)
	}

	OnRemoved() {
		Stats.AddTo(this.Stat_From, -this.valueToGive)
	}
}
