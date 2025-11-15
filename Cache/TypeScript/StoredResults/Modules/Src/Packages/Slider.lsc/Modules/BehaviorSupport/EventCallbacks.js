"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventCallbacks = exports.CallbackType = exports.CustomFunctions = void 0;
class CustomFunctions {
}
exports.CustomFunctions = CustomFunctions;
var CallbackType;
(function (CallbackType) {
    CallbackType[CallbackType["None"] = 0] = "None";
    CallbackType[CallbackType["Behavior"] = 1] = "Behavior";
    CallbackType[CallbackType["BehaviorCustom"] = 2] = "BehaviorCustom";
    CallbackType[CallbackType["CustomFunction"] = 3] = "CustomFunction";
})(CallbackType || (exports.CallbackType = CallbackType = {}));
class EventCallbacks {
    static invokeCallbackFromInputs(callbackData) {
        if (isNull(callbackData.type)) {
            print("Warning: Wrong Callback Type input.");
        }
        switch (callbackData.type) {
            case CallbackType.Behavior:
                return EventCallbacks.invokeCallbackFromBehavior(callbackData.behaviorScripts, callbackData.name);
            case CallbackType.BehaviorCustom:
                return EventCallbacks.invokeCallbackFromBehaviorSystem(callbackData.behaviorSystemTriggers, callbackData.name);
            case CallbackType.CustomFunction:
                return EventCallbacks.invokeCallbackFromScriptAPI(callbackData.scriptFunctions, callbackData.name);
        }
    }
    static invokeCallbackFromBehavior(behaviors, eventName) {
        return () => {
            if (!behaviors) {
                print("Warning: No event with name: " + eventName);
                return;
            }
            for (const behavior of behaviors) {
                behavior?.trigger?.();
            }
        };
    }
    static invokeCallbackFromBehaviorSystem(triggerNames, eventName) {
        return () => {
            if (!global.behaviorSystem) {
                print("The global behavior system has not been instantiated yet! Make sure a Behavior script is present somewhere!");
                return;
            }
            for (const triggerName of triggerNames) {
                if (triggerName.length == 0) {
                    print("You are trying to send an empty string custom trigger for the event: " + eventName);
                    continue;
                }
                global.behaviorSystem.sendCustomTrigger(triggerName);
            }
        };
    }
    static invokeCallbackFromScriptAPI(listeners, eventName) {
        return (eventData) => {
            if (!listeners) {
                return;
            }
            for (const listener of listeners) {
                if (listener.function.length == 0) {
                    print("You are trying to invoke an empty string function for the event: " + eventName);
                    continue;
                }
                if (!listener.script[listener.function]) {
                    print("Cannot find the " + listener.function + " function in the assigned " + listener.script +
                        " script for the event: " + eventName);
                    continue;
                }
                listener.script[listener.function](eventData);
            }
        };
    }
}
exports.EventCallbacks = EventCallbacks;
//# sourceMappingURL=EventCallbacks.js.map