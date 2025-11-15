declare namespace global {
    let behaviorSystem: BehaviorSystem;
}

@typedef
export class CustomFunctions {
    @input
    script: ScriptComponent;

    @input
    function: string;
}

export enum CallbackType {
    None,
    Behavior,
    BehaviorCustom,
    CustomFunction
}

interface CallbackData {
    name: string
    type: CallbackType,
    behaviorScripts: BehaviorScript[],
    behaviorSystemTriggers: string[],
    scriptFunctions: CustomFunctions[]
}

export interface BehaviorScript {
    trigger: () => void;
}

export class EventCallbacks {

    static invokeCallbackFromInputs(callbackData: CallbackData): (data: any) => void {
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

    private static invokeCallbackFromBehavior(behaviors: BehaviorScript[], eventName: string): (data: any) => void {
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

    private static invokeCallbackFromBehaviorSystem(triggerNames: string[], eventName: string): (data: any) => void {
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

    private static invokeCallbackFromScriptAPI(listeners: CustomFunctions[], eventName: string): (data: any) => void {
        return (eventData: any) => {
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
