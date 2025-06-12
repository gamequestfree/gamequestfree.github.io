
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick || {};

/**
 * Behavior generated from Multitouch Joystick
 */
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick = class MultitouchJoystick extends gdjs.RuntimeBehavior {
  constructor(instanceContainer, behaviorData, owner) {
    super(instanceContainer, behaviorData, owner);
    this._runtimeScene = instanceContainer;

    this._onceTriggers = new gdjs.OnceTriggers();
    this._behaviorData = {};
    this._sharedData = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.getSharedData(
      instanceContainer,
      behaviorData.name
    );
    
    this._behaviorData.JoystickAngle = Number("0") || 0;
    this._behaviorData.JoystickForce = Number("0") || 0;
    this._behaviorData.IsPressed = false;
    this._behaviorData.TouchID = Number("0") || 0;
    this._behaviorData.TouchDistance = Number("0") || 0;
    this._behaviorData.FloatingEnabled = behaviorData.FloatingEnabled !== undefined ? behaviorData.FloatingEnabled : false;
    this._behaviorData.ButtonReleased = false;
    this._behaviorData.TouchCounter = Number("") || 0;
  }

  // Hot-reload:
  updateFromBehaviorData(oldBehaviorData, newBehaviorData) {
    
    if (oldBehaviorData.JoystickAngle !== newBehaviorData.JoystickAngle)
      this._behaviorData.JoystickAngle = newBehaviorData.JoystickAngle;
    if (oldBehaviorData.JoystickForce !== newBehaviorData.JoystickForce)
      this._behaviorData.JoystickForce = newBehaviorData.JoystickForce;
    if (oldBehaviorData.IsPressed !== newBehaviorData.IsPressed)
      this._behaviorData.IsPressed = newBehaviorData.IsPressed;
    if (oldBehaviorData.TouchID !== newBehaviorData.TouchID)
      this._behaviorData.TouchID = newBehaviorData.TouchID;
    if (oldBehaviorData.TouchDistance !== newBehaviorData.TouchDistance)
      this._behaviorData.TouchDistance = newBehaviorData.TouchDistance;
    if (oldBehaviorData.FloatingEnabled !== newBehaviorData.FloatingEnabled)
      this._behaviorData.FloatingEnabled = newBehaviorData.FloatingEnabled;
    if (oldBehaviorData.ButtonReleased !== newBehaviorData.ButtonReleased)
      this._behaviorData.ButtonReleased = newBehaviorData.ButtonReleased;
    if (oldBehaviorData.TouchCounter !== newBehaviorData.TouchCounter)
      this._behaviorData.TouchCounter = newBehaviorData.TouchCounter;

    return true;
  }

  // Properties:
  
  _getJoystickAngle() {
    return this._behaviorData.JoystickAngle !== undefined ? this._behaviorData.JoystickAngle : Number("0") || 0;
  }
  _setJoystickAngle(newValue) {
    this._behaviorData.JoystickAngle = newValue;
  }
  _getJoystickForce() {
    return this._behaviorData.JoystickForce !== undefined ? this._behaviorData.JoystickForce : Number("0") || 0;
  }
  _setJoystickForce(newValue) {
    this._behaviorData.JoystickForce = newValue;
  }
  _getIsPressed() {
    return this._behaviorData.IsPressed !== undefined ? this._behaviorData.IsPressed : false;
  }
  _setIsPressed(newValue) {
    this._behaviorData.IsPressed = newValue;
  }
  _toggleIsPressed() {
    this._setIsPressed(!this._getIsPressed());
  }
  _getTouchID() {
    return this._behaviorData.TouchID !== undefined ? this._behaviorData.TouchID : Number("0") || 0;
  }
  _setTouchID(newValue) {
    this._behaviorData.TouchID = newValue;
  }
  _getTouchDistance() {
    return this._behaviorData.TouchDistance !== undefined ? this._behaviorData.TouchDistance : Number("0") || 0;
  }
  _setTouchDistance(newValue) {
    this._behaviorData.TouchDistance = newValue;
  }
  _getFloatingEnabled() {
    return this._behaviorData.FloatingEnabled !== undefined ? this._behaviorData.FloatingEnabled : false;
  }
  _setFloatingEnabled(newValue) {
    this._behaviorData.FloatingEnabled = newValue;
  }
  _toggleFloatingEnabled() {
    this._setFloatingEnabled(!this._getFloatingEnabled());
  }
  _getButtonReleased() {
    return this._behaviorData.ButtonReleased !== undefined ? this._behaviorData.ButtonReleased : false;
  }
  _setButtonReleased(newValue) {
    this._behaviorData.ButtonReleased = newValue;
  }
  _toggleButtonReleased() {
    this._setButtonReleased(!this._getButtonReleased());
  }
  _getTouchCounter() {
    return this._behaviorData.TouchCounter !== undefined ? this._behaviorData.TouchCounter : Number("") || 0;
  }
  _setTouchCounter(newValue) {
    this._behaviorData.TouchCounter = newValue;
  }
}

/**
 * Shared data generated from Multitouch Joystick
 */
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.SharedData = class MultitouchJoystickSharedData {
  constructor(sharedData) {
    
  }
  
  // Shared properties:
  
}

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.getSharedData = function(instanceContainer, behaviorName) {
  if (!instanceContainer._MultitouchJoystick_MultitouchJoystickSharedData) {
    const initialData = instanceContainer.getInitialSharedDataForBehavior(
      behaviorName
    );
    instanceContainer._MultitouchJoystick_MultitouchJoystickSharedData = new gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.SharedData(
      initialData
    );
  }
  return instanceContainer._MultitouchJoystick_MultitouchJoystickSharedData;
}

// Methods:
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.onCreatedContext = {};
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.onCreatedContext.GDObjectObjects1= [];
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.onCreatedContext.GDObjectObjects2= [];


gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.onCreatedContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.onCreatedContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.onCreatedContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.onCreatedContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setTouchID(0);
}
}}

}


};

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.onCreated = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.onCreatedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.onCreatedContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.onCreatedContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.onActivateContext = {};
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.onActivateContext.GDObjectObjects1= [];
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.onActivateContext.GDObjectObjects2= [];


gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.onActivateContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.onActivateContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.onActivateContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.onActivateContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setTouchID(0);
}
}}

}


};

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.onActivate = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.onActivateContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.onActivateContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.onActivateContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext = {};
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1= [];
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2= [];
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects3= [];
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects4= [];
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects5= [];
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDJoystickThumbObjects1= [];
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDJoystickThumbObjects2= [];
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDJoystickThumbObjects3= [];
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDJoystickThumbObjects4= [];
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDJoystickThumbObjects5= [];


gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.mapOfGDgdjs_46evtsExt_95_95MultitouchJoystick_95_95MultitouchJoystick_46MultitouchJoystick_46prototype_46ActivateJoystickContext_46GDJoystickThumbObjects1Objects = Hashtable.newFrom({"JoystickThumb": gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDJoystickThumbObjects1});
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.mapOfGDgdjs_46evtsExt_95_95MultitouchJoystick_95_95MultitouchJoystick_46MultitouchJoystick_46prototype_46ActivateJoystickContext_46GDJoystickThumbObjects1Objects = Hashtable.newFrom({"JoystickThumb": gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDJoystickThumbObjects1});
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.mapOfGDgdjs_46evtsExt_95_95MultitouchJoystick_95_95MultitouchJoystick_46MultitouchJoystick_46prototype_46ActivateJoystickContext_46GDJoystickThumbObjects1Objects = Hashtable.newFrom({"JoystickThumb": gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDJoystickThumbObjects1});
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{



}


{

gdjs.copyArray(eventsFunctionContext.getObjects("JoystickThumb"), gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDJoystickThumbObjects1);
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{let isConditionTrue_1 = false;
isConditionTrue_1 = false;
isConditionTrue_1 = gdjs.evtTools.linkedObjects.pickObjectsLinkedTo(runtimeScene, gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.mapOfGDgdjs_46evtsExt_95_95MultitouchJoystick_95_95MultitouchJoystick_46MultitouchJoystick_46prototype_46ActivateJoystickContext_46GDJoystickThumbObjects1Objects, (gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1.length !== 0 ? gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1[0] : null), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
isConditionTrue_0 = !isConditionTrue_1;
}
if (isConditionTrue_0) {
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.object.getPickedInstancesCount(gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.mapOfGDgdjs_46evtsExt_95_95MultitouchJoystick_95_95MultitouchJoystick_46MultitouchJoystick_46prototype_46ActivateJoystickContext_46GDJoystickThumbObjects1Objects) < 1;
}
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1 */
/* Reuse gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDJoystickThumbObjects1 */
{gdjs.evtTools.object.createObjectOnScene((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : runtimeScene), gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.mapOfGDgdjs_46evtsExt_95_95MultitouchJoystick_95_95MultitouchJoystick_46MultitouchJoystick_46prototype_46ActivateJoystickContext_46GDJoystickThumbObjects1Objects, (( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1[0].getCenterXInScene()), (( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1[0].getCenterYInScene()), (( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1.length === 0 ) ? "" :gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1[0].getLayer()));
}{for(var i = 0, len = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDJoystickThumbObjects1.length ;i < len;++i) {
    gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDJoystickThumbObjects1[i].setZOrder((( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1[0].getZOrder()) + 1);
}
}{gdjs.evtTools.linkedObjects.linkObjects(runtimeScene, (gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1.length !== 0 ? gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1[0] : null), (gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDJoystickThumbObjects1.length !== 0 ? gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDJoystickThumbObjects1[0] : null));
}}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.eventsList1 = function(runtimeScene, eventsFunctionContext) {

{



}


{

gdjs.copyArray(gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2, gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects4);


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects4.length;i<l;++i) {
    if ( !(gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects4[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getIsPressed()) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects4[k] = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects4[i];
        ++k;
    }
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects4.length = k;
if (isConditionTrue_0) {
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects4.length;i<l;++i) {
    if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects4[i].isCollidingWithPoint(gdjs.evtTools.input.getTouchX(runtimeScene, gdjs.evtTools.input.getStartedTouchIdentifier(runtimeScene, (gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects4[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getTouchCounter())), (gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects4[i].getLayer()), 0), gdjs.evtTools.input.getTouchY(runtimeScene, gdjs.evtTools.input.getStartedTouchIdentifier(runtimeScene, (gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects4[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getTouchCounter())), (gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects4[i].getLayer()), 0)) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects4[k] = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects4[i];
        ++k;
    }
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects4.length = k;
}
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects4 */
{for(var i = 0, len = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects4.length ;i < len;++i) {
    gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects4[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setTouchID(gdjs.evtTools.input.getStartedTouchIdentifier(runtimeScene, (gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects4[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getTouchCounter())));
}
}{for(var i = 0, len = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects4.length ;i < len;++i) {
    gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects4[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setIsPressed(true);
}
}}

}


{


let isConditionTrue_0 = false;
{
gdjs.copyArray(gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2, gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects4);

{for(var i = 0, len = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects4.length ;i < len;++i) {
    gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects4[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setTouchCounter(gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects4[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getTouchCounter() + (1));
}
}}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.eventsList2 = function(runtimeScene, eventsFunctionContext) {

{


const repeatCount3 = gdjs.evtTools.input.getStartedTouchCount(runtimeScene);
for (let repeatIndex3 = 0;repeatIndex3 < repeatCount3;++repeatIndex3) {

let isConditionTrue_0 = false;
if (true)
{

{ //Subevents: 
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.eventsList1(runtimeScene, eventsFunctionContext);} //Subevents end.
}
}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.eventsList3 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.hasAnyTouchStarted(runtimeScene);
if (isConditionTrue_0) {
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2);
{for(var i = 0, len = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setTouchCounter(0);
}
}
{ //Subevents
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.eventsList2(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.mapOfGDgdjs_46evtsExt_95_95MultitouchJoystick_95_95MultitouchJoystick_46MultitouchJoystick_46prototype_46ActivateJoystickContext_46GDJoystickThumbObjects2Objects = Hashtable.newFrom({"JoystickThumb": gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDJoystickThumbObjects2});
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.eventsList4 = function(runtimeScene, eventsFunctionContext) {

{



}


{

gdjs.copyArray(eventsFunctionContext.getObjects("JoystickThumb"), gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDJoystickThumbObjects2);
gdjs.copyArray(gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1, gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2);


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.linkedObjects.pickObjectsLinkedTo(runtimeScene, gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.mapOfGDgdjs_46evtsExt_95_95MultitouchJoystick_95_95MultitouchJoystick_46MultitouchJoystick_46prototype_46ActivateJoystickContext_46GDJoystickThumbObjects2Objects, (gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2.length !== 0 ? gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2[0] : null), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDJoystickThumbObjects2 */
/* Reuse gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2 */
{for(var i = 0, len = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDJoystickThumbObjects2.length ;i < len;++i) {
    gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDJoystickThumbObjects2[i].setCenterPositionInScene((( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2.length === 0 ) ? 0 :gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2[0].getCenterXInScene()),(( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2.length === 0 ) ? 0 :gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2[0].getCenterYInScene()));
}
}}

}


{



}


{


let isConditionTrue_0 = false;
{
/* Reuse gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1 */
{for(var i = 0, len = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setIsPressed(false);
}
}{for(var i = 0, len = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setJoystickForce(0);
}
}{for(var i = 0, len = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setTouchID(0);
}
}}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.eventsList5 = function(runtimeScene, eventsFunctionContext) {

{



}


{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2);
{for(var i = 0, len = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setButtonReleased(false);
}
}}

}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.hasTouchEnded(runtimeScene, (( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getTouchID()));
if (isConditionTrue_0) {
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getIsPressed() ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1[k] = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1.length = k;
}
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1 */
{for(var i = 0, len = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setButtonReleased(true);
}
}
{ //Subevents
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.eventsList4(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.eventsList6 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.eventsList3(runtimeScene, eventsFunctionContext);
}


{


gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.eventsList5(runtimeScene, eventsFunctionContext);
}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.eventsList7 = function(runtimeScene, eventsFunctionContext) {

{



}


{


let isConditionTrue_0 = false;
{
gdjs.copyArray(gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1, gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2);

{for(var i = 0, len = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setJoystickAngle(gdjs.evtTools.common.angleBetweenPositions((gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2[i].getCenterXInScene()), (gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2[i].getCenterYInScene()), gdjs.evtTools.input.getTouchX(runtimeScene, (gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getTouchID()), (gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2[i].getLayer()), 0), gdjs.evtTools.input.getTouchY(runtimeScene, (gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getTouchID()), (gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2[i].getLayer()), 0)));
}
}}

}


{



}


{


let isConditionTrue_0 = false;
{
gdjs.copyArray(gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1, gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2);

{for(var i = 0, len = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setTouchDistance(gdjs.evtTools.common.distanceBetweenPositions((gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2[i].getCenterXInScene()), (gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2[i].getCenterYInScene()), gdjs.evtTools.input.getTouchX(runtimeScene, (gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getTouchID()), (gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2[i].getLayer()), 0), gdjs.evtTools.input.getTouchY(runtimeScene, (gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getTouchID()), (gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2[i].getLayer()), 0)));
}
}}

}


{



}


{


let isConditionTrue_0 = false;
{
/* Reuse gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1 */
{for(var i = 0, len = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setJoystickForce(gdjs.evtTools.common.clamp((gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getTouchDistance()) / (gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1[i].getWidth()) * 2, 0, 1));
}
}}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.eventsList8 = function(runtimeScene, eventsFunctionContext) {

{



}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getTouchID() != 0 ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1[k] = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {

{ //Subevents
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.eventsList7(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.mapOfGDgdjs_46evtsExt_95_95MultitouchJoystick_95_95MultitouchJoystick_46MultitouchJoystick_46prototype_46ActivateJoystickContext_46GDJoystickThumbObjects2Objects = Hashtable.newFrom({"JoystickThumb": gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDJoystickThumbObjects2});
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.eventsList9 = function(runtimeScene, eventsFunctionContext) {

{



}


{

/* Reuse gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2 */

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = ((( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2.length === 0 ) ? 0 :gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getTouchDistance()) > (( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2.length === 0 ) ? 0 :gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2[0].getWidth()) / 2);
}
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2 */
{for(var i = 0, len = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2[i].setCenterPositionInScene(gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2[i].getCenterXInScene() +gdjs.evtTools.common.getXFromAngleAndDistance((gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).JoystickAngle((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined))), (gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getTouchDistance()) - (gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2[i].getWidth()) / 2),gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2[i].getCenterYInScene() +gdjs.evtTools.common.getYFromAngleAndDistance((gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).JoystickAngle((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined))), (gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getTouchDistance()) - (gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2[i].getWidth()) / 2));
}
}}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.mapOfGDgdjs_46evtsExt_95_95MultitouchJoystick_95_95MultitouchJoystick_46MultitouchJoystick_46prototype_46ActivateJoystickContext_46GDJoystickThumbObjects1Objects = Hashtable.newFrom({"JoystickThumb": gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDJoystickThumbObjects1});
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.eventsList10 = function(runtimeScene, eventsFunctionContext) {

{



}


{

gdjs.copyArray(gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1, gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2);


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getFloatingEnabled() ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2[k] = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2.length = k;
if (isConditionTrue_0) {

{ //Subevents
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.eventsList9(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


{



}


{

gdjs.copyArray(eventsFunctionContext.getObjects("JoystickThumb"), gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDJoystickThumbObjects1);
/* Reuse gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1 */

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.linkedObjects.pickObjectsLinkedTo(runtimeScene, gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.mapOfGDgdjs_46evtsExt_95_95MultitouchJoystick_95_95MultitouchJoystick_46MultitouchJoystick_46prototype_46ActivateJoystickContext_46GDJoystickThumbObjects1Objects, (gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1.length !== 0 ? gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1[0] : null), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDJoystickThumbObjects1 */
/* Reuse gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1 */
{for(var i = 0, len = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDJoystickThumbObjects1.length ;i < len;++i) {
    gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDJoystickThumbObjects1[i].putAroundObject((gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1.length !== 0 ? gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1[0] : null), Math.min((( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getTouchDistance()), (( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1[0].getWidth()) / 2), (( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).JoystickAngle((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined))));
}
}}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.eventsList11 = function(runtimeScene, eventsFunctionContext) {

{



}


{

gdjs.copyArray(eventsFunctionContext.getObjects("JoystickThumb"), gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDJoystickThumbObjects2);
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2.length;i<l;++i) {
    if ( !(gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).IsPressed((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined))) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2[k] = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2.length = k;
if (isConditionTrue_0) {
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.linkedObjects.pickObjectsLinkedTo(runtimeScene, gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.mapOfGDgdjs_46evtsExt_95_95MultitouchJoystick_95_95MultitouchJoystick_46MultitouchJoystick_46prototype_46ActivateJoystickContext_46GDJoystickThumbObjects2Objects, (gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2.length !== 0 ? gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2[0] : null), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
}
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDJoystickThumbObjects2 */
/* Reuse gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2 */
{for(var i = 0, len = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDJoystickThumbObjects2.length ;i < len;++i) {
    gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDJoystickThumbObjects2[i].setCenterPositionInScene((( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2.length === 0 ) ? 0 :gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2[0].getCenterXInScene()),(( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2.length === 0 ) ? 0 :gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2[0].getCenterYInScene()));
}
}}

}


{



}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).IsPressed((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1[k] = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getTouchID() != 0 ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1[k] = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1.length = k;
}
if (isConditionTrue_0) {

{ //Subevents
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.eventsList10(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.eventsList12 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.eventsList0(runtimeScene, eventsFunctionContext);
}


{


gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.eventsList6(runtimeScene, eventsFunctionContext);
}


{


gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.eventsList8(runtimeScene, eventsFunctionContext);
}


{


gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.eventsList11(runtimeScene, eventsFunctionContext);
}


};

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystick = function(JoystickThumb, parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._runtimeScene;
var thisObjectList = [this.owner];
var Object = Hashtable.newFrom({Object: thisObjectList});
var Behavior = this.name;
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
, "JoystickThumb": JoystickThumb
},
  _objectArraysMap: {
"Object": thisObjectList
, "JoystickThumb": gdjs.objectsListsToArray(JoystickThumb)
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

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects2.length = 0;
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects3.length = 0;
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects4.length = 0;
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDObjectObjects5.length = 0;
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDJoystickThumbObjects1.length = 0;
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDJoystickThumbObjects2.length = 0;
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDJoystickThumbObjects3.length = 0;
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDJoystickThumbObjects4.length = 0;
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.GDJoystickThumbObjects5.length = 0;

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.ActivateJoystickContext.eventsList12(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.JoystickForceContext = {};
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.JoystickForceContext.GDObjectObjects1= [];
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.JoystickForceContext.GDObjectObjects2= [];


gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.JoystickForceContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.JoystickForceContext.GDObjectObjects1);
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = (( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.JoystickForceContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.JoystickForceContext.GDObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getJoystickForce()); }}}

}


};

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.JoystickForce = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.JoystickForceContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.JoystickForceContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.JoystickForceContext.eventsList0(runtimeScene, eventsFunctionContext);

return Number(eventsFunctionContext.returnValue) || 0;
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.JoystickAngleContext = {};
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.JoystickAngleContext.GDObjectObjects1= [];
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.JoystickAngleContext.GDObjectObjects2= [];


gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.JoystickAngleContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.JoystickAngleContext.GDObjectObjects1);
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = (( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.JoystickAngleContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.JoystickAngleContext.GDObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getJoystickAngle()); }}}

}


};

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.JoystickAngle = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.JoystickAngleContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.JoystickAngleContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.JoystickAngleContext.eventsList0(runtimeScene, eventsFunctionContext);

return Number(eventsFunctionContext.returnValue) || 0;
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.CheckJoystickForceContext = {};
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.CheckJoystickForceContext.GDObjectObjects1= [];
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.CheckJoystickForceContext.GDObjectObjects2= [];


gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.CheckJoystickForceContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.CheckJoystickForceContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = ((( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.CheckJoystickForceContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.CheckJoystickForceContext.GDObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).JoystickForce((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined))) >= (typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Force")) || 0 : 0));
}
if (isConditionTrue_0) {
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = true; }}}

}


};

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.CheckJoystickForce = function(Force, parentEventsFunctionContext) {

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
if (argName === "Force") return Force;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.CheckJoystickForceContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.CheckJoystickForceContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.CheckJoystickForceContext.eventsList0(runtimeScene, eventsFunctionContext);

return !!eventsFunctionContext.returnValue;
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext = {};
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects2_1final = [];

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects1= [];
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects2= [];
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects3= [];


gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects1, gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects2);


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getJoystickAngle() >= -(135) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects2[k] = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects2.length = k;
if (isConditionTrue_0) {
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getJoystickAngle() < -(45) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects2[k] = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects2.length = k;
}
if (isConditionTrue_0) {
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = true; }}}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.eventsList1 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = ((typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Direction") : "") == "Up");
}
if (isConditionTrue_0) {

{ //Subevents
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.eventsList0(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.eventsList2 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects1, gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects2);


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getJoystickAngle() >= 45 ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects2[k] = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects2.length = k;
if (isConditionTrue_0) {
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getJoystickAngle() < 135 ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects2[k] = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects2.length = k;
}
if (isConditionTrue_0) {
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = true; }}}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.eventsList3 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = ((typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Direction") : "") == "Down");
}
if (isConditionTrue_0) {

{ //Subevents
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.eventsList2(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.eventsList4 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects1, gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects2);


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects2_1final.length = 0;
let isConditionTrue_1 = false;
isConditionTrue_0 = false;
{
gdjs.copyArray(gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects1, gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects3);

{let isConditionTrue_2 = false;
isConditionTrue_2 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects3.length;i<l;++i) {
    if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects3[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getJoystickAngle() >= -(180) ) {
        isConditionTrue_2 = true;
        gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects3[k] = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects3[i];
        ++k;
    }
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects3.length = k;
if (isConditionTrue_2) {
isConditionTrue_2 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects3.length;i<l;++i) {
    if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects3[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getJoystickAngle() < -(135) ) {
        isConditionTrue_2 = true;
        gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects3[k] = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects3[i];
        ++k;
    }
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects3.length = k;
}
isConditionTrue_1 = isConditionTrue_2;
}
if(isConditionTrue_1) {
    isConditionTrue_0 = true;
    for (let j = 0, jLen = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects3.length; j < jLen ; ++j) {
        if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects2_1final.indexOf(gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects3[j]) === -1 )
            gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects2_1final.push(gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects3[j]);
    }
}
}
{
gdjs.copyArray(gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects1, gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects3);

{let isConditionTrue_2 = false;
isConditionTrue_2 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects3.length;i<l;++i) {
    if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects3[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getJoystickAngle() >= 135 ) {
        isConditionTrue_2 = true;
        gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects3[k] = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects3[i];
        ++k;
    }
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects3.length = k;
if (isConditionTrue_2) {
isConditionTrue_2 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects3.length;i<l;++i) {
    if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects3[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getJoystickAngle() < 180 ) {
        isConditionTrue_2 = true;
        gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects3[k] = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects3[i];
        ++k;
    }
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects3.length = k;
}
isConditionTrue_1 = isConditionTrue_2;
}
if(isConditionTrue_1) {
    isConditionTrue_0 = true;
    for (let j = 0, jLen = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects3.length; j < jLen ; ++j) {
        if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects2_1final.indexOf(gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects3[j]) === -1 )
            gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects2_1final.push(gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects3[j]);
    }
}
}
{
gdjs.copyArray(gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects2_1final, gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects2);
}
}
if (isConditionTrue_0) {
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = true; }}}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.eventsList5 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = ((typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Direction") : "") == "Left");
}
if (isConditionTrue_0) {

{ //Subevents
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.eventsList4(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.eventsList6 = function(runtimeScene, eventsFunctionContext) {

{

/* Reuse gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects1 */

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getJoystickAngle() >= -(45) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects1[k] = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getJoystickAngle() < 45 ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects1[k] = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects1.length = k;
}
if (isConditionTrue_0) {
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = true; }}}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.eventsList7 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = ((typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Direction") : "") == "Right");
}
if (isConditionTrue_0) {

{ //Subevents
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.eventsList6(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.eventsList8 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.eventsList1(runtimeScene, eventsFunctionContext);
}


{


gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.eventsList3(runtimeScene, eventsFunctionContext);
}


{


gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.eventsList5(runtimeScene, eventsFunctionContext);
}


{


gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.eventsList7(runtimeScene, eventsFunctionContext);
}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.eventsList9 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.eventsList8(runtimeScene, eventsFunctionContext);
}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.eventsList10 = function(runtimeScene, eventsFunctionContext) {

{



}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = ((( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).JoystickForce((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined))) > 0);
}
if (isConditionTrue_0) {

{ //Subevents
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.eventsList9(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed = function(Direction, parentEventsFunctionContext) {

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
if (argName === "Direction") return Direction;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects2.length = 0;
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.GDObjectObjects3.length = 0;

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushedContext.eventsList10(runtimeScene, eventsFunctionContext);

return !!eventsFunctionContext.returnValue;
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext = {};
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2_1final = [];

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects1= [];
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2= [];
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects3= [];


gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects1, gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2);


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getJoystickAngle() >= -(112.5) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2[k] = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2.length = k;
if (isConditionTrue_0) {
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getJoystickAngle() < -(67.5) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2[k] = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2.length = k;
}
if (isConditionTrue_0) {
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = true; }}}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.eventsList1 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = ((typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Direction") : "") == "Up");
}
if (isConditionTrue_0) {

{ //Subevents
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.eventsList0(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.eventsList2 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects1, gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2);


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getJoystickAngle() >= 67.5 ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2[k] = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2.length = k;
if (isConditionTrue_0) {
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getJoystickAngle() < 112.5 ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2[k] = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2.length = k;
}
if (isConditionTrue_0) {
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = true; }}}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.eventsList3 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = ((typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Direction") : "") == "Down");
}
if (isConditionTrue_0) {

{ //Subevents
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.eventsList2(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.eventsList4 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects1, gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2);


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2_1final.length = 0;
let isConditionTrue_1 = false;
isConditionTrue_0 = false;
{
gdjs.copyArray(gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects1, gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects3);

{let isConditionTrue_2 = false;
isConditionTrue_2 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects3.length;i<l;++i) {
    if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects3[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getJoystickAngle() >= -(180) ) {
        isConditionTrue_2 = true;
        gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects3[k] = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects3[i];
        ++k;
    }
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects3.length = k;
if (isConditionTrue_2) {
isConditionTrue_2 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects3.length;i<l;++i) {
    if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects3[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getJoystickAngle() < -(157.5) ) {
        isConditionTrue_2 = true;
        gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects3[k] = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects3[i];
        ++k;
    }
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects3.length = k;
}
isConditionTrue_1 = isConditionTrue_2;
}
if(isConditionTrue_1) {
    isConditionTrue_0 = true;
    for (let j = 0, jLen = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects3.length; j < jLen ; ++j) {
        if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2_1final.indexOf(gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects3[j]) === -1 )
            gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2_1final.push(gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects3[j]);
    }
}
}
{
gdjs.copyArray(gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects1, gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects3);

{let isConditionTrue_2 = false;
isConditionTrue_2 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects3.length;i<l;++i) {
    if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects3[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getJoystickAngle() >= 157.5 ) {
        isConditionTrue_2 = true;
        gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects3[k] = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects3[i];
        ++k;
    }
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects3.length = k;
if (isConditionTrue_2) {
isConditionTrue_2 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects3.length;i<l;++i) {
    if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects3[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getJoystickAngle() < 180 ) {
        isConditionTrue_2 = true;
        gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects3[k] = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects3[i];
        ++k;
    }
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects3.length = k;
}
isConditionTrue_1 = isConditionTrue_2;
}
if(isConditionTrue_1) {
    isConditionTrue_0 = true;
    for (let j = 0, jLen = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects3.length; j < jLen ; ++j) {
        if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2_1final.indexOf(gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects3[j]) === -1 )
            gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2_1final.push(gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects3[j]);
    }
}
}
{
gdjs.copyArray(gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2_1final, gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2);
}
}
if (isConditionTrue_0) {
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = true; }}}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.eventsList5 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = ((typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Direction") : "") == "Left");
}
if (isConditionTrue_0) {

{ //Subevents
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.eventsList4(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.eventsList6 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects1, gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2);


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getJoystickAngle() >= -(22.5) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2[k] = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2.length = k;
if (isConditionTrue_0) {
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getJoystickAngle() < 22.5 ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2[k] = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2.length = k;
}
if (isConditionTrue_0) {
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = true; }}}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.eventsList7 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = ((typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Direction") : "") == "Right");
}
if (isConditionTrue_0) {

{ //Subevents
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.eventsList6(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.eventsList8 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects1, gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2);


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getJoystickAngle() >= -(67.5) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2[k] = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2.length = k;
if (isConditionTrue_0) {
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getJoystickAngle() < -(22.5) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2[k] = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2.length = k;
}
if (isConditionTrue_0) {
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = true; }}}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.eventsList9 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = ((typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Direction") : "") == "UpRight");
}
if (isConditionTrue_0) {

{ //Subevents
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.eventsList8(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.eventsList10 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects1, gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2);


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getJoystickAngle() >= -(157.5) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2[k] = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2.length = k;
if (isConditionTrue_0) {
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getJoystickAngle() < -(112.5) ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2[k] = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2.length = k;
}
if (isConditionTrue_0) {
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = true; }}}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.eventsList11 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = ((typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Direction") : "") == "UpLeft");
}
if (isConditionTrue_0) {

{ //Subevents
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.eventsList10(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.eventsList12 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects1, gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2);


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getJoystickAngle() >= 112.5 ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2[k] = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2.length = k;
if (isConditionTrue_0) {
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getJoystickAngle() < 157.5 ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2[k] = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2.length = k;
}
if (isConditionTrue_0) {
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = true; }}}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.eventsList13 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = ((typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Direction") : "") == "DownLeft");
}
if (isConditionTrue_0) {

{ //Subevents
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.eventsList12(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.eventsList14 = function(runtimeScene, eventsFunctionContext) {

{

/* Reuse gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects1 */

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getJoystickAngle() >= 22.5 ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects1[k] = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getJoystickAngle() < 67.5 ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects1[k] = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects1.length = k;
}
if (isConditionTrue_0) {
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = true; }}}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.eventsList15 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = ((typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Direction") : "") == "DownRight");
}
if (isConditionTrue_0) {

{ //Subevents
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.eventsList14(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.eventsList16 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.eventsList1(runtimeScene, eventsFunctionContext);
}


{


gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.eventsList3(runtimeScene, eventsFunctionContext);
}


{


gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.eventsList5(runtimeScene, eventsFunctionContext);
}


{


gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.eventsList7(runtimeScene, eventsFunctionContext);
}


{


gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.eventsList9(runtimeScene, eventsFunctionContext);
}


{


gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.eventsList11(runtimeScene, eventsFunctionContext);
}


{


gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.eventsList13(runtimeScene, eventsFunctionContext);
}


{


gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.eventsList15(runtimeScene, eventsFunctionContext);
}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.eventsList17 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.eventsList16(runtimeScene, eventsFunctionContext);
}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.eventsList18 = function(runtimeScene, eventsFunctionContext) {

{



}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = ((( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).JoystickForce((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined))) > 0);
}
if (isConditionTrue_0) {

{ //Subevents
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.eventsList17(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8Way = function(Direction, parentEventsFunctionContext) {

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
if (argName === "Direction") return Direction;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects2.length = 0;
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.GDObjectObjects3.length = 0;

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.DirectionPushed8WayContext.eventsList18(runtimeScene, eventsFunctionContext);

return !!eventsFunctionContext.returnValue;
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.IsFloatingContext = {};
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.IsFloatingContext.GDObjectObjects1= [];
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.IsFloatingContext.GDObjectObjects2= [];


gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.IsFloatingContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.IsFloatingContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.IsFloatingContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.IsFloatingContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getFloatingEnabled() ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.IsFloatingContext.GDObjectObjects1[k] = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.IsFloatingContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.IsFloatingContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = true; }}}

}


};

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.IsFloating = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.IsFloatingContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.IsFloatingContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.IsFloatingContext.eventsList0(runtimeScene, eventsFunctionContext);

return !!eventsFunctionContext.returnValue;
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SetFloatingContext = {};
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SetFloatingContext.GDObjectObjects1= [];
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SetFloatingContext.GDObjectObjects2= [];


gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SetFloatingContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (typeof eventsFunctionContext !== 'undefined' ? !!eventsFunctionContext.getArgument("Value") : false);
}
if (isConditionTrue_0) {
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SetFloatingContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SetFloatingContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SetFloatingContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setFloatingEnabled(true);
}
}}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = !(typeof eventsFunctionContext !== 'undefined' ? !!eventsFunctionContext.getArgument("Value") : false);
}
if (isConditionTrue_0) {
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SetFloatingContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SetFloatingContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SetFloatingContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setFloatingEnabled(false);
}
}}

}


};

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SetFloating = function(Value, parentEventsFunctionContext) {

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
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SetFloatingContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SetFloatingContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SetFloatingContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.IsPressedContext = {};
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.IsPressedContext.GDObjectObjects1= [];
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.IsPressedContext.GDObjectObjects2= [];


gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.IsPressedContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.IsPressedContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.IsPressedContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.IsPressedContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getIsPressed() ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.IsPressedContext.GDObjectObjects1[k] = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.IsPressedContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.IsPressedContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {
{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = true; }}}

}


};

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.IsPressed = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.IsPressedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.IsPressedContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.IsPressedContext.eventsList0(runtimeScene, eventsFunctionContext);

return !!eventsFunctionContext.returnValue;
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SetPressedContext = {};
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SetPressedContext.GDObjectObjects1= [];
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SetPressedContext.GDObjectObjects2= [];
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SetPressedContext.GDObjectObjects3= [];


gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SetPressedContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SetPressedContext.GDObjectObjects2);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SetPressedContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SetPressedContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getIsPressed() ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SetPressedContext.GDObjectObjects2[k] = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SetPressedContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SetPressedContext.GDObjectObjects2.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SetPressedContext.GDObjectObjects2 */
{for(var i = 0, len = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SetPressedContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SetPressedContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setIsReleased(true);
}
}}

}


{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SetPressedContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SetPressedContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SetPressedContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setIsPressed(false);
}
}}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SetPressedContext.eventsList1 = function(runtimeScene, eventsFunctionContext) {

{



}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (typeof eventsFunctionContext !== 'undefined' ? !!eventsFunctionContext.getArgument("Value") : false);
}
if (isConditionTrue_0) {
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SetPressedContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SetPressedContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SetPressedContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setIsPressed(true);
}
}}

}


{



}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = !(typeof eventsFunctionContext !== 'undefined' ? !!eventsFunctionContext.getArgument("Value") : false);
}
if (isConditionTrue_0) {

{ //Subevents
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SetPressedContext.eventsList0(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SetPressed = function(Value, parentEventsFunctionContext) {

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
if (argName === "Value") return Value;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SetPressedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SetPressedContext.GDObjectObjects2.length = 0;
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SetPressedContext.GDObjectObjects3.length = 0;

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SetPressedContext.eventsList1(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext = {};
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects1= [];
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects2= [];
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects3= [];
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDJoystickThumbObjects1= [];
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDJoystickThumbObjects2= [];
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDJoystickThumbObjects3= [];


gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{



}


{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects2);
{for(var i = 0, len = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setIsPressed(true);
}
}}

}


{



}


{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects2);
{for(var i = 0, len = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setJoystickAngle(gdjs.evtTools.common.angleBetweenPositions((gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects2[i].getCenterXInScene()), (gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects2[i].getCenterYInScene()), (typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("SimulatedTouchX")) || 0 : 0), (typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("SimulatedTouchY")) || 0 : 0)));
}
}}

}


{



}


{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects2);
{for(var i = 0, len = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setTouchDistance(gdjs.evtTools.common.distanceBetweenPositions((gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects2[i].getCenterXInScene()), (gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects2[i].getCenterYInScene()), (typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("SimulatedTouchX")) || 0 : 0), (typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("SimulatedTouchY")) || 0 : 0)));
}
}}

}


{



}


{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setJoystickForce(gdjs.evtTools.common.clamp((gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getTouchDistance()) / (gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects1[i].getWidth()) * 2, 0, 1));
}
}}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.eventsList1 = function(runtimeScene, eventsFunctionContext) {

{

/* Reuse gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects2 */

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = ((( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects2.length === 0 ) ? 0 :gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects2[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getTouchDistance()) > (( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects2.length === 0 ) ? 0 :gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects2[0].getWidth()) / 2);
}
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects2 */
{for(var i = 0, len = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects2[i].setCenterPositionInScene(gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects2[i].getCenterXInScene() +gdjs.evtTools.common.getXFromAngleAndDistance((gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).JoystickAngle((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined))), (gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getTouchDistance()) - (gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects2[i].getWidth()) / 2),gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects2[i].getCenterYInScene() +gdjs.evtTools.common.getYFromAngleAndDistance((gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).JoystickAngle((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined))), (gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getTouchDistance()) - (gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects2[i].getWidth()) / 2));
}
}}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.mapOfGDgdjs_46evtsExt_95_95MultitouchJoystick_95_95MultitouchJoystick_46MultitouchJoystick_46prototype_46SimulateTouch_95PositionContext_46GDJoystickThumbObjects1Objects = Hashtable.newFrom({"JoystickThumb": gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDJoystickThumbObjects1});
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.eventsList2 = function(runtimeScene, eventsFunctionContext) {

{



}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects2);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects2.length;i<l;++i) {
    if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getFloatingEnabled() ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects2[k] = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects2[i];
        ++k;
    }
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects2.length = k;
if (isConditionTrue_0) {

{ //Subevents
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.eventsList1(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


{



}


{

gdjs.copyArray(eventsFunctionContext.getObjects("JoystickThumb"), gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDJoystickThumbObjects1);
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.linkedObjects.pickObjectsLinkedTo(runtimeScene, gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.mapOfGDgdjs_46evtsExt_95_95MultitouchJoystick_95_95MultitouchJoystick_46MultitouchJoystick_46prototype_46SimulateTouch_95PositionContext_46GDJoystickThumbObjects1Objects, (gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects1.length !== 0 ? gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects1[0] : null), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDJoystickThumbObjects1 */
/* Reuse gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects1 */
{for(var i = 0, len = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDJoystickThumbObjects1.length ;i < len;++i) {
    gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDJoystickThumbObjects1[i].putAroundObject((gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects1.length !== 0 ? gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects1[0] : null), Math.min((( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getTouchDistance()), (( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects1[0].getWidth()) / 2), (( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).JoystickAngle((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined))));
}
}}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.eventsList3 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.eventsList0(runtimeScene, eventsFunctionContext);
}


{


gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.eventsList2(runtimeScene, eventsFunctionContext);
}


};

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_Position = function(JoystickThumb, SimulatedTouchX, SimulatedTouchY, parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._runtimeScene;
var thisObjectList = [this.owner];
var Object = Hashtable.newFrom({Object: thisObjectList});
var Behavior = this.name;
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
, "JoystickThumb": JoystickThumb
},
  _objectArraysMap: {
"Object": thisObjectList
, "JoystickThumb": gdjs.objectsListsToArray(JoystickThumb)
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
if (argName === "SimulatedTouchX") return SimulatedTouchX;
if (argName === "SimulatedTouchY") return SimulatedTouchY;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects2.length = 0;
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDObjectObjects3.length = 0;
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDJoystickThumbObjects1.length = 0;
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDJoystickThumbObjects2.length = 0;
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.GDJoystickThumbObjects3.length = 0;

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_PositionContext.eventsList3(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext = {};
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDObjectObjects1= [];
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDObjectObjects2= [];
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDObjectObjects3= [];
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDJoystickThumbObjects1= [];
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDJoystickThumbObjects2= [];
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDJoystickThumbObjects3= [];


gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{



}


{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDObjectObjects2);
{for(var i = 0, len = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDObjectObjects2[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setIsPressed(true);
}
}}

}


{



}


{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setJoystickAngle(gdjs.evtTools.common.clamp((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Angle")) || 0 : 0), -(180), 180));
}
}{for(var i = 0, len = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setJoystickForce(gdjs.evtTools.common.clamp((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Force")) || 0 : 0), 0, 1));
}
}}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.mapOfGDgdjs_46evtsExt_95_95MultitouchJoystick_95_95MultitouchJoystick_46MultitouchJoystick_46prototype_46SimulateTouch_95AngleForceContext_46GDJoystickThumbObjects1Objects = Hashtable.newFrom({"JoystickThumb": gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDJoystickThumbObjects1});
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.eventsList1 = function(runtimeScene, eventsFunctionContext) {

{



}


{

gdjs.copyArray(eventsFunctionContext.getObjects("JoystickThumb"), gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDJoystickThumbObjects1);
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.linkedObjects.pickObjectsLinkedTo(runtimeScene, gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.mapOfGDgdjs_46evtsExt_95_95MultitouchJoystick_95_95MultitouchJoystick_46MultitouchJoystick_46prototype_46SimulateTouch_95AngleForceContext_46GDJoystickThumbObjects1Objects, (gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDObjectObjects1.length !== 0 ? gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDObjectObjects1[0] : null), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDJoystickThumbObjects1 */
/* Reuse gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDObjectObjects1 */
{for(var i = 0, len = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDJoystickThumbObjects1.length ;i < len;++i) {
    gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDJoystickThumbObjects1[i].setCenterPositionInScene((( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDObjectObjects1[0].getCenterXInScene()) + gdjs.evtTools.common.getXFromAngleAndDistance((( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).JoystickAngle((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined))), (( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).JoystickForce((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined))) * (( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDObjectObjects1[0].getWidth()) / 2),(( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDObjectObjects1[0].getCenterYInScene()) + gdjs.evtTools.common.getYFromAngleAndDistance((( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).JoystickAngle((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined))), (( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Behavior")).JoystickForce((typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined))) * (( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDObjectObjects1[0].getWidth()) / 2));
}
}}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.eventsList2 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.eventsList0(runtimeScene, eventsFunctionContext);
}


{


gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.eventsList1(runtimeScene, eventsFunctionContext);
}


};

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForce = function(JoystickThumb, Angle, Force, parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._runtimeScene;
var thisObjectList = [this.owner];
var Object = Hashtable.newFrom({Object: thisObjectList});
var Behavior = this.name;
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
, "JoystickThumb": JoystickThumb
},
  _objectArraysMap: {
"Object": thisObjectList
, "JoystickThumb": gdjs.objectsListsToArray(JoystickThumb)
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
if (argName === "Angle") return Angle;
if (argName === "Force") return Force;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDObjectObjects2.length = 0;
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDObjectObjects3.length = 0;
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDJoystickThumbObjects1.length = 0;
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDJoystickThumbObjects2.length = 0;
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.GDJoystickThumbObjects3.length = 0;

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouch_AngleForceContext.eventsList2(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext = {};
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.GDObjectObjects1= [];
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.GDObjectObjects2= [];
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.GDObjectObjects3= [];
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.GDJoystickThumbObjects1= [];
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.GDJoystickThumbObjects2= [];
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.GDJoystickThumbObjects3= [];


gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.mapOfGDgdjs_46evtsExt_95_95MultitouchJoystick_95_95MultitouchJoystick_46MultitouchJoystick_46prototype_46SimulateTouchEndedContext_46GDJoystickThumbObjects2Objects = Hashtable.newFrom({"JoystickThumb": gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.GDJoystickThumbObjects2});
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{



}


{

gdjs.copyArray(eventsFunctionContext.getObjects("JoystickThumb"), gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.GDJoystickThumbObjects2);
gdjs.copyArray(gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.GDObjectObjects1, gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.GDObjectObjects2);


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.linkedObjects.pickObjectsLinkedTo(runtimeScene, gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.mapOfGDgdjs_46evtsExt_95_95MultitouchJoystick_95_95MultitouchJoystick_46MultitouchJoystick_46prototype_46SimulateTouchEndedContext_46GDJoystickThumbObjects2Objects, (gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.GDObjectObjects2.length !== 0 ? gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.GDObjectObjects2[0] : null), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.GDJoystickThumbObjects2 */
/* Reuse gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.GDObjectObjects2 */
{for(var i = 0, len = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.GDJoystickThumbObjects2.length ;i < len;++i) {
    gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.GDJoystickThumbObjects2[i].setCenterPositionInScene((( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.GDObjectObjects2.length === 0 ) ? 0 :gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.GDObjectObjects2[0].getCenterXInScene()),(( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.GDObjectObjects2.length === 0 ) ? 0 :gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.GDObjectObjects2[0].getCenterYInScene()));
}
}}

}


{



}


{


let isConditionTrue_0 = false;
{
/* Reuse gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.GDObjectObjects1 */
{for(var i = 0, len = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setJoystickForce(0);
}
}}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.eventsList1 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.GDObjectObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.GDObjectObjects1.length;i<l;++i) {
    if ( gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getIsPressed() ) {
        isConditionTrue_0 = true;
        gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.GDObjectObjects1[k] = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.GDObjectObjects1[i];
        ++k;
    }
}
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.GDObjectObjects1.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.GDObjectObjects1 */
{for(var i = 0, len = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setButtonReleased(true);
}
}{for(var i = 0, len = gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setIsPressed(false);
}
}
{ //Subevents
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.eventsList0(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.eventsList2 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.eventsList1(runtimeScene, eventsFunctionContext);
}


};

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEnded = function(JoystickThumb, parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._runtimeScene;
var thisObjectList = [this.owner];
var Object = Hashtable.newFrom({Object: thisObjectList});
var Behavior = this.name;
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
, "JoystickThumb": JoystickThumb
},
  _objectArraysMap: {
"Object": thisObjectList
, "JoystickThumb": gdjs.objectsListsToArray(JoystickThumb)
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

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.GDObjectObjects2.length = 0;
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.GDObjectObjects3.length = 0;
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.GDJoystickThumbObjects1.length = 0;
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.GDJoystickThumbObjects2.length = 0;
gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.GDJoystickThumbObjects3.length = 0;

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.SimulateTouchEndedContext.eventsList2(runtimeScene, eventsFunctionContext);

return;
}

gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick.prototype.doStepPreEvents = function() {
  this._onceTriggers.startNewFrame();
};


gdjs.registerBehavior("MultitouchJoystick::MultitouchJoystick", gdjs.evtsExt__MultitouchJoystick__MultitouchJoystick.MultitouchJoystick);
