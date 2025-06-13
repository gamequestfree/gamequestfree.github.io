export class Abi_Move_RectiRandom extends C4.Abi_Move {
	constructor(unit, abiName, abiData) {
		super(unit, abiName, abiData)
	}

	Init_Data() {
		super.Init_Data()
		this.SetVars_Default({
			//*Abi_Move override
			Type: "Move_Rectiligne",
			MovementType: "Recti_Random",

			//*common override
			Priority: 0,
			Range: -1,
			CanBeInterrupted: true,

			Timer_Execute: -2,

			Move_RegularAnim: true,
		})
	}
}
