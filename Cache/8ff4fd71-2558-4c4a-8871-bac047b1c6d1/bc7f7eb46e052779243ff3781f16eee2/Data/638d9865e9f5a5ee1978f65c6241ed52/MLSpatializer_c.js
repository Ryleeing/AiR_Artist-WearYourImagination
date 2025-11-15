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
// @input Asset.MLAsset model {"hint":"ONNX model asset"}
// @input Asset.Texture inputTexture {"hint":"Input texture for the model (Device Camera Texture)"}
// @input float maxDetectionCount = 5 {"hint":"Maximum number of objects to detect and place", "widget":"slider", "min":1, "max":20, "step":1}
// @input float detectionPersistence = 0.5 {"hint":"Time in seconds to keep detections after they disappear", "widget":"slider", "min":0, "max":5, "step":0.1}
// @input float scoreThreshold = 0.2 {"hint":"Score threshold for detections (0-1) - Lower values make it more sensitive to detections", "widget":"slider", "min":0, "max":1, "step":0.01}
// @input float iouThreshold = 0.5 {"hint":"IOU threshold for non-maximum suppression (0-1)- Non-Maximum Suppression (NMS) is a technique used in object detection to remove redundant bounding boxes for the same object. Higher threshold (e.g., 0.8-0.9): More permissive - allows more overlapping boxes to remain - Lower threshold (e.g., 0.3-0.5): More strict - removes more overlapping boxes", "widget":"slider", "min":0, "max":1, "step":0.01}
// @input string[] classLabels = {"Chair","Table","Sofa"} {"hint":"Class labels"}
// @input bool enableAllClasses = true {"hint":"Enable all classes by default"}
// @input bool enableCallbacks {"hint":"Enable callbacks for detection updates"}
// @input bool debugLogging {"hint":"Log detection results to console"}
// @input Component.Text logText {"hint":"Text component to display logs"}
// @input float centerThreshold = 0.5 {"hint":"Center threshold (0-1) - Higher values exclude more detections from edges", "widget":"slider", "min":0, "max":1, "step":0.01}
// @input AssignableType[] monitorDetectionCallbacks = {} {"hint":"Callbacks for monitor detection state changes"}
// @input string[] monitorDetectedFunctions = {} {"hint":"Callbacks for monitor detection state changes"}
// @input string[] monitorLostFunctions = {} {"hint":"Callbacks for monitor detection state changes"}
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
var Module = require("../../../../../Modules/Src/Assets/Spatialization/Scripts/MLSpatializer");
Object.setPrototypeOf(script, Module.MLSpatializer.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("model", []);
    checkUndefined("inputTexture", []);
    checkUndefined("maxDetectionCount", []);
    checkUndefined("detectionPersistence", []);
    checkUndefined("scoreThreshold", []);
    checkUndefined("iouThreshold", []);
    checkUndefined("classLabels", []);
    checkUndefined("enableAllClasses", []);
    checkUndefined("enableCallbacks", []);
    checkUndefined("debugLogging", []);
    checkUndefined("logText", []);
    checkUndefined("centerThreshold", []);
    checkUndefined("monitorDetectionCallbacks", []);
    checkUndefined("monitorDetectedFunctions", []);
    checkUndefined("monitorLostFunctions", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
