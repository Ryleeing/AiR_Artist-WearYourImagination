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
exports.Line = void 0;
var __selfType = requireType("./Line");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const color_1 = require("SpectaclesInteractionKit.lspkg/Utils/color");
const InteractorLineRenderer_1 = require("SpectaclesInteractionKit.lspkg/Components/Interaction/InteractorLineVisual/InteractorLineRenderer");
/**
 * This class provides visual representation for interactor lines. It allows customization of the line's material, colors, width, length, and visual style. The class integrates with the InteractionManager and WorldCameraFinderProvider to manage interactions and camera positioning.
 */
let Line = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var Line = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.startPointObject = this.startPointObject;
            this.endPointObject = this.endPointObject;
            this.lineMaterial = this.lineMaterial;
            this._beginColor = this._beginColor;
            this._endColor = this._endColor;
            this.lineWidth = this.lineWidth;
            this.lineLength = this.lineLength;
            this.lineStyle = this.lineStyle;
            this.shouldStick = this.shouldStick;
            this._enabled = true;
            this.isShown = false;
            this.defaultScale = new vec3(1, 1, 1);
            this.maxLength = 500;
        }
        __initialize() {
            super.__initialize();
            this.startPointObject = this.startPointObject;
            this.endPointObject = this.endPointObject;
            this.lineMaterial = this.lineMaterial;
            this._beginColor = this._beginColor;
            this._endColor = this._endColor;
            this.lineWidth = this.lineWidth;
            this.lineLength = this.lineLength;
            this.lineStyle = this.lineStyle;
            this.shouldStick = this.shouldStick;
            this._enabled = true;
            this.isShown = false;
            this.defaultScale = new vec3(1, 1, 1);
            this.maxLength = 500;
        }
        /**
         * Sets whether the visual can be shown, so developers can show/hide the ray in certain parts of their lens.
         */
        set isEnabled(isEnabled) {
            this._enabled = isEnabled;
        }
        /**
         * Gets whether the visual is active (can be shown if hand is in frame and we're in far field targeting mode).
         */
        get isEnabled() {
            return this._enabled;
        }
        /**
         * Sets how the visuals for the line drawer should be shown.
         */
        set visualStyle(style) {
            this.line.visualStyle = style;
        }
        /**
         * Gets the current visual style.
         */
        get visualStyle() {
            return this.line.visualStyle;
        }
        /**
         * Sets the color of the visual from the start.
         */
        set beginColor(color) {
            this.line.startColor = (0, color_1.withAlpha)(color, 1);
        }
        /**
         * Gets the color of the visual from the start.
         */
        get beginColor() {
            return (0, color_1.withoutAlpha)(this.line.startColor);
        }
        /**
         * Sets the color of the visual from the end.
         */
        set endColor(color) {
            this.line.endColor = (0, color_1.withAlpha)(color, 1);
        }
        /**
         * Gets the color of the visual from the end.
         */
        get endColor() {
            return (0, color_1.withoutAlpha)(this.line.endColor);
        }
        onAwake() {
            this.transform = this.sceneObject.getTransform();
            this.defaultScale = this.transform.getWorldScale();
            this.line = new InteractorLineRenderer_1.default({
                material: this.lineMaterial,
                points: [
                    this.startPointObject.getTransform().getLocalPosition(),
                    this.endPointObject.getTransform().getLocalPosition(),
                ],
                startColor: (0, color_1.withAlpha)(this._beginColor, 1),
                endColor: (0, color_1.withAlpha)(this._endColor, 1),
                startWidth: this.lineWidth,
                endWidth: this.lineWidth,
            });
            this.line.getSceneObject().setParent(this.sceneObject);
            if (this.lineStyle !== undefined) {
                this.line.visualStyle = this.lineStyle;
            }
            if (this.lineLength && this.lineLength > 0) {
                this.defaultScale = new vec3(1, this.lineLength / this.maxLength, 1);
            }
        }
        rotationFromOrthogonal(right, up, fwd) {
            const vec3to4 = (v3) => new vec4(v3.x, v3.y, v3.z, 0);
            const rotationMatrix = new mat4();
            rotationMatrix.column0 = vec3to4(right);
            rotationMatrix.column1 = vec3to4(up);
            rotationMatrix.column2 = vec3to4(fwd);
            return quat.fromEulerVec(rotationMatrix.extractEulerAngles());
        }
        onDestroy() {
            this.line.destroy();
            this.sceneObject.destroy();
        }
    };
    __setFunctionName(_classThis, "Line");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Line = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Line = _classThis;
})();
exports.Line = Line;
//# sourceMappingURL=Line.js.map