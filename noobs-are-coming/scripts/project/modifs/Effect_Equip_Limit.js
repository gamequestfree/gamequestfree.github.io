export class Effect_Equip_Limit extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)

		this.SetVars({
			Count: "value",
			ActualFX: 1, //Only/No/Max/TierMax/TierMin
			"?Tags": 2,
		})

		if (this.ActualFX === "Max" && this.Count === 0) {
			this.ActualFX = "No"
		}

		this.stackName = "Equip_Limit"
	}

	/*
    Equip_Limit: You can only equip: {0} {1} of type {2} at a time

    Equip_Limit|Only|Minion/Melee: 0
    Equip_Limit|Only|Minion/Melee: 0

    Equip_Limit|Max|Melee: 0
    Equip_Limit|TierMin|Sbire: 2
    */

	OnAdded() {
		//
	}

	OnRemoved() {
		//
	}

	GetInfo() {
		this.translateKey = "Effect_Equip_Limit|" + this.ActualFX

		if (this.Tags) this.translateKey += "|Tags"
		this.text = this.TranslateKey()

		let tagsColor = "yellow"

		if (this.ActualFX === "No") {
			tagsColor = "red"
		}

		let tagsString = this.GetTagsLoc(this.Tags, tagsColor, "SEP_OR", true)

		this.Replace("tags", tagsString)

		this.ReplaceColor("count", this.Count, "red")

		if (this.text.includes("{tier}")) {
			let tierText = this.Count
			tierText = "[c=" + this.runtime.style.GetTierColor(this.Count) + "]" + tierText + "[/c]"
			this.Replace("tier", tierText)
		}

		const color = this.runtime.colorsText.Effect_Neg

		this.text = `[c=${color}]` + this.text + "[/c]"

		return this.text
	}
}
