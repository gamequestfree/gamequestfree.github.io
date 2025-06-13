export class Wep_Skullball extends C4.Units.Weapon {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			AnimObject: "Bullet_Skullball",
			WepAnimSize: 12,

			ITEM: {
				Synergies: "Kickable, Ball, Bone",
				Effects: {
					Desc_Kickable_Nearest: null,
				},
			},

			VARS: {
				MAIN: {
					WepTrigger: "WaveStart",
					Cooldown: 0,
					//Duration: "1",
					Size_Affected: true,
				},
				WEP: {
					ShootWhere: "RandomInArea",
					ShootWhat: "Bullet",

					Bullet_Count: "1/1/1/2",
					Bullet_Amount: "1:4",
				},
				HAND: {
					//
				},
			},

			BULLET: {
				BulletUnit: "Bullet_Skullball",
				AnimObject: "Bullet_Skullball",
				DAMAGE: {
					Dmg: "15/20/25/30",
					"_StatBonus|Damage_Strength": "100/120/140/160",
					Knockback: 7,
				},
				VARS: {
					MAIN: {
						JustHitbox: true,
					},
				},
			},

			DATA_REF: {
				SUBBULLET: {
					//
				},
			},
		})
	}

	//! useful snippet
	/*
	GetSpikeBall() {
		if (this.spikeBallUid) {
			const ballUnit = this.runtime.getUnitByUID(this.spikeBallUid)
			if (ballUnit) return ballUnit
			else {
				this.spikeBallUid = null
			}
		}
		return null
	}*/
}

export class Bullet_Skullball extends C4.Units.Bullet {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)

		this.AddTags("Bone")
	}

	SetData() {
		super.SetData()
		this.kickComp = this.AddComponent(C4.Compos.Compo_Kickable, "Kickable", {
			KickDirection: "Nearest",

			KickOnSolid_Feedbacks: {
				SFX: ["Kick_Soccer", 1],
				SS: [1.4, 0.6],
			},
		})
	}

	ReleaseUnit() {
		super.ReleaseUnit()
		this.kickComp = null
	}
}
