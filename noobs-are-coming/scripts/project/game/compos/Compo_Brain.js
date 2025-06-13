const propStep = ["AB_Start", "AB_Prepare2", "AB_Execute", "AB_Recover", "AB_End"]

export class Compo_Brain extends C4.Component {
	constructor(unit, data = null) {
		super(unit, data)

		this.curAbi = null
		this.curAbi_priority = -1

		this.UID_Abi_Checked = 0

		this.conditionCheck = false

		this.isPlayer = false

		this.canBeInterrupted = true

		this.Move_RegularAnim = true
		this.Move_RegularLogic = true

		this.abis = []

		//unit already has a charaComp
	}

	get charaComp() {
		return this.unit.charaComp
	}

	ReleaseComp() {
		this.ReleaseAbis()
	}

	ReleaseAbis() {
		if (this.curAbi) {
			this.curAbi.ReleaseAbi()
			this.curAbi = null
		}
		for (const abi of this.abis) {
			abi.ReleaseAbi()
		}
		this.abis = null
	}

	GetAbi(abiName) {
		return this.abis.find((abi) => abi.name === abiName)
	}

	AddAbis(data) {
		if (!data) return
		//console.error("😍 AddAbis", data)
		for (const [abiName, abiData] of Object.entries(data)) {
			//console.error("😍 AddAbi", abiName, abiData)
			const abiTypeName = abiData.Type
			const abiClass = C4.Abis[abiTypeName]
			if (!abiClass) {
				continue
			}
			const abi = new abiClass(this.unit, abiName, abiData)
			this.abis.push(abi)
		}
	}

	SetAbis(data) {
		//console.error("😍 SetAbis", data)
		this.ReleaseAbis()
		this.abis = []
		if (!data) return
		this.AddAbis(data)
	}

	PostCreate() {
		if (this.charaComp.animInst) {
			this.charaComp.animInst.addEventListener("animationend", (e) => this.OnAnimationEnds(e.animationName))
		}
	}

	//*ANIM UTILS===========================================================================================

	_SetAnimation(animName) {
		if (!this.animSprite) return
		//if (this.debug) console.error("SET ANIM", animName, this.Move_RegularAnim)
		this.animSprite._SetAnim(animName, 1) //1 = "beginning"
	}

	_isAnimPlaying(animName) {
		if (!this.iAnimSprite) return false

		return this.iAnimSprite.animationName === animName
	}

	_GetAnimationLength(animName) {
		const anim = this.inst.getAnimation(animName)
		return anim.frameCount * anim.speed
	}

	OnAnimationEnds(animName) {
		//
	}

	//*================================================================================================

	_DistanceToTarget() {
		const instTarget = this.charaComp.targetInst
		if (!instTarget) {
			//window.alert("Target not found")
			return Infinity
		}

		return C3.distanceTo(this.inst.x, this.inst.y, instTarget.x, instTarget.y)
	}

	Abi_Filter(abi) {
		//if (abi === this.curAbi) return false
		if (abi.step !== "AB_Idle") return false
		if (abi.Priority <= this.curAbi_priority) return false

		if (abi.Range === 0) return false //! fix issue for minions that retrieves the player range

		if (this.unit.forceAbis) return true

		if (abi.Range > 0 && abi.Range < this._DistanceToTarget()) {
			return false
		}

		/*if (abi.name === "Goblin_Charge") {
			//
		}*/

		//special condition ?
		//abi Condition_Check
		//anim Condition_Check
		return true
	}

	Check_Abilities() {
		/*if (this.unit.forceAbis) {
			window.alert("It Works")
		}*/

		if (this.canBeInterrupted) {
			const availableAbis = this.abis.filter((abi) => this.Abi_Filter(abi))
			const availableAbisSorted = availableAbis.sort((a, b) => a.Priority - b.Priority)

			for (const abiInst of availableAbisSorted) {
				this.Brain_Abi_Start(abiInst)
			}
		}
	}

	CheckAndPlay_Ability(objectClass) {
		//
	}

	Is_Abi_ConditionCheck(abiName) {
		const abi = this.abis.find((abi) => abi.Name === abiName)
		if (!abi) return false
		return abi.Is_ConditionCheck()
	}

	IsPlayingAbi() {
		return this.curAbi !== null
	}

	//*Brain Abi Do ===========================================================================================

	Brain_Abi_Cancel(abi = null) {
		if (abi === null) abi = this.curAbi
		if (!abi) return
		this.Call_Step("AB_Cancel", abi)
		this.Brain_Abi_Stop(abi)
	}

	Set_CurAbi(abi) {
		this.curAbi = abi
		if (abi === null) {
			this.curAbi_priority = -1
			return
		} else {
			this.curAbi_priority = abi.Priority
		}
	}

	Brain_Abi_Start(abi, cancelPrevious = true) {
		if (cancelPrevious) {
			this.Brain_Abi_Cancel()
		}

		if (typeof abi === "string") {
			abi = this.GetAbi(abi)
		}

		this.Set_CurAbi(abi)
		abi.brain = this
		abi.activationCount++
		abi.targetUID = this.charaComp.targetUID

		this.Move_RegularAnim = abi.Move_RegularAnim
		this.Move_RegularLogic = abi.Move_RegularLogic
		this.canBeInterrupted = abi.CanBeInterrupted

		if (!this.Move_RegularLogic) {
			this.unit.InputMove = false
			this.unit.moveComp.Set_Speed(0)
		}

		//*Init if needed
		abi.Abi_Init()

		//Repeat
		if (abi.RepeatIndex === 0) {
			if (abi.RepeatMax > abi.RepeatMin) {
				abi.RepeatCount = Math.floor(Math.random() * (abi.RepeatMax - abi.RepeatMin + 1)) + abi.RepeatMin
			}
			abi.RepeatCount = abi.RepeatMin
		}

		this._SetAnimation(abi.Anim_Prepare)

		if (abi.Timer_Prepare1 >= 0) {
			abi._SetTimer(abi.Timer_Prepare1)
		} else if (abi.Timer_Prepare1 === -2) {
			abi._SetTimer(Infinity)
		}
		//if animation based
		else if (this._isAnimPlaying(abi.Anim_Prepare)) {
			// If Timer_Prepare1 is animation based, Timer_Prepare2 can't be longer as it will be subtracted
			// Timer_Prepare2 is a special case
			const timer_prepareBoth = this.Get_AnimationLength(abi.Anim_Prepare)
			if (abi.Timer_Prepare2 > timer_prepareBoth) abi.Timer_Prepare2 = timer_prepareBoth

			abi._SetTimer(timer_prepareBoth - abi.Timer_Prepare2)
		} else {
			console.error("Brain : Timer Prepare 1 should be anim-based; but Anim_Prepare", abi.Anim_Prepare, "is not playing.")
		}

		//after

		this.Call_Step("AB_Start", abi)
	}

	Brain_Abi_End(abi) {
		//Repeat current Ability
		if (abi.RepeatCount > 1 && abi.RepeatCount > abi.RepeatIndex) {
			abi.RepeatIndex++
			this.Brain_Abi_Start(abi)
		}
		//
		else {
			abi.RepeatIndex = 1

			const abiSubchildren = abi.subAbis
			//Get Child Ability
			if (abiSubchildren.length > 0) {
				const abi2 = abiSubchildren[0]
				abi2.parentAbi = abi.parentAbi ? abi.parentAbi : abi
				this.Brain_Abi_Start(abi2)
			}
			//*Stop Ability
			else {
				//get parent
				if (abi.parentAbi) {
					this.Brain_Abi_Stop(abi.parentAbi)
				}
				//Stop this Ability
				else {
					this.Brain_Abi_Stop(abi)
				}
			}
		}
	}

	Brain_Abi_Stop(abi) {
		//if (this.curAbi) {
		if (abi) {
			abi._SetTimer(abi.Timer_Cooldown)
			if (abi.DestroyedOnFinished) {
				abi.inst.Destroy()
			}
		}

		this.Set_CurAbi(null)
		if (!this.Move_RegularAnim) {
			this.Move_RegularAnim = true
			this.Trigger("On_Move_RegularAnim")
		}
		if (!this.Move_RegularLogic) {
			this.Move_RegularLogic = true
			this.Trigger("On_Move_RegularLogic")
		}

		this.canBeInterrupted = true
	}

	//======== STEP ========

	Ability_SetStep(abi, step) {
		//
	}

	Call_Step(step, abi = null) {
		if (!abi) abi = this.curAbi
		abi.Call_Step(step)
	}

	//* EVENTS TO IMPLEMENT

	On_Move_RegularLogic() {
		//
	}

	On_Move_RegularAnim() {
		//
	}
}
