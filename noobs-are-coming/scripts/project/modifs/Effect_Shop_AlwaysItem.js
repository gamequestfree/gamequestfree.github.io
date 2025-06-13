export class Effect_Shop_AlwaysItem extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)

		//"Shop_AlwaysItem|itemID": null
		const data = effectName.split("|")
		this.Item = data[1]

		this.stackName = "Shop_AlwaysItem"
	}

	GetInfo() {
		this.text = this.TranslateKey()
		this.Replace("0", this.GetItem(this.Item))
		return this.text
	}
}
