export class Wep_Shield_Death extends C4.Units.Weapon {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			AnimObject: "Wep_Shield_Death",

			ITEM: {
				Synergies: "Upgradable, Protection, Necromancer",
				Effects: {
					On_Hurt: {
						Attack_Trigger: true,
					},
				},
				HideEffects: [0],
			},
			VARS: {
				MAIN: {
					WepTrigger: "Event",
					Range: 0,
					Cooldown: 1,
					Size_Affected: true,
				},
				WEP: {
					ShootWhere: "BBoxMid",
					ShootWhat: "Bullet",

					Bullet_Count: "4/5/6/7",
					Bullet_Spray: 360,
					Random_Spread: false,

					Bullet_Color: false,
				},
				HAND: {
					HandType: "Inactive",
					Hand_SetAngle: false,
				},
			},

			BULLET: {
				AnimObject: "Wep_Shield_Death",
				DAMAGE: {
					Dmg: "20/40/60/90",
					"_StatBonus|Damage_Strength": 100,
					Knockback: 2,
					LifeSteal: 10,
				},
				VARS: {
					MAIN: {
						Speed: 100,
						Pierce: 4,
						Bounce_Solid: 0,
						Bounce_Enemy: 0,

						SetBulletAngle: false,
					},
				},
			},
		})
	}

	OnShoot() {
		//
	}

	OnCooldownEnd() {
		//
	}
}
