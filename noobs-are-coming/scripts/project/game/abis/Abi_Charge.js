export class Abi_Charge extends C4.Abi {
	constructor(unit, abiName, abiData) {
		super(unit, abiName, abiData)
	}

	Init_Data() {
		super.Init_Data()
		this.SetVars_Default({
			Charge_Speed: 200,
			Charge_Width: 32,
			Charge_Repeat: 1,

			Charge_NoKnockback: true,
		})
	}

	SetAbiInternals() {
		super.SetAbiInternals()

		this.ChargeIndex = 0
		this.TotalDistance = 0
		this.ChargeAngle = 0
	}

	Step_Prepare2() {
		//
	}

	Step_Execute() {
		this.unit.Trigger("OnCharge_Start")
		this.unit.Trigger("OnCharge")
	}

	Tick() {
		this.unit.Set_Anim_Mirrored_FromAngle(this.ChargeAngle)
	}

	Step_Recover() {
		this.SetHitboxCollision(false)
	}

	SetHitboxCollision(bool) {
		if (!this.Hitbox) return
		this.Hitbox.isCollisionEnabled = bool
	}
}
