export class Style_Manager {
	constructor(runtime) {
		this.runtime = runtime

		runtime.addEventListener("beforeanylayoutstart", () => this.OnBeforeLayoutStart())

		runtime.outlineWidth = Utils.px(0.5)
		runtime.borderSolid = (color) => `${runtime.outlineWidth} solid ${color}`

		runtime.tierColors = {
			TIER_0: "#ffffff",
			//TIER_0_DARK: "#060b1f",
			TIER_0_DARK: "#0f0f0f",

			TIER_0_Gray: "#a4a4a4",
			TIER_0_Gray_DARK: "#444444",

			TIER_1: "#1eff00", //"#1eff00",

			TIER_2: "#00b7ff", //"#0070dd",

			TIER_3: "#a335ee", //"#a335ee",

			TIER_4: "#ff3b3b", //"#ff3b3b",

			TIER_5: "#ffe600",
			/*TIER_5: "#ff8000",*/

			TIER_6: "#ffe600",

			Player0: "#15ffd8",
			Player1: "#ff3be2",
			Player2: "#3bff4f",
			Player3: "#deff3b",

			/*
			Player0: "#a1fced",
			Player1: "#f2ad87",
			Player2: "#a9fca1",
			Player3: "#fcf08f"
            */
		}

		const color = runtime.tierColors["TIER_0_Gray"]
		runtime.tierColors["TIER_0_Gray_ALPHA"] = runtime.colorUtils.hexOpacity(color, 0.4)

		for (let i = 0; i <= 6; i++) {
			const key = "TIER_" + i
			const color = runtime.tierColors[key]
			if (i !== 0) runtime.tierColors[key + "_DARK"] = runtime.colorUtils.hexModulate(color, 0.3)
			runtime.tierColors[key + "_ALPHA"] = runtime.colorUtils.hexOpacity(color, 0.4)

			if (i === 5) {
				runtime.tierColors[key + "_DARK"] = runtime.colorUtils.hexModulate(color, 0.45)
			}
		}

		for (let i = 0; i <= 3; i++) {
			const key = "Player" + i
			const color = runtime.tierColors[key]
			runtime.tierColors[key + "_DARK"] = runtime.colorUtils.hexModulate(color, 0.3)
			runtime.tierColors[key + "_BACK"] = runtime.colorUtils.hexModulate(color, 0.7)
			runtime.tierColors[key + "_ALPHA"] = runtime.colorUtils.hexOpacity(color, 0.4)
		}

		runtime.colorsText = {
			Title: "#ff0066",
			Gray: "#555555",

			Pos: "#00ff00",
			Neg: "red",

			Effect_Neg: "#eb6565",
			Effect_Purple: "#ff00b7",
		}

		this.skinName = "Base"

		this.skins = {
			Base: {
				BG: "#000114",
				BG_Gradient: "#ff0000",
				ChainSkin: "Chain",
			},
			Jungle: {
				BG: "#000114",
				BG_Gradient: "#00e1ff",
				ChainSkin: "Jungle",
				TiledBG: ["Jungle"],
				WaveFinishedAnim: "Anim_Gorilla_Flex",
			},
			Abyss: {
				BG: "#000114",
				BG_Gradient: "#00e1ff",
				ChainSkin: "Abyss",
			},
			Frozen: {
				BG: "#000114",
				BG_Gradient: "#00e1ff",
				ChainSkin: "Abyss",
			},
		}

		const colorText_maybe = {
			White: "#ffffff",
			Boost: "#a30000",
			Curse: "#ca61ff",
			Charm: "#ff639c",
			DamageInc: "#bfebff",
			Highlight: "#72fff2",
			SecondaryFont: "#eae2b0",
			Category: "#faf4cc",
			Gold: "#76ff76",
		}

		runtime.colorsGame = {
			EnemyIdle: [1, 0.416, 0.416],
			EnemyAttack: [1, 0, 0],
		}
	}

	OnBeforeLayoutStart() {
		this.SetSkin()
	}

	SetSkin(skinOverride = "") {
		if (skinOverride) this.skinName = skinOverride
		this.skin = this.skins[this.skinName]

		const colorBG = this.runtime.colorUtils.ColorToRGBArray(this.skin.BG)
		const colorGradient = this.runtime.colorUtils.ColorToRGBArray(this.skin.BG_Gradient)

		const layerBG = this.runtime.layout.getLayer("BG_BG0")
		if (layerBG) {
			layerBG.backgroundColor = colorBG
		}

		const gradientSkins = this.runtime.objects["Circle_Gradient_Sines"].getAllInstances()
		for (const inst of gradientSkins) {
			inst.colorRgb = colorGradient
		}

		const chains = this.runtime.objects["Chain_NoLoop"].getAllInstances()
		for (const inst of chains) {
			inst.setAnimation(this.skin.ChainSkin)
		}
	}

	GetTierLoc(tier, withParenthesis = false) {
		let tierLoc = this.runtime.translation.Get("Tier_" + tier)
		if (withParenthesis) tierLoc = "(" + tierLoc + ")"
		let color = this.runtime.tierColors["TIER_" + tier]
		if (tier === 0) color = this.runtime.tierColors["TIER_0_Gray"]
		tierLoc = "[color=" + color + "]" + tierLoc + "[/color]"
		return tierLoc
	}

	GetTierColor(tier) {
		return this.runtime.tierColors["TIER_" + tier]
	}

	Elem_BGGradient(elem, key = "TIER_0", opacity = 1) {
		const color = this.runtime.tierColors[key + "_DARK"]

		elem.style.background = `linear-gradient(360deg, ${color}, rgba(0, 0, 0, ${opacity}))`
	}

	Elem_BoxColorStyle(elem, key = "TIER_0") {
		const borderColor = this.runtime.tierColors[key]
		const bgColor = this.runtime.tierColors[key + "_DARK"]
		const border = this.runtime.borderSolid(borderColor)

		//elem.style.backgroundColor = bgColor
		elem.style.background = `linear-gradient(360deg, ${bgColor}, rgba(0, 0, 0, 0.83))`

		elem.style.border = border
	}

	Elem_BoxStyle(elem, key = "TIER_0", padding = 2, args = {}) {
		if (!key) key = "TIER_0"

		let hasTransparentBG = "hasTransparentBG" in args ? args.hasTransparentBG : true
		let isSetting = "isSetting" in args ? args.isSetting : false
		let frameUrl = "frameUrl" in args ? args.frameUrl : "Frame_UI_0.png"

		let zIndex_BG = "zIndex_BG" in args ? args.zIndex_BG : -1

		const borderColor = this.runtime.tierColors[key]
		const bgColor = this.runtime.tierColors[key + "_DARK"]

		//elem.style.backgroundColor = bgColor

		//! UI Rework removed border
		//const border = this.runtime.borderSolid(borderColor)
		//elem.style.border = border

		elem.style.position = "relative"

		//* transparentBG

		if (hasTransparentBG === true) {
			let transparentBG = elem.querySelector(":scope > .transparentBG")
			if (!transparentBG) {
				transparentBG = document.createElement("div")
				transparentBG.classList.add("transparentBG")
				elem.appendChild(transparentBG)
			}

			Object.assign(transparentBG.style, {
				position: "absolute",
				inset: Utils.px(2),
				background: `linear-gradient(360deg, ${bgColor}, rgba(0, 0, 0, 0.83))`,
				opacity: "0.92",
				zIndex: zIndex_BG,
				pointerEvents: "none",
			})
		}

		elem.style.padding = Utils.px(padding)

		//* borderFrame
		let borderFrame = elem.querySelector(":scope > .borderFrame")
		if (!borderFrame) {
			borderFrame = document.createElement("div")
			borderFrame.classList.add("borderFrame")
			elem.appendChild(borderFrame)
		}

		Object.assign(borderFrame.style, {
			position: "absolute",
			borderWidth: Utils.px(10),
			borderStyle: "solid",
			borderImageSource: `url(${frameUrl})`,
			borderImageSlice: "50",
			borderImageRepeat: "stretch",
			pointerEvents: "none",
		})

		if (isSetting === true) {
			Object.assign(borderFrame.style, {
				borderWidth: Utils.px(7),
				inset: Utils.px(-1),
				/*
				width: "110%",
				height: "100%",
				boxSizing: "border-box",*/
			})
		} else {
			Object.assign(borderFrame.style, {
				inset: Utils.px(0),
			})
		}
	}

	Elem_ItemStyle(elem, key) {
		const borderColor = this.runtime.tierColors[key + "_ALPHA"]
		const bgColor = this.runtime.tierColors[key + "_DARK"]
		//const border = `${Utils.px(1)} solid ${borderColor}`
		const border = this.runtime.borderSolid("#000000")

		//elem.style.backgroundColor = bgColor
		elem.style.background = `linear-gradient(360deg, ${bgColor}, rgba(0, 0, 0, 0.83))`

		if (key === "TIER_6") {
			elem.style.background = `linear-gradient(360deg, #ff5081, #fada15`
		}

		elem.style.border = border
	}

	//! REWORK UI

	Elem_ItemStyleFrame(elem, tier = 0) {
		Object.assign(elem.style, {
			backgroundImage: `url('frame_item_${tier}.png')`,
			backgroundSize: "cover", // Ensures the image covers the element without distortion
			backgroundRepeat: "no-repeat",
			backgroundPosition: "center",
			// backgroundSize: "100% 100%" // Not needed since "cover" is used
		})
	}
}
