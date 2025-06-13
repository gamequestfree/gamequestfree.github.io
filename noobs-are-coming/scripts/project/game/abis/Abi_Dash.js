export class Abi_Dash extends C4.Abi {
	constructor(unit, abiName, abiData) {
		super(unit, abiName, abiData)
	}

	Init_Data() {
		super.Init_Data()
		this.SetVars_Default({
			Dash_Distance: 80,
			Dash_Ease: "out-exponential",
			Dash_Dodge: true,

			Dash_RandomDirection: false,
			Dash_Scale: 1,

			Dash_HitboxExtands: [0, 0],
			Dash_SpecificHitbox: false,
			Dash_UseRegularHurtbox: false,
		})
	}

	SetAbiInternals() {
		super.SetAbiInternals()

		this.Dash_Angle = 0
		this.Hitbox = null
	}

	Step_Init() {
		if (this.Dash_SpecificHitbox) {
			this.Hitbox = this.runtime.objects["Hitbox"].createInstance("Collisions", this.unit.x, this.unit.y)
			this.inst.addChild(this.Hitbox, {
				transformX: true,
				transformY: true,
				destroyWithParent: true,
			})
			this.Hitbox.Damage = new C4.Damage(this.runtime)

			this.Hitbox.Damage.SetDamageFromData({
				Angle_Hit: "EntityMotion",
			})
		}

		this.SetHitboxCollision(false)
	}

	Step_Execute() {
		this.unit.Trigger("OnDash")
		if (this.Dash_RandomDirection) this.Dash_Angle = Math.random() * 360
		this.unit.moveComp.SetOnSolid("Bounce")
		this.unit.moveComp.Set_AngleOfMotion(this.Angle_OriginToTarget())

		if (this.Dash_Angle > 0) this.unit.moveComp.angleOfMotion = this.Dash_Angle
		this.SetHitboxCollision(true)

		this.unit.moveComp.Dash_Tween(this.Dash_Distance * this.Dash_Scale, this.Dash_Ease, this.Timer_Execute * this.Dash_Scale)
	}

	Tick() {
		if (this.step === "AB_Execute") {
			this.unit.SetMirroredToMotion()
		}
	}

	Step_StopExecute() {
		this.SetHitboxCollision(false)
	}

	SetHitboxCollision(bool) {
		if (this.Hitbox) {
			this.Hitbox.isCollisionEnabled = bool
		}
		if (this.Dash_UseRegularHurtbox && this.unit.Hitbox) {
			this.unit.Hitbox.isCollisionEnabled = bool
			//console.error("Goblin Hitbox", this.unit.Hitbox.isCollisionEnabled, this.unit.Hitbox)
		}
	}
}
