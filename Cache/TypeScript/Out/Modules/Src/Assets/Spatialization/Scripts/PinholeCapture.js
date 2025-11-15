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
exports.PinholeCapture = void 0;
var __selfType = requireType("./PinholeCapture");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const WorldCameraFinderProvider_1 = require("SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider");
const PinholeCameraModel_1 = require("./PinholeCameraModel");
const NativeLogger_1 = require("SpectaclesInteractionKit.lspkg/Utils/NativeLogger");
// Create a logger instance for this class
const log = new NativeLogger_1.default("PinholeCapture");
let PinholeCapture = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var PinholeCapture = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.cameraModule = require("LensStudio:CameraModule");
            this.isInitialized = false;
            this.debugLogging = this.debugLogging;
        }
        __initialize() {
            super.__initialize();
            this.cameraModule = require("LensStudio:CameraModule");
            this.isInitialized = false;
            this.debugLogging = this.debugLogging;
        }
        onAwake() {
            // Create a Promise that will be resolved when initialization is complete
            this.initPromise = new Promise((resolve) => {
                this.initResolve = resolve;
            });
            this.createEvent("OnStartEvent").bind(() => {
                this.logMessage("Initializing PinholeCapture...");
                try {
                    // Initialize camera module and its dependencies
                    this.cameraRequest = CameraModule.createCameraRequest();
                    this.cameraRequest.cameraId = CameraModule.CameraId.Right_Color;
                    const cameraTexture = this.cameraModule.requestCamera(this.cameraRequest);
                    if (!cameraTexture) {
                        this.logMessage("Error: Failed to request camera texture");
                        this.initResolve(false);
                        return;
                    }
                    this.cameraDevice = global.deviceInfoSystem.getTrackingCameraForId(this.cameraRequest.cameraId);
                    if (!this.cameraDevice) {
                        this.logMessage("Error: Failed to get tracking camera device");
                        this.initResolve(false);
                        return;
                    }
                    this.cameraModel = PinholeCameraModel_1.PinholeCameraModel.create(this.cameraDevice);
                    if (!this.cameraModel) {
                        this.logMessage("Error: Failed to create pinhole camera model");
                        this.initResolve(false);
                        return;
                    }
                    // Get the main camera
                    const cameraProvider = WorldCameraFinderProvider_1.default.getInstance();
                    if (!cameraProvider) {
                        this.logMessage("Error: Failed to get camera provider");
                        this.initResolve(false);
                        return;
                    }
                    this.mainCamera = cameraProvider.getComponent();
                    if (!this.mainCamera) {
                        this.logMessage("Error: Failed to get main camera component");
                        this.initResolve(false);
                        return;
                    }
                    // Initial save of the matrix
                    if (!this.saveMatrix()) {
                        this.logMessage("Warning: Initial matrix save failed, will try again later");
                    }
                    this.isInitialized = true;
                    this.logMessage("PinholeCapture initialization complete");
                    this.initResolve(true);
                }
                catch (e) {
                    this.logMessage("Error during initialization: " + e);
                    this.initResolve(false);
                }
            });
        }
        // Check if the component is initialized and ready
        isReady() {
            return this.isInitialized && this.mainCamera != null;
        }
        // Get the initialization promise
        getInitPromise() {
            return this.initPromise;
        }
        // save matrix run it when you are about to execute
        // save rotation and position before the model runs
        saveMatrix() {
            if (!this.mainCamera) {
                this.logMessage("Error: mainCamera is not initialized");
                return false;
            }
            try {
                this.viewToWorld = this.mainCamera.getTransform().getWorldTransform();
                if (this.debugLogging) {
                    this.logMessage("Matrix saved successfully");
                }
                return true;
            }
            catch (e) {
                this.logMessage("Error saving matrix: " + e);
                return false;
            }
        }
        // OBJECT DETECTION METHODS
        // This method is used to get the camera's pose in world space
        captureToWorldTransform(captureUV, depth) {
            if (!this.isReady() || !this.viewToWorld) {
                this.logMessage("Error: PinholeCapture not ready for captureToWorldTransform");
                return new vec3(0, 0, 0);
            }
            const capturePos = this.cameraModel.unprojectFromUV(captureUV, depth);
            const viewPos = this.cameraDevice.pose.multiplyPoint(capturePos);
            const worldPos = this.viewToWorld.multiplyPoint(viewPos);
            return worldPos;
        }
        // This method is used to get the camera's pose in world space
        worldToCaptureTransform() {
            if (!this.isReady() || !this.viewToWorld) {
                this.logMessage("Error: PinholeCapture not ready for worldToCaptureTransform");
                return new mat4(); // Return identity matrix as fallback
            }
            return this.viewToWorld.mult(this.cameraDevice.pose).inverse();
        }
        // This method is used to get the camera's pose in world space
        worldSpaceOfTrackingCamera() {
            if (!this.isReady() || !this.viewToWorld) {
                this.logMessage("Error: PinholeCapture not ready for worldSpaceOfTrackingCamera");
                return new vec3(0, 0, 0);
            }
            return this.viewToWorld
                .mult(this.cameraDevice.pose)
                .multiplyPoint(vec3.zero());
        }
        // Helper method for logging
        logMessage(message) {
            log.d(message);
            if (this.debugLogging) {
                print("PinholeCapture: " + message);
            }
        }
        getCameraModel() {
            if (!this.cameraModel) {
                this.logMessage("Warning: cameraModel not initialized yet");
            }
            return this.cameraModel;
        }
    };
    __setFunctionName(_classThis, "PinholeCapture");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PinholeCapture = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PinholeCapture = _classThis;
})();
exports.PinholeCapture = PinholeCapture;
//# sourceMappingURL=PinholeCapture.js.map