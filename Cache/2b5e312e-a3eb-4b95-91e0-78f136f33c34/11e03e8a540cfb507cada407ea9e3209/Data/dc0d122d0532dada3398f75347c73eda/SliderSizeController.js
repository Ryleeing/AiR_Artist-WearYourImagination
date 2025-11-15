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
exports.SliderSizeController = void 0;
var __selfType = requireType("./SliderSizeController");
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
let SliderSizeController = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var SliderSizeController = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.targetObject = this.targetObject;
            this.slider = this.slider; // Slider component from Slider.lsc package
            this.sliderMinValue = this.sliderMinValue;
            this.sliderMaxValue = this.sliderMaxValue;
            this.minScale = this.minScale;
            this.maxScale = this.maxScale;
            this.uniformScale = this.uniformScale;
            this.scaleAxis = this.scaleAxis;
        }
        __initialize() {
            super.__initialize();
            this.targetObject = this.targetObject;
            this.slider = this.slider; // Slider component from Slider.lsc package
            this.sliderMinValue = this.sliderMinValue;
            this.sliderMaxValue = this.sliderMaxValue;
            this.minScale = this.minScale;
            this.maxScale = this.maxScale;
            this.uniformScale = this.uniformScale;
            this.scaleAxis = this.scaleAxis;
        }
        onAwake() {
            if (!this.targetObject) {
                print("ERROR: Target Object is not assigned!");
                return;
            }
            if (!this.slider) {
                print("ERROR: Slider is not assigned!");
                return;
            }
            this.targetTransform = this.targetObject.getTransform();
            // Subscribe to slider value changes
            this.slider.onValueChanged.add((value) => {
                this.updateObjectSize(value);
            });
            // Set initial size based on slider's current value
            this.updateObjectSize(this.slider.sliderValue);
        }
        updateObjectSize(sliderValue) {
            if (!this.targetTransform) {
                return;
            }
            // Remap slider value from [sliderMinValue, sliderMaxValue] to [0, 1]
            const normalizedValue = MathUtils.remap(sliderValue, this.sliderMinValue, this.sliderMaxValue, 0.0, 1.0);
            // Clamp to ensure it's between 0 and 1
            const clampedValue = MathUtils.clamp(normalizedValue, 0.0, 1.0);
            // Calculate scale using lerp
            const scale = MathUtils.lerp(this.minScale, this.maxScale, clampedValue);
            if (this.uniformScale) {
                // Apply uniform scale to all axes
                this.targetTransform.setLocalScale(new vec3(scale, scale, scale));
            }
            else {
                // Apply scale based on scaleAxis vector
                const currentScale = this.targetTransform.getLocalScale();
                const newScale = new vec3(currentScale.x * this.scaleAxis.x * scale, currentScale.y * this.scaleAxis.y * scale, currentScale.z * this.scaleAxis.z * scale);
                this.targetTransform.setLocalScale(newScale);
            }
        }
    };
    __setFunctionName(_classThis, "SliderSizeController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SliderSizeController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SliderSizeController = _classThis;
})();
exports.SliderSizeController = SliderSizeController;
//# sourceMappingURL=SliderSizeController.js.map