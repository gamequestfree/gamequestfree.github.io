export class Abi_Move_Follow extends C4.Abi_Move {
	constructor(unit, abiName, abiData) {
		super(unit, abiName, abiData)
	}

	Init_Data() {
		super.Init_Data()
		this.SetVars_Default({
			//*Abi_Move override
			MovementType: "Follow",

			//*common override
			Priority: 0,
			Timer_Cooldown: 0,
			Timer_Prepare1: 0,
			Timer_Prepare2: 0,
			Timer_Execute: -2,
			Timer_Recover: 0,

			Move_RegularAnim: true,
		})
	}

	//*========== CONFIG ====================
}
