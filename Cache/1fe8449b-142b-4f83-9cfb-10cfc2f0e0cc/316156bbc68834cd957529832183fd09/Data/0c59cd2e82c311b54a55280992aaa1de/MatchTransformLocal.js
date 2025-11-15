"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchTransformLocal = void 0;
var __selfType = requireType("./MatchTransformLocal");
function component(target) { target.getTypeName = function () { return __selfType; }; }
/**
 * Optionally matches the position, rotation, or scale of another object.
 * Works in-editor.
 */
let MatchTransformLocal = class MatchTransformLocal extends BaseScriptComponent {
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
        const targetPos = targetTransform.getLocalPosition();
        const targetZPos = this.targetZ.getTransform().getLocalPosition();
        const targetYPos = this.targetY.getTransform().getLocalPosition();
        const targetXPos = this.targetX.getTransform().getLocalPosition();
        // Apply offset in world space
        // Note: In a real implementation with proper transform hierarchy,
        // we would need to transform the offset from local to world space
        const targetPosition = new vec3(targetXPos.x + this.positionOffset.x, targetYPos.y + this.positionOffset.y, targetZPos.z + this.positionOffset.z);
        const currentPosition = myTransform.getLocalPosition();
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
        myTransform.setLocalPosition(newPosition);
    }
    /**
     * Update the rotation based on target and constraints.
     */
    updateRotation(myTransform, targetTransform) {
        const targetRotation = targetTransform.getLocalRotation();
        const currentRotation = myTransform.getLocalRotation();
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
        myTransform.setLocalRotation(lerpedRotation);
    }
    /**
     * Update the scale based on target and constraints.
     */
    updateScale(myTransform, targetTransform) {
        const targetScale = targetTransform.getLocalScale();
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
exports.MatchTransformLocal = MatchTransformLocal;
exports.MatchTransformLocal = MatchTransformLocal = __decorate([
    component
], MatchTransformLocal);
//# sourceMappingURL=MatchTransformLocal.js.map