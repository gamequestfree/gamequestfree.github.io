import { EventDispatcher } from "./EventDispatcher.js"

export class FX_Manager extends EventDispatcher {
	constructor(runtime) {
		super(runtime)

		this.glowingAnims = new Set()
		this.glow_Clones = new Set()

		this.pasteClones = new Map()

		this.runtime.addEventListener("instancedestroy", (e) => {
			this.InstanceDestroy(e.instance)
		})
		this.runtime.addEventListener("beforeanylayoutstart", () => {
			this.OnBeforeLayoutStart()
		})
		this.runtime.addEventListener("beforeanylayoutend", () => {
			this.OnBeforeLayoutEnd()
		})

		this.drawOutlines = false

		this.drawGlow = true
		this.drawGlow_Entities = false
	}

	OnBeforeLayoutEnd() {
		this.glowingAnims.clear()
		this.glow_Clones.clear()
		this.pasteClones.clear()

		this.DC_Outlines = null
	}

	OnBeforeLayoutStart() {
		this.DC_Outlines = this.runtime.objects["DC_Outlines"].getFirstInstance()

		const drawingCanvas = this.runtime.objects["DC_Glow"].getFirstInstance()
		if (!drawingCanvas) return

		const colors = {
			1: [0, 1, 0],
			2: [0, 0, 1],
			3: [1, 0, 1],
		}

		this.pasteInsts = new Map()
		for (const [key, color] of Object.entries(colors)) {
			const pasteInst = this.runtime.objects["Anim"].createInstance("Objects_Glow", 0, 0)
			pasteInst.isVisible = false
			pasteInst.colorRgb = color
			this.pasteInsts.set(key, pasteInst)

			pasteInst.effects[0].setParameter(0, color)
		}
	}

	InstanceDestroy(inst) {
		this.glowingAnims.delete(inst)
		this.glow_Clones.delete(inst)
	}

	Add_GlowAnim(inst) {
		this.glowingAnims.add(inst)
	}

	Add_GlowClone(inst) {
		const objectName = inst.objectType.name
		this.glow_Clones.add(inst)

		let pasteClone = this.pasteClones.get(objectName)
		if (!pasteClone) {
			pasteClone = this.runtime.objects[objectName].createInstance("Objects_Glow", 0, 0)
			pasteClone.isVisible = false
			pasteClone.colorRgb = [1, 0, 0]
			//pasteClone.colorRgb = [0, 0.933, 1]
			this.pasteClones.set(objectName, pasteClone)
		}
	}

	Match_Inst_To_Paste(glowingAnim, pasteInst) {
		Utils.World_MatchInst(pasteInst, glowingAnim)

		const outlineOriginal = glowingAnim.effects[0]

		if (outlineOriginal) {
			const outlinePaste = pasteInst.effects[0]
			outlinePaste.isActive = outlineOriginal.isActive
			if (outlineOriginal.isActive) {
				outlinePaste.setParameter(1, outlineOriginal.getParameter(1))
				return true
			}
		}

		return false
	}

	DC_DrawOutline(inst) {
		if (!this.runtime.fxManager.drawOutlines) return
		this.DC_Outlines.pasteInstances([inst], true)
	}

	PreTick() {
		this.runtime.objects["DC_Shadow"].getFirstInstance().clearCanvas([0, 0, 0, 0])

		if (this.runtime.fxManager.drawOutlines) {
			this.runtime.objects["DC_Outlines"].getFirstInstance().clearCanvas([0, 0, 0, 0])
		} else {
			this.runtime.objects["DC_Outlines"].getFirstInstance().isVisible = false
		}
	}

	Tick_Glow() {
		const drawingCanvas = this.runtime.objects["DC_Glow"].getFirstInstance()
		if (!drawingCanvas) return

		if (this.glowingAnims.size === 0 && this.glow_Clones.size === 0) {
			drawingCanvas.isVisible = false
			return
		}

		if (!this.runtime.fxManager.drawGlow) {
			drawingCanvas.isVisible = true
			return
		}

		drawingCanvas.isVisible = true

		drawingCanvas.clearCanvas([0, 0, 0, 0])

		for (const pasteInst of this.pasteInsts.values()) {
			pasteInst.isVisible = true
		}
		for (const pasteClone of this.pasteClones.values()) {
			pasteClone.isVisible = true
		}

		for (const glowClone of this.glow_Clones) {
			const objectName = glowClone.objectType.name
			let pasteClone = this.pasteClones.get(objectName)

			if (glowClone.glowColor) {
				pasteClone.colorRgb = glowClone.glowColor
			}

			const withEffects = this.Match_Inst_To_Paste(glowClone, pasteClone)

			drawingCanvas.pasteInstances([pasteClone], withEffects)
		}

		for (const glowingAnim of this.glowingAnims) {
			if (glowingAnim.isVisible) {
				let pasteInst = this.pasteInsts.get(glowingAnim.glowEvo)
				if (!pasteInst) continue // Skip if pasteInst is not found

				const withEffects = this.Match_Inst_To_Paste(glowingAnim, pasteInst)

				drawingCanvas.pasteInstances([pasteInst], withEffects)
			}
		}

		for (const pasteInst of this.pasteInsts.values()) {
			pasteInst.isVisible = false
		}
		for (const pasteClone of this.pasteClones.values()) {
			pasteClone.isVisible = false
		}
	}

	FX_WalkStep(x, y) {
		const stepFX = this.runtime.pool.CreateInstance("FX_Walkstep", "Objects", x, y)

		const randAnim = "WalkStep" + Utils.randomInt(4)
		stepFX.setAnimation(randAnim)

		//this.runtime.audio.PlaySound("Footstep_Dirt_0" + Utils.randomInt(5))
	}
}
