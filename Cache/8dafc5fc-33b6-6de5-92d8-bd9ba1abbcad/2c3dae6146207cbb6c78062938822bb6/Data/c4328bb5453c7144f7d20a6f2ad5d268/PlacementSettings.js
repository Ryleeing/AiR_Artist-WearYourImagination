"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlacementSettings = exports.PlacementMode = void 0;
var PlacementMode;
(function (PlacementMode) {
    PlacementMode[PlacementMode["HORIZONTAL"] = 0] = "HORIZONTAL";
    PlacementMode[PlacementMode["VERTICAL"] = 1] = "VERTICAL";
    PlacementMode[PlacementMode["NEAR_SURFACE"] = 2] = "NEAR_SURFACE";
})(PlacementMode || (exports.PlacementMode = PlacementMode = {}));
class PlacementSettings {
    constructor(mode, useWidget = true, widgetOffset = new vec3(2, 2, 0), onSliderUpdated = null) {
        this.onSliderUpdate = null;
        this.placementMode = mode;
        this.useAdjustmentWidget = useWidget;
        this.adjustmentWidgetOffset = widgetOffset;
        this.onSliderUpdate = onSliderUpdated;
    }
}
exports.PlacementSettings = PlacementSettings;
//# sourceMappingURL=PlacementSettings.js.map