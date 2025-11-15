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
exports.DepthCache = void 0;
var __selfType = requireType("./DepthCache");
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
/*
Finds the closest camera frame to a matching depth frame
*/
class ColorCameraFrame {
    constructor(imageFrame, colorTimestamp) {
        this.imageFrame = imageFrame;
        this.colorTimestampSeconds = colorTimestamp;
    }
}
class DepthColorPair {
    constructor(colorCameraFrame, depthFrameData, depthDeviceCamera, depthTimestampSeconds, depthCameraPose) {
        this.colorCameraFrame = colorCameraFrame;
        this.depthFrameData = depthFrameData;
        this.depthDeviceCamera = depthDeviceCamera;
        this.depthTimestampSeconds = depthTimestampSeconds;
        this.depthCameraPose = depthCameraPose;
    }
}
let DepthCache = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var DepthCache = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.camModule = this.camModule;
            this.depthModule = require("LensStudio:DepthModule");
            this.depthFrameSession = null;
            this.isEditor = global.deviceInfoSystem.isEditor();
            this.camFrameHistory = [];
            this.latestCameraDepthPair = null;
            this.cachedDepthFrames = new Map();
        }
        __initialize() {
            super.__initialize();
            this.camModule = this.camModule;
            this.depthModule = require("LensStudio:DepthModule");
            this.depthFrameSession = null;
            this.isEditor = global.deviceInfoSystem.isEditor();
            this.camFrameHistory = [];
            this.latestCameraDepthPair = null;
            this.cachedDepthFrames = new Map();
        }
        onAwake() {
            this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
        }
        onStart() {
            this.startCameraUpdates();
            this.startDepthUpdate();
        }
        saveDepthFrame() {
            //create unique ID for depth frame
            let depthFrameID = Date.now();
            this.cachedDepthFrames.set(depthFrameID, this.latestCameraDepthPair);
            return depthFrameID;
        }
        getCamImageWithID(depthFrameID) {
            return this.cachedDepthFrames.get(depthFrameID).colorCameraFrame.imageFrame;
        }
        getWorldPositionWithID(pixelPos, depthFrameID) {
            var cachedDepthColorPair = this.cachedDepthFrames.get(depthFrameID);
            if (cachedDepthColorPair != null) {
                //Remap from the color frame to the depth frame since the depth frame is a cropped and downscaled version of the left color frame.
                const normalizedPointOnColorFrame = pixelPos.div(this.colorDeviceCamera.resolution);
                const pointInCameraSpace = this.colorDeviceCamera.unproject(normalizedPointOnColorFrame, 100.0);
                const normalizedPointOnDepthFrame = cachedDepthColorPair.depthDeviceCamera.project(pointInCameraSpace);
                if (this.isNormalizedPointInImage(normalizedPointOnDepthFrame)) {
                    const objectPixelLocationOnDepthFrame = normalizedPointOnDepthFrame.mult(cachedDepthColorPair.depthDeviceCamera.resolution);
                    //Sample depth at pixel location and compute world position of object
                    const depthVal = this.getMedianDepth(cachedDepthColorPair.depthFrameData, cachedDepthColorPair.depthDeviceCamera.resolution.x, cachedDepthColorPair.depthDeviceCamera.resolution.y, Math.floor(objectPixelLocationOnDepthFrame.x), Math.floor(objectPixelLocationOnDepthFrame.y), 1);
                    const pointInDeviceRef = cachedDepthColorPair.depthDeviceCamera.unproject(normalizedPointOnDepthFrame, depthVal);
                    return cachedDepthColorPair.depthCameraPose.multiplyPoint(pointInDeviceRef);
                }
                print("Point is outside of depth frame: " + normalizedPointOnDepthFrame);
                return null;
            }
            print("Invalid depth frame ID: " + depthFrameID);
            return null;
        }
        disposeDepthFrame(depthFrameID) {
            var depthFrame = this.cachedDepthFrames.get(depthFrameID);
            if (depthFrame != null) {
                this.cachedDepthFrames.delete(depthFrameID);
            }
        }
        getMedianDepth(depthData, width, height, x, y, radius) {
            //Radius = 1 → 3×3 window (9 samples)
            //Radius = 2 → 5×5 window (25 samples)
            //Radius = 3 → 7×7 window (49 samples)
            const xi = Math.round(x);
            const yi = Math.round(y);
            const samples = [];
            for (let dy = -radius; dy <= radius; dy++) {
                for (let dx = -radius; dx <= radius; dx++) {
                    const nx = xi + dx;
                    const ny = yi + dy;
                    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                        const val = depthData[nx + ny * width];
                        if (val > 0)
                            samples.push(val); // skip zeros/invalid
                    }
                }
            }
            if (samples.length === 0)
                return null;
            samples.sort((a, b) => a - b);
            const mid = Math.floor(samples.length / 2);
            return samples.length % 2 === 0
                ? (samples[mid - 1] + samples[mid]) / 2
                : samples[mid];
        }
        startCameraUpdates() {
            var camRequest = CameraModule.createCameraRequest();
            camRequest.cameraId = CameraModule.CameraId.Left_Color;
            this.camTexture = this.camModule.requestCamera(camRequest);
            var camTexControl = this.camTexture.control;
            camTexControl.onNewFrame.add((frame) => {
                var colorCameraFrame = new ColorCameraFrame(this.camTexture.copyFrame(), frame.timestampSeconds);
                //save last half second of camera frames
                this.camFrameHistory.push(colorCameraFrame);
                //cam frame updates at 30hz, depth at 5hz, usually cam frame is 2-3 cam frames behind depth frame
                if (this.camFrameHistory.length > 5) {
                    this.camFrameHistory.shift();
                }
            });
            this.colorDeviceCamera = global.deviceInfoSystem.getTrackingCameraForId(CameraModule.CameraId.Left_Color);
        }
        startDepthUpdate() {
            this.depthFrameSession = this.depthModule.createDepthFrameSession();
            this.depthFrameSession.onNewFrame.add((depthFrameData) => {
                var closestFrame = this.findClosestCameraFrame(depthFrameData);
                if (closestFrame != null) {
                    //Deep copy items here
                    this.latestCameraDepthPair = new DepthColorPair(closestFrame, depthFrameData.depthFrame.slice(), depthFrameData.deviceCamera, depthFrameData.timestampSeconds, mat4.fromColumns(depthFrameData.toWorldTrackingOriginFromDeviceRef.column0, depthFrameData.toWorldTrackingOriginFromDeviceRef.column1, depthFrameData.toWorldTrackingOriginFromDeviceRef.column2, depthFrameData.toWorldTrackingOriginFromDeviceRef.column3));
                }
            });
            this.depthFrameSession.start();
        }
        findClosestCameraFrame(depthFrame, maxOffset = 0.001) {
            if (!this.camFrameHistory || this.camFrameHistory.length === 0) {
                return null;
            }
            const closestColorFrame = this.camFrameHistory.reduce((closest, current) => {
                const currentDelta = Math.abs(current.colorTimestampSeconds - depthFrame.timestampSeconds);
                const closestDelta = Math.abs(closest.colorTimestampSeconds - depthFrame.timestampSeconds);
                return currentDelta < closestDelta ? current : closest;
            });
            return Math.abs(closestColorFrame.colorTimestampSeconds - depthFrame.timestampSeconds) <= maxOffset
                ? closestColorFrame
                : this.camFrameHistory[this.camFrameHistory.length - 1];
        }
        isNormalizedPointInImage(normalizedPoint) {
            return (normalizedPoint.x >= 0.0 &&
                normalizedPoint.x <= 1.0 &&
                normalizedPoint.y >= 0.0 &&
                normalizedPoint.y <= 1.0);
        }
    };
    __setFunctionName(_classThis, "DepthCache");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DepthCache = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DepthCache = _classThis;
})();
exports.DepthCache = DepthCache;
//# sourceMappingURL=DepthCache.js.map