
if (typeof gdjs.evtsExt__NewgroundsAPI__PostScoreOnScoreBoard !== "undefined") {
  gdjs.evtsExt__NewgroundsAPI__PostScoreOnScoreBoard.registeredGdjsCallbacks.forEach(callback =>
    gdjs._unregisterCallback(callback)
  );
}

gdjs.evtsExt__NewgroundsAPI__PostScoreOnScoreBoard = {};


gdjs.evtsExt__NewgroundsAPI__PostScoreOnScoreBoard.userFunc0x267f618 = function(runtimeScene, eventsFunctionContext) {
"use strict";
const ScoreBoardId = eventsFunctionContext.getArgument("ScoreboardId");
const ScoreValue = eventsFunctionContext.getArgument("ScoreValue");

window._newgrounds.ngio.callComponent('ScoreBoard.postScore', {id:ScoreBoardId, value:ScoreValue});
};
gdjs.evtsExt__NewgroundsAPI__PostScoreOnScoreBoard.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__NewgroundsAPI__PostScoreOnScoreBoard.userFunc0x267f618(runtimeScene, typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined);

}


{


let isConditionTrue_0 = false;
{
}

}


};

gdjs.evtsExt__NewgroundsAPI__PostScoreOnScoreBoard.func = function(runtimeScene, ScoreboardId, ScoreValue, parentEventsFunctionContext) {
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
if (argName === "ScoreboardId") return ScoreboardId;
if (argName === "ScoreValue") return ScoreValue;
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};


gdjs.evtsExt__NewgroundsAPI__PostScoreOnScoreBoard.eventsList0(runtimeScene, eventsFunctionContext);

return;
}

gdjs.evtsExt__NewgroundsAPI__PostScoreOnScoreBoard.registeredGdjsCallbacks = [];