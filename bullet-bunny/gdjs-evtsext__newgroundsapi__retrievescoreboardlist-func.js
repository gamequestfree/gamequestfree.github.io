
if (typeof gdjs.evtsExt__NewgroundsAPI__RetrieveScoreBoardList !== "undefined") {
  gdjs.evtsExt__NewgroundsAPI__RetrieveScoreBoardList.registeredGdjsCallbacks.forEach(callback =>
    gdjs._unregisterCallback(callback)
  );
}

gdjs.evtsExt__NewgroundsAPI__RetrieveScoreBoardList = {};


gdjs.evtsExt__NewgroundsAPI__RetrieveScoreBoardList.userFunc0x267f618 = function(runtimeScene, eventsFunctionContext) {
"use strict";

if(window._newgrounds.ScoreBoardList == undefined) {
	window._newgrounds.ScoreBoardList = [];
	window._newgrounds.ngio.callComponent("ScoreBoard.getBoards", {}, (Result) => {
		for (var i = 0; i < Result.scoreboards.length; i++) {
			window._newgrounds.ScoreBoardList.push({
				id: Result.scoreboards[i].id,
				name: Result.scoreboards[i].name
			})
		}
	});
}

eventsFunctionContext.returnValue = JSON.stringify(window._newgrounds.ScoreBoardList);
};
gdjs.evtsExt__NewgroundsAPI__RetrieveScoreBoardList.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
}

}


{


gdjs.evtsExt__NewgroundsAPI__RetrieveScoreBoardList.userFunc0x267f618(runtimeScene, typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined);

}


};

gdjs.evtsExt__NewgroundsAPI__RetrieveScoreBoardList.func = function(runtimeScene, parentEventsFunctionContext) {
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


gdjs.evtsExt__NewgroundsAPI__RetrieveScoreBoardList.eventsList0(runtimeScene, eventsFunctionContext);

return "" + eventsFunctionContext.returnValue;
}

gdjs.evtsExt__NewgroundsAPI__RetrieveScoreBoardList.registeredGdjsCallbacks = [];