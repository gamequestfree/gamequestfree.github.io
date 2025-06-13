export class Pool_Manager {
	constructor(runtime) {
		this.runtime = runtime

		this.pools = {}

		sdk_runtime.Dispatcher().addEventListener("beforelayoutchange", (e) => this.CleanAllPools())
	}

	//todo : objectClass | templateName
	//todo : unit

	// ======================================

	CreateInstance(poolName, layer, x, y, createHierarchy = true, templateName = "") {
		//Todo! (for now fake)
		let pool = this.runtime.objects[poolName]
		if (pool) {
			let inst = pool.createInstance(layer, x, y, createHierarchy, templateName)
			return inst
		}
		return null
	}

	DestroyInstance(inst) {
		inst.destroy()
	}

	// ======================================

	CleanAllPools() {
		//TODO
	}

	CreatePool(name, type, ondestroyedcallback, oncreatedcallback) {
		this.pools[name] = {
			type: type,
			ondestroyedcallback: ondestroyedcallback,
			oncreatedcallback: oncreatedcallback,
			instances: []
		}
	}

	GetPoolInsts(name) {
		return this.pools[name].instances
	}

	SetObjectClassPool(objectClassName, size, ondestroyedcallback, oncreatedcallback) {
		this.CreatePool(objectClassName, "objectClass", ondestroyedcallback, oncreatedcallback)
	}

	GetOne(poolName, layer, x = 0, y = 0, createHierarchy = false, templateName = "") {
		//const name = objectTypeName + (createHierarchy ? 1 : 0) + templateName
		const name = objectClass.GetName() + "|" + templateName
		if (!layer) {
			console.error("Pool.GetOne() : Trying to create" + name + " on a non-existing layer")
			return null
		}
		//("GetOne", name, "on", layer)
		let instance

		if (!this._pool[name]) {
			this.CreatePool(name)
		}

		if (this._pool[name].length === 0) {
			instance = this.runtime.objects[objectClass.GetName()].createInstance(layer, x, y, createHierarchy, templateName)
		} else {
			//check template
			instance = this._pool[name].pop()

			instance.x = x
			instance.y = y
			instance.moveToLayer(layer)
		}

		this._SetEnableInstance(instance, true)
		return instance
	}

	_SetEnableInstance(instance, enable, preloaded = false) {
		//TRUE
		if (enable === true) {
			instance.isVisible = true
			instance.isCollisionEnabled = true
		}
		//FALSE
		else {
			instance.removeFromParent()
			instance.isVisible = false
			instance.isCollisionEnabled = false
		}

		//FALSE : back in pool

		if (enable === false) {
			const name = instance.GetObjectClass().GetName() + "|" + instance.GetTemplateName()

			if (!this._pool[name]) {
				this.CreatePool(name)
			}

			if (!this._pool[name].includes(instance)) this._pool[name].push(instance)
			//this._pool[name].push(instance)
		}

		if (preloaded === false) {
			if (enable === true) {
				sdkInst.Trigger(C3.Behaviors.overboy_pooled.Cnds.OnPoolGet)
			} else {
				sdkInst.Trigger(C3.Behaviors.overboy_pooled.Cnds.OnPoolReturn)
			}
		}
	}
}
