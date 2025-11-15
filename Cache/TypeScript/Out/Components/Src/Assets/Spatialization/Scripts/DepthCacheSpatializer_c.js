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
// @input SceneObject camera {"hint":"The camera that will be used for distance spatialization"}
// @input AssignableType debugVisualizer {"hint":"The debug visualizer that will be used to visualize the camera frame and depth points"}
// @input AssignableType_1 depthCache {"hint":"The depth cache that will be used to store and retrieve depth frames"}
// @input Asset.ObjectPrefab depthPrefab {"hint":"The prefab that will be instantiated for each detected object"}
// @input AssignableType_2 testButton {"hint":"The button that will trigger the update position function"}
// @input AssignableType_3 mlSpatializer {"hint":"The spatializer that will be used for ML spatialization and coordinate conversion"}
// @input bool debug = true {"hint":"The button that will trigger the update position function"}
// @input bool enableContinuousUpdate {"hint":"Enable automatic position updates"}
// @input float continuousUpdateInterval = 5 {"hint":"Interval in seconds between automatic position updates"}
// @input float maxDetections = 3 {"hint":"Maximum number of detections to render (1-5)"}
// @input float boundingBoxScale = 1 {"hint":"Scale factor for bounding box vertices (0-1, 0=center point, 1=full bbox)"}
// @input float positionUpdateThreshold = 30 {"hint":"Minimum position change in cm to trigger update"}
// @input float maxCameraRotationSpeed = 90 {"hint":"Maximum camera rotation speed (degrees/second) before skipping updates"}
// @input float maxCameraMovementSpeed = 100 {"hint":"Maximum camera movement speed (cm/second) before skipping updates"}
// @input float vertexUpdateThreshold = 20 {"hint":"Minimum vertex change in cm to trigger vertex update"}
// @input float stableFramesRequired = 2 {"hint":"Number of stable frames required before considering detection persistent"}
// @input bool enableStaticScene = true {"hint":"Enable static scene mode with pre-instantiated prefabs and smooth repositioning instead of clean up and re-instantiation"}
// @input float lerpDuration = 0.3 {"hint":"Smooth lerp duration in seconds for position transitions"}
// @input float vertexLerpDuration = 0.2 {"hint":"Smooth lerp duration in seconds for vertex transitions"}
// @input bool enableRotationLerp = true {"hint":"Enable smooth rotation lerping for detection objects"}
// @input float rotationLerpDuration = 0.4 {"hint":"Smooth lerp duration in seconds for rotation transitions"}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../Modules/Src/Assets/Spatialization/Scripts/DepthCacheSpatializer");
Object.setPrototypeOf(script, Module.DepthSpatializer.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("enableContinuousUpdate", []);
    checkUndefined("continuousUpdateInterval", []);
    checkUndefined("maxDetections", []);
    checkUndefined("boundingBoxScale", []);
    checkUndefined("positionUpdateThreshold", []);
    checkUndefined("maxCameraRotationSpeed", []);
    checkUndefined("maxCameraMovementSpeed", []);
    checkUndefined("vertexUpdateThreshold", []);
    checkUndefined("stableFramesRequired", []);
    checkUndefined("enableStaticScene", []);
    checkUndefined("lerpDuration", []);
    checkUndefined("vertexLerpDuration", []);
    checkUndefined("enableRotationLerp", []);
    checkUndefined("rotationLerpDuration", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
