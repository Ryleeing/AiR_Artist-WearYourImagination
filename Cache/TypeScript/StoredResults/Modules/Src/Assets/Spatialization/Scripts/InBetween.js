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
exports.InBetween = void 0;
var __selfType = requireType("./InBetween");
function component(target) { target.getTypeName = function () { return __selfType; }; }
/**
 * Utility for calculating positions and rotations between two objects.
 */
let InBetween = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var InBetween = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.target1 = this.target1;
            this.target2 = this.target2;
            this.applyPosition = this.applyPosition;
            this.applyRotation = this.applyRotation;
            this.positionBlend = this.positionBlend;
            this.rotationBlend = this.rotationBlend;
        }
        __initialize() {
            super.__initialize();
            this.target1 = this.target1;
            this.target2 = this.target2;
            this.applyPosition = this.applyPosition;
            this.applyRotation = this.applyRotation;
            this.positionBlend = this.positionBlend;
            this.rotationBlend = this.rotationBlend;
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
            if (!this.target1 || !this.target2) {
                print("Warning: Both targets must be set for InBetweenUtility");
            }
        }
        onUpdate() {
            if (!this.target1 || !this.target2)
                return;
            const transform = this.sceneObject.getTransform();
            // Apply position if enabled
            if (this.applyPosition) {
                const newPosition = this.getInBetweenPosition(this.target1, this.target2, this.positionBlend);
                transform.setWorldPosition(newPosition);
            }
            // Apply rotation if enabled
            if (this.applyRotation) {
                const target1Forward = this.getForwardVector(this.target1);
                const target2Forward = this.getForwardVector(this.target2);
                // Apply the in-between rotation to this object
                const newRotation = this.getInBetweenRotation(target1Forward, target2Forward, this.rotationBlend);
                transform.setWorldRotation(newRotation);
            }
        }
        /**
         * Gets the position between two objects.
         * @param a The first object
         * @param b The second object
         * @param blend The blend factor (0 = a, 1 = b, 0.5 = halfway)
         * @returns The position between the two objects
         */
        getInBetweenPosition(a, b, blend = 0.5) {
            if (!a || !b) {
                print("Warning: Can't calculate in-between position - one or both objects are null");
                return new vec3(0, 0, 0); // Origin
            }
            const posA = a.getTransform().getWorldPosition();
            const posB = b.getTransform().getWorldPosition();
            // Linear interpolation between the two positions
            return this.lerpVector(posA, posB, blend);
        }
        /**
         * Linear interpolation between two vectors.
         * @param a The first vector
         * @param b The second vector
         * @param t The interpolation factor (0 = a, 1 = b)
         * @returns The interpolated vector
         */
        lerpVector(a, b, t) {
            return new vec3(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, a.z + (b.z - a.z) * t);
        }
        /**
         * Gets the in-between rotation between two transforms.
         * @param a The first transform
         * @param b The second transform
         * @param blend The blend factor (0 = a, 1 = b, 0.5 = halfway)
         * @returns The rotation between the forward directions of the two objects
         */
        getInBetweenRotationFromTransforms(a, b, blend = 0.5) {
            if (!a || !b) {
                print("Warning: Can't calculate in-between rotation - one or both objects are null");
                return new quat(0, 0, 0, 1); // Identity quaternion
            }
            // Get the forward vectors of both objects
            const forwardA = this.getForwardVector(a);
            const forwardB = this.getForwardVector(b);
            // Get the in-between rotation with the specified blend
            return this.getInBetweenRotation(forwardA, forwardB, blend);
        }
        /**
         * Gets the in-between rotation between two arbitrary directions.
         * @param directionA The first direction as a vec3
         * @param directionB The second direction as a vec3
         * @param blend The blend factor (0 = directionA, 1 = directionB, 0.5 = halfway)
         * @returns The rotation between the two directions
         */
        getInBetweenRotation(directionA, directionB, blend = 0.5) {
            // Normalize the directions
            const normalizedA = this.normalizeVector(directionA);
            const normalizedB = this.normalizeVector(directionB);
            // Create quaternions based on the directions
            const rotationA = this.lookRotation(normalizedA);
            const rotationB = this.lookRotation(normalizedB);
            // Slerp between the two directions with the specified blend factor
            return quat.slerp(rotationA, rotationB, blend);
        }
        /**
         * Gets the forward vector from a transform.
         * @param obj The SceneObject to get the forward vector from
         * @returns The forward vector of the transform
         */
        getForwardVector(obj) {
            if (!obj)
                return new vec3(0, 0, 1); // Default forward
            const transform = obj.getTransform();
            const worldRotation = transform.getWorldRotation();
            // Calculate forward vector (local Z axis in world space)
            // For a quat rotation, if we transform (0,0,1), we get the forward vector
            const forward = new vec3(0, 0, 1);
            return this.rotateVectorByQuaternion(forward, worldRotation);
        }
        /**
         * Rotates a vector by a quaternion.
         * @param vector The vector to rotate
         * @param rotation The quaternion rotation
         * @returns The rotated vector
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
         * Creates a quaternion that represents a rotation looking in a specified direction.
         * @param direction The direction to look at (forward vector)
         * @returns A quaternion representing the rotation
         */
        lookRotation(direction) {
            // Simplified implementation of Quaternion.LookRotation
            // Default up vector is (0,1,0) - world up
            const up = new vec3(0, 1, 0);
            // Normalize direction
            const normalizedDirection = this.normalizeVector(direction);
            // Handle the case when direction is parallel to up
            if (Math.abs(normalizedDirection.x) < 0.0001 &&
                Math.abs(normalizedDirection.z) < 0.0001) {
                // Looking straight up or down
                if (normalizedDirection.y > 0) {
                    // Looking up, rotate 180 degrees around X axis
                    return quat.fromEulerAngles(Math.PI, 0, 0);
                }
                else {
                    // Looking down, no rotation needed
                    return new quat(0, 0, 0, 1);
                }
            }
            // Calculate right vector (cross product of up and forward)
            const right = this.normalizeVector(this.crossProduct(up, normalizedDirection));
            // Recalculate up vector (cross product of forward and right)
            const newUp = this.crossProduct(normalizedDirection, right);
            // Create rotation matrix from the orthonormal basis
            // Convert to quaternion
            const trace = right.x + newUp.y + normalizedDirection.z;
            if (trace > 0) {
                const s = 0.5 / Math.sqrt(trace + 1.0);
                return new quat((newUp.z - normalizedDirection.y) * s, (normalizedDirection.x - right.z) * s, (right.y - newUp.x) * s, 0.25 / s);
            }
            else {
                // Use the appropriate formula based on which diagonal element is largest
                if (right.x > newUp.y && right.x > normalizedDirection.z) {
                    const s = 2.0 * Math.sqrt(1.0 + right.x - newUp.y - normalizedDirection.z);
                    return new quat(0.25 * s, (right.y + newUp.x) / s, (normalizedDirection.x + right.z) / s, (newUp.z - normalizedDirection.y) / s);
                }
                else if (newUp.y > normalizedDirection.z) {
                    const s = 2.0 * Math.sqrt(1.0 + newUp.y - right.x - normalizedDirection.z);
                    return new quat((right.y + newUp.x) / s, 0.25 * s, (newUp.z + normalizedDirection.y) / s, (normalizedDirection.x - right.z) / s);
                }
                else {
                    const s = 2.0 * Math.sqrt(1.0 + normalizedDirection.z - right.x - newUp.y);
                    return new quat((normalizedDirection.x + right.z) / s, (newUp.z + normalizedDirection.y) / s, 0.25 * s, (right.y - newUp.x) / s);
                }
            }
        }
        /**
         * Calculates the cross product of two vectors.
         * @param a The first vector
         * @param b The second vector
         * @returns The cross product vector
         */
        crossProduct(a, b) {
            return new vec3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
        }
        /**
         * Normalizes a vector to unit length.
         * @param vector The vector to normalize
         * @returns The normalized vector
         */
        normalizeVector(vector) {
            const length = Math.sqrt(vector.x * vector.x +
                vector.y * vector.y +
                vector.z * vector.z);
            if (length < 0.0001) {
                return new vec3(0, 0, 1); // Default forward
            }
            return new vec3(vector.x / length, vector.y / length, vector.z / length);
        }
    };
    __setFunctionName(_classThis, "InBetween");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InBetween = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InBetween = _classThis;
})();
exports.InBetween = InBetween;
//# sourceMappingURL=InBetween.js.map