export class Effect_Start_Item extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)

		//"Start_Item|itemID": 0
		const data = effectName.split("|")
		this.Item = data[1]
		this.Count = effectData ? effectData : 1

		//this.Item = this.Item.replace("Wep_", "")

		this.stackName = "Start_Item"
	}

	OnAdded() {
		this.player.AddItemByName(this.Item, 0, this.Count, true)
	}

	GetInfo() {
		this.text = this.Translate("Effect_Start_Item")
		this.Replace("0", this.Count)
		this.Replace("1", Utils.GetItemDisplayName(this.Item, true))
		//this.Replace("img", this.GetItemImg(this.Item))
		this.Replace("img", "")
		return this.text
	}
}
