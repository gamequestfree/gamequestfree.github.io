export class Abi_JumpArea extends C4.Abi {
	constructor(unit, abiName, abiData) {
		super(unit, abiName, abiData)
	}

	//Prepare 2: Spawn Telegraph
	//Execute : Begin Jump
	//End: Apply Telegraph

	Init_Data() {
		super.Init_Data()
		this.SetVars_Default({
			Move_Distance: 80,
			Move_Ease: "in-out-sine",
			Jump_Dodge: true,
			Jump_RandomDirection: false,

			Jump_Scale: 1,

			Telegraph_Visu: "",

			Jump_Height: 30,

			Jump_RangeForPerfectAim: 0,

			Jump_Area: 40,

			Jump_Damage: {
				//
			},
		})
	}

	ReleaseAbi() {
		super.ReleaseAbi()

		//if (this.jumpTelegraph?.uid) this.jumpTelegraph.destroy()

		this.jumpTelegraph = null
	}

	SetAbiInternals() {
		super.SetAbiInternals()
	}

	Step_Init() {
		this.tweenBeh = this.inst.behaviors["Tween"]
		//console.error("Jumping TweenBeh", this.tweenBeh)
	}

	Step_Prepare2() {
		if (this.Jump_RandomDirection) {
			const randPos = this.runtime.spawnManager.GetPosInArea_FromCircle(this.inst.x, this.inst.y, this.Move_Distance)
			this.jumpTargetX = randPos[0]
			this.jumpTargetY = randPos[1]
		} else {
			this.jumpTargetX = this.targetX
			this.jumpTargetY = this.targetY

			if (C3.distanceTo(this.inst.x, this.inst.y, this.targetX, this.targetY) > this.Move_Distance) {
				const angle = C3.angleTo(this.inst.x, this.inst.y, this.targetX, this.targetY)
				this.jumpTargetX = this.inst.x + Math.cos(angle) * this.Move_Distance
				this.jumpTargetY = this.inst.y + Math.sin(angle) * this.Move_Distance
			}
		}

		this.jumpTelegraph = this.runtime.objects["Circle_Telegraph"].createInstance("Ground_Marks", this.jumpTargetX, this.jumpTargetY)
		this.jumpTelegraph.setSize(0, 0)
		this.jumpTelegraph.behaviors["Tween"].startTween("size", [this.Jump_Area, this.Jump_Area], 0.3, "out-elastic")

		this.inst.addChild(this.jumpTelegraph, {
			destroyWithParent: true,
		})

		//this.jumpTelegraph.setSize(this.Jump_Area, this.Jump_Area)

		this.jumpTelegraph.colorRgb = this.unit.outlineColor
		this.jumpTelegraph.opacity = 0.8

		this.unit.moveComp.enabled = false
	}

	Step_Execute() {
		const jumpTween = this.tweenBeh.startTween("position", [this.jumpTargetX, this.jumpTargetY], this.Timer_Execute, this.Move_Ease, {
			tags: ["Abi_JumpArea"],
		})
		//console.error("Jumping Tween", jumpTween)

		this.unit.juice.Roll()

		this.unit.juice.SS_SetScale(1.4, 0.6)

		this.unit.Flag_Add("Invulnerable_TooHigh", "Abi_JumpArea")

		//this.unit

		this.unit.Hitbox.isCollisionEnabled = false
	}

	Step_Recover() {
		this.unit.Hitbox.isCollisionEnabled = true

		this.unit.zJumpOffset = 0

		this.unit.juice.SS_SetScale(1.4, 0.6)

		this.unit.moveComp.ResetMove()
		this.unit.moveComp.enabled = true

		const jumpTelegraph_Circle = this.runtime.objects["Circle_Fading"].createInstance("Ground_Marks", this.jumpTelegraph.x, this.jumpTelegraph.y)
		jumpTelegraph_Circle.setSize(0, 0)
		jumpTelegraph_Circle.behaviors["Tween"].startTween("size", [this.Jump_Area, this.Jump_Area], 0.3, "out-elastic")
		jumpTelegraph_Circle.opacity = 0.8
		jumpTelegraph_Circle.colorRgb = this.unit.outlineColor

		this.jumpTelegraph.destroy()

		this.unit.Flag_Remove("Invulnerable_TooHigh", "Abi_JumpArea")
	}

	Tick() {
		if (this.step === "AB_Execute") {
			this.unit.SetMirroredToMotion()

			const jumpTween = Utils.GetTween(this.tweenBeh, "Abi_JumpArea")
			//console.error("Jumping Tween", jumpTween)

			if (jumpTween) {
				//this.unit.zJumpOffset = this.Jump_Height * (1 - Math.pow(2 * jumpTween.progress - 1, 2))

				//this.unit.zJumpOffset = this.Jump_Height * Math.sin(jumpTween.progress * Math.PI)

				this.unit.zJumpOffset = this.Jump_Height * Math.pow(Math.sin(jumpTween.progress * Math.PI), 1.5)
			}
		}
	}
}
