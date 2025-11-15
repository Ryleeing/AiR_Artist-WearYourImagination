if (script.onAwake) {
	script.onAwake();
	return;
};
function checkUndefined(property, showIfData){
   for (var i = 0; i < showIfData.length; i++){
       if (showIfData[i][0] && script[showIfData[i][0]] != showIfData[i][1]){
           return;
       }
   }
   if (script[property] == undefined){
      throw new Error('Input ' + property + ' was not provided for the object ' + script.getSceneObject().name);
   }
}
// @input SceneObject target {"hint":"Override default target mainCamera"}
// @input vec3 positionOffset = {0,0,0} {"hint":"Position offset for matching the target's position"}
// @input bool usePositionLerp = true {"hint":"Use lerping for smooth position transitions"}
// @input float positionLerpSpeed = 1 {"hint":"Speed for moving towards the target's position (when lerping is enabled)"}
// @input float rotationLerpSpeed = 1 {"hint":"Speed for rotating towards the target's rotation"}
// @input float scaleLerpSpeed = 1 {"hint":"Speed for scaling towards the target's scale"}
// @input bool constrainPositionX {"hint":"Toggle to constrain movement on specific axes"}
// @input bool constrainPositionY
// @input bool constrainPositionZ
// @input bool constrainRotationX {"hint":"Toggle to constrain rotation on specific axes"}
// @input bool constrainRotationY
// @input bool constrainRotationZ
// @input bool constrainScaleX {"hint":"Toggle to constrain scaling on specific axes"}
// @input bool constrainScaleY
// @input bool constrainScaleZ
var scriptPrototype = Object.getPrototypeOf(script);
if (!global.BaseScriptComponent){
   function BaseScriptComponent(){}
   global.BaseScriptComponent = BaseScriptComponent;
   global.BaseScriptComponent.prototype = scriptPrototype;
   global.BaseScriptComponent.prototype.__initialize = function(){};
   global.BaseScriptComponent.getTypeName = function(){
       throw new Error("Cannot get type name from the class, not decorated with @component");
   }
}
var Module = require("../../../../../Modules/Src/Assets/Spatialization/Scripts/MatchTransform");
Object.setPrototypeOf(script, Module.MatchTransformTS.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("target", []);
    checkUndefined("positionOffset", []);
    checkUndefined("usePositionLerp", []);
    checkUndefined("positionLerpSpeed", []);
    checkUndefined("rotationLerpSpeed", []);
    checkUndefined("scaleLerpSpeed", []);
    checkUndefined("constrainPositionX", []);
    checkUndefined("constrainPositionY", []);
    checkUndefined("constrainPositionZ", []);
    checkUndefined("constrainRotationX", []);
    checkUndefined("constrainRotationY", []);
    checkUndefined("constrainRotationZ", []);
    checkUndefined("constrainScaleX", []);
    checkUndefined("constrainScaleY", []);
    checkUndefined("constrainScaleZ", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
