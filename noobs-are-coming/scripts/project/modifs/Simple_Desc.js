C4.Modifs.Simple_Desc = class Simple_Desc extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)
		const itemManager = this.runtime.itemManager

		//this.name = "Desc_" + effectName

		this.name = effectName
		this.translateKey = this.name

		this.stackName = effectName
	}

	OnAdded() {
		//
	}

	OnRemoved() {
		//
	}

	GetInfo() {
		this.text = this.TranslateKey()

		//find [STAT_...] and replace with the stat translation
		let matches = this.text.match(/\[STAT_[^\]]+\]/g)
		if (matches) {
			for (const match of matches) {
				const statKey = match.replace("[", "").replace("]", "")
				this.text = this.text.replace(match, this.tr(statKey))
			}
		}

		return this.text
	}
}
