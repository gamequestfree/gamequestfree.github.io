export class Wep_Wand_Skull extends C4.Units.Weapon {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()

		this.OverrideData({
			AnimObject: "Wep_Wand_Skull",
			ITEM: {
				Synergies: "Ranged, Necromancer",
				Effects: {
					"ATK_Every_X|Kill|15": {
						"Stat|HP_Max": "1|4",
					},
				},
			},
			VARS: {
				MAIN: {
					Cooldown: "1/0.92/0.85/0.8",
					Range: 80,
					Size_Affected: true,
				},
				WEP: {
					Is_Automatic: true,
					Beam: "No",
					Time_Preparation: 0,
				},
				HAND: {
					IsVisible: true,
					HandType: "Regular",
					MaxHoldDist: 10,
					AngleSpeed: 30,
					MoveSpeed: 5,
				},
			},

			BULLET: {
				DAMAGE: {
					Dmg: "10/15/20/25",
					"_StatBonus|Damage_Arcane": "80/85/90/100",
					Knockback: 2,
					Crit_Chance: 0,
				},
				VARS: {
					MAIN: {
						Speed: 400,
						Pierce: 0,
						Bounce_Solid: 0,
						Bounce_Enemy: 0,
					},
				},
			},
		})

		this.OverrideData({})
	}

	OnShoot() {
		this.PlaySound("Magic_Shot_2", 0.5)
	}
}
