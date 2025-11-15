"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassHelper = void 0;
class PassHelper {
    static setBaseColorAlpha(pass, alpha) {
        const color = pass.baseColor;
        color.w = alpha;
        pass.baseColor = color;
    }
    static cloneAndReplaceMaterial(meshVisual) {
        const clone = meshVisual.mainMaterial.clone();
        meshVisual.mainMaterial = clone;
        return clone;
    }
    static copyColorWithDifferentAlpha(color, alpha) {
        return new vec4(color.r, color.g, color.b, alpha);
    }
}
exports.PassHelper = PassHelper;
//# sourceMappingURL=PassHelper.js.map