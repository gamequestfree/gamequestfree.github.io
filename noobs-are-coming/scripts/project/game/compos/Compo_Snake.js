export class Compo_Snake extends C4.Component {
	constructor(unit, data = null) {
		super(unit, data)
	}
	SetData() {
		this.SetVars_Default({
			Type: "Rope", //["Rope", "Follow"]
			Snake_DistPart: 15,

			Snake_Visu: "SnakePart",
			Snake_Visu_Size: 0,

			Snake_Parts_Min: 0,
			Snake_Parts_Add: 0,

			AttachEvery: 2,

			SnakePart_SetAngle: false,

			Snake_Shadow: true,
		})
	}

	SetInternals() {
		this.selfIsHead = true
		this.positions = []
	}

	Init() {
		this.bodyparts = []
		this.attachements = []

		if (this.inst) this.bodyparts.push(this.inst)

		this.Attachements_Update()

		this.bodyPaste = this.runtime.objects["Anim"].createInstance("FX_Behind", 0, 0)
		this.inst.addChild(this.bodyPaste, {
			destroyWithParent: true,
		})

		this._SetTicking(true)
	}

	ReleaseComp() {
		super.ReleaseComp()
		for (let i = 1; i < this.bodyparts.length; ++i) {
			const bodypart = this.bodyparts[i]
			bodypart.destroy()
		}
		this.bodyparts = null
		this.attachements = null
		this.bodyPaste = null
	}

	Attachement_Add(inst) {
		this.attachements.push(inst)
		this.Attachements_Update()
	}

	Attachement_Remove(inst) {
		const index = this.attachements.indexOf(inst)
		if (index !== -1) {
			this.attachements.splice(index, 1)
			this.Attachements_Update()
		}
	}

	Attachements_Update() {
		let idealBodyLength = this.attachements.length * this.AttachEvery + 1 + this.Snake_Parts_Add
		idealBodyLength = Math.max(idealBodyLength, this.Snake_Parts_Min)

		//adapt length of snake to attachements (but keep minimum)
		while (idealBodyLength > this.bodyparts.length) {
			this.Bodypart_Add_Default()
		}

		while (this.bodyparts.length > idealBodyLength) {
			const bodypart = this.bodyparts.pop()
			bodypart.destroy()
		}

		for (let i = 0; i < this.attachements.length; i++) {
			const inst = this.attachements[i]
			inst.removeFromParent()

			const part = this.bodyparts[i * this.AttachEvery + 1]

			const partBBox = part.getBoundingBox()

			inst.setPosition(partBBox.left + partBBox.width / 2, partBBox.top + partBBox.height / 2)

			part.addChild(inst, {
				transformX: true,
				transformY: true,
			})

			const wepInst = Utils.World_GetChild(inst, "Wep")
			if (wepInst) {
				this.runtime.zOrder.LinkTo(wepInst.unit.anim, part, 100)
			}
		}
	}

	Tick() {
		if (this.Snake_Shadow) {
			//skip the head
			for (let i = 1; i < this.bodyparts.length; ++i) {
				const bodypart = this.bodyparts[i]
				const shadow = Utils.World_GetChild(bodypart, "Shadow")
				if (shadow) {
					shadow.setSize(bodypart.width * 1, bodypart.width * 0.4)
				}
			}
		}

		for (let i = 1; i < this.bodyparts.length; ++i) {
			const bodypart = this.bodyparts[i]
			bodypart.zOffset = -i * 0.01
		}

		if (this.Type === "Rope") {
			for (let i = 0; i < this.bodyparts.length; ++i) {
				if (i === 0) {
					//this.bodyparts[i].GetBehaviorInstanceFromCtor(BEH_SNAKE)._sdkInst._Move()
				} else {
					//let bboxChanged = false

					const pinWi = this.bodyparts[i - 1]
					const myWi = this.bodyparts[i]

					const dist = C3.distanceTo(myWi.x, myWi.y, pinWi.x, pinWi.y)

					if (dist > this.Snake_DistPart) {
						const a = C3.angleTo(pinWi.x, pinWi.y, myWi.x, myWi.y)
						const targetX = pinWi.x + Math.cos(a) * this.Snake_DistPart
						const targetY = pinWi.y + Math.sin(a) * this.Snake_DistPart
						myWi.x = C3.lerp(myWi.x, targetX, 0.5)
						myWi.y = C3.lerp(myWi.y, targetY, 0.5)
					}

					if (this.SnakePart_SetAngle) {
						const angleToPrevious = C3.angleTo(myWi.x, myWi.y, pinWi.x, pinWi.y)
						myWi.angle = C3.angleLerp(myWi.angle, angleToPrevious, 0.5)
					}
				}
			}
		} else if (this.Type === "Follow") {
			const headWi = this.bodyparts[0]
			this.positions.push([headWi.x, headWi.y])

			let index = this.positions.length - 1
			let pos = this.positions[index]
			let prevPos = this.positions[index - 1]
			let distance = 0

			let dontErase = false

			for (let i = 0; i < this.bodyparts.length; ++i) {
				if (i === 0) {
					//
				} else {
					const myWi = this.bodyparts[i]
					while (index > 1 && distance < this.Snake_DistPart) {
						pos = this.positions[index]
						prevPos = this.positions[index - 1]
						distance += C3.distanceTo(pos[0], pos[1], prevPos[0], prevPos[1])
						index--
					}
					if (index > 0) {
						//if (i === 1) console.log("distance total", distance)
						distance -= this.Snake_DistPart

						const a = C3.angleTo(pos[0], pos[1], prevPos[0], prevPos[1])
						let targetX = pos[0] + Math.cos(a) * -distance
						let targetY = pos[1] + Math.sin(a) * -distance

						/*
                        targetX = C3.lerp(myWi.x, targetX, 0.5)
                        targetY = C3.lerp(myWi.y, targetY, 0.5)*/

						myWi.x = targetX
						myWi.y = targetY

						//set start distance for next part
						pos = [myWi.x, myWi.y]
						distance = C3.distanceTo(pos[0], pos[1], prevPos[0], prevPos[1])

						if (this.SnakePart_SetAngle) {
							const pinWi = this.bodyparts[i - 1]
							const angleToPrevious = C3.angleTo(myWi.x, myWi.y, pinWi.x, pinWi.y)
							myWi.angle = C3.angleLerp(myWi.angle, angleToPrevious, 0.5)
						}
					}
					/*else {
                        dontErase = true
                        console.log("don't erase")
                    }*/
				}
			}
			/*
            console.log("last index", index, "positions", this.positions.length)

            if (index - 100 > 0) {
                this.positions = this.positions.splice(index - 100)
            }*/
		}

		this.Tick_DrawOutline_Snake()
	}

	Tick_DrawOutline_Snake() {
		if (!this.runtime.fxManager.drawOutlines) return
		const outlineUnit = this.unit.outline
		if (!outlineUnit || !this.unit.unit_isVisible) {
			return
		}

		this.bodyPaste.isVisible = true

		const outlinePaste = this.bodyPaste.effects[0]
		outlinePaste.isActive = true
		outlinePaste.setParameter(0, outlineUnit.getParameter(0))

		const pasteInst = this.bodyPaste

		let top = null
		let left = null
		let right = null
		let bottom = null

		/*for (let i = 1; i < this.bodyparts.length; ++i) {
			//get the max bottom/right/left/top of the bodyparts to position and resize the drawing canvas
			const bodypart = this.bodyparts[i]

			//const glowingAnim = Utils.World_GetChild(bodypart, "Anim")
			//if (!glowingAnim) continue
			const glowingAnim = bodypart

			const bbox = glowingAnim.getBoundingBox()

			if (top === null || bbox.top < top) top = bbox.top
			if (left === null || bbox.left < left) left = bbox.left
			if (right === null || bbox.right > right) right = bbox.right
			if (bottom === null || bbox.bottom > bottom) bottom = bbox.bottom
		}

		if (top !== null && left !== null && right !== null && bottom !== null) {
			const margin = 10
			const width = right - left + margin * 2
			const height = bottom - top + margin * 2
			const centerX = left + width / 2 - margin
			const centerY = top + height / 2 - margin

			this.drawingCanvas_local.setSize(width, height)
			this.drawingCanvas_local.setPosition(centerX, centerY)
		}*/

		for (let i = 1; i < this.bodyparts.length; ++i) {
			const bodypart = this.bodyparts[i]
			/*const glowingAnim = Utils.World_GetChild(bodypart, "Anim")
			if (!glowingAnim) continue*/

			Utils.World_MatchInst(pasteInst, bodypart)

			this.runtime.fxManager.DC_DrawOutline(pasteInst)
		}
		this.bodyPaste.isVisible = false
	}

	SetCompVisible(bool) {
		for (let i = 1; i < this.bodyparts.length; i++) {
			const bodypart = this.bodyparts[i]
			bodypart.isVisible = bool
		}
	}

	Bodypart_Add_Default() {
		const inst = Utils.createAnim(this.Snake_Visu, this.inst.x, this.inst.y)
		if (this.Snake_Visu_Size) Utils.World_SetSizeByMax(inst, this.Snake_Visu_Size)
		this.Bodypart_Add(inst)

		if (this.Snake_Visu === "SnakePart_Player") {
			inst.colorRgb = this.runtime.colorUtils.ColorToRGBArray(this.unit.player.color_)
		}

		if (this.Snake_Shadow) {
			const shadow = this.runtime.pool.CreateInstance("Shadow", "Shadows", inst.x, inst.y)

			inst.addChild(shadow, {
				transformX: true,
				transformY: true,
				transformVisibility: true,
				destroyWithParent: true,
			})
		}
	}

	Bodypart_Add(inst, angleOffset = 0) {
		//console.error("Snake: add bodypart", this)

		const lastBodypart = this.bodyparts[this.bodyparts.length - 1]
		const partInst = inst

		if (lastBodypart) {
			const angle = lastBodypart.angle + C3.toRadians(angleOffset)
			partInst.x = lastBodypart.x + this.Snake_DistPart * Math.cos(angle)
			partInst.y = lastBodypart.y + this.Snake_DistPart * Math.sin(angle)
		} else {
			partInst.x = this.inst.x
			partInst.y = this.inst.y
		}

		if (this.Type === "Follow") {
			this.positions.unshift([partInst.x, partInst.y])
			//console.log("new bodypart", this.positions[0])
		}

		this.bodyparts.push(partInst)
	}

	Bodypart_Remove(inst) {
		const partInst = inst
		const index = this.bodyparts.indexOf(partInst)
		if (index !== -1) {
			this.bodyparts.splice(index, 1)
			//inst.destroy()
		}
	}
}
