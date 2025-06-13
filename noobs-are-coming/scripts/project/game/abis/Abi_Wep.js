export class Abi_Wep extends C4.Abi {
	constructor(unit, abiName, abiData) {
		super(unit, abiName, abiData)
	}

	Init_Data() {
		super.Init_Data()
		this.SetVars_Default({
			//
		})
	}

	Step_Init() {
		//this.Range = this.wep.Range
	}
}
