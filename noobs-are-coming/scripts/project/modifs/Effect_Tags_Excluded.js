export class Effect_Tags_Excluded extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)

		this.tags = Utils.TagsParamToArray(effectData)

		this.stackName = "Tags_Excluded"
	}

	GetInfo() {
		if (!this.runtime.main.IsDev()) return ""

		this.text = this.TranslateKey()

		const color = this.runtime.colorsText.Effect_Neg
		this.text = `[c=${color}]` + this.text + "[/c]"

		this.tagString = this.tags.join(", ")
		this.ReplaceColor("0", this.tagString, "white")

		return this.text
	}
}
