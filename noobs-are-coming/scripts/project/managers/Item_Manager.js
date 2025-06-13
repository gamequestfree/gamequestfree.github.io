const effectsEvents = {
	effectsJustDesc: {
		Attack_Kickable: "",
	},
	simpleBools: {
		Structs_CloseEachOther: "",
		Trees_DieOneHit: "",

		Snake_Weps: "",
		Flying: "",

		Potion_Cork: "",
		HP_Regen_Doubled: "",

		Melee_AllAlternates: "",
		Weps_RandomAim: "",
		Weps_FixedAim: "",
		Weps_NoMinRange: "",
		Weps_InvertSweepThrust: "",
		Weps_OnlyThrust: "",
		All_ATK_Synergize: "",
		All_ATK_SynergiesAreMaxed: "",
		CantEquip_ATK_Twice: "neg",
		NoStatOnLevelUp: "neg",

		Shop_MoneyIsHP: "",
		Shop_NoATK: "neg",
		Shop_OnlySameATK: "",

		Cant_ATK_Upgrade: "neg",
		Cant_ATK_Sell: "neg",
		Cant_Shop_Lock: "neg",

		Cant_Attack: "neg",
		Cant_StopMoving: "neg",
		Cant_Move: "neg",

		NoCrit: "neg",
		Skill_Close: "",

		Kickable_Disks: "",
		Kickable_Turrets: "",
		Kickable_Statues: "",

		CollectSouls_Minion: "",
		CollectSouls_Kickable: "",

		Attract_Kickables: "",
		Attract_Turrets: "",
		Turrets_CloseEachOther: "",

		No_Heal: "neg",
		No_Heal_BetweenWaves: "neg",

		Cheat_Unique: "",
		Skill_Ball_Control: "",
	},

	hitEvents: ["On_Hit"],

	simpleEvents: [
		"On_Noob_Death",
		"On_Noob_Username_Death",

		"On_Pickup_Soul",
		"On_Pickup_Soul_Golden",
		"On_Pickup_Soul_Red",

		//"On_Pickup_Coin",
		"On_Pickup_Chest",
		"On_Pickup_Mushroom",
		"On_Pickup_HP",
		"On_Pickup_PowerOrb",

		"On_Potion",
		"On_Potion_HP_Max",

		"On_Spawn_Blocked",

		"On_Dodge",
		"On_Hurt",
		"On_AbsorbDamage",

		"On_Kick",
		"On_Kicked",

		"On_Healed",
		"On_Heal",

		"On_Death",

		"On_LevelUp",

		"On_Wave_Start",
		"On_Wave_End",
		"On_Wave_Halfway",

		"On_Reroll",
		"On_Shop_Enter",
		"On_Shop_Buy",
		"On_Shop_Sell",
		"On_Shop_Steal",
		"On_Merge",
	],

	//prettier-ignore
	simple_Desc: [
        "Desc_Kickable_Behind", 
        "Desc_Kickable_Nearest", 
        "Desc_Kickable_Move",

        "Desc_Recti_ToPlayer",
        "Desc_Charge_ToPlayer_Brutal",
        "Desc_Charge_ToPlayer",
        "Desc_Dash_OnEnemies",

        "Desc_Collect_Souls",

        "Desc_Redirects_ToPlayer",
        "Desc_AdaptAngle",

        "Desc_Double",
        "Desc_Linked_Umbilical",
        "Desc_Linked_Chain",

        "Desc_Shoot_TowardsPlayer",
        "Desc_Shoot_Around",
        "Desc_Shoot_Nearest",

        "Desc_GroundArea_Damage",

        "Desc_Landmine",
        "Desc_ATK_FixedDirection"
    ],

	effectsValue: {
		Wep_Cooldown_Min: 0,
		Wep_Cooldown_Max: 99, //structure ?
		Wep_Tier_Min: 0,
		Wep_Tier_Max: 99,
	},

	simpleEvents_ATK: [
		"On_ATK_Damage",
		"On_ATK_Crit",
		"On_ATK_Hit",
		"On_ATK_Kill",
		"On_ATK_Kill_Crit",
		"On_ATK_Trigger",

		"On_You_Hit",
		"On_You_Kill",
		"On_You_Kill_Crit",
		"On_You_Crit",
	],

	simple_While: {
		Moving: {
			opposite: "Standing",
			onStart: "On_Move_Start",
			onEnd: "On_Move_End",
			check: function () {
				return this.player.unit?.moveComp?.isMoving
			},
		},

		Facing_Right: {
			opposite: "Facing_Left",
			onStart: "On_Facing_Right",
			onEnd: "On_Facing_Left",
			check: function () {
				return this.player.unit?.charaComp?.isFacingRight
			},
		},
		Circle_Inside: {
			opposite: "Circle_Outside",
			onStart: "On_Circle_Inside",
			onEnd: "On_Circle_Outside",
			check: function () {
				const colliding = Utils.testOverlapOpti_All(this.player.unit.inst, this.runtime.objects["Pentagram"])
				return colliding.length > 0
			},
		},
		HP_Full: {
			opposite: "HP_NotFull",
			onStart: "On_HP_Full",
			onEnd: "On_HP_NotFull",
			check: function () {
				return this.player.unit?.healthComp?.IsFull()
			},
		},
		Wave_FirstHalf: {
			start_with: "On_Wave_Start",
			end_with: "On_Wave_Halfway",
		},
		Wave_SecondHalf: {
			start_with: "On_Wave_Halfway",
			end_with: "On_Wave_End",
		},
		Wave_Current: {
			start: "On_Wave_Start",
			end: "On_Wave_End",
		},
		Wave_Next: {
			start: "On_Wave_Start",
			end: "On_Wave_End",
			destroy: true,
		},
	},

	actions: {},
	almostStats: {
		Evasion: 0,
		Evasion_EachWave: 0,

		Wave_Start_HP: 0,
		Wave_StartNext_HP: 0,

		OnlySourceOfRegen_PerSec: 0,

		AllStats_Primary: 0,
		AllStats_Secondary: 0,
	},

	stacks: {
		Every_X_Sec: [],
	},

	effectsContainers: {
		For_Type_Mod: [],

		For_Every_Equip: [],
		For_Every_Living: [],
		For_Every_Scaled: [],

		Every_X_Attack: [],
		Every_X_Kill: [],

		Every_XDamageTaken: [],

		On_EquipItemStat: [],
	},

	effectsArray: {
		Stat: [],
		StatCapped: [],

		Modif_Stat: [],

		StatPercent: [],

		Scaled: [],

		Equip_Limit: [],

		Cooldown_Limit: [],
		Reset_Cooldown: [],

		Type_Mod: [],

		Tags_Wanted: [],
		Shop_AlwaysItem: [],
		Start_Item: [],

		Status_MaxStack: [],

		DangerSpawn: [],

		DamageBonus_Against: [],
	},

	wepEffects: {
		Every_X_ATK: "",
		Every_X_Kill: "",
	},
}

export class Item_Manager {
	constructor(runtime) {
		this.runtime = runtime

		this.effectsEvents = effectsEvents
	}

	LoadSimpleEvents() {
		//positive or negative ??

		//simple events
		for (const key of this.effectsEvents.simpleEvents) {
			this.runtime.dataManager.loadedData["ItemEffects"].set(key, C4.Modifs.Simple_On)
		}

		for (const key of this.effectsEvents.simpleEvents_ATK) {
			this.runtime.dataManager.loadedData["ItemEffects"].set(key, C4.Modifs.Simple_On)
		}

		//effects simpleBools
		for (const key of Object.keys(this.effectsEvents.simpleBools)) {
			this.runtime.dataManager.loadedData["ItemEffects"].set(key, C4.Modifs.Simple_Bool)
		}

		for (const key of this.effectsEvents.simple_Desc) {
			this.runtime.dataManager.loadedData["ItemEffects"].set(key, C4.Modifs.Simple_Desc)
		}

		//effects while

		for (const [key, value] of Object.entries(this.effectsEvents.simple_While)) {
			this.runtime.dataManager.loadedData["ItemEffects"].set("While_" + key, C4.Modifs.Simple_While)

			if (value.opposite) {
				this.runtime.dataManager.loadedData["ItemEffects"].set("While_" + value.opposite, C4.Modifs.Simple_While)
			}
		}
	}

	DataToEffects(thing, effectsData, isEffect = false) {
		const itemEffectMap = this.runtime.loadedData["ItemEffects"]
		const effects = []
		const item = isEffect ? thing.item : thing

		const parent = isEffect ? thing : null

		if (effectsData) {
			for (const [effectName, effectData] of Object.entries(effectsData)) {
				//separator for multiple effects
				if (effectName.startsWith("___")) {
					const sep = new C4.Modifs.Effect_Separator(item, effectName, effectData, parent)
					effects.push(sep)
					continue
				}
				const effectSplit = effectName.split("|")
				const effectType = effectSplit[0]
				if (itemEffectMap.has(effectType)) {
					const effectClass = itemEffectMap.get(effectType)
					//console.error("effectType", effectType)
					const effect = new effectClass(item, effectName, effectData, parent)
					effects.push(effect)
				}
			}
		}

		thing.effects = effects
	}

	AddEffect(item, effectName, effectData = {}) {
		const itemEffectMap = this.runtime.loadedData["ItemEffects"]
		const effectClass = itemEffectMap.get(effectName)
		const effect = new effectClass(item, effectName, effectData, null)
		item.effects.push(effect)
	}
}
