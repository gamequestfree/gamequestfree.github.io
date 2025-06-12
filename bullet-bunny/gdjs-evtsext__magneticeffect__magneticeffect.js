
gdjs.evtsExt__MagneticEffect__MagneticEffect = gdjs.evtsExt__MagneticEffect__MagneticEffect || {};

/**
 * Behavior generated from Magnetic Effect
 */
gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect = class MagneticEffect extends gdjs.RuntimeBehavior {
  constructor(instanceContainer, behaviorData, owner) {
    super(instanceContainer, behaviorData, owner);
    this._runtimeScene = instanceContainer;

    this._onceTriggers = new gdjs.OnceTriggers();
    this._behaviorData = {};
    this._sharedData = gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.getSharedData(
      instanceContainer,
      behaviorData.name
    );
    
    this._behaviorData.Speed = Number("48") || 0;
    this._behaviorData.Distance = Number("128") || 0;
    this._behaviorData.IsAttracted = false;
  }

  // Hot-reload:
  updateFromBehaviorData(oldBehaviorData, newBehaviorData) {
    
    if (oldBehaviorData.Speed !== newBehaviorData.Speed)
      this._behaviorData.Speed = newBehaviorData.Speed;
    if (oldBehaviorData.Distance !== newBehaviorData.Distance)
      this._behaviorData.Distance = newBehaviorData.Distance;
    if (oldBehaviorData.IsAttracted !== newBehaviorData.IsAttracted)
      this._behaviorData.IsAttracted = newBehaviorData.IsAttracted;

    return true;
  }

  // Properties:
  
  _getSpeed() {
    return this._behaviorData.Speed !== undefined ? this._behaviorData.Speed : Number("48") || 0;
  }
  _setSpeed(newValue) {
    this._behaviorData.Speed = newValue;
  }
  _getDistance() {
    return this._behaviorData.Distance !== undefined ? this._behaviorData.Distance : Number("128") || 0;
  }
  _setDistance(newValue) {
    this._behaviorData.Distance = newValue;
  }
  _getIsAttracted() {
    return this._behaviorData.IsAttracted !== undefined ? this._behaviorData.IsAttracted : false;
  }
  _setIsAttracted(newValue) {
    this._behaviorData.IsAttracted = newValue;
  }
  _toggleIsAttracted() {
    this._setIsAttracted(!this._getIsAttracted());
  }
}

/**
 * Shared data generated from Magnetic Effect
 */
gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.SharedData = class MagneticEffectSharedData {
  constructor(sharedData) {
    
  }
  
  // Shared properties:
  
}

gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.getSharedData = function(instanceContainer, behaviorName) {
  if (!instanceContainer._MagneticEffect_MagneticEffectSharedData) {
    const initialData = instanceContainer.getInitialSharedDataForBehavior(
      behaviorName
    );
    instanceContainer._MagneticEffect_MagneticEffectSharedData = new gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.SharedData(
      initialData
    );
  }
  return instanceContainer._MagneticEffect_MagneticEffectSharedData;
}

// Methods:
gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext = {};
gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDObjectObjects1= [];
gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDObjectObjects2= [];
gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDOtherObjectObjects1= [];
gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDOtherObjectObjects2= [];


gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

};gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.mapOfGDgdjs_46evtsExt_95_95MagneticEffect_95_95MagneticEffect_46MagneticEffect_46prototype_46AttractionContext_46GDObjectObjects1Objects = Hashtable.newFrom({"Object": gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDObjectObjects1});
gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.mapOfGDgdjs_46evtsExt_95_95MagneticEffect_95_95MagneticEffect_46MagneticEffect_46prototype_46AttractionContext_46GDOtherObjectObjects1Objects = Hashtable.newFrom({"OtherObject": gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDOtherObjectObjects1});
gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.mapOfGDgdjs_46evtsExt_95_95MagneticEffect_95_95MagneticEffect_46MagneticEffect_46prototype_46AttractionContext_46GDObjectObjects1Objects = Hashtable.newFrom({"Object": gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDObjectObjects1});
gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.mapOfGDgdjs_46evtsExt_95_95MagneticEffect_95_95MagneticEffect_46MagneticEffect_46prototype_46AttractionContext_46GDOtherObjectObjects1Objects = Hashtable.newFrom({"OtherObject": gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDOtherObjectObjects1});
gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.mapOfGDgdjs_46evtsExt_95_95MagneticEffect_95_95MagneticEffect_46MagneticEffect_46prototype_46AttractionContext_46GDObjectObjects1Objects = Hashtable.newFrom({"Object": gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDObjectObjects1});
gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.mapOfGDgdjs_46evtsExt_95_95MagneticEffect_95_95MagneticEffect_46MagneticEffect_46prototype_46AttractionContext_46GDOtherObjectObjects1Objects = Hashtable.newFrom({"OtherObject": gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDOtherObjectObjects1});
gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.eventsList1 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDObjectObjects1);
gdjs.copyArray(eventsFunctionContext.getObjects("OtherObject"), gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDOtherObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.object.distanceTest(gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.mapOfGDgdjs_46evtsExt_95_95MagneticEffect_95_95MagneticEffect_46MagneticEffect_46prototype_46AttractionContext_46GDObjectObjects1Objects, gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.mapOfGDgdjs_46evtsExt_95_95MagneticEffect_95_95MagneticEffect_46MagneticEffect_46prototype_46AttractionContext_46GDOtherObjectObjects1Objects, (( gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getDistance()), true);
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDObjectObjects1 */
{for(var i = 0, len = gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setIsAttracted(false);
}
}}

}


};gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.eventsList2 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = !(typeof eventsFunctionContext !== 'undefined' ? !!eventsFunctionContext.getArgument("Permanent") : false);
}
if (isConditionTrue_0) {

{ //Subevents
gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.eventsList1(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.eventsList3 = function(runtimeScene, eventsFunctionContext) {

{



}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = ((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Distance")) || 0 : 0) != 0);
}
if (isConditionTrue_0) {
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setDistance((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Distance")) || 0 : 0));
}
}}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = ((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Speed")) || 0 : 0) != 0);
}
if (isConditionTrue_0) {
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setSpeed((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Speed")) || 0 : 0));
}
}}

}


{


gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.eventsList0(runtimeScene, eventsFunctionContext);
}


{



}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDObjectObjects1);
gdjs.copyArray(eventsFunctionContext.getObjects("OtherObject"), gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDOtherObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.object.distanceTest(gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.mapOfGDgdjs_46evtsExt_95_95MagneticEffect_95_95MagneticEffect_46MagneticEffect_46prototype_46AttractionContext_46GDObjectObjects1Objects, gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.mapOfGDgdjs_46evtsExt_95_95MagneticEffect_95_95MagneticEffect_46MagneticEffect_46prototype_46AttractionContext_46GDOtherObjectObjects1Objects, (( gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getDistance()), false);
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDObjectObjects1 */
{for(var i = 0, len = gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setIsAttracted(true);
}
}}

}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).IsAttracted((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDObjectObjects1[k] = gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDObjectObjects1 */
gdjs.copyArray(eventsFunctionContext.getObjects("OtherObject"), gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDOtherObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDObjectObjects1[i].addForceTowardObject((gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDOtherObjectObjects1.length !== 0 ? gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDOtherObjectObjects1[0] : null), (gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getSpeed()), 0);
}
}}

}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDObjectObjects1);
gdjs.copyArray(eventsFunctionContext.getObjects("OtherObject"), gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDOtherObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.object.hitBoxesCollisionTest(gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.mapOfGDgdjs_46evtsExt_95_95MagneticEffect_95_95MagneticEffect_46MagneticEffect_46prototype_46AttractionContext_46GDObjectObjects1Objects, gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.mapOfGDgdjs_46evtsExt_95_95MagneticEffect_95_95MagneticEffect_46MagneticEffect_46prototype_46AttractionContext_46GDOtherObjectObjects1Objects, false, runtimeScene, false);
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDObjectObjects1 */
{for(var i = 0, len = gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDObjectObjects1[i].clearForces();
}
}}

}


{



}


{


gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.eventsList2(runtimeScene, eventsFunctionContext);
}


};

gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.Attraction = function(OtherObject, Distance, Speed, Permanent, parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._runtimeScene;
var thisObjectList = [this.owner];
var Object = Hashtable.newFrom({Object: thisObjectList});
var Behavior = this.name;
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
, "OtherObject": OtherObject
},
  _objectArraysMap: {
"Object": thisObjectList
, "OtherObject": gdjs.objectsListsToArray(OtherObject)
},
  _behaviorNamesMap: {
"Behavior": Behavior
},
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        eventsFunctionContext._objectArraysMap[objectName].push(object);
      }
      return object;    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
if (argName === "Distance") return Distance;
if (argName === "Speed") return Speed;
if (argName === "Permanent") return Permanent;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDObjectObjects2.length = 0;
gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDOtherObjectObjects1.length = 0;
gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.GDOtherObjectObjects2.length = 0;

gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.AttractionContext.eventsList3(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.IsAttractedContext = {};
gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.IsAttractedContext.GDObjectObjects1= [];
gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.IsAttractedContext.GDObjectObjects2= [];


gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.IsAttractedContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{



}


{


let isConditionTrue_0 = false;
{
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = false; }}}

}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.IsAttractedContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.IsAttractedContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.IsAttractedContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getIsAttracted() ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.IsAttractedContext.GDObjectObjects1[k] = gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.IsAttractedContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.IsAttractedContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = true; }}}

}


};

gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.IsAttracted = function(parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._runtimeScene;
var thisObjectList = [this.owner];
var Object = Hashtable.newFrom({Object: thisObjectList});
var Behavior = this.name;
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
},
  _objectArraysMap: {
"Object": thisObjectList
},
  _behaviorNamesMap: {
"Behavior": Behavior
},
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        eventsFunctionContext._objectArraysMap[objectName].push(object);
      }
      return object;    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.IsAttractedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.IsAttractedContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.IsAttractedContext.eventsList0(runtimeScene, eventsFunctionContext);

return !!eventsFunctionContext.returnValue;
}
gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.StopAttractionContext = {};
gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.StopAttractionContext.GDObjectObjects1= [];
gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.StopAttractionContext.GDObjectObjects2= [];


gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.StopAttractionContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{



}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.StopAttractionContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.StopAttractionContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.StopAttractionContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).IsAttracted((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.StopAttractionContext.GDObjectObjects1[k] = gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.StopAttractionContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.StopAttractionContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.StopAttractionContext.GDObjectObjects1 */
{for(var i = 0, len = gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.StopAttractionContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.StopAttractionContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setIsAttracted(false);
}
}}

}


};

gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.StopAttraction = function(parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._runtimeScene;
var thisObjectList = [this.owner];
var Object = Hashtable.newFrom({Object: thisObjectList});
var Behavior = this.name;
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
},
  _objectArraysMap: {
"Object": thisObjectList
},
  _behaviorNamesMap: {
"Behavior": Behavior
},
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        eventsFunctionContext._objectArraysMap[objectName].push(object);
      }
      return object;    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.StopAttractionContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.StopAttractionContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.StopAttractionContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.onDeActivateContext = {};
gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.onDeActivateContext.GDObjectObjects1= [];
gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.onDeActivateContext.GDObjectObjects2= [];


gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.onDeActivateContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{



}


{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.onDeActivateContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.onDeActivateContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.onDeActivateContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).StopAttraction((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
}
}}

}


};

gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.onDeActivate = function(parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._runtimeScene;
var thisObjectList = [this.owner];
var Object = Hashtable.newFrom({Object: thisObjectList});
var Behavior = this.name;
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
},
  _objectArraysMap: {
"Object": thisObjectList
},
  _behaviorNamesMap: {
"Behavior": Behavior
},
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        eventsFunctionContext._objectArraysMap[objectName].push(object);
      }
      return object;    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.onDeActivateContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.onDeActivateContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.onDeActivateContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.onDestroyContext = {};
gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.onDestroyContext.GDObjectObjects1= [];
gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.onDestroyContext.GDObjectObjects2= [];


gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.onDestroyContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{



}


{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.onDestroyContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.onDestroyContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.onDestroyContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).StopAttraction((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
}
}}

}


};

gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.onDestroy = function(parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._runtimeScene;
var thisObjectList = [this.owner];
var Object = Hashtable.newFrom({Object: thisObjectList});
var Behavior = this.name;
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
},
  _objectArraysMap: {
"Object": thisObjectList
},
  _behaviorNamesMap: {
"Behavior": Behavior
},
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        eventsFunctionContext._objectArraysMap[objectName].push(object);
      }
      return object;    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.onDestroyContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.onDestroyContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.onDestroyContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}

gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect.prototype.doStepPreEvents = function() {
  this._onceTriggers.startNewFrame();
};


gdjs.registerBehavior("MagneticEffect::MagneticEffect", gdjs.evtsExt__MagneticEffect__MagneticEffect.MagneticEffect);
