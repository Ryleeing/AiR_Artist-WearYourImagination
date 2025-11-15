"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleRaycastTS = void 0;
var __selfType = requireType("./WorldQueryHitExampleHeadPose");
function component(target) { target.getTypeName = function () { return __selfType; }; }
// Given an object with a BodyComponent
// If the object intersects with the ray described
// by rayStart and rayEnd, print a message.
let SimpleRaycastTS = class SimpleRaycastTS extends BaseScriptComponent {
    onAwake() {
        // Check if endPointAttachment is defined
        print("EndPointAttachment object defined: " + (this.endPointAttachment !== undefined));
        this.createEvent("OnStartEvent").bind(() => {
            this.onStart();
        });
        this.createEvent("UpdateEvent").bind(() => {
            this.updateObjectMovement();
        });
    }
    onStart() {
        // Check if endPointAttachment is defined at start
        print("EndPointAttachment object at start: " + (this.endPointAttachment !== undefined));
        if (this.endPointAttachment) {
            print("EndPointAttachment object name: " + this.endPointAttachment.name);
        }
    }
    updateObjectMovement() {
        // Create a probe to raycast through all worlds.
        var globalProbe = Physics.createGlobalProbe();
        // Check if endPointAttachment is defined before raycasting
        print("EndPointAttachment object before raycast: " + (this.endPointAttachment !== undefined));
        // Store 'this' reference to use inside the callback
        const self = this;
        globalProbe.rayCast(this.rayStart.getTransform().getWorldPosition(), this.rayEnd.getTransform().getWorldPosition(), function (hit) {
            if (hit) {
                var position = hit.position;
                print("Raycast hit: " + hit.collider.getSceneObject().name);
                // Add safety check for endPointAttachment
                if (self.endPointAttachment) {
                    print("EndPointAttachment exists in callback, setting position");
                    self.endPointAttachment.getTransform().setWorldPosition(position);
                }
                else {
                    print("ERROR: EndPointAttachment is undefined in callback");
                }
            }
        });
    }
};
exports.SimpleRaycastTS = SimpleRaycastTS;
exports.SimpleRaycastTS = SimpleRaycastTS = __decorate([
    component
], SimpleRaycastTS);
//# sourceMappingURL=WorldQueryHitExampleHeadPose.js.map