"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClosedPolyline = void 0;
var __selfType = requireType("./ClosedPolyline");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const color_1 = require("SpectaclesInteractionKit.lspkg/Utils/color");
const InteractorLineRenderer_1 = require("SpectaclesInteractionKit.lspkg/Components/Interaction/InteractorLineVisual/InteractorLineRenderer");
/**
 * This class provides visual representation for a polyline that can be rendered as a continuous or split sequence of lines.
 */
let ClosedPolyline = class ClosedPolyline extends BaseScriptComponent {
    set isEnabled(isEnabled) {
        this._enabled = isEnabled;
        this.lines.forEach(line => {
            line.getSceneObject().enabled = isEnabled;
        });
    }
    get isEnabled() {
        return this._enabled;
    }
    onAwake() {
        if (!this.points || this.points.length < 2) {
            throw new Error("ClosedPolylineVisual requires at least 2 points");
        }
        this.transform = this.sceneObject.getTransform();
        this.createOrUpdateLines();
    }
    refreshLine() {
        if (!this.points || this.points.length < 2) {
            print("Cannot refresh line: Invalid state");
            return;
        }
        // Recalculate positions and update the lines
        this.createOrUpdateLines();
    }
    createOrUpdateLines() {
        // Clear existing lines
        this.lines.forEach(line => line.destroy());
        this.lines = [];
        const positions = this.points.map(point => point.getTransform().getLocalPosition());
        if (this.continuousLine) {
            // Render as a single closed line
            positions.push(positions[0]);
            const line = new InteractorLineRenderer_1.default({
                material: this.lineMaterial,
                points: positions,
                startColor: (0, color_1.withAlpha)(this._color, 1),
                endColor: (0, color_1.withAlpha)(this._color, 1),
                startWidth: this.lineWidth,
                endWidth: this.lineWidth,
            });
            line.getSceneObject().setParent(this.sceneObject);
            line.visualStyle = this.lineStyle;
            this.lines.push(line);
        }
        else {
            // Render as separate lines between each pair of points
            for (let i = 0; i < positions.length; i++) {
                const startIndex = i;
                const endIndex = (i + 1) % positions.length;
                const line = new InteractorLineRenderer_1.default({
                    material: this.lineMaterial,
                    points: [positions[startIndex], positions[endIndex]],
                    startColor: (0, color_1.withAlpha)(this._color, 1),
                    endColor: (0, color_1.withAlpha)(this._color, 1),
                    startWidth: this.lineWidth,
                    endWidth: this.lineWidth,
                });
                line.getSceneObject().setParent(this.sceneObject);
                line.visualStyle = this.lineStyle;
                this.lines.push(line);
            }
        }
        this.isEnabled = this._enabled;
    }
    onDestroy() {
        this.lines.forEach(line => line.destroy());
        this.sceneObject.destroy();
    }
    getPoints() {
        return this.points || [];
    }
    setColor(color) {
        this._color = color;
        this.lines.forEach(line => {
            const colorWithAlpha = (0, color_1.withAlpha)(color, 1);
            line.startColor = colorWithAlpha;
            line.endColor = colorWithAlpha;
        });
    }
    setPoints(newPoints) {
        if (newPoints.length < 2) {
            print("Error: At least 2 points are required");
            return;
        }
        this.points = newPoints;
        this.refreshLine();
    }
    __initialize() {
        super.__initialize();
        this._enabled = true;
        this.lines = [];
    }
};
exports.ClosedPolyline = ClosedPolyline;
exports.ClosedPolyline = ClosedPolyline = __decorate([
    component
], ClosedPolyline);
//# sourceMappingURL=ClosedPolyline.js.map