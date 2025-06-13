import { EventDispatcher } from "./EventDispatcher.js"

class C3Array {
	constructor(o) {
		const sz = o["size"]
		this._cx = sz[0]
		this._cy = sz[1]
		this._cz = sz[2]
		this._arr = o["data"]
	}

	At(x, y, z) {
		x = Math.floor(x)
		y = Math.floor(y)
		z = Math.floor(z)
		if (x >= 0 && x < this._cx && y >= 0 && y < this._cy && z >= 0 && z < this._cz) return this._arr[x][y][z]
		else return 0
	}
}

export class Translation_Manager extends EventDispatcher {
	constructor(runtime) {
		super(runtime)
		//*Translation

		this.langs = {}
		this.loadedFiles = new Set()
		this.currentLang = "EN"

		this.alreadyLoadedKeys = new Set()

		//! to implem only if need something in addition to families
		//this.textC3Inst_toTranslate = new Set()

		this.addEventListener("localLoaded", (e) => {
			this.TranslatePage()
		})

		this.Request_Config("_Translations.json")
		//this.Request_Config("_Translations_Bossgame.json")
	}

	ChangeLang(lang) {
		lang = lang.toUpperCase()
		this.currentLang = lang
		this.TranslatePage()
	}

	sanitizeHTMLString(inputString) {
		return inputString
			.replace(/&/g, "&amp;") // Escape &
			.replace(/"/g, "&quot;") // Escape double quotes
			.replace(/'/g, "&#39;") // Escape single quotes
			.replace(/</g, "&lt;") // Escape <
			.replace(/>/g, "&gt;") // Escape >
			.replace(/\n\s*/g, "") // Remove line breaks and extra spaces
			.trim() // Trim spaces at the start and end
	}

	Elem_SetTranslateKey_ToHTML(elem, key, callback = null) {
		//! textContent remove all children
		if (!elem || !key) return
		elem.setAttribute("data-translate-html", key)

		if (callback) {
			elem.addEventListener("translated", (event) => {
				// Pass elem to the callback when the event is triggered
				callback(event.detail.elem)
			})
		}

		this.Elem_UpdateTranslation_HTML(elem)
	}

	Elem_SetTranslateKey(elem, key, callback = null) {
		//! textContent remove all children
		if (!elem || !key) return
		elem.setAttribute("data-translate", key)
		elem.textContent = this.runtime.translation.Get(key)

		if (callback) {
			callback(elem)
			elem.addEventListener("translated", (event) => {
				// Pass elem to the callback when the event is triggered
				callback(event.detail.elem)
			})
		}
	}

	Elem_UpdateTranslation_HTML(elem) {
		const key = elem.getAttribute("data-translate-html")

		//!todo fallback to english in Get
		//const translatedText = translations[language]?.[translationKey] || translations["en"][translationKey]
		const string = this.runtime.translation.Get(key)
		const parsedBBcode = Utils.parseBBCode(string)
		elem.innerHTML = parsedBBcode

		const translatedEvent = new CustomEvent("translated", { detail: { elem } })
		elem.dispatchEvent(translatedEvent)
	}

	Elem_UpdateTranslation(elem) {
		//if (!elem) return
		const key = elem.getAttribute("data-translate")
		if (!key) {
			this.Elem_UpdateTranslation_HTML(elem)
			return
		}

		//!todo fallback to english in Get
		//const translatedText = translations[language]?.[translationKey] || translations["en"][translationKey]
		elem.textContent = this.runtime.translation.Get(key)
		const translatedEvent = new CustomEvent("translated", { detail: { elem } })
		elem.dispatchEvent(translatedEvent)
	}

	SetCJK(bool) {
		let styleId = "cjk-style" // Unique ID for the style element
		let existingStyle = document.getElementById(styleId)

		if (bool) {
			if (!existingStyle) {
				const style = document.createElement("style")
				style.id = styleId
				style.innerHTML = `
                    * {
                        word-break: break-word;
                        line-break: strict;
                        white-space: normal;
                    }
                `
				document.head.appendChild(style)
			}
		} else {
			if (existingStyle) {
				existingStyle.remove()
			}
		}
	}

	Update_BarkMap() {
		const allKeys = Object.keys(this.langs[this.currentLang])

		let allBarkKeys = allKeys.filter((key) => key.startsWith("Bark_")).map((key) => key.replace("Bark_", ""))

		//Bark_Noob_02, Bark_Tankette_Attack_02
		//create a dictionary where each type of bark (Noob, Tankette_Attack) is a key associated to an array of all keys
		this.barkMap = {}
		for (const key of allBarkKeys) {
			const parts = key.split("_")
			// if the last part is a number, remove it
			if (!isNaN(parts[parts.length - 1])) {
				parts.pop()
			}
			const barkType = parts.join("_")

			if (!this.barkMap[barkType]) {
				this.barkMap[barkType] = []
			}
			this.barkMap[barkType].push("Bark_" + key)
		}

		console.error("BarkMap", this.barkMap)
	}

	Update_HTMLClass() {
		const lang = this?.runtime?.settings?.Language
		if (!lang) return

		const chineseKorean = ["zh", "zh_TW", "ja", "ko"]

		//parent container (go to find)
		const statsTabs = document.querySelectorAll(".statsTab")

		//column
		//! find TabsUpdateHeight()
		const tabLinks = document.querySelectorAll(".tablinks")
		//set height

		const statContainers = document.querySelectorAll(".statContainer")

		const statNames = document.querySelectorAll(".statName")
		const statValues = document.querySelectorAll(".statValue")

		statContainers.forEach((elem) => {
			//remove space below
			elem.style.marginBottom = ""
		})

		if (lang === "ru") {
			//overrride the style of statValue class
			tabLinks.forEach((elem) => {
				elem.style.fontSize = Utils.px(5.2)
			})
			statNames.forEach((elem) => {
				elem.style.fontSize = Utils.px(6)
			})
			statValues.forEach((elem) => {
				elem.style.marginLeft = Utils.px(4)
			})
		} else if (["zh", "zh_TW", "ko"].includes(lang)) {
			tabLinks.forEach((elem) => {
				elem.style.fontSize = Utils.px(6.5)
			})
			statNames.forEach((elem) => {
				elem.style.fontSize = Utils.px(6)
			})
			statValues.forEach((elem) => {
				elem.style.marginLeft = Utils.px(4)
			})
		} else if (lang === "ja") {
			tabLinks.forEach((elem) => {
				elem.style.fontSize = Utils.px(5)
			})
			statContainers.forEach((elem) => {
				//remove space below
				elem.style.marginBottom = Utils.px(-1)
			})
			statNames.forEach((elem) => {
				elem.style.fontSize = Utils.px(5.7)
			})
			statValues.forEach((elem) => {
				elem.style.marginLeft = Utils.px(4)
			})
		} else {
			tabLinks.forEach((elem) => {
				elem.style.fontSize = Utils.px(6)
			})
			statNames.forEach((elem) => {
				elem.style.fontSize = Utils.px(5.7)
			})
			statValues.forEach((elem) => {
				elem.style.marginLeft = Utils.px(4)
			})
		}

		statValues.forEach((elem) => {
			elem.style.marginLeft = Utils.px(3)
		})
	}

	TranslatePage() {
		this.Update_BarkMap()
		this.Update_HTMLClass()

		this.runtime.events.dispatchEventString("translationChanged")

		const lang = this.runtime.settings.Language
		const cjkLangs = ["zh", "zh_TW", "ja", "ko"]
		const isCJK = cjkLangs.includes(lang)
		this.SetCJK(isCJK)

		const elementsToTranslate = document.querySelectorAll("[data-translate]")

		elementsToTranslate.forEach((elem) => {
			this.Elem_UpdateTranslation(elem)
		})

		const elementsToTranslateHTML = document.querySelectorAll("[data-translate-html]")

		elementsToTranslateHTML.forEach((elem) => {
			this.Elem_UpdateTranslation_HTML(elem)
		})

		this.TranslateInsts()
	}

	TranslateInsts() {
		const textC3Inst_translate = this.runtime.objects["Text_Translate"].getAllInstances()
		for (const inst of textC3Inst_translate) {
			const tr = this.runtime.translation.Get(inst.instVars["TrKey"])
			if (tr) inst.text = tr
		}
	}

	async Request_Config(url) {
		if (this.loadedFiles.has(url)) return

		this.loadedFiles.add(url)

		// Get the correct URL to fetch
		const textFileUrl = await this.runtime.assets.getProjectFileUrl(url)

		// Now fetch that URL normally
		const response = await fetch(textFileUrl)
		const responseJson = await response.json()

		const arr = new C3Array(responseJson)

		//for each lang (X column)
		for (let x = 2; x < arr._cx; x++) {
			const lang = arr.At(x, 0, 0).toUpperCase()
			//for each key (Y row)
			for (let y = 1; y < arr._cy; y++) {
				const key = arr.At(0, y, 0)
				if (!key) continue
				if (this.alreadyLoadedKeys.has(key)) continue
				const value = arr.At(x, y, 0)
				if (!value) continue
				this._set(this.langs, [lang, key], value)
			}
		}

		for (let y = 1; y < arr._cy; y++) {
			const key = arr.At(0, y, 0)
			if (!key) continue
			this.alreadyLoadedKeys.add(key)
		}

		console.error("Translation_Manager: Loaded " + url)

		this.dispatchEventString("localLoaded")
	}

	HasKey(key) {
		if (this.langs?.[this.currentLang]?.[key]) return true
		return false
	}

	Get(key) {
		//!todo fallback to english
		if (!this.langs?.[this.currentLang]?.[key]) {
			return key
		}
		return this.langs[this.currentLang][key]
	}

	_set(obj, path, value, override = true) {
		if (typeof path === "string") {
			path = path.split(".")
		}
		let didntExisted = false
		for (var i = 0; i < path.length - 1; i++) {
			var key = path[i]
			if (!obj.hasOwnProperty(key) || typeof obj[key] !== "object") {
				obj[key] = {}
				didntExisted = true
			}
			obj = obj[key]
		}
		if (override || didntExisted) obj[path[path.length - 1]] = value
		return obj[path[path.length - 1]]
	}
}
