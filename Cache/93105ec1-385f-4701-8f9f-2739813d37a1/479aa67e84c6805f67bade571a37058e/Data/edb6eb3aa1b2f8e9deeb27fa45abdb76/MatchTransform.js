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
exports.MatchTransformTS = void 0;
var __selfType = requireType("./MatchTransform");
function component(target) { target.getTypeName = function () { return __selfType; }; }
/**
 * Optionally matches the position, rotation, or scale of another object.
 * Works in-editor.
 */
let MatchTransformTS = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var MatchTransformTS = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.target = this.target;
            this.positionOffset = this.positionOffset;
            this.usePositionLerp = this.usePositionLerp;
            this.positionLerpSpeed = this.positionLerpSpeed;
            this.rotationLerpSpeed = this.rotationLerpSpeed;
            this.scaleLerpSpeed = this.scaleLerpSpeed;
            this.constrainPositionX = this.constrainPositionX;
            this.constrainPositionY = this.constrainPositionY;
            this.constrainPositionZ = this.constrainPositionZ;
            this.constrainRotationX = this.constrainRotationX;
            this.constrainRotationY = this.constrainRotationY;
            this.constrainRotationZ = this.constrainRotationZ;
            this.constrainScaleX = this.constrainScaleX;
            this.constrainScaleY = this.constrainScaleY;
            this.constrainScaleZ = this.constrainScaleZ;
        }
        __initialize() {
            super.__initialize();
            this.target = this.target;
            this.positionOffset = this.positionOffset;
            this.usePositionLerp = this.usePositionLerp;
            this.positionLerpSpeed = this.positionLerpSpeed;
            this.rotationLerpSpeed = this.rotationLerpSpeed;
            this.scaleLerpSpeed = this.scaleLerpSpeed;
            this.constrainPositionX = this.constrainPositionX;
            this.constrainPositionY = this.constrainPositionY;
            this.constrainPositionZ = this.constrainPositionZ;
            this.constrainRotationX = this.constrainRotationX;
            this.constrainRotationY = this.constrainRotationY;
            this.constrainRotationZ = this.constrainRotationZ;
            this.constrainScaleX = this.constrainScaleX;
            this.constrainScaleY = this.constrainScaleY;
            this.constrainScaleZ = this.constrainScaleZ;
        }
        // Initialize with the proper pattern
        onAwake() {
            this.createEvent("OnStartEvent").bind(() => {
                this.onStart();
            });
            this.createEvent("UpdateEvent").bind(() => {
                this.onUpdate();
            });
        }
        onStart() {
            if (!this.target) {
                print("No target set for MatchTransform - please set a target object");
            }
        }
        onUpdate() {
            if (!this.target)
                return;
            this.updateTransform();
        }
        /**
         * Update this object's transform to match the target's transform with constraints.
         */
        updateTransform() {
            // Get current transform details
            const myTransform = this.sceneObject.getTransform();
            const targetTransform = this.target.getTransform();
            // Handle position matching with optional constraints
            this.updatePosition(myTransform, targetTransform);
            // Handle rotation matching with optional constraints
            this.updateRotation(myTransform, targetTransform);
            // Handle scale matching with optional constraints
            this.updateScale(myTransform, targetTransform);
        }
        /**
         * Update the position based on target and constraints.
         */
        updatePosition(myTransform, targetTransform) {
            // Get target position
            const targetPos = targetTransform.getWorldPosition();
            // Apply offset in world space
            // Note: In a real implementation with proper transform hierarchy,
            // we would need to transform the offset from local to world space
            const targetPosition = new vec3(targetPos.x + this.positionOffset.x, targetPos.y + this.positionOffset.y, targetPos.z + this.positionOffset.z);
            const currentPosition = myTransform.getWorldPosition();
            // Apply constraints
            let newPosition = new vec3(this.constrainPositionX ? currentPosition.x : targetPosition.x, this.constrainPositionY ? currentPosition.y : targetPosition.y, this.constrainPositionZ ? currentPosition.z : targetPosition.z);
            // Apply lerp if enabled, otherwise use direct position matching
            if (this.usePositionLerp) {
                // Smooth transition with lerp
                newPosition = this.lerpVector(currentPosition, newPosition, this.positionLerpSpeed * getDeltaTime());
            }
            else {
                // Direct 1:1 position matching (no lerp)
                // newPosition is already set correctly from constraints
            }
            // Set the new position
            myTransform.setWorldPosition(newPosition);
        }
        /**
         * Update the rotation based on target and constraints.
         */
        updateRotation(myTransform, targetTransform) {
            const targetRotation = targetTransform.getWorldRotation();
            const currentRotation = myTransform.getWorldRotation();
            // Convert to Euler angles for constraints
            const targetEuler = this.quaternionToEuler(targetRotation);
            const currentEuler = this.quaternionToEuler(currentRotation);
            // Apply constraints
            const newEuler = new vec3(this.constrainRotationX ? currentEuler.x : targetEuler.x, this.constrainRotationY ? currentEuler.y : targetEuler.y, this.constrainRotationZ ? currentEuler.z : targetEuler.z);
            // Convert back to quaternion
            const newRotation = quat.fromEulerAngles(newEuler.x, newEuler.y, newEuler.z);
            // Apply lerp
            const lerpedRotation = quat.slerp(currentRotation, newRotation, this.rotationLerpSpeed * getDeltaTime());
            // Set the new rotation
            myTransform.setWorldRotation(lerpedRotation);
        }
        /**
         * Update the scale based on target and constraints.
         */
        updateScale(myTransform, targetTransform) {
            const targetScale = targetTransform.getWorldScale();
            const currentScale = myTransform.getLocalScale();
            // Apply constraints
            const newScale = new vec3(this.constrainScaleX ? currentScale.x : targetScale.x, this.constrainScaleY ? currentScale.y : targetScale.y, this.constrainScaleZ ? currentScale.z : targetScale.z);
            // Apply lerp
            const lerpedScale = this.lerpVector(currentScale, newScale, this.scaleLerpSpeed * getDeltaTime());
            // Set the new scale
            myTransform.setLocalScale(lerpedScale);
        }
        /**
         * Convert quaternion to Euler angles (in radians).
         * @param q The quaternion to convert
         * @returns Euler angles in radians (x, y, z order)
         */
        quaternionToEuler(q) {
            // This is an approximation that works for most cases
            // In a real implementation, we would handle gimbal lock cases
            // Extract the Euler angles from the quaternion
            const x = q.x;
            const y = q.y;
            const z = q.z;
            const w = q.w;
            // Roll (x-axis rotation)
            const sinr_cosp = 2 * (w * x + y * z);
            const cosr_cosp = 1 - 2 * (x * x + y * y);
            const roll = Math.atan2(sinr_cosp, cosr_cosp);
            // Pitch (y-axis rotation)
            const sinp = 2 * (w * y - z * x);
            let pitch;
            if (Math.abs(sinp) >= 1) {
                // Use 90 degrees if out of range
                pitch = Math.sign(sinp) * Math.PI / 2;
            }
            else {
                pitch = Math.asin(sinp);
            }
            // Yaw (z-axis rotation)
            const siny_cosp = 2 * (w * z + x * y);
            const cosy_cosp = 1 - 2 * (y * y + z * z);
            const yaw = Math.atan2(siny_cosp, cosy_cosp);
            return new vec3(roll, pitch, yaw);
        }
        /**
         * Linear interpolation between two vectors.
         * @param a Start vector
         * @param b End vector
         * @param t Interpolation parameter (0-1)
         * @returns Interpolated vector
         */
        lerpVector(a, b, t) {
            // Clamp t to [0, 1]
            const clampedT = Math.max(0, Math.min(1, t));
            // Interpolate each component
            return new vec3(a.x + (b.x - a.x) * clampedT, a.y + (b.y - a.y) * clampedT, a.z + (b.z - a.z) * clampedT);
        }
    };
    __setFunctionName(_classThis, "MatchTransformTS");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MatchTransformTS = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MatchTransformTS = _classThis;
})();
exports.MatchTransformTS = MatchTransformTS;
//# sourceMappingURL=MatchTransform.js.map