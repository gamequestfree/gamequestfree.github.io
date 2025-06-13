export class Wep_Plant_Tomato extends C4.Units.Weapon {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			AnimObject: "Plant_Tomato",
			WepAnimSize: 16,

			ITEM: {
				Synergies: "Plant, Heavy",
				ItemTags: "Give_Water",
				Effects: {
					Desc_Dash_OnEnemies: null,
					___Sep: null,
					Plant_Desc: null,
				},
			},

			VARS: {
				MAIN: {
					WepTrigger: "Cooldown",
					Cooldown: 7,
					Duration: 7,
					Cooldown_Type: "Cooldown_Spawn",
				},
				WEP: {
					ShootWhere: "RandomInArea",
					ShootWhat: "Entity",
					ShootWhich: "Plant_Tomato",

					MinionHitbox: true,
					MinionInvulnerable: true,
				},
				HAND: {
					HandType: "Inactive",
				},
			},

			BULLET: {
				DAMAGE: {
					Dmg: "3/6/9/9",
					"_StatBonus|Damage_Elem": "100/120/150/200",
					Knockback: 1,
					DmgEffects: {},
				},
			},
		})
	}
}

export class Plant_Tomato extends C4.Units.Character {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()

		this.plantComp = this.AddComponent(C4.Compos.Compo_Plant, "Plant")

		this.OverrideData({
			AnimObject: "Plant_Tomato",
			UnitTags: "Plant",

			VARS: {
				MAIN: {
					HP_Max: 4,
					HP_PerWave: 2.5,
					Speed_Walk: "95-105",
					Damage: 0,
					Damage_PerWave: 0,

					IsEnemy: false,
					IsMinion: true,
					FollowTargetMove: false,

					Shadow_Width: 1.2,
				},
			},
		})
	}

	Plant_OnMature() {
		this.FollowTargetMove = true

		const HitboxMinion = this.HitboxMinion

		if (HitboxMinion) {
			const HitboxMinionInst = HitboxMinion.inst

			HitboxMinionInst.setSize(this.anim.width, this.anim.height)

			HitboxMinionInst.removeFromParent()

			this.anim.addChild(HitboxMinionInst, {
				transformX: true,
				transformY: true,
				transformAngle: true,
			})
		}

		this.SetAbis({
			Dash: {
				Type: "Dash",
				//spec
				Dash_Distance: 80,

				//shared
				Priority: 10,
				Range: 80,
				CanBeInterrupted: false,

				Timer_Cooldown: "0.1-0.5",
				Timer_Prepare1: 0.5,
				Timer_Prepare2: 0,
				Timer_Execute: 0.3,
				Timer_Recover: 0,

				onStart: () => {
					this.juice.Shake()
					this.PlaySound("CuteMob_Prepare", 0.5, Utils.random(0.9, 1.1))
				},

				onExecute: () => {
					const atkSfx = "CuteMob_ATK_" + Utils.randomInt(6)
					this.runtime.audio.PlaySound(atkSfx)
					this.juice.SS_SetScale(1.4, 0.6)
				},
			},
		})
	}
}
