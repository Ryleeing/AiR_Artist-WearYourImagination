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
exports.Horizontal = void 0;
var __selfType = requireType("./Horizontal");
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
const MAX_HIT_DISTANCE = 500; //max is 1000
const MIN_HIT_DISTANCE = 20;
const DEFAULT_SCREEN_DISTANCE = 300; // Distance in cm from camera to visual when no surface is hit
const DEFAULT_GROUND_DISTANCE = 100;
let Horizontal = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = SurfaceDetector_1.SurfaceDetector;
    var Horizontal = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.screenTextObj = this.screenTextObj;
            this.screenTextTrans = null;
        }
        __initialize() {
            super.__initialize();
            this.screenTextObj = this.screenTextObj;
            this.screenTextTrans = null;
        }
        onAwake() {
            super.onAwake();
            this.singleSurface = this.getSceneObject().getComponent(SingleSurface_1.SingleSurface.getTypeName());
            this.screenTextTrans = this.screenTextObj.getTransform();
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
            this.circleAnim.setLoadingColor(true);
            this.circleAnim.animateCircleIn(null);
            this.circleAnim.enableScanAnimation(true);
        }
        onInteractionStart() {
            if (!this.isCalibrationRunning) {
                return;
            }
            super.onInteractionStart();
            this.circleAnim.animateCircleOut(null);
            this.circleAnim.enableScanAnimation(false);
            this.handHintController.disableHint();
        }
        onInteractionEnd() {
            if (!this.isCalibrationRunning) {
                return;
            }
            super.onInteractionEnd();
            if (this.hitTestSession != null && super.isLookingAtCalibrationIcon()) {
                this.startCalibrationComplete();
            }
            else {
                this.onInteractionCanceled();
            }
        }
        startSurfaceCalibration(callback) {
            this.handHintController.disableHint();
            super.startSurfaceCalibration(callback);
            this.startHitTestSession();
            this.singleSurface.startCalibration();
            this.circleAnim.setLoadingColor(true);
            this.circleAnim.enableScanAnimation(true);
            this.handHintController.enableHint(this.hintAnchor.getTransform());
            this.playHandHint(this.isMobileConnected());
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
            this.playHandHint(isConnected);
        }
        startCalibrationComplete() {
            super.onCalibrationComplete(this.invokeCalibrationComplete);
        }
        invokeCalibrationComplete() {
            this.onCompleteCallback(this.singleSurface.desiredPosition, this.singleSurface.desiredRotation);
        }
        update() {
            super.update();
            if (this.singleSurface.hasFoundPlane()) {
                this.singleSurface.adjustPosition();
            }
            else {
                this.singleSurface.runHitTest(this.hitTestSession, MIN_HIT_DISTANCE, MAX_HIT_DISTANCE, this.onHitTestResult.bind(this));
            }
            this.faceCamera();
            this.singleSurface.interpolatePositionVisuals();
            //keep screen text at same height as camera
            var worldTextPos = this.screenTextObj
                .getParent()
                .getTransform()
                .getWorldTransform()
                .multiplyPoint(new vec3(0, 8, 0));
            worldTextPos.y = this.cameraTransform.getWorldPosition().y;
            //make sure text stays above ground visual
            worldTextPos.y = Math.max(worldTextPos.y, this.singleSurface.lastGroundHeight + 50);
            this.screenTextTrans.setWorldPosition(worldTextPos);
        }
        onHitTestResult(hitTestResult) {
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
            //check if horizontal plane is being tracked
            var foundHorizontalPlane = foundNormal.y > 0.95;
            if (foundHorizontalPlane) {
                this.singleSurface.useDefaultHeight = false;
                this.singleSurface.lastGroundHeight = foundPosition.y;
                this.singleSurface.desiredPosition = foundPosition;
            }
            else {
                var worldCameraForward = this.cameraTransform.right
                    .cross(vec3.up())
                    .normalize();
                this.singleSurface.desiredPosition = camPos.add(worldCameraForward.uniformScale(-DEFAULT_SCREEN_DISTANCE));
                this.singleSurface.desiredPosition =
                    this.singleSurface.desiredPosition.add(vec3.up().uniformScale(-DEFAULT_GROUND_DISTANCE));
            }
            var isGroundHeightLower = this.singleSurface.lastGroundHeight < foundPosition.y;
            this.singleSurface.desiredPosition.y =
                this.singleSurface.useDefaultHeight || !isGroundHeightLower
                    ? this.singleSurface.desiredPosition.y
                    : this.singleSurface.lastGroundHeight;
        }
        faceCamera() {
            var worldCameraForward = this.cameraTransform.right
                .cross(vec3.up())
                .normalize();
            this.singleSurface.desiredRotation = quat.lookAt(worldCameraForward, vec3.up());
        }
    };
    __setFunctionName(_classThis, "Horizontal");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Horizontal = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Horizontal = _classThis;
})();
exports.Horizontal = Horizontal;
//# sourceMappingURL=Horizontal.js.map