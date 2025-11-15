"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
let PinholeCapture = class PinholeCapture extends BaseScriptComponent {
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
    __initialize() {
        super.__initialize();
        this.cameraModule = require("LensStudio:CameraModule");
        this.isInitialized = false;
    }
};
exports.PinholeCapture = PinholeCapture;
exports.PinholeCapture = PinholeCapture = __decorate([
    component
], PinholeCapture);
//# sourceMappingURL=PinholeCapture.js.map