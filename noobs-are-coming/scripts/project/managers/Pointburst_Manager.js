export class Pointburst_Manager {
	constructor(runtime) {
		this.runtime = runtime

		const C3htmlwrap = document.querySelector(".c3html")
		this.gameWorld = document.createElement("div")
		this.gameWorld.classList.add("gameWorld")
		C3htmlwrap.appendChild(this.gameWorld)

		//! just disabled to avoid annoying popups

		/*
		setInterval(() => {
			// Random damage, x, and y positions
			const randomDamage = Math.floor(Math.random() * 100) + 1
			const randomX = Math.random() * window.innerWidth
			const randomY = Math.random() * window.innerHeight

			const player = this.runtime.player.inst

			if (!player) return

			//sqthis.CreatePointBurst(randomDamage, player.x, player.y)

			//this.CreatePointBurst_HTMLElem(randomDamage, player.x, player.y)
			this.CreatePointBurst_HTMLElem(randomDamage, player.x, player.y - 50, "", "Game/Graph/Stat_Armor.png")
		}, 1000)*/

		this.runtime.events.addEventListener("OnGameTick", () => {
			this.UpdateGameWorldTransform()
			this.Tick_TweeningTexts()
		})
	}

	Create_InfoShake_Text(text, x, y, color = "white") {
		const inst = this.runtime.pool.CreateInstance("InfoShake_Text", "HUD_Local", x, y)

		Utils.TextC3(inst, {
			text: text,
			outlineBack: 6,
			color: color,
		})

		inst.angleDegrees = Utils.random(-17, 17)
		inst.behaviors["Fade"].restartFade()
		inst.behaviors["Sine"].isEnabled = true
		inst.behaviors["Sine2"].isEnabled = true
	}

	Create_SF_TextImpact(text, type = "", x, y) {
		const objType = type ? "SF_TextImpact_" + type : "SF_TextImpact"
		const inst = this.runtime.pool.CreateInstance(objType, "HUD_Local", x, y)
		inst.angleDegrees = Utils.random(-17, 17)
		inst.text = text
		inst.behaviors["Fade"].restartFade()
		inst.behaviors["Sine"].isEnabled = true
		inst.behaviors["Sine2"].isEnabled = true

		return inst
	}

	CreatePointBurst_SpriteFont(damage, x, y, color = "white", imagePath = "") {
		if (!color) color = "white"

		x = x + Utils.random(-10, 10)
		y = y + Utils.random(-10, 10)
		const inst = this.runtime.pool.CreateInstance("SF_Pointburst", "Objects", x, y)

		damage = damage.toString()
		if (damage > 0 && imagePath) damage = "+" + damage
		inst.text = damage
		inst.colorRgb = [1, 1, 1]
		const tweenBeh = inst.behaviors["Tween"]
		const timerBeh = inst.behaviors["Timer"]

		tweenBeh.startTween("y", y - 4, 0.05, "linear", {
			pingPong: true,
		})

		timerBeh.startTimer(Utils.random(0.7, 0.9), "Scale")
		timerBeh.startTimer(1.2, "BackToPool")

		timerBeh.addEventListener("timer", (e) => {
			if (e.tag === "Scale") {
				inst.instVars.scaleDown = true
				tweenBeh.startTween("value", 0, 0.3, "out-exponential", {
					tags: "scaleDown",
				})
			} else if (e.tag === "BackToPool") {
				inst.instVars.scaleDown = false
				inst.destroy()
			}
		})

		return inst
	}

	Tick_TweeningTexts() {
		const tweeningTexts = this.runtime.objects["Text_Icon"].getAllInstances()
		for (const inst of tweeningTexts) {
			const tweenBeh = inst.behaviors["Tween"]
			for (const tweenScale of tweenBeh.tweensByTags("textScale")) {
				inst.sizePt = inst.size_init * tweenScale.value
			}
		}
	}

	CreatePointBurst_Icon(text, x, y, color = "white", iconName = "") {
		x = x + Utils.random(-10, 10)
		y = y + Utils.random(-10, 10)
		const inst = this.runtime.objects["Text_Icon"].createInstance("HUD_Local", x, y)

		inst.behaviors["Tween"].startTween("y", y - 4, 0.05, "linear", {
			pingPong: true,
		})

		if (typeof text === "number") {
			text = text.toString()
			if (text > 0 && iconName) text = "+" + text
		}

		if (!text) {
			//spawn just an icon instead
		}

		if (iconName) text += ` [icon=${iconName}]`

		Utils.TextC3(inst, {
			text: text,
			outlineBack: 5,
			color: color,
		})

		const timerBeh = inst.behaviors["Timer"]

		timerBeh.addEventListener("timer", (e) => {
			if (e.tag === "scale") {
				inst.size_init = inst.sizePt
				inst.behaviors["Tween"].startTween("value", 0, 0.15, "linear", {
					startValue: 1,
					destroyOnComplete: true,
					tags: "textScale",
				})
			}
		})

		timerBeh.startTimer(Utils.random(0.55, 0.7), "scale")

		return inst
	}

	CreatePointBurst_HTMLElem(text, x, y, color = "white", imagePath = "") {
		if (!color) color = "white"

		x = x + Utils.random(-10, 10)
		y = y + Utils.random(-10, 10)
		const inst = this.runtime.objects["Pointburst"].createInstance("HTML_Local", x, y)

		inst.behaviors["Tween"].startTween("y", y - 4, 0.05, "linear", {
			pingPong: true,
		})

		if (typeof text === "number") {
			text = text.toString()
			if (text > 0 && imagePath) text = "+" + text
		}

		inst.htmlContent = /*html*/ `
        <span style="
            display: flex; 
            align-items: center; /* Vertically center the items */
            font-family: 'LilitaOne', sans-serif; 
            font-size: calc(var(--px) * 10); 
            color: ${color}; 
            justify-content: center;
            align-items: center;
            transform-origin: center;
        ">
            ${text} 
            ${imagePath ? `<img src="${imagePath}" alt="icon" style="width: 1em; height: 1em; margin-left: 4px;" />` : ""}
        </span>
`
		const timerBeh = inst.behaviors["Timer"]

		timerBeh.addEventListener("timer", (e) => {
			if (e.tag === "scale") {
				inst.setContentCssStyle("transform", "scale(0)", "", true)
			} else if (e.tag === "destroy") {
				inst.destroy()
			}
		})

		timerBeh.startTimer(Utils.random(0.55, 0.7), "scale")
		timerBeh.startTimer(1.2, "destroy")

		return inst
	}

	UpdateGameWorldTransform() {
		const layout = this.runtime.layout

		//Utils.debugText(layout.scrollX)

		const offsetX = `calc(var(--px) * ${layout.scrollX})`
		const offsetY = `calc(var(--px) * ${layout.scrollY})`
		const layoutScale = `calc(var(--construct-scale) * ${layout.scale})`
		this.gameWorld.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${layoutScale})`
	}

	CreatePointBurst(damage, x, y) {
		const pointBurst = document.createElement("div")

		// Assign the 'pointburst' class for styling
		pointBurst.classList.add("pointburst")

		pointBurst.textContent = damage

		pointBurst.style.left = `calc(var(--px) * ${x})`
		pointBurst.style.top = `calc(var(--px) * ${y})`

		this.gameWorld.appendChild(pointBurst)

		setTimeout(() => {
			pointBurst.style.opacity = "0"
			pointBurst.style.top = `calc(var(--px) * ${y - 50})`
		}, 100)

		setTimeout(() => {
			pointBurst.remove()
		}, 600)
	}
}
