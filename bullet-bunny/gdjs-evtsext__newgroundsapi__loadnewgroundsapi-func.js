
if (typeof gdjs.evtsExt__NewgroundsAPI__LoadNewgroundsAPI !== "undefined") {
  gdjs.evtsExt__NewgroundsAPI__LoadNewgroundsAPI.registeredGdjsCallbacks.forEach(callback =>
    gdjs._unregisterCallback(callback)
  );
}

gdjs.evtsExt__NewgroundsAPI__LoadNewgroundsAPI = {};


gdjs.evtsExt__NewgroundsAPI__LoadNewgroundsAPI.userFunc0x2689860 = function(runtimeScene, eventsFunctionContext) {
"use strict";
const AppId = eventsFunctionContext.getArgument("AppId");
const EncryptKey = eventsFunctionContext.getArgument("EncryptKey");

window._newgrounds.PlayerName = null;
window._newgrounds.IsLoggedIn = false;

function OnLoggedIn() {
    window._newgrounds.ngio.getSessionLoader().closePassport();
    window._newgrounds.PlayerName = window._newgrounds.ngio.user.name;
	window._newgrounds.IsLoggedIn = window._newgrounds.ngio.user.name;
}

window._newgrounds.ngio =  new window._newgrounds.Newgrounds.io.core(
	AppId,
	EncryptKey
);

window._newgrounds.ngio.getValidSession(() => {
	if(window._newgrounds.ngio.user != null) {
		OnLoggedIn();
	}
});




};
gdjs.evtsExt__NewgroundsAPI__LoadNewgroundsAPI.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__NewgroundsAPI__LoadNewgroundsAPI.userFunc0x2689860(runtimeScene, typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined);

}


{


let isConditionTrue_0 = false;
{
}

}


};

gdjs.evtsExt__NewgroundsAPI__LoadNewgroundsAPI.func = function(runtimeScene, AppId, EncryptKey, parentEventsFunctionContext) {
var eventsFunctionContext = {
  _objectsMap: {
},
  _objectArraysMap: {
},
  _behaviorNamesMap: {
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
if (argName === "AppId") return AppId;
if (argName === "EncryptKey") return EncryptKey;
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};


gdjs.evtsExt__NewgroundsAPI__LoadNewgroundsAPI.eventsList0(runtimeScene, eventsFunctionContext);

return;
}

gdjs.evtsExt__NewgroundsAPI__LoadNewgroundsAPI.registeredGdjsCallbacks = [];