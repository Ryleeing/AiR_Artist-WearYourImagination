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
exports.SingleSurface = void 0;
var __selfType = requireType("./SingleSurface");
function component(target) {
    target.getTypeName = function () { return __selfType; };
    if (target.prototype.hasOwnProperty("getTypeName"))
        return;
    Object.defineProperty(target.prototype, "getTypeName", {
        value: function () { return __selfType; },
        configurable: true,
        writable: true
    });
}
const SurfaceDetector_1 = require("./SurfaceDetector");
const DRAG_THRESHOLD = 11; // Minimum distance to start drag in CM
const SPEED = 8; // Interpolation speed
let SingleSurface = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var SingleSurface = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.interactable = this.interactable;
            this.desiredPosition = vec3.zero();
            this.desiredRotation = quat.quatIdentity();
            this.useDefaultHeight = true;
            this.lastGroundHeight = 0;
            this.trans = null;
            this.cameraTransform = null;
            this.screenDistance = null;
            this.currInteractor = null;
            this.touchStartPosition = null;
            this.isDragging = false;
            this.surfaceDetector = null;
        }
        __initialize() {
            super.__initialize();
            this.interactable = this.interactable;
            this.desiredPosition = vec3.zero();
            this.desiredRotation = quat.quatIdentity();
            this.useDefaultHeight = true;
            this.lastGroundHeight = 0;
            this.trans = null;
            this.cameraTransform = null;
            this.screenDistance = null;
            this.currInteractor = null;
            this.touchStartPosition = null;
            this.isDragging = false;
            this.surfaceDetector = null;
        }
        onAwake() {
            this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
            this.surfaceDetector = this.getSceneObject()
                .getComponents("ScriptComponent")
                .find((s) => s instanceof SurfaceDetector_1.SurfaceDetector);
        }
        onStart() {
            this.interactable.onHoverEnter.add((args) => {
                this.surfaceDetector.onHoverEnter();
            });
            this.interactable.onHoverExit.add((args) => {
                this.surfaceDetector.onHoverExit();
            });
            this.interactable.onTriggerStart.add((args) => {
                this.currInteractor = args.interactor;
                this.surfaceDetector.onInteractionStart();
                this.touchStartPosition = this.desiredPosition;
                this.isDragging = false;
            });
            this.interactable.onTriggerCanceled.add((args) => {
                args.interactor.clearCurrentInteractable();
                this.currInteractor = null;
                this.surfaceDetector.onInteractionCanceled();
            });
            this.interactable.onTriggerEnd.add((args) => {
                this.currInteractor = null;
                this.surfaceDetector.onInteractionEnd();
            });
        }
        init(camTrans, transform, screenDist) {
            this.cameraTransform = camTrans;
            this.trans = transform;
            this.screenDistance = screenDist;
            this.setDefaultPose();
        }
        startCalibration() {
            this.useDefaultHeight = true;
            this.lastGroundHeight = 0;
            this.desiredPosition = vec3.zero();
            this.desiredRotation = quat.quatIdentity();
        }
        setDefaultPose() {
            this.desiredPosition = this.cameraTransform
                .getWorldPosition()
                .add(this.cameraTransform.forward.uniformScale(-this.screenDistance));
            this.desiredRotation = this.cameraTransform.getWorldRotation();
            this.trans.setWorldPosition(this.desiredPosition);
            this.trans.setWorldRotation(this.desiredRotation);
        }
        hasFoundPlane() {
            return this.currInteractor != null;
        }
        runHitTest(hitTestSession, min, max, onHitTestResult) {
            var isCapturing = getDeltaTime() < 0.001;
            if (isCapturing) {
                return;
            }
            const rayDirection = this.cameraTransform.forward;
            const camPos = this.cameraTransform.getWorldPosition();
            const rayStart = camPos.add(rayDirection.uniformScale(-min));
            const rayEnd = camPos.add(rayDirection.uniformScale(-max));
            if (hitTestSession != null) {
                hitTestSession.hitTest(rayStart, rayEnd, (hitTestResult) => {
                    onHitTestResult(hitTestResult);
                });
            }
        }
        adjustPosition() {
            //find point where camera forward intersects plane
            var planeNormal = this.desiredRotation.multiplyVec3(vec3.up().uniformScale(-1));
            var interactorDirection = this.currInteractor.endPoint
                .sub(this.currInteractor.startPoint)
                .normalize();
            var distanceToPlane = planeNormal.dot(this.desiredPosition.sub(this.currInteractor.startPoint)) / planeNormal.dot(interactorDirection);
            //what point on frozen plane is being pointed to
            var pointPos = this.currInteractor.startPoint.add(interactorDirection.uniformScale(distanceToPlane));
            var distance = pointPos.distance(this.touchStartPosition);
            if (distance > DRAG_THRESHOLD && !this.isDragging) {
                this.isDragging = true;
            }
            if (this.isDragging) {
                this.desiredPosition = pointPos;
            }
        }
        interpolatePositionVisuals() {
            this.trans.setWorldPosition(vec3.lerp(this.trans.getWorldPosition(), this.desiredPosition, getDeltaTime() * SPEED));
            this.trans.setWorldRotation(quat.slerp(this.trans.getWorldRotation(), this.desiredRotation, getDeltaTime() * SPEED));
        }
    };
    __setFunctionName(_classThis, "SingleSurface");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SingleSurface = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SingleSurface = _classThis;
})();
exports.SingleSurface = SingleSurface;
//# sourceMappingURL=SingleSurface.js.map