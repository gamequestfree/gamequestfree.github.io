export class Effect_Shop_AlwaysWepMin extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)

		this.SetVars({
			Count: 1,
		})

		this.stackName = "Shop_AlwaysWepMin"
	}

	GetInfo() {
		this.text = this.TranslateKey()
		return this.text
	}
}
