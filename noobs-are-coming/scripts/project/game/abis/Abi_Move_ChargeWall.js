export class Abi_Move_ChargeWall extends C4.Abi_Move {
	constructor(unit, abiName, abiData) {
		super(unit, abiName, abiData)
	}

	Init_Data() {
		super.Init_Data()
		this.SetVars_Default({
			//*Abi_Move override
			Type: "Move_Rectiligne",
			MovementType: "Recti_Target",
			Recti_EndOnWall: true,

			Speed_Override: 280,

			//*common override
			Priority: 1,

			Timer_Cooldown: "0.1-0.5",
			Timer_Prepare1: 0.5,
			Timer_Prepare2: 0.2,
			Timer_Execute: -2,
			Timer_Recover: 0,

			Move_RegularAnim: true,

			onWallImpact: () => {},
		})
	}
}
