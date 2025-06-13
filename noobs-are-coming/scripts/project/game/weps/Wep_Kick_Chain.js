export class Wep_Kick_Chain extends C4.Units.Weapon {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			AnimObject: "Bullet_Kick_Chain",
			WepAnimSize: 16,

			ITEM: {
				Synergies: "Upgradable, Link, Kickable, Ball, Spikes",
				Effects: {
					Desc_Kickable_Move: null,
					Desc_Linked_Chain: null,
				},
			},

			VARS: {
				MAIN: {
					WepTrigger: "WaveStart",
					Cooldown: 0,
					Size_Affected: true,
				},
				WEP: {
					ShootWithin: 40,
					ShootWhat: "Bullet",

					Bullet_Count: "1/1/1/2",
				},
				HAND: {
					//
				},
			},

			BULLET: {
				BulletUnit: "Bullet_Kick_Chain",
				AnimObject: "Bullet_Kick_Chain",
				DAMAGE: {
					Dmg: "10/15/20/30",
					"_StatBonus|Damage_Strength": "100/120/140/160",
					Knockback: 6,
					Angle_Hit: "FromEntity",
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

export class Bullet_Kick_Chain extends C4.Units.Bullet {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	Init() {
		super.Init()
		this.moveComp.enabled = true
	}

	SetData() {
		super.SetData()
		this.kickComp = this.AddComponent(C4.Compos.Compo_Kickable, "Kickable", {
			Tags_Kickers: ["Player" + this.playerIndex],
			Kick_Speed: 300,
			Kick_Acc: -300,
			DamageActivation: false,
			Kick_CanRekick: 0.4,

			KickOnSolid_Feedbacks: {},
		})
	}

	ReleaseUnit() {
		super.ReleaseUnit()
		this.kickComp = null
	}

	Kick_Func() {
		/*
		const kicker = this.runtime.getUnitByUID(this.kickComp.lastCollideUid)
		if (kicker && kicker.player) {
			const angleMotion = Utils.angleToDeg(kicker.x, kicker.y, this.unit.x, this.unit.y)
			this.moveComp.Set_AngleOfMotion(angleMotion)
		}*/

		const chainComp = this.chainComp_spike
		if (chainComp) {
			this.moveComp.elasticVx *= 0.7
			this.moveComp.elasticVy *= 0.7

			this.moveComp.elasticVx = 0
			this.moveComp.elasticVy = 0
		}
	}

	OnShot_Init() {
		this.chainComp_spike = this.AddComponent(C4.Compos.Compo_Chain, "Chain", {
			LinkAnim: "Chain_Link_Spike",
		})

		this.chainComp_spike.chainTargetUID = this.wepUnit.holderUnit.uid
	}
}
