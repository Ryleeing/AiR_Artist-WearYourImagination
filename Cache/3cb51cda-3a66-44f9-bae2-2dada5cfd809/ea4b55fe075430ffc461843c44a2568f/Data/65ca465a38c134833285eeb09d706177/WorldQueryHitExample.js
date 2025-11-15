"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewScript = void 0;
var __selfType = requireType("./WorldQueryHitExample");
function component(target) { target.getTypeName = function () { return __selfType; }; }
// import required modules
const WorldQueryModule = require("LensStudio:WorldQueryModule");
const SIK = require("SpectaclesInteractionKit.lspkg/SIK").SIK;
const InteractorTriggerType = require("SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor").InteractorTriggerType;
const EPSILON = 0.01;
let NewScript = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var NewScript = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.indexToSpawn = this.indexToSpawn;
            this.targetObject = this.targetObject;
            this.objectsToSpawn = this.objectsToSpawn;
            this.filterEnabled = this.filterEnabled;
        }
        __initialize() {
            super.__initialize();
            this.indexToSpawn = this.indexToSpawn;
            this.targetObject = this.targetObject;
            this.objectsToSpawn = this.objectsToSpawn;
            this.filterEnabled = this.filterEnabled;
        }
        onAwake() {
            // create new hit session
            this.hitTestSession = this.createHitTestSession(this.filterEnabled);
            if (!this.sceneObject) {
                print("Please set Target Object input");
                return;
            }
            this.transform = this.targetObject.getTransform();
            // disable target object when surface is not detected
            this.targetObject.enabled = false;
            this.setObjectEnabled(this.indexToSpawn);
            // create update event
            this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
        }
        createHitTestSession(filterEnabled) {
            // create hit test session with options
            var options = HitTestSessionOptions.create();
            options.filter = filterEnabled;
            var session = WorldQueryModule.createHitTestSessionWithOptions(options);
            return session;
        }
        onHitTestResult(results) {
            if (results === null) {
                this.targetObject.enabled = false;
            }
            else {
                this.targetObject.enabled = true;
                // get hit information
                const hitPosition = results.position;
                const hitNormal = results.normal;
                //identifying the direction the object should look at based on the normal of the hit location.
                var lookDirection;
                if (1 - Math.abs(hitNormal.normalize().dot(vec3.up())) < EPSILON) {
                    lookDirection = vec3.forward();
                }
                else {
                    lookDirection = hitNormal.cross(vec3.up());
                }
                const toRotation = quat.lookAt(lookDirection, hitNormal);
                //set position and rotation
                this.targetObject.getTransform().setWorldPosition(hitPosition);
                this.targetObject.getTransform().setWorldRotation(toRotation);
                if (this.primaryInteractor.previousTrigger !== InteractorTriggerType.None &&
                    this.primaryInteractor.currentTrigger === InteractorTriggerType.None) {
                    // Called when a trigger ends
                    // Copy the plane/axis object
                    let parent = this.objectsToSpawn[this.indexToSpawn].getParent();
                    let newObject = parent.copyWholeHierarchy(this.objectsToSpawn[this.indexToSpawn]);
                    newObject.setParentPreserveWorldTransform(null);
                }
            }
        }
        onUpdate() {
            this.primaryInteractor = SIK.InteractionManager.getTargetingInteractors().shift();
            if (this.primaryInteractor &&
                this.primaryInteractor.isActive() &&
                this.primaryInteractor.isTargeting()) {
                const rayStartOffset = new vec3(this.primaryInteractor.startPoint.x, this.primaryInteractor.startPoint.y, this.primaryInteractor.startPoint.z + 30);
                const rayStart = rayStartOffset;
                const rayEnd = this.primaryInteractor.endPoint;
                this.hitTestSession.hitTest(rayStart, rayEnd, this.onHitTestResult.bind(this));
            }
            else {
                this.targetObject.enabled = false;
            }
        }
        setObjectIndex(i) {
            this.indexToSpawn = i;
        }
        setObjectEnabled(i) {
            for (let i = 0; i < this.objectsToSpawn.length; i++)
                this.objectsToSpawn[i].enabled = i == this.indexToSpawn;
        }
    };
    __setFunctionName(_classThis, "NewScript");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        NewScript = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return NewScript = _classThis;
})();
exports.NewScript = NewScript;
//# sourceMappingURL=WorldQueryHitExample.js.map