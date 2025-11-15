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
exports.SurfaceDetector = void 0;
var __selfType = requireType("./SurfaceDetector");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const animate_1 = require("SpectaclesInteractionKit.lspkg/Utils/animate");
const SIK_1 = require("SpectaclesInteractionKit.lspkg/SIK");
const WorldCameraFinderProvider_1 = require("SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider");
let SurfaceDetector = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var SurfaceDetector = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.circleAnim = this.circleAnim;
            this.hintAnchor = this.hintAnchor;
            this.confirmText = this.confirmText;
            this.cameraTransform = WorldCameraFinderProvider_1.default.getInstance().getTransform();
            this.hitTestSession = null;
            this.onCompleteCallback = null;
            this.onAnimCompleteCallback = null;
            this.trans = this.getSceneObject().getTransform();
            this.updateEvent = null;
            this.worldQueryModule = null;
            this.visualParentTrans = this.getSceneObject().getChild(0).getTransform();
            this.animCancel = new animate_1.CancelSet();
            this.iconTrans = null;
            this.mobileConnected = false;
            this.isCalibrationRunning = false;
            this.handHintController = null;
        }
        __initialize() {
            super.__initialize();
            this.circleAnim = this.circleAnim;
            this.hintAnchor = this.hintAnchor;
            this.confirmText = this.confirmText;
            this.cameraTransform = WorldCameraFinderProvider_1.default.getInstance().getTransform();
            this.hitTestSession = null;
            this.onCompleteCallback = null;
            this.onAnimCompleteCallback = null;
            this.trans = this.getSceneObject().getTransform();
            this.updateEvent = null;
            this.worldQueryModule = null;
            this.visualParentTrans = this.getSceneObject().getChild(0).getTransform();
            this.animCancel = new animate_1.CancelSet();
            this.iconTrans = null;
            this.mobileConnected = false;
            this.isCalibrationRunning = false;
            this.handHintController = null;
        }
        onAwake() {
            this.visualParentTrans.setLocalScale(vec3.zero());
            this.iconTrans = this.circleAnim.getSceneObject().getTransform();
        }
        init(handHints) {
            this.handHintController = handHints;
            this.onMobileConnnectionStateChange(this.isMobileConnected());
        }
        onDestroy() {
            print("SurfaceDetector destroyed");
            if (this.hitTestSession != null) {
                this.hitTestSession.stop();
                this.hitTestSession = null;
            }
            if (this.updateEvent != null) {
                this.removeEvent(this.updateEvent);
                this.updateEvent = null;
            }
            if (this.animCancel)
                this.animCancel.cancel();
        }
        startSurfaceCalibration(callback) {
            this.isCalibrationRunning = true;
            this.circleAnim.reset();
            this.animateVisuals(true, null);
            this.onCompleteCallback = callback;
            this.updateEvent = this.createEvent("UpdateEvent");
            this.updateEvent.bind(this.update.bind(this));
        }
        onHoverEnter() {
            //change instruction text
            if (this.confirmText != null) {
                this.confirmText.text = "Drag to Move";
            }
        }
        onHoverExit() {
            //change instruction text
            if (this.confirmText != null && this.isCalibrationRunning) {
                this.confirmText.text = this.isMobileConnected()
                    ? "Tap to Confirm"
                    : "Pinch to Confirm";
            }
        }
        onInteractionCanceled() { }
        onInteractionStart() { }
        onInteractionEnd() { }
        isLookingAtCalibrationIcon() {
            var camComp = this.cameraTransform.getSceneObject().getComponent("Camera");
            return camComp.isSphereVisible(this.iconTrans.getWorldPosition(), 10);
        }
        animateVisuals(animateIn, callback) {
            if (this.animCancel)
                this.animCancel.cancel();
            var start = animateIn ? vec3.zero() : vec3.one();
            var end = animateIn ? vec3.one() : vec3.zero();
            const easingType = animateIn
                ? "ease-out-cubic"
                : "ease-in-cubic";
            (0, animate_1.default)({
                easing: easingType,
                duration: 0.5,
                update: (t) => {
                    this.visualParentTrans.setLocalScale(vec3.lerp(start, end, t));
                },
                ended: callback,
                cancelSet: this.animCancel,
            });
        }
        startHitTestSession() {
            try {
                this.worldQueryModule =
                    require("LensStudio:WorldQueryModule");
                const options = HitTestSessionOptions.create();
                options.filter = true;
                this.hitTestSession =
                    this.worldQueryModule.createHitTestSessionWithOptions(options);
                this.hitTestSession.start();
            }
            catch (e) {
                print("Hit test error: " + e);
            }
        }
        onMobileConnnectionStateChange(isConnected) {
            //change instruction text
            if (this.confirmText != null) {
                this.confirmText.text = isConnected
                    ? "Tap to Confirm"
                    : "Pinch to Confirm";
            }
        }
        isMobileConnected() {
            return SIK_1.SIK.MobileInputData.isAvailable();
        }
        update() {
            var isMobileAvailable = SIK_1.SIK.MobileInputData.isAvailable();
            if (this.mobileConnected != isMobileAvailable) {
                this.mobileConnected = isMobileAvailable;
                this.onMobileConnnectionStateChange(this.mobileConnected);
            }
        }
        onCalibrationComplete(callback) {
            this.isCalibrationRunning = false;
            print("Calibration complete..");
            //remove events
            this.removeEvent(this.updateEvent);
            this.updateEvent = null;
            //delay stop hit test session
            var delay = this.createEvent("DelayedCallbackEvent");
            delay.bind(() => {
                if (this.hitTestSession != null) {
                    print("Stopping hit test session...");
                    this.hitTestSession.stop();
                    this.hitTestSession = null;
                }
            });
            delay.reset(0.1);
            //play audio
            this.getSceneObject()
                .getParent()
                .getComponent("Component.AudioComponent")
                .play(1);
            //animate circle
            this.onAnimCompleteCallback = callback;
            this.circleAnim.animateCircleIn(() => {
                this.animateVisuals(false, this.onAnimCompleteCallback());
            });
        }
    };
    __setFunctionName(_classThis, "SurfaceDetector");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SurfaceDetector = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SurfaceDetector = _classThis;
})();
exports.SurfaceDetector = SurfaceDetector;
//# sourceMappingURL=SurfaceDetector.js.map