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
// @input SceneObject targetObject {"label":"Target Object"}
// @input AssignableType slider {"label":"Slider"}
// @input float sliderMinValue = "0.0" {"label":"Slider Min Value"}
// @input float sliderMaxValue = "1.0" {"label":"Slider Max Value"}
// @input float minScale = "0.1" {"label":"Min Scale"}
// @input float maxScale = "2.0" {"label":"Max Scale"}
// @input bool uniformScale = "true" {"label":"Uniform Scale"}
// @input vec3 scaleAxis = "{1.0, 1.0, 1.0}" {"label":"Scale Axis", "showIf":"uniformScale", "showIfValue":false}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../Modules/Src/Assets/SliderSizeController");
Object.setPrototypeOf(script, Module.SliderSizeController.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("targetObject", []);
    checkUndefined("slider", []);
    checkUndefined("sliderMinValue", []);
    checkUndefined("sliderMaxValue", []);
    checkUndefined("minScale", []);
    checkUndefined("maxScale", []);
    checkUndefined("uniformScale", []);
    checkUndefined("scaleAxis", [["uniformScale",false]]);
    if (script.onAwake) {
       script.onAwake();
    }
});
