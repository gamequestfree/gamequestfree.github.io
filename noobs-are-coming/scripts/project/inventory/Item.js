export class Item {
	constructor(runtime, player, itemName, evolution = 0) {
		this.runtime = runtime
		this.name = itemName
		this.evolution = evolution
		this.nameEvo = Utils.GetNameEvo(this.name, evolution)

		this.player = player

		this.locked = false

		this.tags = new Set()
		this.effects = []
		this.quantity = 1

		this.inventory = null

		this.damages = new Set()

		//actually init data

		const itemData = this.runtime.loadedData["Items"].get(this.name)

		if (!itemData) {
			console.error("ItemData not found", this.name)
		}

		this.itemType = itemData?.ItemType || "Item"

		this.evoMax = itemData.EvoMax
		this.evoMin = itemData.EvoMin

		this.isEvoMax = this.evolution === this.evoMax
		this.isEvoMin = this.evolution === this.evoMin

		this.hideEffects = itemData.HideEffects || []

		this.price = Utils.ProcessEvoNumber(itemData.Price || 0, this.evolution)
		if (!this.price && this.itemType === "Item") {
			if (this.evolution === 0) this.price = 20
			else if (this.evolution === 1) this.price = 40
			else if (this.evolution === 2) this.price = 60
			else if (this.evolution === 3) this.price = 90
			else if (this.evolution === 4) this.price = 120
			else if (this.evolution === 5) this.price = 160
		}

		//override price for weapons for now
		if (!this.price && this.itemType === "Weapon") {
			this.defaultPrice = true
			if (this.evolution === 0) this.price = 15 //25 if wepCount > 3
			else if (this.evolution === 1) this.price = 30
			else if (this.evolution === 2) this.price = 60
			else if (this.evolution === 3) this.price = 100
			else if (this.evolution === 4) this.price = 120
			else if (this.evolution === 5) this.price = 160
		}

		this.itemDrop = itemData.ItemDrop ?? 1

		this.limitCount = Utils.ProcessEvoNumber(itemData.Limit, this.evolution) || Infinity

		this.AddTags("Tier_" + this.evolution)

		if (this.limitCount === 1) {
			this.AddTags("Unique")
		} else if (this.limitCount > 1 && this.limitCount < Infinity) {
			this.AddTags("Limited")
		}

		this.secretDescription = itemData.SecretDescription || false

		//! before DataToEffects (for Effect_SynergyCount)
		this.Synergies = []
		this.Synergies = Utils.TagsParamToArray(itemData.Synergies)
		this.AddTags(itemData.Synergies)
		this.AddTags(itemData.ItemTags)

		this.runtime.itemManager.DataToEffects(this, itemData.Effects, false)

		if (this.HasTag("Upgradable")) {
			this.upgradable = true
			this.upgradable_upgrade = false
			//this.runtime.itemManager.AddEffect(this, "ATK_Upgradable")
		}

		this.UID_Entity = 0

		this.dataClass = this.runtime.dataInstances["Items"].get(this.nameEvo)

		//weapon
		this.Wep_NameEvo = this?.dataClass?.Wep_NameEvo

		if (this.itemType === "Weapon") {
			this.AddTags("Weapon")
			this.AddTags(this.GetWep_DmgScale_Tags())
			this.limitCount = 1
		} else if (this.itemType === "Item") {
			this.AddTags("Upgrade")
		} else if (this.itemType === "Synergy") {
			this.AddTags("Synergy")
		} else if (this.itemType === "InvisibleItem") {
			this.AddTags("InvisibleItem")
		} else if (this.itemType === "Stat") {
			this.AddTags("Stat")
		} else if (this.itemType === "Difficulty") {
			this.AddTags("Difficulty")
		} else if (this.itemType === "Playable") {
			this.AddTags("Playable")
			this.charaClass = itemData.CharaClass

			if (itemData.Start_ATK) {
				this.Start_ATK = itemData.Start_ATK
				//console.error("Start_ATK", this.name, this.Start_ATK)
			}
		} else if (this.itemType === "Enemy") {
			this.AddTags("Enemy")
			this.enemyName = itemData.EnemyName
		} else if (this.itemType === "Hero") {
			this.AddTags("Hero")
			this.enemyName = itemData.EnemyName
		}

		//img

		this.img = itemData.Img
		this.AnimObject = itemData.Img_AnimObject
		if (this.AnimObject) {
			Object.defineProperty(this, "img", {
				get: () => this.runtime.dataManager.Get_AnimObjectUrl(this.AnimObject),
			})

			/*const url = this.runtime.dataManager.Get_AnimObjectUrl(this.AnimObject)
			if (url) this.img = url*/
		}

		if (itemData.RareATK) {
			this.RareATK = true
		}

		if (itemData?.LockedBy) {
			const stillLockInPreview = true
			if (!stillLockInPreview && itemData.LockedBy === "Dev" && this.runtime.platforms.Export === "preview") {
				//
			} else {
				this.locked = true
				this.lockedBy = itemData.LockedBy
			}
		}
	}

	CreateDamage(data) {
		const Damage = new C4.Damage(this.runtime, this.evolution, this.evoMin)
		Damage.SetDamageFromData(data)

		if (this.player) {
			Damage.charaUnit = this.player.unit
			Damage.playerIndex = this.player.playerIndex
		}

		//if (!name) name = Utils.generateUID()

		this.damages.add(Damage)
		return Damage
	}

	RemoveDamage(Damage) {
		Damage.ReleaseDamage()
		this.damages.delete(Damage)
	}

	GetItemDisplayKey() {
		return Utils.GetItemDisplayKey(this.name)
	}

	GetItemDisplayName(withRank = true) {
		let displayName = Utils.GetItemDisplayName(this.name)

		if (this.itemType === "Weapon" && withRank && this.evolution > 0) {
			const romanMap = {
				1: "I",
				2: "II",
				3: "III",
				4: "IV",
				5: "V",
				6: "VI",
				7: "VII",
				8: "VIII",
				9: "IX",
				10: "X",
			}

			const romanNumeral = romanMap[this.evolution + 1]
			if (romanNumeral) {
				displayName += " (" + romanNumeral + ")"
			}
		}

		return displayName
	}

	/*
	async CheckImage() {
		if (!this.img) {
			this.img = "random_icon.png"
			return
		}
		if (this.img) {
			await fetch(this.img)
				.then((response) => {
					if (!response.ok) {
						console.error("Image not found", this.img)
						this.img = "random_icon.png"
					}
				})
				.catch((error) => {
					console.error("Image not found", this.img)
					this.img = "random_icon.png"
				})
		}
	}*/

	Get_Sell_Value() {
		//!todo inflation based
		//console.error("🎡 Get_Sell_Value", this.price, this.player.stats.GetStatValue("Sell_Value"))

		if (!this.price_sellBase) this.price_sellBase = this.price * Utils.random(0.2, 0.3)
		let recycleValue = this.price_sellBase * this.player.stats.GetStatValue("Sell_Value")
		recycleValue = Math.floor(recycleValue)
		recycleValue = Math.max(recycleValue, 1)
		return recycleValue
	}

	get wepDataInst() {
		return this.runtime.dataInstances["Weps"].get(this.nameEvo)
	}

	GetWepInfo(player, tooltip) {
		this.wepDataInst.GetWepInfo(this, player, tooltip)
	}

	GetWep_DmgScale_Tags() {
		const damageDataInst = this.wepDataInst.DamageDataInst
		const tags = []
		for (const statBonus of damageDataInst.StatBonuses) {
			tags.push("STAT_" + statBonus.stat)
		}
		return tags
	}

	GetWep_DmgScale_Weights() {
		const damageDataInst = this.wepDataInst.DamageDataInst
		const statBonuses = damageDataInst.StatBonuses

		const total = statBonuses.reduce((sum, bonus) => sum + bonus.value, 0)

		let ret = null

		if (total === 0) {
			// Avoid division by zero (should never happen)
			ret = statBonuses.map((bonus) => ({ stat: bonus.stat, weight: 0 }))
		} else {
			ret = statBonuses.map((bonus) => ({
				stat: "STAT_" + bonus.stat,
				weight: bonus.value / total,
			}))
		}

		//console.error("DmgScales for ATK", this.name, ret)

		return ret
	}

	Get_WepATK_Stats(tooltip) {
		const wep = this.actualWep
		if (!wep) return
		wep.Get_WepATK_Stats(tooltip)
	}

	HasTag(tag) {
		return this.tags.has(tag)
	}

	HasTags_All(tags) {
		const tagsArray = Utils.TagsParamToArray(tags)
		for (const tag of tagsArray) {
			if (!this.tags.has(tag)) return false
		}
		return true
	}

	HasTags_Any(tags) {
		const tagsArray = Utils.TagsParamToArray(tags)
		//console.error("HasTags_Any", tagsArray, "this.tags", this.tags)
		for (const tag of tagsArray) {
			if (this.tags.has(tag)) return true
		}
		return false
	}

	AddTags(...tags) {
		const tagsArray = Utils.TagsParamToArray(...tags)

		for (const tag of tagsArray) {
			//if (tag === undefined) console.error("tag is undefined, param was", tags)
			this.tags.add(tag)
		}
	}

	Apply() {
		if (this.runtime.layout.name !== "GAME") return

		this.ApplyWep()
		this.ApplyPlayable()

		for (const effect of this.effects) {
			effect.OnAdded_()
		}

		if (this.itemType === "Enemy") {
			this.runtime.spawnManager.SpawnChara(this.enemyName)
			//this.runtime.waveManager.noSpawnThisWave = true
		}
		if (this.itemType === "Hero") {
			/*this.runtime.spawnManager.SpawnChara(this.enemyName)
			this.runtime.waveManager.noSpawnThisWave = true*/

			this.runtime.movie.heroes.push(this.enemyName)
			//this.runtime.waveManager.noSpawnThisWave = true
		}
	}

	RemoveItemFromInventory() {
		if (this.inventory) {
			this.inventory.RemoveItem(this)
		}
	}

	ItemRemove() {
		this.inventory = null

		this.RemoveWep()

		for (const effect of this.effects) {
			effect.OnRemoved_()
		}
	}

	get actualWep() {
		return this.runtime.getUnitByUID(this.wepUID)
	}

	ApplyWep() {
		if (this.itemType === "Weapon") {
			//window.alert("ApplyWep " + this.name)
			if (this.Wep_NameEvo) {
				const actualWeapon = this.runtime.spawnManager.SpawnWep(this.Wep_NameEvo)

				this.wepUID = actualWeapon.uid

				//console.error("Apply weapon item", this.Wep_NameEvo, this)
				//console.error("Apply weapon item actualWeapon", actualWeapon)
				if (actualWeapon) {
					actualWeapon.item = this
					//console.error("❌ Apply weapon item actualWeapon", this.Wep_NameEvo, this.player, this.player.unit)
					this.player.unit.AddAutoWep(actualWeapon)
				}

				//* add a watercan if the player doesn't have a water attack
				if (this.HasTag("Give_Water")) {
					const waterAtks = this.player.inventoryWeps.items.filter((item) => item.Synergies.includes("Water"))
					if (waterAtks.length === 0) {
						this.player.inventoryWeps.AddItemByName("Wep_Watercan", 0, 1, true)
					}
				}
			}
		}
	}

	RemoveWep(destroy = true) {
		if (this.itemType === "Weapon") {
			this.player.unit.RemoveAutoWep(this.actualWep, destroy)
		}
	}

	ApplyPlayable() {
		if (this.HasTag("Playable")) {
			const playerUnit = this.player.unit
			//only set anim for the first
			if (this.player.inventory.items[0] === this) {
				playerUnit.SetAnimObject(this.AnimObject)
			} else {
				playerUnit.AddOrbit_Mergo(this.AnimObject)
			}
		}
	}

	//infos utils

	Color(text, color) {
		if (text === "") return ""
		return "[c=" + color + "]" + text + "[/c]"
	}

	Translate(key) {
		return this.runtime.translation.Get(key)
	}

	GetTypeLoc(color = "") {
		let text = ""

		if (this.itemType === "Weapon") {
			text = this.GetTagsLoc(this.Synergies, "rgb(255, 140, 9)", ", ")
			//#ff005d
			/*
			text = this.Translate("Attack")
			text = this.Color(text, "#yellow")*/
			//text = this.Color(text, "#ff639c")
		} else if (this.itemType === "Playable") {
			text = this.Translate("Boss")
			if (this.name.includes("Overboy")) text = this.Translate("Final Boss")
			text = this.Color(text, "yellow")
		} else if (this.itemType === "Item") {
			text = this.Translate("Item")

			if (this.limitCount > 0 && this.limitCount < Infinity) {
				text += ", "
				if (this.limitCount === 1) {
					text += this.Translate("ItemType_Unique")
				} else {
					text += this.Translate("ItemType_Limited")
					text = text.replace("{0}", this.limitCount)
				}
			}

			text = this.Color(text, "yellow")
		} else if (this.name === "Item Random") {
			return ""
		} else if (!this.itemType) {
			return ""
		} else {
			text = this.Translate(this.itemType)
			text = this.Color(text, "yellow")
		}
		text = Utils.parseBBCode(text)
		return text
	}

	GetTagsLoc(tags, color = "yellow", sep = ", ", statImg = false) {
		if (!tags) return ""
		if (!Array.isArray(tags)) {
			tags = tags.split("/")
		}

		if (sep === "SEP_OR") {
			sep = this.runtime.translation.Get("SEP_OR")
		}

		let tagsLocalized = ""
		for (let i = 0; i < tags.length; i++) {
			const tag = tags[i]
			let tagLoc = this.Translate(tag)

			/*if (tag === "Upgradable") {
				tagLoc = this.Translate("Upgrade")
			}*/

			//tagLoc = "[" + tagLoc + "]"
			if (i > 0) tagsLocalized += sep
			tagsLocalized += tagLoc

			if (statImg) {
				const tagStat = tag.replace("STAT_", "")
				if (this.player.stats.primaryStats.includes(tagStat)) {
					tagsLocalized += " " + Utils.GetStatImg(tagStat)
				}
			}
		}

		if (color) {
			tagsLocalized = this.Color(tagsLocalized, color)
			tagsLocalized = Utils.parseBBCode(tagsLocalized)
		}

		return tagsLocalized
	}
}
