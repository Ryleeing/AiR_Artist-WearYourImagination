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
exports.SurfaceDetection = void 0;
var __selfType = requireType("./SurfaceDetection");
function component(target) { target.getTypeName = function () { return __selfType; }; }
let SurfaceDetection = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var SurfaceDetection = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.camObj = this.camObj;
            this.visualObj = this.visualObj;
            this.vertical = this.vertical;
            this.worldQueryModule = require("LensStudio:WorldQueryModule");
            // Set min and max hit distance to surfaces
            this.MAX_HIT_DISTANCE = 1000;
            this.MIN_HIT_DISTANCE = 50;
            // Number of frames before surface detection completes
            this.CALIBRATION_FRAMES = 30;
            // Distance in cm the surface visual can move before canceling
            this.MOVE_DISTANCE_THRESHOLD = 5;
            // Minimum distance threshold for vertical surface updates (in cm)
            this.VERTICAL_MIN_MOVE_THRESHOLD = 1.0;
            // Distance in cm from camera to visual when no surface is hit
            this.DEFAULT_SCREEN_DISTANCE = 200;
            this.SPEED = 10;
            // Higher smoothing factor for vertical surfaces
            this.VERTICAL_SMOOTHING = 0.85;
            this.calibrationPosition = vec3.zero();
            this.calibrationRotation = quat.quatIdentity();
            this.desiredPosition = vec3.zero();
            this.desiredRotation = quat.quatIdentity();
            // For smoothing vertical surface detection
            this.smoothedPosition = vec3.zero();
            this.isVerticalSurface = false;
            this.lastValidPosition = vec3.zero();
            this.hitTestSession = null;
            this.updateEvent = null;
            this.history = [];
            this.calibrationFrames = 0;
            this.onGroundFoundCallback = null;
        }
        __initialize() {
            super.__initialize();
            this.camObj = this.camObj;
            this.visualObj = this.visualObj;
            this.vertical = this.vertical;
            this.worldQueryModule = require("LensStudio:WorldQueryModule");
            // Set min and max hit distance to surfaces
            this.MAX_HIT_DISTANCE = 1000;
            this.MIN_HIT_DISTANCE = 50;
            // Number of frames before surface detection completes
            this.CALIBRATION_FRAMES = 30;
            // Distance in cm the surface visual can move before canceling
            this.MOVE_DISTANCE_THRESHOLD = 5;
            // Minimum distance threshold for vertical surface updates (in cm)
            this.VERTICAL_MIN_MOVE_THRESHOLD = 1.0;
            // Distance in cm from camera to visual when no surface is hit
            this.DEFAULT_SCREEN_DISTANCE = 200;
            this.SPEED = 10;
            // Higher smoothing factor for vertical surfaces
            this.VERTICAL_SMOOTHING = 0.85;
            this.calibrationPosition = vec3.zero();
            this.calibrationRotation = quat.quatIdentity();
            this.desiredPosition = vec3.zero();
            this.desiredRotation = quat.quatIdentity();
            // For smoothing vertical surface detection
            this.smoothedPosition = vec3.zero();
            this.isVerticalSurface = false;
            this.lastValidPosition = vec3.zero();
            this.hitTestSession = null;
            this.updateEvent = null;
            this.history = [];
            this.calibrationFrames = 0;
            this.onGroundFoundCallback = null;
        }
        onAwake() {
            if (!this.camObj) {
                print("Please set Camera Obj input");
                return;
            }
            this.camTrans = this.camObj.getTransform();
            this.visualTrans = this.visualObj.getTransform();
            this.visualObj.enabled = false;
            try {
                const options = HitTestSessionOptions.create();
                options.filter = true;
                this.hitTestSession = this.worldQueryModule.createHitTestSessionWithOptions(options);
            }
            catch (e) {
                print(e);
            }
            this.createEvent("OnStartEvent").bind(() => {
                this.setDefaultPosition();
            });
        }
        startGroundCalibration(callback) {
            this.setDefaultPosition();
            this.hitTestSession?.start();
            this.visualObj.enabled = true;
            this.history = [];
            this.calibrationFrames = 0;
            this.onGroundFoundCallback = callback;
            this.updateEvent = this.createEvent("UpdateEvent");
            this.updateEvent.bind(() => {
                this.update();
            });
        }
        setDefaultPosition() {
            this.desiredPosition = this.camTrans.getWorldPosition().add(this.camTrans.forward.uniformScale(-this.DEFAULT_SCREEN_DISTANCE));
            this.desiredRotation = this.camTrans.getWorldRotation();
            this.visualTrans.setWorldPosition(this.desiredPosition);
            this.visualTrans.setWorldRotation(this.desiredRotation);
        }
        update() {
            const rayDirection = this.camTrans.forward;
            rayDirection.y += .1;
            const camPos = this.camTrans.getWorldPosition();
            const rayStart = camPos.add(rayDirection.uniformScale(-this.MIN_HIT_DISTANCE));
            const rayEnd = camPos.add(rayDirection.uniformScale(-this.MAX_HIT_DISTANCE));
            this.hitTestSession.hitTest(rayStart, rayEnd, (hitTestResult) => {
                this.onHitTestResult(hitTestResult);
            });
        }
        onHitTestResult(hitTestResult) {
            let foundPosition = vec3.zero();
            let foundNormal = vec3.zero();
            if (hitTestResult != null) {
                foundPosition = hitTestResult.position;
                foundNormal = hitTestResult.normal;
            }
            this.updateCalibration(foundPosition, foundNormal);
        }
        updateCalibration(foundPosition, foundNormal) {
            const currPosition = this.visualTrans.getWorldPosition();
            const currRotation = this.visualTrans.getWorldRotation();
            this.desiredPosition = this.camTrans.getWorldPosition().add(this.camTrans.forward.uniformScale(-this.DEFAULT_SCREEN_DISTANCE));
            this.desiredRotation = this.camTrans.getWorldRotation();
            //check if horizontal plane is being tracked
            if (foundNormal.distance(vec3.up()) < .1 && !this.vertical) {
                //make calibration face camera
                this.desiredPosition = foundPosition;
                const worldCameraForward = this.camTrans.right.cross(vec3.up()).normalize();
                this.desiredRotation = quat.lookAt(worldCameraForward, foundNormal);
                this.desiredRotation = this.desiredRotation.multiply(quat.fromEulerVec(new vec3(-Math.PI / 2, 0, 0)));
                this.history.push(this.desiredPosition);
                if (this.history.length > this.CALIBRATION_FRAMES) {
                    this.history.shift();
                }
                const distance = this.history[0].distance(this.history[this.history.length - 1]);
                if (distance < this.MOVE_DISTANCE_THRESHOLD) {
                    this.calibrationFrames++;
                }
                else {
                    this.calibrationFrames = 0;
                }
            }
            else if (Math.abs(foundNormal.dot(vec3.up())) < .5 && this.vertical) {
                //make calibration face camera
                this.isVerticalSurface = true;
                // Save the found position as the raw desired position
                const rawDesiredPosition = foundPosition;
                // Initialize smoothed position if this is first vertical surface detection
                if (this.lastValidPosition.equal(vec3.zero())) {
                    this.lastValidPosition = rawDesiredPosition;
                    this.smoothedPosition = rawDesiredPosition;
                }
                // Only update if movement exceeds minimum threshold (reduces micro-jitters)
                const movementDistance = this.lastValidPosition.distance(rawDesiredPosition);
                if (movementDistance > this.VERTICAL_MIN_MOVE_THRESHOLD) {
                    // Apply exponential smoothing to reduce jitter
                    this.smoothedPosition = vec3.lerp(this.smoothedPosition, rawDesiredPosition, 1.0 - this.VERTICAL_SMOOTHING);
                    // Update last valid position
                    this.lastValidPosition = rawDesiredPosition;
                }
                // Use smoothed position for vertical surfaces
                this.desiredPosition = this.smoothedPosition;
                // Calculate the up vector for the surface - use world up
                const surfaceUp = vec3.up();
                // Calculate the forward vector - this should be the surface normal
                const surfaceForward = foundNormal;
                // Calculate the right vector by crossing up and forward
                const surfaceRight = surfaceUp.cross(surfaceForward).normalize();
                // Recalculate a proper up vector to ensure orthogonality
                const adjustedUp = surfaceForward.cross(surfaceRight).normalize();
                // Use lookAt to create base rotation - looking along the normal with the up direction
                this.desiredRotation = quat.lookAt(surfaceForward, vec3.up());
                this.history.push(this.desiredPosition);
                if (this.history.length > this.CALIBRATION_FRAMES) {
                    this.history.shift();
                }
                const distance = this.history[0].distance(this.history[this.history.length - 1]);
                if (distance < this.MOVE_DISTANCE_THRESHOLD) {
                    this.calibrationFrames++;
                }
                else {
                    this.calibrationFrames = 0;
                }
            }
            else {
                this.calibrationFrames = 0;
                this.history = [];
                this.isVerticalSurface = false;
            }
            const calibrationAmount = this.calibrationFrames / this.CALIBRATION_FRAMES;
            if (calibrationAmount == 1) {
                this.calibrationPosition = this.desiredPosition;
                const rotOffset = quat.fromEulerVec(new vec3(Math.PI / 2, 0, 0));
                this.calibrationRotation = this.desiredRotation.multiply(rotOffset);
            }
            //interpolate - use more aggressive smoothing for vertical surfaces
            const speedFactor = this.isVerticalSurface ? this.SPEED * 0.5 : this.SPEED;
            this.visualTrans.setWorldPosition(vec3.lerp(currPosition, this.desiredPosition, getDeltaTime() * speedFactor));
            this.visualTrans.setWorldRotation(quat.slerp(currRotation, this.desiredRotation, getDeltaTime() * speedFactor));
        }
        onCalibrationComplete() {
            // Keep the hit test session running to continue updating position
            // this.hitTestSession?.stop();
            //this.onGroundFoundCallback?.(this.calibrationPosition, this.calibrationRotation);
        }
    };
    __setFunctionName(_classThis, "SurfaceDetection");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SurfaceDetection = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SurfaceDetection = _classThis;
})();
exports.SurfaceDetection = SurfaceDetection;
//# sourceMappingURL=SurfaceDetection.js.map