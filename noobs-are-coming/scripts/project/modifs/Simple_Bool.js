C4.Modifs.Simple_Bool = class Simple_Bool extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)
		const itemManager = this.runtime.itemManager

		this.simpleBoolName = effectName

		this.name = "Bool_" + effectName
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

		const simpleBoolData = this.runtime.itemManager.effectsEvents.simpleBools[this.simpleBoolName]

		if (simpleBoolData) {
			if (simpleBoolData === "neg") {
				this.text = `[c=${this.runtime.colorsText.Effect_Neg}]` + this.text + "[/c]"
			}
		}

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
