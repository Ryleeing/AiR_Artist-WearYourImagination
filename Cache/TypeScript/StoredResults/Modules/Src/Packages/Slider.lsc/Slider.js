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
exports.Slider = void 0;
var __selfType = requireType("./Slider");
function component(target) { target.getTypeName = function () { return __selfType; }; }
/**
 * Slider
 * Version 0.0.10
 *
 * Slider UI element with counter option.
 *
 * API:
 *
 * enableInteractable(): void
 * disableInteractable(): void
 * getCounterValue(): number
 * enableCounter(): void
 * disableCounter(): void
 * sliderValue: number
 * counterTextSize: number
 * trackBarColor: vec3
 * sliderOpacity: number
 *
 * Events:
 *
 * onValueChanged - triggers with passed slider value in the range [this.startValue, this.endValue].
 * onTouchStart - triggers with passed TouchStartEventArgs data.
 * onTouchMove - triggers with passed TouchMoveEventArgs data.
 * onTouchEnd - triggers with passed TouchEndEventArgs data.
 * onEnabledInteractable
 * onDisabledInteractable
 */
const BaseSlider_1 = require("./BaseSlider");
const EventCallbacks_1 = require("./Modules/BehaviorSupport/EventCallbacks");
let Slider = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseSlider_1.BaseSlider;
    var Slider = _classThis = class extends _classSuper {
        __initialize() {
            super.__initialize();
            this.counterEnabled = this.counterEnabled;
            this.fractionDigits = this.fractionDigits;
            this.trackBar = this.trackBar;
            this._trackBarColor = this._trackBarColor;
            this.eventCallbacks = this.eventCallbacks;
            this.callbackType = this.callbackType;
            this.onValueChangedBehaviors = this.onValueChangedBehaviors;
            this.onValueChangedCustomTriggers = this.onValueChangedCustomTriggers;
            this.onValueChangedFunctions = this.onValueChangedFunctions;
            this.counterData = {
                so: null,
                st: null,
                text: null
            };
        }
        constructor() {
            super();
            this.counterEnabled = this.counterEnabled;
            this.fractionDigits = this.fractionDigits;
            this.trackBar = this.trackBar;
            this._trackBarColor = this._trackBarColor;
            this.eventCallbacks = this.eventCallbacks;
            this.callbackType = this.callbackType;
            this.onValueChangedBehaviors = this.onValueChangedBehaviors;
            this.onValueChangedCustomTriggers = this.onValueChangedCustomTriggers;
            this.onValueChangedFunctions = this.onValueChangedFunctions;
            this.counterData = {
                so: null,
                st: null,
                text: null
            };
        }
        onAwake() {
            this.initialize();
        }
        set counterTextSize(textSize) {
            this.counterData.text.size = textSize;
        }
        get counterTextSize() {
            return this.counterData.text.size;
        }
        set trackBarColor(value) {
            this.backgroundData.pass.foreground_color = value;
        }
        get trackBarColor() {
            return this.backgroundData.pass.foreground_color;
        }
        set sliderOpacity(value) {
            this.backgroundData.pass.background_alpha = value;
        }
        get sliderOpacity() {
            return this.backgroundData.pass.background_alpha;
        }
        getCounterValue() {
            return +this.counterData.text.text;
        }
        enableCounter() {
            this.counterEnabled = true;
            this.counterData.so.enabled = true;
            this.updateCounter(this._sliderValue);
        }
        disableCounter() {
            this.counterEnabled = false;
            this.counterData.so.enabled = false;
        }
        /**
         * Initializes all slider's components.
         * @protected
         */
        initialize() {
            super.initialize();
            this.initializeCounter();
            this.initializeOrientation();
            this.initializeEventCallbacks();
            this.updateTrackBar(-1.0);
            this.sliderValue = this.startSliderValue;
            this.backgroundData.pass.foreground_color = this._trackBarColor;
        }
        initializeCounter() {
            this.counterData.so = this.sliderData.counterSO;
            if (!this.counterData.so) {
                throw new Error("Invalid Counter.");
            }
            this.counterData.st = this.counterData.so.getComponent('ScreenTransform');
            if (!this.counterData.st) {
                throw new Error("Invalid Counter Screen Transform.");
            }
            this.counterData.text = this.counterData.so.getComponent('Text');
            if (!this.counterData.text) {
                throw new Error("Invalid Counter Text.");
            }
            this.counterData.so.enabled = this.counterEnabled;
        }
        /**
         * Expands 'initializeOrientation' method and changes the position of the counter depending on the orientation.
         * @protected
         */
        initializeOrientation() {
            super.initializeOrientation();
            switch (this.orientation) {
                case BaseSlider_1.Orientation.Vertical:
                    this.counterData.st.anchors.setCenter(new vec2(Slider.COUNTER_ANCHOR_OFFSET_VERTICAL, 0.0));
                    this.counterData.st.offsets.setCenter(new vec2(Slider.COUNTER_OFFSET, 0.0));
                    this.counterData.text.horizontalAlignment = HorizontalAlignment.Left;
                    break;
                case BaseSlider_1.Orientation.Horizontal:
                    this.counterData.st.anchors.setCenter(new vec2(0.0, Slider.COUNTER_ANCHOR_OFFSET_HORIZONTAL));
                    this.counterData.st.offsets.setCenter(new vec2(0.0, Slider.COUNTER_OFFSET));
                    this.counterData.text.horizontalAlignment = HorizontalAlignment.Center;
                    break;
            }
        }
        /**
         * Adds listeners to `onValueChanged` event.
         * @private
         */
        initializeEventCallbacks() {
            if (this.eventCallbacks && this.callbackType !== EventCallbacks_1.CallbackType.None) {
                this.onValueChanged.add(EventCallbacks_1.EventCallbacks.invokeCallbackFromInputs({
                    name: "onValueChanged",
                    type: this.callbackType,
                    behaviorScripts: this.onValueChangedBehaviors,
                    behaviorSystemTriggers: this.onValueChangedCustomTriggers,
                    scriptFunctions: this.onValueChangedFunctions
                }));
            }
        }
        /**
         * Sets a new slider value. Value should be in the range [-1.0, 1.0].
         * @param value - a new slider value.
         */
        _setSliderValue(value) {
            super._setSliderValue(value);
            if (this.counterEnabled) {
                this.updateCounter(this._sliderValue);
            }
            if (this.trackBar) {
                this.updateTrackBar(this._sliderValue);
            }
        }
        /**
         * Updates the counter value according to the slider value.
         * @param sliderValue - current slider's value in the range [-1.0, 1.0].
         * @private
         */
        updateCounter(sliderValue) {
            this.counterData.text.text = MathUtils.remap(sliderValue, -1.0, 1.0, this.startValue, this.endValue).toFixed(this.fractionDigits);
        }
        /**
         * Updates the trackBar value according to the slider value.
         * @param sliderValue - current slider's value in the range [-1.0, 1.0].
         * @private
         */
        updateTrackBar(sliderValue) {
            this.backgroundData.pass.slider_value = (sliderValue + 1) / 2;
        }
    };
    __setFunctionName(_classThis, "Slider");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Slider = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    _classThis.COUNTER_OFFSET = 0.125;
    _classThis.COUNTER_ANCHOR_OFFSET_VERTICAL = 1.5;
    _classThis.COUNTER_ANCHOR_OFFSET_HORIZONTAL = 0.5;
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Slider = _classThis;
})();
exports.Slider = Slider;
//# sourceMappingURL=Slider.js.map