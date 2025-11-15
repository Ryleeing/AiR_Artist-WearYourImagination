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
exports.SurfacePlacementController = void 0;
const PlacementSettings_1 = require("./PlacementSettings");
const HandHintsController_1 = require("./HandHintsController");
const Singleton_1 = require("../Decorators/Singleton");
const SurfaceDetector_1 = require("./SurfaceDetector");
const TableTop_1 = require("./TableTop");
// public static getInstance: () => SIKLogLevelProvider
const CALIBRATE_AUDIOTRACK = requireAsset("../Sounds/CalibrateSnap.mp3");
const HANDHINTS_PREFAB = requireAsset("../Prefabs/HandHints.prefab");
const PLACEMENT_MODE_PREFABS = [
    requireAsset("../Prefabs/HorizontalPlacement__PLACE_IN_SCENE.prefab"),
    requireAsset("../Prefabs/VerticalPlacement__PLACE_IN_SCENE.prefab"),
    requireAsset("../Prefabs/TableTopPlacement__PLACE_IN_SCENE.prefab"),
];
let SurfacePlacementController = (() => {
    let _classDecorators = [Singleton_1.Singleton];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var SurfacePlacementController = _classThis = class {
        constructor() {
            this.handHindsController = null;
            this.currDetector = null;
            this.sceneObject = null;
            this.sceneObject = global.scene.createSceneObject("SurfacePlacementController");
            this.init();
        }
        init() {
            let audioComponent = this.sceneObject.createComponent("AudioComponent");
            audioComponent.audioTrack = CALIBRATE_AUDIOTRACK;
            var handHintsObj = HANDHINTS_PREFAB.instantiate(this.sceneObject);
            this.handHindsController = handHintsObj.getComponent(HandHintsController_1.HandHintsController.getTypeName());
            this.handHindsController.disableHint();
        }
        startSurfacePlacement(settings, callback) {
            if (this.currDetector != null) {
                //in case mode is changed remove current detector
                this.stopSurfacePlacement();
            }
            //create new one and init
            var detectorObj = PLACEMENT_MODE_PREFABS[settings.placementMode].instantiate(this.sceneObject);
            this.currDetector = detectorObj
                .getComponents("ScriptComponent")
                .find((s) => s instanceof SurfaceDetector_1.SurfaceDetector);
            if (settings.placementMode == PlacementSettings_1.PlacementMode.NEAR_SURFACE) {
                var tableTop = detectorObj.getComponent(TableTop_1.TableTop.getTypeName());
                tableTop.setOptions(settings);
            }
            this.currDetector.init(this.handHindsController);
            //start surface placement on desired mode
            this.currDetector.startSurfaceCalibration(callback);
        }
        stopSurfacePlacement() {
            if (this.currDetector) {
                this.handHindsController.disableHint();
                this.currDetector.onDestroy();
                this.currDetector.getSceneObject().destroy();
                this.currDetector = null;
            }
        }
    };
    __setFunctionName(_classThis, "SurfacePlacementController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SurfacePlacementController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SurfacePlacementController = _classThis;
})();
exports.SurfacePlacementController = SurfacePlacementController;
//# sourceMappingURL=SurfacePlacementController.js.map