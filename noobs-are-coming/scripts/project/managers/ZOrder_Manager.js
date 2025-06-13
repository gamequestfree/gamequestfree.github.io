export class ZOrder_Manager {
	constructor(runtime) {
		this.runtime = runtime

		// All 'ZOrder' object-type instances
		this.zOrderInstances = new Set()

		// child -> [parent, offset]
		this.linkedTo = new Map()

		this.runtime.addEventListener("instancedestroy", (e) => {
			this.InstanceDestroy(e.instance)
		})

		// Whenever a new instance of the "ZOrder" plugin/behavior is created, track it
		this.runtime.objects["ZOrder"].addEventListener("instancecreate", (e) => {
			this.AddZInst(e.instance)
		})

		this.runtime.addEventListener("beforeanylayoutend", () => {
			this.OnBeforeLayoutEnd()
		})
	}

	OnBeforeLayoutEnd() {
		this.zOrderInstances.clear()
		this.linkedTo.clear()
	}

	AddZInst(inst) {
		// Optionally check if it's not already in the set
		this.zOrderInstances.add(inst)
	}

	LinkTo(child, parent, offset = 0) {
		// Optional: ensure both child & parent are actually in zOrderInstances
		// or you might prefer to handle them dynamically
		if (!this.zOrderInstances.has(child)) {
			console.warn("LinkTo called on child that is not a tracked zOrder instance:", child)
			this.zOrderInstances.add(child)
		}
		if (!this.zOrderInstances.has(parent)) {
			console.warn("LinkTo called on parent that is not a tracked zOrder instance:", parent)
			this.zOrderInstances.add(parent)
		}

		this.linkedTo.set(child, [parent, offset])
	}

	InstanceDestroy(inst) {
		// Remove the instance from zOrderInstances
		this.zOrderInstances.delete(inst)

		// Remove any links where this instance is either the key or the parent
		this.linkedTo.forEach((value, key) => {
			if (key === inst || value[0] === inst) {
				this.linkedTo.delete(key)
			}
		})
	}

	SortZ() {
		// We only care about instances that exist on the "Objects" layer (per your code)
		// Convert zOrderInstances to an Array
		const instances = [...this.zOrderInstances].filter((inst) => inst.layer && inst.layer.name === "Objects")

		// Start everyone off with some baseline Z
		for (const inst of instances) {
			inst.myZOrder = inst.zOrder !== undefined ? inst.zOrder : inst.y
		}

		// Use a cache to store computed final Z to avoid repeated recursion
		const finalZCache = new Map()

		// For cycle detection, maintain a "visited stack" and "fully resolved" set
		const inStack = new Set()
		const resolved = new Set()

		const getFinalZ = (inst) => {
			// If we have previously resolved this instance's final Z, just return
			if (finalZCache.has(inst)) {
				return finalZCache.get(inst)
			}

			// If there's no parent link, just use the instance's baseline
			if (!this.linkedTo.has(inst)) {
				finalZCache.set(inst, inst.myZOrder)
				resolved.add(inst)
				return inst.myZOrder
			}

			// If we detect a cycle (inst is visited again before being resolved),
			// we’ll bail out (or handle some fallback).
			// Without this, we'd get infinite recursion on a cycle.
			if (inStack.has(inst)) {
				console.error("ZOrder cycle detected! Instance:", inst)
				// fallback: treat as no parent
				finalZCache.set(inst, inst.myZOrder)
				resolved.add(inst)
				return inst.myZOrder
			}

			// Mark as in stack
			inStack.add(inst)

			const [parent, offset] = this.linkedTo.get(inst)
			let parentZ
			if (!parent || !this.zOrderInstances.has(parent)) {
				// If the parent is invalid or destroyed or not in zOrder,
				// treat as no parent
				parentZ = inst.myZOrder
			} else {
				parentZ = getFinalZ(parent)
			}

			const finalZ = parentZ + offset / 1000
			finalZCache.set(inst, finalZ)

			// Once we have finalZ for this node, it’s resolved
			inStack.delete(inst)
			resolved.add(inst)

			return finalZ
		}

		// We want to gather *all* potentially linked instances,
		// but only those on the "Objects" layer.
		const allRelevantInstances = Array.from(new Set([...instances, ...this.linkedTo.keys()])).filter(
			(inst) => inst.layer && inst.layer.name === "Objects"
		)

		// Compute finalZ for all relevant instances
		for (const inst of allRelevantInstances) {
			getFinalZ(inst)
		}

		// Apply final Z to instances
		for (const inst of allRelevantInstances) {
			inst.myZOrder = finalZCache.get(inst)

			if (inst.zOffset) inst.myZOrder += inst.zOffset
		}

		// Finally, sort them
		this.runtime.sortZOrder(allRelevantInstances, (a, b) => a.myZOrder - b.myZOrder)
	}
}
