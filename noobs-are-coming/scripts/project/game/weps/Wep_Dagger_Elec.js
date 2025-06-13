export class Wep_Dagger_Elec extends C4.Units.Weapon {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			AnimObject: "Wep_Dagger_Elec",

			ITEM: {
				Synergies: "Melee, Rogue, Lightning",
				Effects: {},
			},

			VARS: {
				MAIN: {
					Range: 75,
					Cooldown: "1/0.9/0.8/0.7",
					//Duration: "1",
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
					Dmg: "3/7/10/15",
					"_StatBonus|Damage_Strength": "60/70/80/100",
					Knockback: 3,
					Crit_Chance: 10,
					DmgEffects: {
						"Chain|ChainLightning": {
							Chance: 100,
							ChainBounces: "2-3",
							ChainDelay: 0.1,
							ChainRange: 150,
							DAMAGE: {
								Dmg: "2/3/4/5",
								"_StatBonus|Damage_Elem": "50",
								Knockback: null,
							},
						},
					},
				},
			},
		})
	}
}
