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
exports.MLSpatializer = void 0;
var __selfType = requireType("./MLSpatializer");
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
const YOLODetectionProcessor_1 = require("./YOLODetectionProcessor");
const NativeLogger_1 = require("SpectaclesInteractionKit.lspkg/Utils/NativeLogger");
const Events = require("../../Multi-Object Detection [Modified]/Scripts/Modules/EventModule");
// Create a logger instance for this class
const log = new NativeLogger_1.default("MLSpatializer");
/**
 * Main entry point for ML-based object detection processing
 * Handles YOLO model inference and detection parsing only
 * Use WorldQueryModuleSpatializer for 3D spatialization
 */
let MLSpatializer = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var MLSpatializer = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.model = this.model;
            this.inputTexture = this.inputTexture;
            this.maxDetectionCount = this.maxDetectionCount;
            this.detectionPersistence = this.detectionPersistence;
            this.scoreThreshold = this.scoreThreshold;
            this.iouThreshold = this.iouThreshold;
            this.classLabels = this.classLabels;
            this.enableAllClasses = this.enableAllClasses;
            this.enableCallbacks = this.enableCallbacks;
            this.debugLogging = this.debugLogging;
            this.logText = this.logText;
            this.centerThreshold = this.centerThreshold;
            this.detectionTimestamps = [];
            this.onDetectionsUpdated = new Events.EventWrapper();
            this.isInitialized = false;
            this.initAttempts = 0;
            this.maxInitAttempts = 5;
            this.isRunning = false;
            // Monitor detection callback system for SmartTether
            this.monitorDetectionCallbacks = this.monitorDetectionCallbacks;
            this.monitorDetectedFunctions = this.monitorDetectedFunctions;
            this.monitorLostFunctions = this.monitorLostFunctions;
            this.lastMonitorDetectionState = false;
        }
        __initialize() {
            super.__initialize();
            this.model = this.model;
            this.inputTexture = this.inputTexture;
            this.maxDetectionCount = this.maxDetectionCount;
            this.detectionPersistence = this.detectionPersistence;
            this.scoreThreshold = this.scoreThreshold;
            this.iouThreshold = this.iouThreshold;
            this.classLabels = this.classLabels;
            this.enableAllClasses = this.enableAllClasses;
            this.enableCallbacks = this.enableCallbacks;
            this.debugLogging = this.debugLogging;
            this.logText = this.logText;
            this.centerThreshold = this.centerThreshold;
            this.detectionTimestamps = [];
            this.onDetectionsUpdated = new Events.EventWrapper();
            this.isInitialized = false;
            this.initAttempts = 0;
            this.maxInitAttempts = 5;
            this.isRunning = false;
            // Monitor detection callback system for SmartTether
            this.monitorDetectionCallbacks = this.monitorDetectionCallbacks;
            this.monitorDetectedFunctions = this.monitorDetectedFunctions;
            this.monitorLostFunctions = this.monitorLostFunctions;
            this.lastMonitorDetectionState = false;
        }
        onAwake() {
            log.d("MLSpatializer: onAwake called");
            this.logMessage("MLSpatializer initializing...");
            // Create the delayed callback event
            this.delayedInitEvent = this.createEvent("DelayedCallbackEvent");
            this.delayedInitEvent.bind(() => this.delayedInitialize());
            // Wait for scene start event to ensure components are registered
            this.createEvent("OnStartEvent").bind(() => {
                // Initialize with a slight delay
                this.delayedInitEvent.reset(1.0); // 1 second delay
            });
        }
        /**
         * Attempt initialization with a delay and retries
         */
        delayedInitialize() {
            this.initAttempts++;
            if (this.initAttempts < this.maxInitAttempts) {
                this.logMessage(`Starting initialization attempt ${this.initAttempts}/${this.maxInitAttempts}...`);
                this.initialize();
            }
            else {
                this.logMessage(`Failed to initialize after ${this.maxInitAttempts} attempts`);
                log.e(`Failed to initialize after ${this.maxInitAttempts} attempts`);
            }
        }
        /**
         * Initialize the component
         */
        initialize() {
            this.logMessage("Starting MLSpatializer initialization...");
            this.continueInitialization();
        }
        /**
         * Continue initialization
         */
        continueInitialization() {
            try {
                // Initialize YOLO processor
                this.yoloProcessor = new YOLODetectionProcessor_1.YOLODetectionProcessor(this.classLabels, this.scoreThreshold, this.iouThreshold, this.debugLogging);
                // Initialize ML component
                this.initML();
                this.isInitialized = true;
                this.logMessage("MLSpatializer ready");
            }
            catch (e) {
                this.logMessage("Error during initialization: " + e);
                log.e("Error during initialization: " + e);
            }
        }
        /**
         * Create ML component
         */
        initML() {
            if (!this.model) {
                print("Error, please set ML Model asset input");
                return;
            }
            this.mlComponent = this.getSceneObject().createComponent("MLComponent");
            this.mlComponent.model = this.model;
            this.mlComponent.onLoadingFinished = () => this.onLoadingFinished();
            this.mlComponent.inferenceMode = MachineLearning.InferenceMode.Accelerator;
            this.mlComponent.build([]);
        }
        // START 
        getMLOutputs() {
            return this.outputs;
        }
        /**
         * Get the YOLO processor for external use
         */
        getYOLOProcessor() {
            return this.yoloProcessor;
        }
        /**
         * Get the latest detections processed by this spatializer
         */
        getLatestDetections() {
            if (!this.yoloProcessor || !this.outputs) {
                return [];
            }
            try {
                // Process YOLO outputs to get raw detections
                const detections = this.yoloProcessor.parseYolo7Outputs(this.outputs);
                // Apply the same filtering used internally
                return this.filterDetectionsByCenter(detections);
            }
            catch (e) {
                if (this.debugLogging) {
                    this.logMessage("Error getting latest detections: " + e);
                }
                return [];
            }
        }
        /**
         * Get raw unfiltered detections (for debugging purposes)
         */
        getRawDetections() {
            if (!this.yoloProcessor || !this.outputs) {
                return [];
            }
            try {
                // Process YOLO outputs to get raw detections without filtering
                return this.yoloProcessor.parseYolo7Outputs(this.outputs);
            }
            catch (e) {
                if (this.debugLogging) {
                    this.logMessage("Error getting raw detections: " + e);
                }
                return [];
            }
        }
        // END 
        /**
         * Configure inputs and outputs, start running ML component
         */
        onLoadingFinished() {
            this.outputs = this.mlComponent.getOutputs();
            this.inputs = this.mlComponent.getInputs();
            this.printInfo("Model built");
            // Initialize YOLO processor with model inputs/outputs
            this.yoloProcessor.initialize(this.outputs, this.inputs);
            // Assign input texture
            this.inputs[0].texture = this.inputTexture;
            // Log input texture assignment
            if (this.debugLogging) {
                if (this.inputTexture) {
                    this.logMessage(`Assigned input texture: ${this.inputTexture.name || "unnamed"}`);
                }
                else {
                    this.logMessage("Warning: No input texture assigned");
                }
            }
            // Run on update
            this.mlComponent.runScheduled(true, MachineLearning.FrameTiming.Update, MachineLearning.FrameTiming.Update);
            // Process outputs on script update (after ml update)
            this.createEvent("UpdateEvent").bind((eventData) => this.onUpdate(eventData));
        }
        /**
         * Process outputs on each update
         */
        onUpdate(eventData) {
            if (this.isRunning || !this.isInitialized) {
                return;
            }
            this.isRunning = true;
            try {
                // Process YOLO outputs
                const detections = this.yoloProcessor.parseYolo7Outputs(this.outputs);
                // Filter detections based on center threshold
                const filteredDetections = this.filterDetectionsByCenter(detections);
                this.onRunningFinished(filteredDetections);
            }
            catch (e) {
                log.e("Error processing ML output: " + e);
                this.logMessage("Error: ML processing failed: " + e);
            }
            finally {
                this.isRunning = false;
            }
        }
        /**
         * Filter detections based on their distance from center of screen
         * Detections too far from center will be excluded
         */
        filterDetectionsByCenter(detections) {
            if (this.centerThreshold <= 0) {
                return detections; // No filtering needed
            }
            return detections.filter(detection => {
                // Get center coordinates (0-1)
                const centerX = detection.bbox[0];
                const centerY = detection.bbox[1];
                // Calculate distance from center of screen (0.5, 0.5)
                // Normalize to 0-1 range where 0 is center and 1 is corner
                const distanceX = Math.abs(centerX - 0.5) * 2; // 0 at center, 1 at edges
                const distanceY = Math.abs(centerY - 0.5) * 2; // 0 at center, 1 at edges
                // Use the maximum of the two distances as our metric
                const maxDistance = Math.max(distanceX, distanceY);
                // Keep detection if distance is less than threshold
                const shouldKeep = maxDistance < this.centerThreshold;
                if (this.debugLogging && !shouldKeep) {
                    log.d(`Filtered out detection at (${centerX.toFixed(2)}, ${centerY.toFixed(2)}) with distance ${maxDistance.toFixed(2)} > threshold ${this.centerThreshold}`);
                }
                return shouldKeep;
            });
        }
        /**
         * Process ML results and log detections
         */
        onRunningFinished(detections) {
            // Log detection results if debug is enabled
            if (this.debugLogging) {
                if (detections.length === 0) {
                    print("[MLSpatializer] No objects detected");
                    // Only log this message occasionally to avoid spamming
                    if (Math.random() < 0.05) {
                        // ~5% of frames
                        this.logMessage("TIP: If you're sure objects should be detected, try these troubleshooting steps:");
                        this.logMessage("1. Point camera at clear examples of objects to detect");
                        this.logMessage("2. Lower scoreThreshold in inspector (try 0.2 or 0.1)");
                        this.logMessage("3. Ensure all classes are enabled");
                        this.logMessage("4. Check input texture is correctly assigned");
                    }
                }
                else {
                    print(`[MLSpatializer] Detected ${detections.length} objects:`);
                    detections.forEach((detection, index) => {
                        if (index < 5) {
                            // Limit to first 5 detections to avoid console spam
                            print(`  - ${detection.label}: ${Math.round(detection.score * 100)}% confidence at [${detection.bbox[0].toFixed(2)}, ${detection.bbox[1].toFixed(2)}]`);
                        }
                    });
                    if (detections.length > 5) {
                        print(`  - ... and ${detections.length - 5} more`);
                    }
                    // Update log text with current detection info
                    this.logMessage(`Detected ${detections.length} objects. Highest confidence: ${Math.round(detections[0].score * 100)}% (${detections[0].label})`);
                }
            }
            // Update detection timestamps for persistence tracking
            const currentTime = getTime();
            for (let i = 0; i < Math.min(detections.length, this.maxDetectionCount); i++) {
                this.detectionTimestamps[i] = currentTime;
            }
            // Emit the onDetectionsUpdated event with the result
            this.onDetectionsUpdated.trigger(detections);
            if (this.enableCallbacks) {
                // Handle monitor detection callbacks
                this.handleMonitorDetectionCallbacks(detections.length > 0);
            }
        }
        /**
         * Handle callbacks for monitor detection state changes
         * This is used by SmartTether to know when a monitor is detected or lost
         */
        handleMonitorDetectionCallbacks(isMonitorDetected) {
            // Only trigger callbacks when the state changes
            if (isMonitorDetected !== this.lastMonitorDetectionState) {
                this.lastMonitorDetectionState = isMonitorDetected;
                if (this.debugLogging) {
                    this.logMessage(`Monitor detection state changed to: ${isMonitorDetected ? "detected" : "lost"}`);
                }
                // Call the appropriate callbacks
                for (let i = 0; i < this.monitorDetectionCallbacks.length; i++) {
                    try {
                        const callback = this.monitorDetectionCallbacks[i];
                        const functionName = isMonitorDetected ?
                            this.monitorDetectedFunctions[i] :
                            this.monitorLostFunctions[i];
                        if (callback && typeof callback[functionName] === "function") {
                            callback[functionName]();
                        }
                    }
                    catch (e) {
                        log.e(`Error calling monitor detection callback: ${e}`);
                    }
                }
            }
        }
        /**
         * Print debug info if enabled
         */
        printInfo(msg) {
            if (this.debugLogging) {
                print(msg);
            }
        }
        /**
         * Update the log text component
         */
        logMessage(message) {
            if (this.logText) {
                this.logText.text = message;
            }
            if (this.debugLogging) {
                print("MLSpatializer: " + message);
            }
        }
        /**
         * Public method to get the onDetectionsUpdated event
         */
        getDetectionsUpdatedEvent() {
            return this.onDetectionsUpdated;
        }
        onDestroy() {
            // Clean up resources - no spatialization components to clean up
            this.detectionTimestamps = [];
        }
    };
    __setFunctionName(_classThis, "MLSpatializer");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MLSpatializer = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MLSpatializer = _classThis;
})();
exports.MLSpatializer = MLSpatializer;
//# sourceMappingURL=MLSpatializer.js.map