"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
let Line = class Line extends BaseScriptComponent {
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
    __initialize() {
        super.__initialize();
        this._enabled = true;
        this.isShown = false;
        this.defaultScale = new vec3(1, 1, 1);
        this.maxLength = 500;
    }
};
exports.Line = Line;
exports.Line = Line = __decorate([
    component
], Line);
//# sourceMappingURL=Line.js.map