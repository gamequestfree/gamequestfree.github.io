export class Wep_Minion_Bonecrusher extends C4.Units.Weapon {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			AnimObject: "Minion_Bonecrusher",
			WepAnimSize: 16,

			ITEM: {
				Synergies: "Minion, Heavy",
				Effects: {
					Desc_Charge_ToPlayer_Brutal: null,
				},
			},

			VARS: {
				MAIN: {
					WepTrigger: "WaveStart",
					Range: 130,
					Size_Affected: true,
				},
				WEP: {
					ShootWhere: "RandomInArea",
					ShootWhat: "Entity",
					ShootWhich: "Minion_Bonecrusher",
					//WhichEntity_Anim: "Minion_Bonecrusher",

					MinionHitbox: true,
					MinionInvulnerable: true,
				},
				HAND: {
					HandType: "Inactive",
				},
			},

			BULLET: {
				DAMAGE: {
					Dmg: "14/19/23/30",
					"_StatBonus|Damage_Minions": "100/120/150/200",
					Knockback: 4,
					Knockback_Ally: true,
				},
			},
		})
	}

	/*
	OnMinionSpawn(spawnUnit) {
		const hitboxMinion = this.runtime.getUnitByUID(spawnUnit.HitboxMinionUid)
		if (hitboxMinion) {
			//
		}

		spawnUnit.brainComp.GetAbi("Bonecrusher_Charge").SetTarget(this.runtime.player)
	}*/
}

export class Minion_Bonecrusher extends C4.Units.Character {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	Tick() {
		super.Tick()
		const abiCharge = this.brainComp.GetAbi("Bonecrusher_Charge")

		//! bandage fix game breaking bug doppelganger
		if (!this.atk_Unit) {
			this.OnDestroyed(true)
			return
		}

		if (abiCharge) {
			abiCharge.Range = this.atk_Unit.GetRange_Value()
			//Utils.debugText("Range: " + abiCharge.Range)
		}
	}

	SetData() {
		super.SetData()

		this.OverrideData({
			AnimObject: "Minion_Bonecrusher",
			UnitTags: "Minion",
			EnemyTags: [],
			TargetSummoner: true,

			VARS: {
				MAIN: {
					HP_Max: 4,
					HP_PerWave: 2.5,
					Speed_Walk: "110-120",
					Damage: 0,
					Damage_PerWave: 0,

					IsEnemy: false,
					IsMinion: true,
					FollowTargetMove: true,

					Shadow_Width: 1.2,
				},
			},
		})

		this.SetAbis({
			Bonecrusher_Charge: {
				Type: "Move_ChargeWall",
				//spec
				Speed_Override: 280,

				//shared
				Priority: 10,
				Range: 0, //! overriden by ATK Stat
				CanBeInterrupted: false,

				Timer_Cooldown: "0.1-0.5",
				Timer_Prepare1: 0.5,
				Timer_Prepare2: 0,
				Timer_Execute: -2,
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

				onWallImpact: () => {
					this.runtime.audio.PlaySound("Wall_Impact", 0.5)
					this.runtime.camera.RotateShake()
				},
			},
		})
	}
}
