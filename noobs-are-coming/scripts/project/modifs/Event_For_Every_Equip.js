export class For_Every_Equip extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)

		// For_Every_Equip|Item|Bait
		// For_Every_Equip|TagDiff|Weapon|Tier_1

		// Pour chaque [Arme de mélée] différent(e) de type [Feu] [Niveau1] que vous avez
		// Pour chaque [Appât] que vous avez

		this.SetVars({
			Kind: 1, // Item/Type/Diff/Tag/TagDiff
			Which: 2, // ex: Bait/Weapon
			Tags: 3,
		})

		this.previousCount = 0
	}

	OnAdded() {
		this.updateCount = (e) => this.UpdateCount()

		this.events.addEventListener("OnItem_Added", this.updateCount)
		this.events.addEventListener("OnItem_Removed", this.updateCount)
	}

	OnRemoved() {
		this.events.removeEventListener("OnItem_Added", this.updateCount)
		this.events.removeEventListener("OnItem_Removed", this.updateCount)
	}

	UpdateCount() {
		const count = this.GetForEveryCount()
		if (count !== this.previousCount) {
			this.Refresh()
			this.previousCount = count
		}
	}

	GetForEveryCount() {
		const player = this.player

		if (this.Kind === "Item") {
			//TODO
			return 0
		} else {
			let items = []

			if (this.Which === "Weapon") items = player.inventoryWeps.items
			else if (this.Which === "Item") items = player.inventory.items

			if (this.Kind.includes("Tag")) {
				const tags = this.Tags.split(" ")

				//filterByTag
				items = items.filter((item) => {
					for (const tag of tags) {
						if (!item.HasTag(tag)) return false
					}
				})
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

			return items.length
		}
	}

	GetInfo() {
		if (this.Kind === "Diff") this.translateKey = "For_Every_Diff"
		else if (this.Kind === "Tag") this.translateKey = "For_Every_Tag"
		else if (this.Kind === "TagDiff") this.translateKey = "For_Every_TagDiff"
		else this.translateKey = "For_Every"

		this.text = this.TranslateKey()
		this.Replace("0", this.GetTagsLoc(this.Which))
		this.Replace("1", this.GetTagsLoc(this.Tags))
		this.Replace("x", this.GetForEveryCountText())
		return this.text
	}
}
