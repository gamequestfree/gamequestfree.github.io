export class Effect_Init_ATK_Slot extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)

		this.Count = effectData
	}

	OnAdded() {
		this.player.stats.GetStat("ATK_Slot").ChangeBase(this.Count)
	}

	GetInfo() {
		this.text = this.Translate("Effect_Init_ATK_Slot")
		if (this.Count >= 6) {
			this.ReplaceColor("0", this.Count, "green")
		} else this.ReplaceColor("0", this.Count, "red")

		return this.text
	}
}
