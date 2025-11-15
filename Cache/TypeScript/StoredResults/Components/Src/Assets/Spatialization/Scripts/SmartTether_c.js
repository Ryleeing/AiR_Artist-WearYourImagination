if (script.onAwake) {
    script.onAwake();
    return;
}
function checkUndefined(property, showIfData) {
    for (var i = 0; i < showIfData.length; i++) {
        if (showIfData[i][0] && script[showIfData[i][0]] != showIfData[i][1]) {
            return;
        }
    }
    if (script[property] == undefined) {
        throw new Error("Input " + property + " was not provided for the object " + script.getSceneObject().name);
    }
}
// @input SceneObject target {"hint":"Override default target mainCamera"}
// @input float verticalDistanceFromTarget = 0.1 {"hint":"Minimum vertical movement to recalculate position"}
// @input float horizontalDistanceFromTarget = 0.1 {"hint":"Minimum horizontal movement to recalculate position"}
// @input bool reorientDuringTargetRotation = true {"hint":"Should the content rotate and reposition with the target"}
// @input bool flattenDuringTargetRotation = true {"hint":"Flatten Y-axis rotation during target rotation"}
// @input vec3 offset = {0,0,0} {"hint":"Offset for tethering the content in relation to the target"}
// @input vec3 offsetWithoutDetectedObject = {0,0,0} {"hint":"Offset for tethering the content in relation to the target when detected object is not present"}
// @input vec3 offsetWithDetectedObject = {0,0,0} {"hint":"Offset for tethering the content in relation to the target when detected object is present"}
// @input float lerpSpeed = 5 {"hint":"Lerp speed for smooth movement"}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../Modules/Src/Assets/Spatialization/Scripts/SmartTether");
Object.setPrototypeOf(script, Module.SmartTether.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("target", []);
    checkUndefined("verticalDistanceFromTarget", []);
    checkUndefined("horizontalDistanceFromTarget", []);
    checkUndefined("reorientDuringTargetRotation", []);
    checkUndefined("flattenDuringTargetRotation", []);
    checkUndefined("offset", []);
    checkUndefined("offsetWithoutDetectedObject", []);
    checkUndefined("offsetWithDetectedObject", []);
    checkUndefined("lerpSpeed", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
