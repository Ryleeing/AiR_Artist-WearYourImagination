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
// @input AssignableType mlSpatializer {"hint":"Reference to the MLSpatializer component that handles ML detection"}
// @input Asset.ObjectPrefab detectionPrefab {"hint":"Object to place at detected locations"}
// @input AssignableType_1 detectButton {"hint":"Button to trigger detection on click"}
// @input float maxDetectionCount = 5 {"hint":"Maximum number of objects to detect and place", "widget":"slider", "min":1, "max":20, "step":1}
// @input float rayDistance = 200 {"hint":"Distance to project detections in world space"}
// @input AssignableType_2 pinholeCapture {"hint":"Reference to the PinholeCapture component"}
// @input bool debugLogging {"hint":"Log detection results to console"}
// @input bool enableSurfaceDetection = true {"hint":"Enable surface detection with WorldQueryModule"}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../Modules/Src/Assets/Spatialization/Scripts/WorldQueryModuleSpatializer");
Object.setPrototypeOf(script, Module.WorldQuerySpatializer.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("mlSpatializer", []);
    checkUndefined("detectionPrefab", []);
    checkUndefined("detectButton", []);
    checkUndefined("maxDetectionCount", []);
    checkUndefined("rayDistance", []);
    checkUndefined("pinholeCapture", []);
    checkUndefined("debugLogging", []);
    checkUndefined("enableSurfaceDetection", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
