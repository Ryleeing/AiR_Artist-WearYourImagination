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
exports.Vertical = void 0;
var __selfType = requireType("./Vertical");
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
const SurfaceDetector_1 = require("../Scripts/SurfaceDetector");
const SingleSurface_1 = require("../Scripts/SingleSurface");
// Set min and max hit distance to surfaces
const MAX_HIT_DISTANCE = 1000;
const MIN_HIT_DISTANCE = 50;
const STATE_SWITCH_THRESHOLD = 15; // Number of frames to switch default pose and surface pose (so it doesnt flicker)
const DEFAULT_SCREEN_DISTANCE = 200; // Distance in cm from camera to visual when no surface is hit
let Vertical = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = SurfaceDetector_1.SurfaceDetector;
    var Vertical = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.step1 = this.step1;
            this.step2 = this.step2;
            this.currStateCount = 0;
            this.currSurfaceDetected = false;
        }
        __initialize() {
            super.__initialize();
            this.step1 = this.step1;
            this.step2 = this.step2;
            this.currStateCount = 0;
            this.currSurfaceDetected = false;
        }
        onAwake() {
            super.onAwake();
            this.singleSurface = this.getSceneObject().getComponent(SingleSurface_1.SingleSurface.getTypeName());
        }
        init(handHints) {
            super.init(handHints);
            this.singleSurface.init(this.cameraTransform, this.trans, DEFAULT_SCREEN_DISTANCE);
        }
        onHoverEnter() {
            if (!this.isCalibrationRunning) {
                return;
            }
            super.onHoverEnter();
            this.circleAnim.setLoadingColor(false);
        }
        onHoverExit() {
            if (!this.isCalibrationRunning) {
                return;
            }
            super.onHoverExit();
            this.circleAnim.setLoadingColor(true);
        }
        onInteractionCanceled() {
            super.onInteractionCanceled();
            this.circleAnim.animateCircleIn(null);
            this.circleAnim.setLoadingColor(true);
            this.circleAnim.enableScanAnimation(true);
        }
        onInteractionStart() {
            if (!this.isCalibrationRunning) {
                return;
            }
            super.onInteractionStart();
            if (this.step1.enabled) {
                return;
            }
            this.circleAnim.animateCircleOut(null);
            this.circleAnim.enableScanAnimation(false);
            this.handHintController.disableHint();
        }
        onInteractionEnd() {
            if (!this.isCalibrationRunning) {
                return;
            }
            super.onInteractionEnd();
            if (this.hitTestSession != null &&
                this.step2.enabled &&
                super.isLookingAtCalibrationIcon()) {
                this.startCalibrationComplete();
            }
            else {
                this.onInteractionCanceled();
            }
        }
        playHandHint(isMobile) {
            if (isMobile) {
                this.handHintController.playMobileTap();
                this.hintAnchor
                    .getTransform()
                    .setLocalRotation(quat.fromEulerVec(new vec3(-30 * MathUtils.DegToRad, 0, 0)));
            }
            else {
                this.handHintController.playFarPinch();
                this.hintAnchor
                    .getTransform()
                    .setLocalRotation(quat.fromEulerVec(vec3.zero()));
            }
        }
        onMobileConnnectionStateChange(isConnected) {
            super.onMobileConnnectionStateChange(isConnected);
        }
        setCircleColor(isTracking) {
            var dotColor = isTracking ? new vec4(1, 1, 0, 1) : new vec4(1, 1, 1, 1);
            this.circleAnim.setCircleColor(dotColor);
            this.circleAnim.enableScanAnimation(isTracking);
        }
        startCalibrationComplete() {
            this.isCalibrationRunning = false;
            super.onCalibrationComplete(this.invokeCalibrationComplete.bind(this));
        }
        invokeCalibrationComplete() {
            this.onCompleteCallback(this.singleSurface.desiredPosition, this.singleSurface.desiredRotation);
        }
        startSurfaceCalibration(callback) {
            this.handHintController.disableHint();
            this.enableStep1(true);
            this.currSurfaceDetected = false;
            this.isCalibrationRunning = true;
            super.startSurfaceCalibration(callback);
            this.startHitTestSession();
            this.singleSurface.startCalibration();
            this.circleAnim.setLoadingColor(true);
        }
        update() {
            super.update();
            if (!this.isCalibrationRunning) {
                return;
            }
            if (this.singleSurface.hasFoundPlane()) {
                this.singleSurface.adjustPosition();
            }
            else {
                this.singleSurface.runHitTest(this.hitTestSession, MIN_HIT_DISTANCE, MAX_HIT_DISTANCE, this.onHitTestResult.bind(this));
            }
            this.singleSurface.interpolatePositionVisuals();
        }
        enableStep1(enabled) {
            this.step1.enabled = enabled;
            this.step2.enabled = !enabled;
            this.setCircleColor(!enabled);
            this.circleAnim.getSceneObject().getComponent("ColliderComponent").enabled =
                !enabled;
            if (!enabled) {
                this.handHintController.enableHint(this.hintAnchor.getTransform());
                this.playHandHint(this.isMobileConnected());
            }
            else {
                this.handHintController.disableHint();
            }
        }
        onHitTestResult(hitTestResult) {
            if (!this.isCalibrationRunning || this.singleSurface.hasFoundPlane()) {
                return;
            }
            let foundPosition = vec3.zero();
            let foundNormal = vec3.zero();
            if (hitTestResult != null) {
                foundPosition = hitTestResult.position;
                foundNormal = hitTestResult.normal;
            }
            this.updateCalibration(foundPosition, foundNormal);
        }
        updateCalibration(foundPosition, foundNormal) {
            var camPos = this.cameraTransform.getWorldPosition();
            this.singleSurface.desiredPosition = camPos.add(this.cameraTransform.forward.uniformScale(-DEFAULT_SCREEN_DISTANCE));
            this.singleSurface.desiredRotation = quat.lookAt(this.cameraTransform.forward, vec3.up());
            //check if vertical plane is being tracking
            var foundVerticalPlane = Math.abs(foundNormal.y) < 0.15 && Math.abs(foundNormal.y) > 0.0001;
            //check for state change
            if (this.currSurfaceDetected != foundVerticalPlane) {
                this.currStateCount = 0;
            }
            foundVerticalPlane ? this.currStateCount++ : this.currStateCount--;
            //set UI based on current state
            if (Math.abs(this.currStateCount) > STATE_SWITCH_THRESHOLD) {
                foundVerticalPlane = this.currStateCount > 0;
                if (foundVerticalPlane != this.step2.enabled) {
                    this.enableStep1(!foundVerticalPlane);
                }
            }
            this.currSurfaceDetected = foundVerticalPlane;
            if (this.step2.enabled) {
                this.singleSurface.useDefaultHeight = false;
                this.singleSurface.desiredPosition = foundPosition;
                //make sure this is perpendicular to vec3.up()
                var projectedNormal = new vec3(foundNormal.x, 0.0, foundNormal.z);
                this.singleSurface.desiredRotation = quat.lookAt(projectedNormal.normalize(), vec3.up());
            }
            this.singleSurface.desiredRotation =
                this.singleSurface.desiredRotation.multiply(quat.fromEulerVec(new vec3(Math.PI / 2, 0, 0)));
        }
    };
    __setFunctionName(_classThis, "Vertical");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Vertical = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Vertical = _classThis;
})();
exports.Vertical = Vertical;
//# sourceMappingURL=Vertical.js.map