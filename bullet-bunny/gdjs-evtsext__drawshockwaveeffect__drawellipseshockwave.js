
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave = gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave || {};

/**
 * Behavior generated from Draw shock waves in ellipse
 */
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave = class DrawEllipseShockWave extends gdjs.RuntimeBehavior {
  constructor(instanceContainer, behaviorData, owner) {
    super(instanceContainer, behaviorData, owner);
    this._runtimeScene = instanceContainer;

    this._onceTriggers = new gdjs.OnceTriggers();
    this._behaviorData = {};
    this._sharedData = gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.getSharedData(
      instanceContainer,
      behaviorData.name
    );
    
    this._behaviorData.Start1Width = behaviorData.Start1Width !== undefined ? behaviorData.Start1Width : Number("8") || 0;
    this._behaviorData.Start2Height = behaviorData.Start2Height !== undefined ? behaviorData.Start2Height : Number("8") || 0;
    this._behaviorData.Start3Outline = behaviorData.Start3Outline !== undefined ? behaviorData.Start3Outline : Number("16") || 0;
    this._behaviorData.Start4Color = behaviorData.Start4Color !== undefined ? behaviorData.Start4Color : "255;255;255";
    this._behaviorData.Start5Opacity = behaviorData.Start5Opacity !== undefined ? behaviorData.Start5Opacity : Number("255") || 0;
    this._behaviorData.Start6Angle = behaviorData.Start6Angle !== undefined ? behaviorData.Start6Angle : Number("0") || 0;
    this._behaviorData.End1Width = behaviorData.End1Width !== undefined ? behaviorData.End1Width : Number("64") || 0;
    this._behaviorData.End2Height = behaviorData.End2Height !== undefined ? behaviorData.End2Height : Number("64") || 0;
    this._behaviorData.End3Outline = behaviorData.End3Outline !== undefined ? behaviorData.End3Outline : Number("0") || 0;
    this._behaviorData.End4Color = behaviorData.End4Color !== undefined ? behaviorData.End4Color : "255;217;154";
    this._behaviorData.End5Opacity = behaviorData.End5Opacity !== undefined ? behaviorData.End5Opacity : Number("255") || 0;
    this._behaviorData.End6Angle = behaviorData.End6Angle !== undefined ? behaviorData.End6Angle : Number("0") || 0;
    this._behaviorData.Behaviors = behaviorData.Behaviors !== undefined ? behaviorData.Behaviors : "";
    this._behaviorData.Duration = behaviorData.Duration !== undefined ? behaviorData.Duration : Number("1000") || 0;
    this._behaviorData.TweenName = behaviorData.TweenName !== undefined ? behaviorData.TweenName : "easeOutSine";
    this._behaviorData.Width = Number("") || 0;
    this._behaviorData.Height = Number("") || 0;
    this._behaviorData.Outline = Number("") || 0;
    this._behaviorData.Color = "";
    this._behaviorData.Angle = Number("") || 0;
  }

  // Hot-reload:
  updateFromBehaviorData(oldBehaviorData, newBehaviorData) {
    
    if (oldBehaviorData.Start1Width !== newBehaviorData.Start1Width)
      this._behaviorData.Start1Width = newBehaviorData.Start1Width;
    if (oldBehaviorData.Start2Height !== newBehaviorData.Start2Height)
      this._behaviorData.Start2Height = newBehaviorData.Start2Height;
    if (oldBehaviorData.Start3Outline !== newBehaviorData.Start3Outline)
      this._behaviorData.Start3Outline = newBehaviorData.Start3Outline;
    if (oldBehaviorData.Start4Color !== newBehaviorData.Start4Color)
      this._behaviorData.Start4Color = newBehaviorData.Start4Color;
    if (oldBehaviorData.Start5Opacity !== newBehaviorData.Start5Opacity)
      this._behaviorData.Start5Opacity = newBehaviorData.Start5Opacity;
    if (oldBehaviorData.Start6Angle !== newBehaviorData.Start6Angle)
      this._behaviorData.Start6Angle = newBehaviorData.Start6Angle;
    if (oldBehaviorData.End1Width !== newBehaviorData.End1Width)
      this._behaviorData.End1Width = newBehaviorData.End1Width;
    if (oldBehaviorData.End2Height !== newBehaviorData.End2Height)
      this._behaviorData.End2Height = newBehaviorData.End2Height;
    if (oldBehaviorData.End3Outline !== newBehaviorData.End3Outline)
      this._behaviorData.End3Outline = newBehaviorData.End3Outline;
    if (oldBehaviorData.End4Color !== newBehaviorData.End4Color)
      this._behaviorData.End4Color = newBehaviorData.End4Color;
    if (oldBehaviorData.End5Opacity !== newBehaviorData.End5Opacity)
      this._behaviorData.End5Opacity = newBehaviorData.End5Opacity;
    if (oldBehaviorData.End6Angle !== newBehaviorData.End6Angle)
      this._behaviorData.End6Angle = newBehaviorData.End6Angle;
    if (oldBehaviorData.Behaviors !== newBehaviorData.Behaviors)
      this._behaviorData.Behaviors = newBehaviorData.Behaviors;
    if (oldBehaviorData.Duration !== newBehaviorData.Duration)
      this._behaviorData.Duration = newBehaviorData.Duration;
    if (oldBehaviorData.TweenName !== newBehaviorData.TweenName)
      this._behaviorData.TweenName = newBehaviorData.TweenName;
    if (oldBehaviorData.Width !== newBehaviorData.Width)
      this._behaviorData.Width = newBehaviorData.Width;
    if (oldBehaviorData.Height !== newBehaviorData.Height)
      this._behaviorData.Height = newBehaviorData.Height;
    if (oldBehaviorData.Outline !== newBehaviorData.Outline)
      this._behaviorData.Outline = newBehaviorData.Outline;
    if (oldBehaviorData.Color !== newBehaviorData.Color)
      this._behaviorData.Color = newBehaviorData.Color;
    if (oldBehaviorData.Angle !== newBehaviorData.Angle)
      this._behaviorData.Angle = newBehaviorData.Angle;

    return true;
  }

  // Properties:
  
  _getStart1Width() {
    return this._behaviorData.Start1Width !== undefined ? this._behaviorData.Start1Width : Number("8") || 0;
  }
  _setStart1Width(newValue) {
    this._behaviorData.Start1Width = newValue;
  }
  _getStart2Height() {
    return this._behaviorData.Start2Height !== undefined ? this._behaviorData.Start2Height : Number("8") || 0;
  }
  _setStart2Height(newValue) {
    this._behaviorData.Start2Height = newValue;
  }
  _getStart3Outline() {
    return this._behaviorData.Start3Outline !== undefined ? this._behaviorData.Start3Outline : Number("16") || 0;
  }
  _setStart3Outline(newValue) {
    this._behaviorData.Start3Outline = newValue;
  }
  _getStart4Color() {
    return this._behaviorData.Start4Color !== undefined ? this._behaviorData.Start4Color : "255;255;255";
  }
  _setStart4Color(newValue) {
    this._behaviorData.Start4Color = newValue;
  }
  _getStart5Opacity() {
    return this._behaviorData.Start5Opacity !== undefined ? this._behaviorData.Start5Opacity : Number("255") || 0;
  }
  _setStart5Opacity(newValue) {
    this._behaviorData.Start5Opacity = newValue;
  }
  _getStart6Angle() {
    return this._behaviorData.Start6Angle !== undefined ? this._behaviorData.Start6Angle : Number("0") || 0;
  }
  _setStart6Angle(newValue) {
    this._behaviorData.Start6Angle = newValue;
  }
  _getEnd1Width() {
    return this._behaviorData.End1Width !== undefined ? this._behaviorData.End1Width : Number("64") || 0;
  }
  _setEnd1Width(newValue) {
    this._behaviorData.End1Width = newValue;
  }
  _getEnd2Height() {
    return this._behaviorData.End2Height !== undefined ? this._behaviorData.End2Height : Number("64") || 0;
  }
  _setEnd2Height(newValue) {
    this._behaviorData.End2Height = newValue;
  }
  _getEnd3Outline() {
    return this._behaviorData.End3Outline !== undefined ? this._behaviorData.End3Outline : Number("0") || 0;
  }
  _setEnd3Outline(newValue) {
    this._behaviorData.End3Outline = newValue;
  }
  _getEnd4Color() {
    return this._behaviorData.End4Color !== undefined ? this._behaviorData.End4Color : "255;217;154";
  }
  _setEnd4Color(newValue) {
    this._behaviorData.End4Color = newValue;
  }
  _getEnd5Opacity() {
    return this._behaviorData.End5Opacity !== undefined ? this._behaviorData.End5Opacity : Number("255") || 0;
  }
  _setEnd5Opacity(newValue) {
    this._behaviorData.End5Opacity = newValue;
  }
  _getEnd6Angle() {
    return this._behaviorData.End6Angle !== undefined ? this._behaviorData.End6Angle : Number("0") || 0;
  }
  _setEnd6Angle(newValue) {
    this._behaviorData.End6Angle = newValue;
  }
  _getBehaviors() {
    return this._behaviorData.Behaviors !== undefined ? this._behaviorData.Behaviors : "";
  }
  _setBehaviors(newValue) {
    this._behaviorData.Behaviors = newValue;
  }
  _getDuration() {
    return this._behaviorData.Duration !== undefined ? this._behaviorData.Duration : Number("1000") || 0;
  }
  _setDuration(newValue) {
    this._behaviorData.Duration = newValue;
  }
  _getTweenName() {
    return this._behaviorData.TweenName !== undefined ? this._behaviorData.TweenName : "easeOutSine";
  }
  _setTweenName(newValue) {
    this._behaviorData.TweenName = newValue;
  }
  _getWidth() {
    return this._behaviorData.Width !== undefined ? this._behaviorData.Width : Number("") || 0;
  }
  _setWidth(newValue) {
    this._behaviorData.Width = newValue;
  }
  _getHeight() {
    return this._behaviorData.Height !== undefined ? this._behaviorData.Height : Number("") || 0;
  }
  _setHeight(newValue) {
    this._behaviorData.Height = newValue;
  }
  _getOutline() {
    return this._behaviorData.Outline !== undefined ? this._behaviorData.Outline : Number("") || 0;
  }
  _setOutline(newValue) {
    this._behaviorData.Outline = newValue;
  }
  _getColor() {
    return this._behaviorData.Color !== undefined ? this._behaviorData.Color : "";
  }
  _setColor(newValue) {
    this._behaviorData.Color = newValue;
  }
  _getAngle() {
    return this._behaviorData.Angle !== undefined ? this._behaviorData.Angle : Number("") || 0;
  }
  _setAngle(newValue) {
    this._behaviorData.Angle = newValue;
  }
}

/**
 * Shared data generated from Draw shock waves in ellipse
 */
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.SharedData = class DrawEllipseShockWaveSharedData {
  constructor(sharedData) {
    
  }
  
  // Shared properties:
  
}

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.getSharedData = function(instanceContainer, behaviorName) {
  if (!instanceContainer._DrawShockWaveEffect_DrawEllipseShockWaveSharedData) {
    const initialData = instanceContainer.getInitialSharedDataForBehavior(
      behaviorName
    );
    instanceContainer._DrawShockWaveEffect_DrawEllipseShockWaveSharedData = new gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.SharedData(
      initialData
    );
  }
  return instanceContainer._DrawShockWaveEffect_DrawEllipseShockWaveSharedData;
}

// Methods:
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext = {};
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1= [];
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects2= [];


gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = eventsFunctionContext.getOnceTriggers().triggerOnce(41831988);
}
if (isConditionTrue_0) {
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].returnVariable(gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getVariables().get("__DrawEllipseShockWave__").getChild("Width")).setNumber((gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getStart1Width()));
}
}{for(var i = 0, len = gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].returnVariable(gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getVariables().get("__DrawEllipseShockWave__").getChild("Height")).setNumber((gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getStart2Height()));
}
}{for(var i = 0, len = gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].returnVariable(gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getVariables().get("__DrawEllipseShockWave__").getChild("Outline")).setNumber((gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getStart3Outline()));
}
}{for(var i = 0, len = gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].returnVariable(gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getVariables().get("__DrawEllipseShockWave__").getChild("Opacity")).setNumber((gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getStart5Opacity()));
}
}{for(var i = 0, len = gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].returnVariable(gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getVariables().get("__DrawEllipseShockWave__").getChild("Red")).setNumber(gdjs.evtsExt__DrawShockWaveEffect__GetPrimaryColor.func(runtimeScene, (gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getStart4Color()), "Red", (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)));
}
}{for(var i = 0, len = gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].returnVariable(gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getVariables().get("__DrawEllipseShockWave__").getChild("Blue")).setNumber(gdjs.evtsExt__DrawShockWaveEffect__GetPrimaryColor.func(runtimeScene, (gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getStart4Color()), "Blue", (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)));
}
}{for(var i = 0, len = gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].returnVariable(gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getVariables().get("__DrawEllipseShockWave__").getChild("Green")).setNumber(gdjs.evtsExt__DrawShockWaveEffect__GetPrimaryColor.func(runtimeScene, (gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getStart4Color()), "Green", (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)));
}
}}

}


};gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.eventsList1 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = eventsFunctionContext.getOnceTriggers().triggerOnce(41841700);
}
if (isConditionTrue_0) {
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behaviors")).addVariableTween("Width", gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getVariables().get("__DrawEllipseShockWave__").getChild("Width"), (gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getStart1Width()), (gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getEnd1Width()), (gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getTweenName()), (gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getDuration()), false);
}
}{for(var i = 0, len = gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behaviors")).addVariableTween("Height", gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getVariables().get("__DrawEllipseShockWave__").getChild("Height"), (gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getStart2Height()), (gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getEnd2Height()), (gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getTweenName()), (gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getDuration()), false);
}
}{for(var i = 0, len = gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behaviors")).addVariableTween("Outline", gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getVariables().get("__DrawEllipseShockWave__").getChild("Outline"), (gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getStart3Outline()), (gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getEnd3Outline()), (gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getTweenName()), (gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getDuration()), true);
}
}{for(var i = 0, len = gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behaviors")).addVariableTween("Opacity", gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getVariables().get("__DrawEllipseShockWave__").getChild("Opacity"), (gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getStart5Opacity()), (gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getEnd5Opacity()), (gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getTweenName()), (gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getDuration()), false);
}
}{for(var i = 0, len = gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behaviors")).addVariableTween("Angle", gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getVariables().get("__DrawEllipseShockWave__").getChild("Angle"), (gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getStart6Angle()), (gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getEnd6Angle()), (gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getTweenName()), (gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getDuration()), false);
}
}{for(var i = 0, len = gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behaviors")).addObjectColorTween("Color", (gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getEnd4Color()), (gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getTweenName()), (gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getDuration()), false, false);
}
}{for(var i = 0, len = gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behaviors")).addVariableTween("Red", gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getVariables().get("__DrawEllipseShockWave__").getChild("Red"), gdjs.evtsExt__DrawShockWaveEffect__GetPrimaryColor.func(runtimeScene, (gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getStart4Color()), "Red", (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)), gdjs.evtsExt__DrawShockWaveEffect__GetPrimaryColor.func(runtimeScene, (gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getEnd4Color()), "Red", (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)), (gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getTweenName()), (gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getDuration()), false);
}
}{for(var i = 0, len = gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behaviors")).addVariableTween("Blue", gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getVariables().get("__DrawEllipseShockWave__").getChild("Blue"), gdjs.evtsExt__DrawShockWaveEffect__GetPrimaryColor.func(runtimeScene, (gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getStart4Color()), "Blue", (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)), gdjs.evtsExt__DrawShockWaveEffect__GetPrimaryColor.func(runtimeScene, (gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getEnd4Color()), "Blue", (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)), (gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getTweenName()), (gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getDuration()), false);
}
}{for(var i = 0, len = gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behaviors")).addVariableTween("Green", gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getVariables().get("__DrawEllipseShockWave__").getChild("Green"), gdjs.evtsExt__DrawShockWaveEffect__GetPrimaryColor.func(runtimeScene, (gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getStart4Color()), "Green", (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)), gdjs.evtsExt__DrawShockWaveEffect__GetPrimaryColor.func(runtimeScene, (gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getEnd4Color()), "Green", (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)), (gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getTweenName()), (gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._getDuration()), false);
}
}}

}


};gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.eventsList2 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].setOutlineColor((gdjs.RuntimeObject.getVariableString(gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getVariables().get("__DrawEllipseShockWave__").getChild("Red"))) + ";" + (gdjs.RuntimeObject.getVariableString(gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getVariables().get("__DrawEllipseShockWave__").getChild("Green"))) + ";" + (gdjs.RuntimeObject.getVariableString(gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getVariables().get("__DrawEllipseShockWave__").getChild("Blue"))));
}
}{for(var i = 0, len = gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].setFillOpacity(0);
}
}{for(var i = 0, len = gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].setOutlineSize(Math.floor((gdjs.RuntimeObject.getVariableNumber(gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getVariables().get("__DrawEllipseShockWave__").getChild("Outline")))));
}
}{for(var i = 0, len = gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].setOutlineOpacity((gdjs.RuntimeObject.getVariableNumber(gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getVariables().get("__DrawEllipseShockWave__").getChild("Opacity"))));
}
}{for(var i = 0, len = gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].drawEllipse(0, 0, Math.floor((gdjs.RuntimeObject.getVariableNumber(gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getVariables().get("__DrawEllipseShockWave__").getChild("Width")))), Math.floor((gdjs.RuntimeObject.getVariableNumber(gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getVariables().get("__DrawEllipseShockWave__").getChild("Height")))));
}
}{for(var i = 0, len = gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].setAngle((gdjs.RuntimeObject.getVariableNumber(gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1[i].getVariables().get("__DrawEllipseShockWave__").getChild("Angle"))));
}
}}

}


};gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.eventsList3 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.eventsList0(runtimeScene, eventsFunctionContext);
}


{


gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.eventsList1(runtimeScene, eventsFunctionContext);
}


{


gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.eventsList2(runtimeScene, eventsFunctionContext);
}


};

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEvents = function(parentEventsFunctionContext) {
this._onceTriggers.startNewFrame();
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
, "Behaviors": this._getBehaviors()
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

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.doStepPreEventsContext.eventsList3(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartColorContext = {};
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartColorContext.GDObjectObjects1= [];
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartColorContext.GDObjectObjects2= [];


gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartColorContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartColorContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartColorContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartColorContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setStart4Color((typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Color") : ""));
}
}}

}


};

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartColor = function(Color, parentEventsFunctionContext) {

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
, "Behaviors": this._getBehaviors()
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
if (argName === "Color") return Color;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartColorContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartColorContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartColorContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartWidthContext = {};
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartWidthContext.GDObjectObjects1= [];
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartWidthContext.GDObjectObjects2= [];


gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartWidthContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartWidthContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartWidthContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartWidthContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setStart1Width((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Width")) || 0 : 0));
}
}}

}


};

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartWidth = function(Width, parentEventsFunctionContext) {

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
, "Behaviors": this._getBehaviors()
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
if (argName === "Width") return Width;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartWidthContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartWidthContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartWidthContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartHeightContext = {};
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartHeightContext.GDObjectObjects1= [];
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartHeightContext.GDObjectObjects2= [];


gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartHeightContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartHeightContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartHeightContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartHeightContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setStart2Height((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Height")) || 0 : 0));
}
}}

}


};

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartHeight = function(Height, parentEventsFunctionContext) {

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
, "Behaviors": this._getBehaviors()
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
if (argName === "Height") return Height;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartHeightContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartHeightContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartHeightContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartOpacityContext = {};
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartOpacityContext.GDObjectObjects1= [];
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartOpacityContext.GDObjectObjects2= [];


gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartOpacityContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartOpacityContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartOpacityContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartOpacityContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setStart5Opacity((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Opacity")) || 0 : 0));
}
}}

}


};

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartOpacity = function(Opacity, parentEventsFunctionContext) {

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
, "Behaviors": this._getBehaviors()
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
if (argName === "Opacity") return Opacity;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartOpacityContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartOpacityContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartOpacityContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartOutlineContext = {};
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartOutlineContext.GDObjectObjects1= [];
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartOutlineContext.GDObjectObjects2= [];


gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartOutlineContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartOutlineContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartOutlineContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartOutlineContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setStart3Outline((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("outline")) || 0 : 0));
}
}}

}


};

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartOutline = function(outline, parentEventsFunctionContext) {

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
, "Behaviors": this._getBehaviors()
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
if (argName === "outline") return outline;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartOutlineContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartOutlineContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartOutlineContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartAngleContext = {};
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartAngleContext.GDObjectObjects1= [];
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartAngleContext.GDObjectObjects2= [];


gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartAngleContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartAngleContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartAngleContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartAngleContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setStart6Angle((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Angle")) || 0 : 0));
}
}}

}


};

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartAngle = function(Angle, parentEventsFunctionContext) {

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
, "Behaviors": this._getBehaviors()
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
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartAngleContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartAngleContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetStartAngleContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndColorContext = {};
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndColorContext.GDObjectObjects1= [];
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndColorContext.GDObjectObjects2= [];


gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndColorContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndColorContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndColorContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndColorContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setEnd4Color((typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Color") : ""));
}
}}

}


};

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndColor = function(Color, parentEventsFunctionContext) {

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
, "Behaviors": this._getBehaviors()
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
if (argName === "Color") return Color;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndColorContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndColorContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndColorContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndWidthContext = {};
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndWidthContext.GDObjectObjects1= [];
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndWidthContext.GDObjectObjects2= [];


gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndWidthContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndWidthContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndWidthContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndWidthContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setEnd1Width((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Width")) || 0 : 0));
}
}}

}


};

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndWidth = function(Width, parentEventsFunctionContext) {

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
, "Behaviors": this._getBehaviors()
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
if (argName === "Width") return Width;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndWidthContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndWidthContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndWidthContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndHeightContext = {};
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndHeightContext.GDObjectObjects1= [];
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndHeightContext.GDObjectObjects2= [];


gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndHeightContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = eventsFunctionContext.getOnceTriggers().triggerOnce(41921420);
}
if (isConditionTrue_0) {
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndHeightContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndHeightContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndHeightContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setEnd2Height((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Height")) || 0 : 0));
}
}}

}


};

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndHeight = function(Height, parentEventsFunctionContext) {

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
, "Behaviors": this._getBehaviors()
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
if (argName === "Height") return Height;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndHeightContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndHeightContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndHeightContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndOpacityContext = {};
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndOpacityContext.GDObjectObjects1= [];
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndOpacityContext.GDObjectObjects2= [];


gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndOpacityContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndOpacityContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndOpacityContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndOpacityContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setEnd5Opacity((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Opacity")) || 0 : 0));
}
}}

}


};

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndOpacity = function(Opacity, parentEventsFunctionContext) {

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
, "Behaviors": this._getBehaviors()
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
if (argName === "Opacity") return Opacity;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndOpacityContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndOpacityContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndOpacityContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndOutlineContext = {};
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndOutlineContext.GDObjectObjects1= [];
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndOutlineContext.GDObjectObjects2= [];


gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndOutlineContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndOutlineContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndOutlineContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndOutlineContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setEnd3Outline((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Outline")) || 0 : 0));
}
}}

}


};

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndOutline = function(Outline, parentEventsFunctionContext) {

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
, "Behaviors": this._getBehaviors()
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
if (argName === "Outline") return Outline;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndOutlineContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndOutlineContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndOutlineContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndAngleContext = {};
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndAngleContext.GDObjectObjects1= [];
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndAngleContext.GDObjectObjects2= [];


gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndAngleContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndAngleContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndAngleContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndAngleContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setEnd6Angle((typeof eventsFunctionContext !== 'undefined' ? Number(eventsFunctionContext.getArgument("Angle")) || 0 : 0));
}
}}

}


};

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndAngle = function(Angle, parentEventsFunctionContext) {

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
, "Behaviors": this._getBehaviors()
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
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndAngleContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndAngleContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.SetEndAngleContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.ChangeNameOfTweenContext = {};
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.ChangeNameOfTweenContext.GDObjectObjects1= [];
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.ChangeNameOfTweenContext.GDObjectObjects2= [];


gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.ChangeNameOfTweenContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.ChangeNameOfTweenContext.GDObjectObjects1);
{for(var i = 0, len = gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.ChangeNameOfTweenContext.GDObjectObjects1.length ;i < len;++i) {
    gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.ChangeNameOfTweenContext.GDObjectObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Behavior"))._setTweenName((typeof eventsFunctionContext !== 'undefined' ? "" + eventsFunctionContext.getArgument("Name") : ""));
}
}}

}


};

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.ChangeNameOfTween = function(Name, parentEventsFunctionContext) {

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
, "Behaviors": this._getBehaviors()
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
if (argName === "Name") return Name;
    return "";
  },
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.ChangeNameOfTweenContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.ChangeNameOfTweenContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave.prototype.ChangeNameOfTweenContext.eventsList0(runtimeScene, eventsFunctionContext);

return;
}


gdjs.registerBehavior("DrawShockWaveEffect::DrawEllipseShockWave", gdjs.evtsExt__DrawShockWaveEffect__DrawEllipseShockWave.DrawEllipseShockWave);
