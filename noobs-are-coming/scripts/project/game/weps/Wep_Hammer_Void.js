export class Wep_Hammer_Void extends C4.Units.Weapon {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			AnimObject: "Wep_Hammer_Void",

			ITEM: {
				Synergies: "Melee, Heavy, Void",
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
					TweenMode: "Sweep",
				},
			},

			BULLET: {
				DAMAGE: {
					Dmg: "10/15/20/30",
					"_StatBonus|Damage_Strength": "80/85/90/100",
					Knockback: 8,
				},
			},
		})
	}
}
