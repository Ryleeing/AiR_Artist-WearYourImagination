if (script.onAwake) {
    script.onAwake();
    return;
}
/*
@typedef CustomFunctions
@property {Component.ScriptComponent} script
@property {string} function
*/
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
// @input bool editDebugSettings
// @ui {"widget":"group_start", "label":"Debug Statements", "showIf":"editDebugSettings"}
// @input bool printDebugStatements = "false" {"label":"Print Info"}
// @input bool printWarningStatements = "true" {"label":"Print Warnings"}
// @ui {"widget":"group_end"}
// @ui {"widget":"separator"}
// @input bool interactable = "true"
// @input bool blockTouches = "true" {"label":"Block System Swipe", "hint":"Blocks Snapchat's default swipe and pan behaviours."}
// @ui {"widget":"separator"}
// @input int renderOrder
// @ui {"widget":"separator"}
// @input int orientation {"widget":"combobox", "values":[{"label":"Horizontal", "value":0}, {"label":"Vertical", "value":1}]}
// @input float startValue = "0.0"
// @input float endValue = "1.0"
// @input float startSliderValue = "0.5" {"label":"Initial Value"}
// @ui {"widget":"separator"}
// @input bool stepEnabled {"label":"Step"}
// @input float stepValue {"label":"Step", "showIf":"stepEnabled"}
// @input Asset.ObjectPrefab prefabSlider
// @ui {"widget":"separator"}
// @input bool counterEnabled {"label":"Counter"}
// @input int fractionDigits {"showIf":"counterEnabled"}
// @ui {"widget":"separator"}
// @input bool trackBar
// @input vec3 _trackBarColor = "{1.0, 1.0, 0.0}" {"label":"Color", "widget":"color", "showIf":"trackBar"}
// @ui {"widget":"separator"}
// @input bool eventCallbacks
// @ui {"widget":"group_start", "label":"Event Callbacks", "showIf":"eventCallbacks"}
// @input int callbackType = "0" {"widget":"combobox", "values":[{"label":"None", "value":0}, {"label":"Behavior Script", "value":1}, {"label":"Behavior Custom", "value":2}, {"label":"Custom Function", "value":3}]}
// @input Component.ScriptComponent[] onValueChangedBehaviors {"showIf":"callbackType", "showIfValue":1}
// @input string[] onValueChangedCustomTriggers {"showIf":"callbackType", "showIfValue":2}
// @input CustomFunctions[] onValueChangedFunctions {"showIf":"callbackType", "showIfValue":3}
// @ui {"widget":"group_end"}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../Modules/Src/Packages/Slider.lsc/Slider");
Object.setPrototypeOf(script, Module.Slider.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("editDebugSettings", []);
    checkUndefined("printDebugStatements", [["editDebugSettings",true]]);
    checkUndefined("printWarningStatements", [["editDebugSettings",true]]);
    checkUndefined("interactable", []);
    checkUndefined("blockTouches", []);
    checkUndefined("renderOrder", []);
    checkUndefined("orientation", []);
    checkUndefined("startValue", []);
    checkUndefined("endValue", []);
    checkUndefined("startSliderValue", []);
    checkUndefined("stepEnabled", []);
    checkUndefined("stepValue", [["stepEnabled",true]]);
    checkUndefined("prefabSlider", []);
    checkUndefined("counterEnabled", []);
    checkUndefined("fractionDigits", [["counterEnabled",true]]);
    checkUndefined("trackBar", []);
    checkUndefined("_trackBarColor", [["trackBar",true]]);
    checkUndefined("eventCallbacks", []);
    checkUndefined("callbackType", [["eventCallbacks",true]]);
    checkUndefined("onValueChangedBehaviors", [["eventCallbacks",true],["callbackType",1]]);
    checkUndefined("onValueChangedCustomTriggers", [["eventCallbacks",true],["callbackType",2]]);
    if (script.onAwake) {
       script.onAwake();
    }
});
