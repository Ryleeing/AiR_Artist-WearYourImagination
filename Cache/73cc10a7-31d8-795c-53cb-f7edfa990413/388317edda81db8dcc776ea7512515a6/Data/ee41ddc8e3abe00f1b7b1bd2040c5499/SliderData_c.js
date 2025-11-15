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
// @input SceneObject backgroundSO
// @input SceneObject touchZoneSO
// @input SceneObject spareTouchZoneSO
// @input SceneObject buttonSO
// @input SceneObject counterSO
// @input Component.ScriptComponent sliderAspectRatioSetter
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../../../Modules/Src/Packages/Slider.lsc/Slider Prefab/Resources/Scripts/SliderData");
Object.setPrototypeOf(script, Module.SliderData.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("backgroundSO", []);
    checkUndefined("touchZoneSO", []);
    checkUndefined("spareTouchZoneSO", []);
    checkUndefined("buttonSO", []);
    checkUndefined("counterSO", []);
    checkUndefined("sliderAspectRatioSetter", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
