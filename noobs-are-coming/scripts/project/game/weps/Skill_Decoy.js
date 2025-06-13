export class Skill_Decoy extends C4.Skill {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)

		this.powerAlone = false
	}

	SetData() {
		super.SetData()

		this.OverrideData({
			AnimObject: "Skill_Decoy",

			ITEM: {
				Synergies: "Upgradable, Skill, Trap, Explosive",
				Evolutions: "0-3",
				Effects: null,
			},

			VARS: {
				MAIN: {
					WepTrigger: "Skill",
					Duration: 2,
					Range: -1,
					Cooldown: "4",
				},
				WEP: {
					ShootWhere: "BBoxBottom",
					ShootWhat: "Entity",
					ShootWhich: "Minion_Decoy",
				},
				HAND: {
					//
				},
			},

			BULLET: {
				AnimObject: "FX_AirStrike_Impact",
				DAMAGE: {
					Dmg: "20/40/50/60",
					"_StatBonus|Damage_Arcane": "100/120/140/160",
					Knockback: 20,
				},
				VARS: {
					MAIN: {
						JustHitbox: true,
						Lifetime: 0.6,
					},
				},
			},
		})
	}

	//Decoy apparition
	Skill_Start() {
		super.Skill_Start()
		//! exception for this Power (can cumulate)
		this.powerActive = false
		this.Shoot(true)
	}
}

export class Minion_Decoy extends C4.Units.Character {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	OnMinionInit() {
		this.SetAnimObject(this.atk_Unit.unitChara.AnimObject_FullBody())
		this.anim.animationFrame = this.atk_Unit.unitChara.anim.animation.frameCount

		//window.alert("Decoy Frame:" + this.atk_Unit.unitChara.anim.animation.frameCount)
		//!tofix

		//! bandage fix game breaking bug doppelganger
		if (!this.atk_Unit) {
			this.OnDestroyed(true)
			return
		}

		this.timerComp.Timer_Start("Explosion_Dealy", this.atk_Unit.GetDuration_Value(), () => {
			this.DecoyExplode()
		})

		const player = this.runtime.players[this.minionPlayerIndex]
		const playerMoveAngle = player.unit.moveComp.AngleOfMotion() + 180
		this.moveComp.Set_AngleOfMotion(playerMoveAngle)
	}

	DecoyExplode() {
		this.atk_Unit.CreateExplosion(100, this.inst.x, this.inst.y)

		this.DestroyUnit()
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			AnimObject: "",
			UnitTags: "Minion, Tank",

			VARS: {
				MAIN: {
					HP_Max: 100,
					HP_PerWave: 0,
					Damage: 0,

					IsEnemy: false,
					IsMinion: true,
					FollowTargetMove: false,
				},
			},
		})

		this.SetAbis({
			Tank_EndlessBounce: {
				Type: "Move_Rectiligne",
				//specific
				MovementType: "Recti",
				Speed_Override: 50,

				//shared
				Priority: 10,
				Range: -1,
				CanBeInterrupted: false,

				Timer_Cooldown: 0,
				Timer_Prepare1: 0,
				Timer_Prepare2: 0,
				Timer_Execute: -2,
				Timer_Recover: 0,
			},
		})
	}
}
