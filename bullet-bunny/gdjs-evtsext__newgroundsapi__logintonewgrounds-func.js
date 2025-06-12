
if (typeof gdjs.evtsExt__NewgroundsAPI__LogInToNewGrounds !== "undefined") {
  gdjs.evtsExt__NewgroundsAPI__LogInToNewGrounds.registeredGdjsCallbacks.forEach(callback =>
    gdjs._unregisterCallback(callback)
  );
}

gdjs.evtsExt__NewgroundsAPI__LogInToNewGrounds = {};


gdjs.evtsExt__NewgroundsAPI__LogInToNewGrounds.userFunc0x267f618 = function(runtimeScene, eventsFunctionContext) {
"use strict";
function OnLoggedOut() {
    window._newgrounds.IsLoggedIn = false;
    window._newgrounds.PlayerName = null;
	window._newgrounds.ngio.getSessionLoader().closePassport();
}

function OnLoggedIn() {
    window._newgrounds.ngio.getSessionLoader().closePassport();
    window._newgrounds.PlayerName = window._newgrounds.ngio.user.name;
    window._newgrounds.IsLoggedIn = true;
}

window._newgrounds.ngio.getValidSession(() => {
	if(window._newgrounds.ngio.user != null) {
		OnLoggedIn();
	} else {
        window._newgrounds.ngio.requestLogin(OnLoggedIn, OnLoggedOut, OnLoggedOut);
    }
});
};
gdjs.evtsExt__NewgroundsAPI__LogInToNewGrounds.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__NewgroundsAPI__LogInToNewGrounds.userFunc0x267f618(runtimeScene, typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined);

}


{


let isConditionTrue_0 = false;
{
}

}


};

gdjs.evtsExt__NewgroundsAPI__LogInToNewGrounds.func = function(runtimeScene, parentEventsFunctionContext) {
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
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};


gdjs.evtsExt__NewgroundsAPI__LogInToNewGrounds.eventsList0(runtimeScene, eventsFunctionContext);

return;
}

gdjs.evtsExt__NewgroundsAPI__LogInToNewGrounds.registeredGdjsCallbacks = [];