export class Wep_Spikeball extends C4.Units.Weapon {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			AnimObject: "Bullet_Spikeball",
			WepAnimSize: 16,

			ITEM: {
				Synergies: "Kickable, Ball, Spikes",
				Effects: {
					//Desc_Kickable_Move: null,
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
					Bullet_Amount: "1:8/1:7/1:6/1:5",
				},
				HAND: {
					//
				},
			},

			BULLET: {
				BulletUnit: "Bullet_Spikeball",
				AnimObject: "Bullet_Spikeball",
				DAMAGE: {
					Dmg: "20/25/30/35",
					"_StatBonus|Damage_Strength": "120/140/160/180",
					Knockback: -1,
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

export class Bullet_Spikeball extends C4.Units.Bullet {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()
		this.kickComp = this.AddComponent(C4.Compos.Compo_Kickable, "Kickable", {
			KickDirection: "Nearest",
			Kick_Speed: 320,
			Kick_Acc: -60,

			Kick_RandomAngleOffset: 2,

			KickOnSolid_Feedbacks: {
				Shake: true,
				SFX: ["Wall_Impact", 0.35],
				SS: [1.4, 0.6],
			},
		})
	}

	ReleaseUnit() {
		super.ReleaseUnit()
		this.kickComp = null
	}
}
