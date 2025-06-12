
if (typeof gdjs.evtsExt__NewgroundsAPI__RetrieveMedalList !== "undefined") {
  gdjs.evtsExt__NewgroundsAPI__RetrieveMedalList.registeredGdjsCallbacks.forEach(callback =>
    gdjs._unregisterCallback(callback)
  );
}

gdjs.evtsExt__NewgroundsAPI__RetrieveMedalList = {};


gdjs.evtsExt__NewgroundsAPI__RetrieveMedalList.userFunc0x267f618 = function(runtimeScene, eventsFunctionContext) {
"use strict";
if(window._newgrounds.MedalList == undefined) {
	window._newgrounds.MedalList = [];
	window._newgrounds.ngio.callComponent("Medal.getList", {}, (Result) => {
		for (var i = 0; i < Result.medals.length; i++) {
			window._newgrounds.MedalList.push({
				id: Result.medals[i].id,
				name: Result.medals[i].name
			})
		}
	});
}

eventsFunctionContext.returnValue = JSON.stringify(window._newgrounds.MedalList);
};
gdjs.evtsExt__NewgroundsAPI__RetrieveMedalList.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
}

}


{


gdjs.evtsExt__NewgroundsAPI__RetrieveMedalList.userFunc0x267f618(runtimeScene, typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined);

}


};

gdjs.evtsExt__NewgroundsAPI__RetrieveMedalList.func = function(runtimeScene, parentEventsFunctionContext) {
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


gdjs.evtsExt__NewgroundsAPI__RetrieveMedalList.eventsList0(runtimeScene, eventsFunctionContext);

return "" + eventsFunctionContext.returnValue;
}

gdjs.evtsExt__NewgroundsAPI__RetrieveMedalList.registeredGdjsCallbacks = [];