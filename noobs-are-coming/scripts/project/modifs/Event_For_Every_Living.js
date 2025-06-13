export class For_Every_Living extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)

		this.DataToEffects(effectData)

		// For_Every_Living|Chara|Landmine
		// For_Every_Living|TagDiff|Enemy|Tier_1

		// Pour chaque [Arme de mélée] différent(e) de type [Feu] [Niveau1] que vous avez
		// Pour chaque [Appât] que vous avez

		this.SetVars({
			Kind: 1, // Chara/Type/Diff/Tag/TagDiff
			Which: 2, // ex: Bait/Weapon
			Tags: 3,
		})
	}

	OnAdded() {
		this.onUnitCreated = (e) => this.OnLivingEvent(true, e)
		this.onUnitDestroyed = (e) => this.OnLivingEvent(false, e)

		this.globalEvents.addEventListener("OnUnit_Created", this.onUnitCreated)
		this.globalEvents.addEventListener("OnUnit_Destroyed", this.onUnitDestroyed)
	}

	OnRemoved() {
		this.globalEvents.removeEventListener("OnUnit_Created", this.onUnitCreated)
		this.globalEvents.removeEventListener("OnUnit_Destroyed", this.onUnitDestroyed)
	}

	OnLivingEvent(created, event) {
		const charaUnit = event.unit

		const offset = created ? 1 : -1

		if (this.Kind === "Chara") {
			if (charaUnit.id === this.Which) {
				this.count += offset
			}
		} else {
			if (this.Kind.includes("Tag")) {
				const tags = this.Tags.split(" ")

				for (const tag of this.tagsArr) {
					if (!charaUnit.HasTag(tag)) return false
				}
			}

			if (this.Kind.includes("Diff")) {
				const seen = new Set()
				items = items.filter((item) => {
					if (!seen.has(item.id)) {
						seen.add(item.id)
						return true
					}
					return false
				})
			}
		}
	}

	GetInfo() {
		if (this.Kind === "Diff") this.translateKey = "For_Every_Living_Diff"
		else if (this.Kind === "Tag") this.translateKey = "For_Every_Living_Tag"
		else if (this.Kind === "TagDiff") this.translateKey = "For_Every_Living_TagDiff"
		else this.translateKey = "For_Every_Living"

		this.text = this.TranslateKey()
		this.Replace("0", this.GetTagsLoc(this.Which))
		this.Replace("1", this.GetTagsLoc(this.Tags))
		this.Replace("x", "")
		return this.text
	}
}
