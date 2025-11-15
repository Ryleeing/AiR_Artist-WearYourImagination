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
exports.DebugVisualizer = void 0;
var __selfType = requireType("./DebugVisualizer");
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
let DebugVisualizer = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var DebugVisualizer = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.pointPrefab = this.pointPrefab;
            this.pointPrefabVertex = this.pointPrefabVertex;
            this.testCamVisualObj = this.testCamVisualObj;
        }
        __initialize() {
            super.__initialize();
            this.pointPrefab = this.pointPrefab;
            this.pointPrefabVertex = this.pointPrefabVertex;
            this.testCamVisualObj = this.testCamVisualObj;
        }
        onAwake() {
            this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
        }
        onStart() {
            this.testCamVisualObj.enabled = true;
        }
        updateCameraFrame(cameraFrame) {
            this.destroyAllLocalPoints(this.testCamVisualObj);
            this.testCamVisualObj.getComponent("RenderMeshVisual").mainPass.baseTex =
                cameraFrame;
        }
        visualizeLocalPoint(pixelPos, cameraFrame) {
            print("visualizeLocalPoint" +
                "pixel pos" +
                pixelPos +
                "cam" +
                cameraFrame.getWidth() +
                "x" +
                cameraFrame.getHeight());
            var localX = MathUtils.remap(pixelPos.x, 0, cameraFrame.getWidth(), -0.5, 0.5);
            // this one is flipped earlier for lens studio
            var localY = MathUtils.remap(pixelPos.y, 0, cameraFrame.getHeight(), 0.5, -0.5);
            var localPos = new vec3(localX, localY, 0.01);
            var pointObj = this.pointPrefab.instantiate(this.testCamVisualObj);
            print("instantiate point prefab: " + pointObj.name);
            var pointTrans = pointObj.getTransform();
            pointTrans.setLocalPosition(localPos);
            pointTrans.setWorldScale(vec3.one().uniformScale(0.5));
        }
        visualizeBoundingBoxVertices(bbox, cameraFrame) {
            // bbox format: [centerX, centerY, width, height] (normalized 0-1)
            const centerX = bbox[0];
            const centerY = bbox[1];
            const width = bbox[2];
            const height = bbox[3];
            // Calculate half dimensions
            const halfWidth = width / 2;
            const halfHeight = height / 2;
            // Calculate the 4 corner vertices in normalized coordinates
            const topLeft = new vec2(centerX - halfWidth, centerY - halfHeight);
            const topRight = new vec2(centerX + halfWidth, centerY - halfHeight);
            const bottomLeft = new vec2(centerX - halfWidth, centerY + halfHeight);
            const bottomRight = new vec2(centerX + halfWidth, centerY + halfHeight);
            // Convert normalized coordinates to pixel coordinates
            const frameWidth = cameraFrame.getWidth();
            const frameHeight = cameraFrame.getHeight();
            const vertices = [
                new vec2(topLeft.x * frameWidth, topLeft.y * frameHeight),
                new vec2(topRight.x * frameWidth, topRight.y * frameHeight),
                new vec2(bottomLeft.x * frameWidth, bottomLeft.y * frameHeight),
                new vec2(bottomRight.x * frameWidth, bottomRight.y * frameHeight),
            ];
            print(`Visualizing bounding box vertices for bbox [${centerX.toFixed(3)}, ${centerY.toFixed(3)}, ${width.toFixed(3)}, ${height.toFixed(3)}]`);
            // Visualize each vertex
            vertices.forEach((vertex, index) => {
                this.visualizeBoundingBoxVertex(vertex, cameraFrame, index);
            });
        }
        visualizeBoundingBoxVertex(pixelPos, cameraFrame, vertexIndex) {
            var localX = MathUtils.remap(pixelPos.x, 0, cameraFrame.getWidth(), -0.5, 0.5);
            // this one is flipped earlier for lens studio
            var localY = MathUtils.remap(pixelPos.y, 0, cameraFrame.getHeight(), 0.5, -0.5);
            // Offset vertices slightly forward from center point to avoid z-fighting
            var localPos = new vec3(localX, localY, 0.02);
            var pointObj = this.pointPrefabVertex.instantiate(this.testCamVisualObj);
            pointObj.name = `BBoxVertex_${vertexIndex}`;
            var pointTrans = pointObj.getTransform();
            pointTrans.setLocalPosition(localPos);
            // Make vertices slightly smaller than center points
            pointTrans.setWorldScale(vec3.one().uniformScale(0.3));
            print(`Visualized vertex ${vertexIndex} at pixel (${pixelPos.x.toFixed(1)}, ${pixelPos.y.toFixed(1)}) -> local (${localX.toFixed(3)}, ${localY.toFixed(3)})`);
        }
        destroyAllLocalPoints(parentObj) {
            var points = [];
            for (var i = 0; i < parentObj.getChildrenCount(); i++) {
                var childObj = parentObj.getChild(i);
                points.push(childObj);
            }
            for (var i = 0; i < points.length; i++) {
                var child = points[i];
                child.destroy();
            }
        }
    };
    __setFunctionName(_classThis, "DebugVisualizer");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DebugVisualizer = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DebugVisualizer = _classThis;
})();
exports.DebugVisualizer = DebugVisualizer;
//# sourceMappingURL=DebugVisualizer.js.map