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
exports.SmartTether = void 0;
var __selfType = requireType("./SmartTether");
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
/**
 * Tethers content to a target, repositioning when it moves too far away
 * or when the angle between target's forward and direction to object exceeds threshold.
 */
let SmartTether = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var SmartTether = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.target = this.target;
            this.verticalDistanceFromTarget = this.verticalDistanceFromTarget;
            this.horizontalDistanceFromTarget = this.horizontalDistanceFromTarget;
            this.reorientDuringTargetRotation = this.reorientDuringTargetRotation;
            this.flattenDuringTargetRotation = this.flattenDuringTargetRotation;
            this.offset = this.offset;
            this.offsetWithoutDetectedObject = this.offsetWithoutDetectedObject;
            this.offsetWithDetectedObject = this.offsetWithDetectedObject;
            this.lerpSpeed = this.lerpSpeed;
            this._targetPosition = new vec3(0, 0, 0);
            this._currentAngle = 0;
            this._flatAngle = 0;
            this._targetDir = new vec3(0, 0, 0);
            this._flatForward = new vec3(0, 0, 0);
        }
        __initialize() {
            super.__initialize();
            this.target = this.target;
            this.verticalDistanceFromTarget = this.verticalDistanceFromTarget;
            this.horizontalDistanceFromTarget = this.horizontalDistanceFromTarget;
            this.reorientDuringTargetRotation = this.reorientDuringTargetRotation;
            this.flattenDuringTargetRotation = this.flattenDuringTargetRotation;
            this.offset = this.offset;
            this.offsetWithoutDetectedObject = this.offsetWithoutDetectedObject;
            this.offsetWithDetectedObject = this.offsetWithDetectedObject;
            this.lerpSpeed = this.lerpSpeed;
            this._targetPosition = new vec3(0, 0, 0);
            this._currentAngle = 0;
            this._flatAngle = 0;
            this._targetDir = new vec3(0, 0, 0);
            this._flatForward = new vec3(0, 0, 0);
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
                print("No target set for Tether - please set a target object");
                return;
            }
            // Initialize target position
            this._targetPosition = this.calculateNewTargetPosition();
        }
        onUpdate() {
            if (!this.target)
                return;
            // Calculate the angles
            this._currentAngle = this.calculateAngle();
            this._flatAngle = this.calculateFlatAngle();
            // Check if we need to reposition
            if (this.shouldReposition()) {
                this._targetPosition = this.calculateNewTargetPosition();
            }
            // Update position with lerping
            this.updateContentPosition();
        }
        /**
         * Calculate the new target position based on offset and rotation settings.
         */
        calculateNewTargetPosition() {
            const targetTransform = this.target.getTransform();
            const targetPos = targetTransform.getWorldPosition();
            if (this.reorientDuringTargetRotation) {
                if (this.flattenDuringTargetRotation) {
                    // Get target's forward and right, but flatten them
                    const targetRotation = targetTransform.getWorldRotation();
                    // Get the forward direction
                    const forward = this.getForwardVector(targetRotation);
                    const flattenedForward = this.normalizeVector(new vec3(forward.x, 0, forward.z));
                    // Get the right direction
                    const right = this.getRightVector(targetRotation);
                    const flattenedRight = this.normalizeVector(new vec3(right.x, 0, right.z));
                    // Calculate new position using the flattened directions
                    return new vec3(targetPos.x + flattenedRight.x * this.offset.x + this.offset.y * 0 + flattenedForward.x * this.offset.z, targetPos.y + flattenedRight.y * this.offset.x + this.offset.y * 1 + flattenedForward.y * this.offset.z, targetPos.z + flattenedRight.z * this.offset.x + this.offset.y * 0 + flattenedForward.z * this.offset.z);
                }
                else {
                    // Apply offset in target's local space
                    const targetRot = targetTransform.getWorldRotation();
                    // Transform offset by target's rotation
                    const rotatedOffset = this.rotateVectorByQuaternion(this.offset, targetRot);
                    // Add to target position
                    return new vec3(targetPos.x + rotatedOffset.x, targetPos.y + rotatedOffset.y, targetPos.z + rotatedOffset.z);
                }
            }
            // Simple offset in world space
            return new vec3(targetPos.x + this.offset.x, targetPos.y + this.offset.y, targetPos.z + this.offset.z);
        }
        /**
         * Check if the content should be repositioned.
         */
        shouldReposition() {
            const myPos = this.sceneObject.getTransform().getWorldPosition();
            const targetPos = this.target.getTransform().getWorldPosition();
            // Calculate displacement vector to target
            const toTarget = new vec3(myPos.x - targetPos.x, myPos.y - targetPos.y, myPos.z - targetPos.z);
            // Calculate vertical and horizontal distances
            const verticalDistance = Math.abs(toTarget.y);
            const horizontalDistance = Math.sqrt(toTarget.x * toTarget.x + toTarget.z * toTarget.z);
            // Check if any threshold is exceeded
            return verticalDistance > this.verticalDistanceFromTarget ||
                horizontalDistance > this.horizontalDistanceFromTarget;
        }
        /**
         * Update the content's position with lerping.
         */
        updateContentPosition() {
            const myTransform = this.sceneObject.getTransform();
            const currentPos = myTransform.getWorldPosition();
            // Lerp to the target position
            const newPos = this.lerpVector(currentPos, this._targetPosition, this.lerpSpeed * getDeltaTime());
            // Apply the new position
            myTransform.setWorldPosition(newPos);
        }
        updateOffsetWithDetectedObject() {
            print("updateOffsetWithDetectedObject");
            this.offset = this.offsetWithDetectedObject;
        }
        updateOffsetWithoutDetectedObject() {
            print("updateOffsetWithoutDetectedObject");
            this.offset = this.offsetWithoutDetectedObject;
        }
        /**
         * Calculate the angle between target's forward and direction to the object on XZ plane.
         */
        calculateFlatAngle() {
            // Calculate direction from target to object
            const myPos = this.sceneObject.getTransform().getWorldPosition();
            const targetPos = this.target.getTransform().getWorldPosition();
            this._targetDir = new vec3(myPos.x - targetPos.x, 0, // Ignore Y component for flat angle calculation
            myPos.z - targetPos.z);
            // Get target's forward vector and flatten it
            const targetRotation = this.target.getTransform().getWorldRotation();
            const forward = this.getForwardVector(targetRotation);
            this._flatForward = this.normalizeVector(new vec3(forward.x, 0, forward.z));
            // Calculate the signed angle
            return this.signedAngle(this._targetDir, this._flatForward);
        }
        /**
         * Calculate the signed angle between two vectors on the XZ plane.
         */
        signedAngle(from, to) {
            // Ensure vectors are normalized
            const normalizedFrom = this.normalizeVector(from);
            const normalizedTo = this.normalizeVector(to);
            // Calculate the angle using dot product
            const dot = this.dotProduct(normalizedFrom, normalizedTo);
            let angle = Math.acos(Math.max(-1, Math.min(1, dot))) * (180 / Math.PI);
            // Determine the sign using cross product
            const cross = this.crossProduct(normalizedFrom, normalizedTo);
            if (cross.y < 0)
                angle = -angle;
            return angle;
        }
        /**
         * Calculate the cross product between two vectors.
         */
        crossProduct(v1, v2) {
            return new vec3(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x * v2.z, v1.x * v2.y - v1.y * v2.x);
        }
        /**
         * Calculate the angle between target's forward and our forward.
         */
        calculateAngle() {
            const myTransform = this.sceneObject.getTransform();
            const targetTransform = this.target.getTransform();
            // Get forward vectors
            const myForward = this.getForwardVector(myTransform.getWorldRotation());
            const targetForward = this.getForwardVector(targetTransform.getWorldRotation());
            // Calculate the angle between them
            const dot = this.dotProduct(myForward, targetForward);
            const angle = Math.acos(Math.max(-1, Math.min(1, dot))) * (180 / Math.PI);
            return angle;
        }
        /**
         * Get the forward vector from a rotation.
         */
        getForwardVector(rotation) {
            // Transform the local forward vector (0,0,1) by the rotation
            return this.rotateVectorByQuaternion(new vec3(0, 0, 1), rotation);
        }
        /**
         * Get the right vector from a rotation.
         */
        getRightVector(rotation) {
            // Transform the local right vector (1,0,0) by the rotation
            return this.rotateVectorByQuaternion(new vec3(1, 0, 0), rotation);
        }
        /**
         * Calculate the dot product between two vectors.
         */
        dotProduct(v1, v2) {
            return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
        }
        /**
         * Rotate a vector by a quaternion.
         */
        rotateVectorByQuaternion(vector, rotation) {
            const x = rotation.x;
            const y = rotation.y;
            const z = rotation.z;
            const w = rotation.w;
            // Apply the quaternion rotation to the vector
            // Formula: q * v * q^-1 simplified
            const ix = w * vector.x + y * vector.z - z * vector.y;
            const iy = w * vector.y + z * vector.x - x * vector.z;
            const iz = w * vector.z + x * vector.y - y * vector.x;
            const iw = -x * vector.x - y * vector.y - z * vector.z;
            const result = new vec3(ix * w + iw * -x + iy * -z - iz * -y, iy * w + iw * -y + iz * -x - ix * -z, iz * w + iw * -z + ix * -y - iy * -x);
            return result;
        }
        /**
         * Linear interpolation between two vectors.
         */
        lerpVector(a, b, t) {
            const clampedT = Math.max(0, Math.min(1, t));
            return new vec3(a.x + (b.x - a.x) * clampedT, a.y + (b.y - a.y) * clampedT, a.z + (b.z - a.z) * clampedT);
        }
        /**
         * Normalize a vector to unit length.
         */
        normalizeVector(v) {
            const length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
            if (length < 0.0001) {
                return new vec3(0, 0, 0);
            }
            return new vec3(v.x / length, v.y / length, v.z / length);
        }
        /**
         * Convert quaternion to Euler angles (degrees).
         */
        quaternionToEulerAngles(q) {
            // Implement quaternion to Euler angles conversion
            // This is a simplified conversion that may have gimbal lock issues
            const x = q.x, y = q.y, z = q.z, w = q.w;
            // Roll (x-axis rotation)
            const sinr_cosp = 2 * (w * x + y * z);
            const cosr_cosp = 1 - 2 * (x * x + y * y);
            const roll = Math.atan2(sinr_cosp, cosr_cosp) * (180 / Math.PI);
            // Pitch (y-axis rotation)
            let pitch;
            const sinp = 2 * (w * y - z * x);
            if (Math.abs(sinp) >= 1) {
                // Use 90 degrees if out of range
                pitch = Math.sign(sinp) * 90;
            }
            else {
                pitch = Math.asin(sinp) * (180 / Math.PI);
            }
            // Yaw (z-axis rotation)
            const siny_cosp = 2 * (w * z + x * y);
            const cosy_cosp = 1 - 2 * (y * y + z * z);
            const yaw = Math.atan2(siny_cosp, cosy_cosp) * (180 / Math.PI);
            return new vec3(roll, pitch, yaw);
        }
        /**
         * Convert Euler angles (degrees) to quaternion.
         */
        eulerAnglesToQuaternion(pitch, yaw, roll) {
            // Convert Euler angles to quaternion
            // Convert degrees to radians
            const pitchRad = pitch * (Math.PI / 180);
            const yawRad = yaw * (Math.PI / 180);
            const rollRad = roll * (Math.PI / 180);
            // Calculate quaternion components using Euler angles
            const cy = Math.cos(yawRad * 0.5);
            const sy = Math.sin(yawRad * 0.5);
            const cp = Math.cos(pitchRad * 0.5);
            const sp = Math.sin(pitchRad * 0.5);
            const cr = Math.cos(rollRad * 0.5);
            const sr = Math.sin(rollRad * 0.5);
            const w = cr * cp * cy + sr * sp * sy;
            const x = sr * cp * cy - cr * sp * sy;
            const y = cr * sp * cy + sr * cp * sy;
            const z = cr * cp * sy - sr * sp * cy;
            return new quat(x, y, z, w);
        }
    };
    __setFunctionName(_classThis, "SmartTether");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SmartTether = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SmartTether = _classThis;
})();
exports.SmartTether = SmartTether;
//# sourceMappingURL=SmartTether.js.map