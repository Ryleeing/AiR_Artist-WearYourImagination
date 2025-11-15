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
// @input SceneObject target1 {"hint":"First target for position/rotation calculation"}
// @input SceneObject target2 {"hint":"Second target for position/rotation calculation"}
// @input bool applyPosition = true {"hint":"Apply position between targets"}
// @input bool applyRotation = true {"hint":"Apply rotation between targets"}
// @input float positionBlend = 0.5 {"hint":"Position blend factor (0 = target1, 1 = target2, 0.5 = halfway)", "widget":"slider", "min":0, "max":1, "step":0.01}
// @input float rotationBlend = 0.5 {"hint":"Rotation blend factor (0 = target1, 1 = target2, 0.5 = halfway)", "widget":"slider", "min":0, "max":1, "step":0.01}
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
var Module = require("../../../../../Modules/Src/Assets/Spatialization/Scripts/InBetween");
Object.setPrototypeOf(script, Module.InBetween.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("target1", []);
    checkUndefined("target2", []);
    checkUndefined("applyPosition", []);
    checkUndefined("applyRotation", []);
    checkUndefined("positionBlend", []);
    checkUndefined("rotationBlend", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
