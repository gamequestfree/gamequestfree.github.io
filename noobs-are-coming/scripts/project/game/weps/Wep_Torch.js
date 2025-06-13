export class Wep_Torch extends C4.Units.Weapon {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			AnimObject: "Wep_Torch",

			ITEM: {
				Synergies: "Melee, Fire",
				Effects: {
					DmgFX_All: "",
				},
			},

			VARS: {
				MAIN: {
					Range: 70,
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
					Dmg: "2/4/6/8",
					"_StatBonus|Damage_Elem": "50/60/70/80",
					Knockback: 3,
					DmgEffects: {
						"DmgStatus|Burn": {
							Chance: 100,

							DAMAGE: {
								Dmg: "0.4/0.8/1.2/1.6",
								"_StatBonus|Damage_Elem": "40/60/80/100",
								Knockback: null,
								StatusDuration: "2/3/4/5",
							},
						},
					},
				},
			},
		})
	}
}
