import { Layout } from "./Layout.js"

export class Layout_Title extends Layout {
	constructor(runtime) {
		super(runtime, "Title")

		this.runtime.addEventListener("beforeanylayoutstart", () => this.Resize_FullscreenObj())
		this.runtime.addEventListener("resize", () => this.Resize_FullscreenObj())

		this.runtime.events.addEventListener("translationChanged", () => this.Update_TitleLanguage())

		this.init = false
	}

	Resize_FullscreenObj(e) {
		const fullscreens = this.runtime.objects["Fullscreen"].getAllInstances()
		const fullscreens_9Patch = this.runtime.objects["Fullscreen_9Patch"].getAllInstances()

		const fullScreenObjects = [...fullscreens, ...fullscreens_9Patch]

		for (const inst of fullScreenObjects) {
			if (!inst) continue
			const layerViewport = inst.layer.getViewport()

			inst.setPosition((layerViewport.left + layerViewport.right) / 2, (layerViewport.top + layerViewport.bottom) / 2)
			inst.setSize(layerViewport.width, layerViewport.height)
		}
	}

	Update_TitleLanguage() {
		//!disable for now
		return
		const titleLogo = this.runtime.objects["TitleLogo"].getFirstInstance()
		const titleLogo_Chinese = this.runtime.objects["TitleLogo_Chinese"].getFirstInstance()

		if (!titleLogo || !titleLogo_Chinese) return

		titleLogo_Chinese.setPosition(titleLogo.x, titleLogo.y)
		titleLogo.addChild(titleLogo_Chinese, {
			transformX: true,
			transformY: true,
		})

		if (this.runtime.settings.Language === "zh" || this.runtime.settings.Language === "zh_TW") {
			titleLogo.isVisible = false
			titleLogo_Chinese.isVisible = true
		} else {
			titleLogo.isVisible = true
			titleLogo_Chinese.isVisible = false
		}
	}

	Start(e) {
		if (this.runtime.main.isDemo) {
			this.runtime.menu.watermark.innerText = "Demo"
		} else {
			this.runtime.menu.watermark.innerText = "Beta"
		}

		if (this.runtime.platforms.Export === "preview") {
			this.runtime.menu.watermark.innerText = ""
		}

		const bottomLeft = this.runtime.menu.bottomLeft

		bottomLeft.style.display = "flex"

		if (!this.init) {
			this.init = true

			const elemVersion = bottomLeft.querySelector("#bottomLeft_Version")
			if (elemVersion) {
				elemVersion.textContent = `v${this.runtime.main.version}`
				if (this.runtime.main.isDemo) elemVersion.textContent = "Demo " + elemVersion.textContent
			}

			this.runtime.translation.Elem_SetTranslateKey(bottomLeft.querySelector("#bottomLeft_ReleaseDate"), "Full_Release_Date")
			this.runtime.translation.Elem_SetTranslateKey(bottomLeft.querySelector("#bottomLeft_Wishlist"), "Please_Wishlist")
		}

		this.Update_TitleLanguage()

		const titleGround = this.runtime.objects["TitleGround"].getFirstInstance()
		this.runtime.movie.CreateSceneFromData("Title", titleGround.x, titleGround.y)

		this.runtime.menu.GoTo("titleScreen")

		this.runtime.translation.Elem_UpdateTranslation(this.runtime.progress.progressTitle)
		const progressLabelButton = this.runtime.menu.nameToMenu.get("titleScreen").querySelector('[data-translate-html="Progress"]')
		//console.error("progressLabelButton", progressLabelButton)
		this.runtime.translation.Elem_UpdateTranslation(progressLabelButton)

		//reset connection just in case
		this.runtime.menu.startRun.ResetPlayerConnection()

		/*
		for (const player of this.runtime.players) {
			if (player.isPlayer0) {
				player.SpatialNavigation()
			} else player.SN.clear()
		}*/

		for (const player of this.runtime.players) {
			player.startRun_wep = null
		}

		//this.runtime.menu.SpatialNavigation()

		//!  TEMP
		this.runtime.audio.PlayMusic("Title_Eat_a_slug_and_die")
	}

	End(e) {
		this.runtime.menu.bottomLeft.style.display = "none"
	}

	Tick() {
		this.runtime.zOrder.SortZ()
	}
}
