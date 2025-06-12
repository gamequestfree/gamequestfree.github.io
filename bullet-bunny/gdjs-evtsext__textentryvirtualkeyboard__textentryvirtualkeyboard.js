
gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard = gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard || {};

/**
 * Behavior generated from Mobile virtual keyboard for Text Entry
 */
gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard = class TextEntryVirtualKeyboard extends gdjs.RuntimeBehavior {
  constructor(instanceContainer, behaviorData, owner) {
    super(instanceContainer, behaviorData, owner);
    this._runtimeScene = instanceContainer;

    this._onceTriggers = new gdjs.OnceTriggers();
    this._behaviorData = {};
    this._sharedData = gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.getSharedData(
      instanceContainer,
      behaviorData.name
    );
    
  }

  // Hot-reload:
  updateFromBehaviorData(oldBehaviorData, newBehaviorData) {
    

    return true;
  }

  // Properties:
  
}

/**
 * Shared data generated from Mobile virtual keyboard for Text Entry
 */
gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.SharedData = class TextEntryVirtualKeyboardSharedData {
  constructor(sharedData) {
    
  }
  
  // Shared properties:
  
}

gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.getSharedData = function(instanceContainer, behaviorName) {
  if (!instanceContainer._TextEntryVirtualKeyboard_TextEntryVirtualKeyboardSharedData) {
    const initialData = instanceContainer.getInitialSharedDataForBehavior(
      behaviorName
    );
    instanceContainer._TextEntryVirtualKeyboard_TextEntryVirtualKeyboardSharedData = new gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.SharedData(
      initialData
    );
  }
  return instanceContainer._TextEntryVirtualKeyboard_TextEntryVirtualKeyboardSharedData;
}

// Methods:
gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.onCreatedContext = {};
gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.onCreatedContext.GDObjectObjects1= [];
gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.onCreatedContext.GDObjectObjects2= [];


gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.onCreatedContext.userFunc0x2666fc8 = function(runtimeScene, eventsFunctionContext) {
"use strict";
gdjs._extensionMobileKeyboard = gdjs._extensionMobileKeyboard || {};

if (typeof document === "undefined") {
    console.error("This behavior is only running in a Browser-like environment");
    return;
}

// Select and focus the input associated to the object when opening the keyboard
gdjs._extensionMobileKeyboard.openKeyboard = function (eventsFunctionContext) {
    var uniqueID = gdjs._extensionMobileKeyboard.getUniqueIdInObject(eventsFunctionContext);
    var input = document.getElementById(uniqueID);
    if (input) {
        var textEntry = eventsFunctionContext.getObjects("Object")[0];
        input.value = textEntry.getString();
        input.style.removeProperty("visibility");
        input.focus();
    }
}

// Blur the input associated to an ID
gdjs._extensionMobileKeyboard.closeKeyboardById = function (uniqueID) {
    var input = document.getElementById(uniqueID);
    if (input) {
        input.blur();
        input.style.setProperty("visibility", "hidden");
    }
}

// Blur the input associated to an object
gdjs._extensionMobileKeyboard.closeKeyboard = function (eventsFunctionContext) {
    var uniqueID = gdjs._extensionMobileKeyboard.getUniqueIdInObject(eventsFunctionContext);
    var input = document.getElementById(uniqueID);
    if (input) {
        var textEntry = eventsFunctionContext.getObjects("Object")[0];
        textEntry.setString(input.value);
        input.blur();
        input.style.setProperty("visibility", "hidden");
    }
}

// Return the id of the current behavior object
gdjs._extensionMobileKeyboard.getUniqueIdInObject = function (eventsFunctionContext) {
    var behaviorName = eventsFunctionContext.getBehaviorName("Behavior");
    return eventsFunctionContext.getObjects("Object")[0]._mobileKeyboardExtensionInput._uniqueId;
}

// Save an ID inside the object
var setUniqueIdInObject = function (id) {
    var behaviorName = eventsFunctionContext.getBehaviorName("Behavior");
    eventsFunctionContext.getObjects("Object")[0]._mobileKeyboardExtensionInput = { "_uniqueId": id };
}

// Create an input for the current object
const input = document.createElement("input");
input.type = "text";
input.setAttribute("spellcheck", "false"); // Disable spell checking (blue line on mobile under words)
input.style = "background-color: transparent;border: 0px;outline: transparent;color: #0000;";

// Create an identifier that is unique
var uniqueId = "GDevelop_Mobile_Keyboard_Input" + Date.now() + '-' + Math.floor(Math.random() * 100000);
input.id = uniqueId; // Apply it to the input
setUniqueIdInObject(uniqueId); // Apply it to the object

document.body.appendChild(input); // Add input to the document HTML

// Handle key presses on the input
input.addEventListener("keyup", function (event) {
    input.focus();

    // Force selection to be at the end (to mimic Text Entry)
    var length_string = input.value.length;
    input.setSelectionRange(length_string, length_string);

    // Support for removing the last character
    if (event.keyCode == 8 || event.keyCode == 46) { // 8=Backspace, 46=Del
        input.value = input.value.slice(0, -1);
    }

    var textEntry = eventsFunctionContext.getObjects("Object")[0];
    textEntry.setString(input.value);//Edit textEntry _str value

    if (event.keyCode === 13) { // 13=Enter key 
        //Send id to function for close keyboard
        if (gdjs._extensionMobileKeyboard.closeKeyboard != undefined) {
            gdjs._extensionMobileKeyboard.closeKeyboardById(uniqueId);
        }
    }
}, { passive: false });

};
gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.onCreatedContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.onCreatedContext.userFunc0x2666fc8(runtimeScene, typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined);

}


};gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.onCreatedContext.eventsList1 = function(runtimeScene, eventsFunctionContext) {

{



}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.systemInfo.isMobile();
if (isConditionTrue_0) {

{ //Subevents
gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.onCreatedContext.eventsList0(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};

gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.onCreated = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.onCreatedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.onCreatedContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.onCreatedContext.eventsList1(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.openKeyboardContext = {};
gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.openKeyboardContext.GDObjectObjects1= [];
gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.openKeyboardContext.GDObjectObjects2= [];


gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.openKeyboardContext.userFunc0x26681b8 = function(runtimeScene, eventsFunctionContext) {
"use strict";
gdjs._extensionMobileKeyboard = gdjs._extensionMobileKeyboard || {};

if (gdjs._extensionMobileKeyboard.openKeyboard) { 
    gdjs._extensionMobileKeyboard.openKeyboard(eventsFunctionContext);
}
};
gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.openKeyboardContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.openKeyboardContext.userFunc0x26681b8(runtimeScene, typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined);

}


};gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.openKeyboardContext.eventsList1 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.systemInfo.isMobile();
if (isConditionTrue_0) {

{ //Subevents
gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.openKeyboardContext.eventsList0(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};

gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.openKeyboard = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.openKeyboardContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.openKeyboardContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.openKeyboardContext.eventsList1(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.closeKeyboardContext = {};
gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.closeKeyboardContext.GDObjectObjects1= [];
gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.closeKeyboardContext.GDObjectObjects2= [];


gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.closeKeyboardContext.userFunc0x26681b8 = function(runtimeScene, eventsFunctionContext) {
"use strict";
gdjs._extensionMobileKeyboard = gdjs._extensionMobileKeyboard || {};

if (gdjs._extensionMobileKeyboard.closeKeyboard) { 
    gdjs._extensionMobileKeyboard.closeKeyboard(eventsFunctionContext);
}
};
gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.closeKeyboardContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.closeKeyboardContext.userFunc0x26681b8(runtimeScene, typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined);

}


};gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.closeKeyboardContext.eventsList1 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.systemInfo.isMobile();
if (isConditionTrue_0) {

{ //Subevents
gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.closeKeyboardContext.eventsList0(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};

gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.closeKeyboard = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.closeKeyboardContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.closeKeyboardContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.closeKeyboardContext.eventsList1(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.onOwnerRemovedFromSceneContext = {};
gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.onOwnerRemovedFromSceneContext.GDObjectObjects1= [];
gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.onOwnerRemovedFromSceneContext.GDObjectObjects2= [];


gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.onOwnerRemovedFromSceneContext.userFunc0x2668280 = function(runtimeScene, eventsFunctionContext) {
"use strict";
gdjs._extensionMobileKeyboard = gdjs._extensionMobileKeyboard || {};

var uniqueID = gdjs._extensionMobileKeyboard.getUniqueIdInObject(eventsFunctionContext);
var element = document.getElementById(uniqueID);
if (element) {
    element.parentNode.removeChild(element);
}
};
gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.onOwnerRemovedFromSceneContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.onOwnerRemovedFromSceneContext.userFunc0x2668280(runtimeScene, typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined);

}


};gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.onOwnerRemovedFromSceneContext.eventsList1 = function(runtimeScene, eventsFunctionContext) {

{



}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.systemInfo.isMobile();
if (isConditionTrue_0) {

{ //Subevents
gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.onOwnerRemovedFromSceneContext.eventsList0(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};

gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.onOwnerRemovedFromScene = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.onOwnerRemovedFromSceneContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.onOwnerRemovedFromSceneContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.onOwnerRemovedFromSceneContext.eventsList1(runtimeScene, eventsFunctionContext);

return;
}

gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.onDestroy = function() {
  // Redirect call to onOwnerRemovedFromScene (the old name of onDestroy)
  if (this.onOwnerRemovedFromScene) this.onOwnerRemovedFromScene();
};

gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard.prototype.doStepPreEvents = function() {
  this._onceTriggers.startNewFrame();
};


gdjs.registerBehavior("TextEntryVirtualKeyboard::TextEntryVirtualKeyboard", gdjs.evtsExt__TextEntryVirtualKeyboard__TextEntryVirtualKeyboard.TextEntryVirtualKeyboard);
