export class Wep_Fist extends C4.Units.Weapon {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			AnimObject: "Wep_Fist",

			ITEM: {
				Synergies: "Melee, Martial",
				Effects: null,
			},

			VARS: {
				MAIN: {
					Range: 75,
					Cooldown: "1/0.9/0.8/0.7",
				},
				WEP: {
					ShootWhere: "Melee",
				},
				HAND: {
					HandType: "Melee_Tween",
					TweenMode: "Thrust",
				},
			},

			BULLET: {
				DAMAGE: {
					Dmg: "6/12/18/30",
					"_StatBonus|Damage_Strength": "100/110/120/130",
					Knockback: 3,
					Crit_Chance: 10,
					Life_Steal: 10,
				},
			},
		})
	}
}
