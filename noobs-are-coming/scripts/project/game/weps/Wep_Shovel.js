export class Wep_Shovel extends C4.Units.Weapon {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			AnimObject: "Wep_Shovel",

			ITEM: {
				Synergies: "Melee",
				Effects: {
					On_ATK_Hit: {
						"Chance|30": {
							//"Stat|Coins": 1,
							Spawn_Soul: 1,
						},
					},
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
					Dmg: "6/12/18/30",
					"_StatBonus|Damage_Strength": "80/85/90/100",
					Knockback: 3,
					Crit_Chance: 10,
				},
			},
		})
	}
}
