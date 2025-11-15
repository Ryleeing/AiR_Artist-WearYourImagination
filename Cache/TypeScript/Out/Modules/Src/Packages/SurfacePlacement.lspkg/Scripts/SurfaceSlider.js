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
exports.SurfaceSlider = void 0;
var __selfType = requireType("./SurfaceSlider");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const animate_1 = require("SpectaclesInteractionKit.lspkg/Utils/animate");
const Slider_1 = require("SpectaclesInteractionKit.lspkg/Components/UI/Slider/Slider");
const SLIDER_SCALE = 1;
const SLIDER_RANGE_CM = 4;
let SurfaceSlider = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var SurfaceSlider = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.sliderObj = this.sliderObj;
            this.groundVisualObj = this.groundVisualObj;
            this.trans = null;
            this.goundVisualTrans = null;
            this.surfaceRenderer = null;
            this.desiredAlpha = 0;
            this.groundVisualPos = vec3.zero();
            this.sliderOffsetPos = vec3.zero();
            this.onSliderUpdateEvent = null;
        }
        __initialize() {
            super.__initialize();
            this.sliderObj = this.sliderObj;
            this.groundVisualObj = this.groundVisualObj;
            this.trans = null;
            this.goundVisualTrans = null;
            this.surfaceRenderer = null;
            this.desiredAlpha = 0;
            this.groundVisualPos = vec3.zero();
            this.sliderOffsetPos = vec3.zero();
            this.onSliderUpdateEvent = null;
        }
        onAwake() {
            this.trans = this.getSceneObject().getTransform();
            this.goundVisualTrans = this.groundVisualObj.getTransform();
            this.surfaceRenderer =
                this.groundVisualObj.getComponent("RenderMeshVisual");
            this.surfaceRenderer.mainPass.Alpha = this.desiredAlpha;
            this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
        }
        init(offsetPos, onSliderUpdated) {
            this.sliderOffsetPos = offsetPos;
            this.onSliderUpdateEvent = onSliderUpdated;
        }
        onUpdate() {
            //interpolate surface alpha when slider touched
            this.surfaceRenderer.mainPass.Alpha = MathUtils.lerp(this.surfaceRenderer.mainPass.Alpha, this.desiredAlpha, getDeltaTime() * 4);
            //move ground based on slider position
            this.goundVisualTrans.setLocalPosition(this.groundVisualPos);
        }
        resetSlider() {
            this.trans.setLocalScale(vec3.zero());
            this.groundVisualPos.y = 0;
            this.goundVisualTrans.setLocalPosition(vec3.zero());
            this.sliderObj.getComponent(Slider_1.Slider.getTypeName()).currentValue = 0.5;
        }
        onSliderStart() {
            this.desiredAlpha = 1;
        }
        onSliderMoved(val) {
            this.groundVisualPos.y = MathUtils.remap(val, 0, 1, -SLIDER_RANGE_CM, SLIDER_RANGE_CM);
            this.onSliderUpdateEvent?.(this.goundVisualTrans.getWorldPosition());
        }
        onSliderEnd() {
            this.desiredAlpha = 0;
        }
        showSlider(calibrationTrans) {
            this.groundVisualPos = vec3.zero();
            var desiredPosition = calibrationTrans.getWorldPosition();
            var desiredRotation = calibrationTrans.getWorldRotation();
            if (global.deviceInfoSystem.isEditor()) {
                desiredRotation = desiredRotation.multiply(quat.fromEulerVec(new vec3(-Math.PI / 2, 0, 0)));
            }
            //set parent position and rotation
            this.trans.setWorldPosition(desiredPosition);
            this.trans.setWorldRotation(desiredRotation);
            //slider section scale in
            (0, animate_1.default)({
                easing: "ease-out-elastic",
                duration: 1,
                update: (t) => {
                    this.trans.setWorldScale(vec3.lerp(vec3.zero(), vec3.one().uniformScale(SLIDER_SCALE), t));
                },
                ended: null,
                cancelSet: new animate_1.CancelSet(),
            });
            //slider offset position
            var sliderTrans = this.getSceneObject().getChild(0).getTransform();
            sliderTrans.setLocalPosition(this.sliderOffsetPos.uniformScale(SLIDER_SCALE));
        }
    };
    __setFunctionName(_classThis, "SurfaceSlider");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SurfaceSlider = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SurfaceSlider = _classThis;
})();
exports.SurfaceSlider = SurfaceSlider;
//# sourceMappingURL=SurfaceSlider.js.map