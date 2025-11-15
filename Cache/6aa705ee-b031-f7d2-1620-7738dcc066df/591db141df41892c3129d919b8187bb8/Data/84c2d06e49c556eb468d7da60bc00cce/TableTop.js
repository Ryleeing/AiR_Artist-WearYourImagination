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
exports.TableTop = void 0;
var __selfType = requireType("./TableTop");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const SIK_1 = require("SpectaclesInteractionKit.lspkg/SIK");
const SurfaceDetector_1 = require("../Scripts/SurfaceDetector");
const SurfaceSlider_1 = require("../Scripts/SurfaceSlider");
const HAND_OFFSET = -1; // offset in cm from hand to surface
const MOVEMENT_THRESHOLD = 1.5; //movement allowed in cm for calibration to occur
const ANGLE_THRESHOLD = 0.25; // hand facing up threshold, if hand is flat we assume its on flat surface
const HEIGHT_THRESHOLD = 6; // height distance between joints on hand so we can know if it is resting on flat surface
const DEFAULT_SCREEN_DISTANCE = 70; // distance in cm from camera to visual when no surface is hit
const CALIBRATION_FRAME_COUNT = 60; // how many stable frames before completion is called
const mobileText = "Move mobile \n device to \n a flat surface";
const mobileConfirmText = "Tap \n to confirm \n placement";
const handText = "Place hand \n face down \n on a surface";
let TableTop = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = SurfaceDetector_1.SurfaceDetector;
    var TableTop = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.instructTextObj = this.instructTextObj;
            this.sliderPrefab = this.sliderPrefab;
            this.rightHand = SIK_1.SIK.HandInputData.getHand("right");
            this.leftHand = SIK_1.SIK.HandInputData.getHand("left");
            this.desiredPosition = vec3.zero();
            this.desiredRotation = quat.quatIdentity();
            this.textTrans = null;
            this.instructionText = null;
            this.camComp = null;
            this.calibrationFrames = 0;
            this.canCalibrate = false;
            this.leftPosHistory = [];
            this.rightPosHistory = [];
            this.interpolateSpeed = 10;
            this.isAnyPoseValid = false;
            this.tapEvent = null;
            this.surfaceSlider = null;
            this.useAdjustmentWidget = false;
            this.widgetOffset = new vec3(2, 2, 0);
        }
        __initialize() {
            super.__initialize();
            this.instructTextObj = this.instructTextObj;
            this.sliderPrefab = this.sliderPrefab;
            this.rightHand = SIK_1.SIK.HandInputData.getHand("right");
            this.leftHand = SIK_1.SIK.HandInputData.getHand("left");
            this.desiredPosition = vec3.zero();
            this.desiredRotation = quat.quatIdentity();
            this.textTrans = null;
            this.instructionText = null;
            this.camComp = null;
            this.calibrationFrames = 0;
            this.canCalibrate = false;
            this.leftPosHistory = [];
            this.rightPosHistory = [];
            this.interpolateSpeed = 10;
            this.isAnyPoseValid = false;
            this.tapEvent = null;
            this.surfaceSlider = null;
            this.useAdjustmentWidget = false;
            this.widgetOffset = new vec3(2, 2, 0);
        }
        onAwake() {
            super.onAwake();
            this.textTrans = this.instructTextObj.getTransform();
            this.instructionText = this.instructTextObj.getComponent("Text");
            this.camComp = this.cameraTransform.getSceneObject().getComponent("Camera");
        }
        onDestroy() {
            super.onDestroy();
            if (this.surfaceSlider) {
                this.surfaceSlider.getSceneObject().destroy();
                this.surfaceSlider = null;
            }
        }
        setOptions(settings) {
            this.useAdjustmentWidget = settings.useAdjustmentWidget;
            this.widgetOffset = settings.adjustmentWidgetOffset;
            if (this.useAdjustmentWidget) {
                var sliderObj = this.sliderPrefab.instantiate(null);
                this.surfaceSlider = sliderObj.getComponent(SurfaceSlider_1.SurfaceSlider.getTypeName());
                this.surfaceSlider.init(this.widgetOffset, settings.onSliderUpdate);
                this.surfaceSlider.resetSlider();
            }
        }
        startSurfaceCalibration(callback) {
            this.handHintController.disableHint();
            this.calibrationFrames = 0;
            this.canCalibrate = true;
            this.isAnyPoseValid = false;
            super.startSurfaceCalibration(callback);
            this.tapEvent = this.createEvent("TapEvent");
            this.tapEvent.bind(this.onMobileTap.bind(this));
            this.circleAnim.setLoadingAmount(0);
            this.setCircleColor(false);
            if (this.useAdjustmentWidget) {
                this.surfaceSlider.resetSlider();
            }
        }
        onPoseStateChanged() {
            //hand or mobile state is valid and can start checking for calibration
            if (this.isAnyPoseValid) {
                this.handHintController.enableHint(this.hintAnchor.getTransform());
                this.playHandHint(this.isMobileConnected());
            }
            else {
                this.handHintController.disableHint();
            }
        }
        playHandHint(isMobile) {
            var anchorTrans = this.hintAnchor.getTransform();
            anchorTrans.setLocalScale(vec3.one().uniformScale(0.4));
            if (isMobile) {
                this.handHintController.playMobileTap();
                anchorTrans.setLocalPosition(new vec3(0, 0, 58));
                anchorTrans.setLocalRotation(quat.fromEulerVec(new vec3(-10 * MathUtils.DegToRad, 0, 0)));
            }
            else {
                this.handHintController.playHandTouchSurface();
                anchorTrans.setLocalPosition(new vec3(0, 35, 40));
                anchorTrans.setLocalRotation(quat.fromEulerVec(new vec3(-50 * MathUtils.DegToRad, 0, 0)));
            }
        }
        onMobileTap() {
            if (global.deviceInfoSystem.isEditor()) {
                this.startCalibrationComplete();
                return;
            }
            if (this.isCalibrationRunning && this.isAnyPoseValid) {
                this.startCalibrationComplete();
            }
        }
        setCircleColor(isTracking) {
            var dotColor = isTracking ? new vec4(1, 1, 0, 1) : new vec4(1, 1, 1, 1);
            this.circleAnim.setCircleColor(dotColor);
            this.circleAnim.enableScanAnimation(isTracking);
        }
        onMobileConnnectionStateChange(isConnected) {
            super.onMobileConnnectionStateChange(isConnected);
            this.instructionText.text = isConnected ? mobileText : handText;
            this.interpolateSpeed = isConnected ? 15 : 8;
        }
        startCalibrationComplete() {
            //remove events
            this.removeEvent(this.tapEvent);
            this.tapEvent = null;
            this.circleAnim.animateCircleOut(() => {
                super.onCalibrationComplete(this.invokeCalibrationComplete);
            });
        }
        invokeCalibrationComplete() {
            this.handHintController.disableHint();
            if (global.deviceInfoSystem.isEditor()) {
                //for editor just the camera forward direction
                var worldCameraForward = this.cameraTransform.right
                    .cross(vec3.up())
                    .normalize();
                this.desiredRotation = quat.lookAt(worldCameraForward, vec3.up());
                this.trans.setWorldRotation(this.desiredRotation);
            }
            else {
                this.desiredRotation = this.desiredRotation.multiply(quat.fromEulerVec(new vec3(Math.PI / 2, 0, 0)));
            }
            this.onCompleteCallback(this.desiredPosition, this.desiredRotation);
            if (this.useAdjustmentWidget) {
                this.surfaceSlider.showSlider(this.circleAnim.getTransform());
            }
        }
        getHandUpVector(hand) {
            var hndForward = hand.wrist.position
                .sub(hand.middleTip.position)
                .normalize();
            var handRight = hand.thumbBaseJoint.position
                .sub(hand.pinkyKnuckle.position)
                .normalize();
            if (hand.handType == "right") {
                handRight = handRight.uniformScale(-1);
            }
            return hndForward.cross(handRight).normalize();
        }
        updateHandPosition(hand) {
            if (hand.isTracked()) {
                if (hand.handType != "right") {
                    this.leftPosHistory.push(hand.thumbTip.position);
                    if (this.leftPosHistory.length > CALIBRATION_FRAME_COUNT / 2) {
                        this.leftPosHistory.shift();
                    }
                }
                else {
                    this.rightPosHistory.push(hand.thumbTip.position);
                    if (this.rightPosHistory.length > CALIBRATION_FRAME_COUNT / 2) {
                        this.rightPosHistory.shift();
                    }
                }
            }
        }
        isHandMoving(list) {
            if (list.length < 2) {
                return true;
            }
            var maxMovement = list[0].distance(list[list.length - 1]);
            return maxMovement > MOVEMENT_THRESHOLD;
        }
        isHandWithinAngleThreshold(hand) {
            return vec3.up().angleTo(this.getHandUpVector(hand)) < ANGLE_THRESHOLD;
        }
        addHandPoints(hand, list) {
            list.push(hand.thumbTip.position.y);
            list.push(hand.indexTip.position.y);
            list.push(hand.pinkyTip.position.y);
        }
        //support calibation with either single hand only or both hands
        updateCalibration(leftHandValid, rightHandValid) {
            //get angle difference from gravity vs hands to make sure they are on flat surface
            var leftAngleValid = this.isHandWithinAngleThreshold(this.leftHand) && leftHandValid;
            var rightAngleValid = this.isHandWithinAngleThreshold(this.rightHand) && rightHandValid;
            var isWithinAngleThreshold = leftAngleValid || rightAngleValid;
            //make sure hands are at the same height and flat
            var jointPositions = [];
            if (leftHandValid)
                this.addHandPoints(this.leftHand, jointPositions);
            if (rightHandValid)
                this.addHandPoints(this.rightHand, jointPositions);
            var heightDifference = Math.abs(Math.max(...jointPositions) - Math.min(...jointPositions));
            var isWithinHeightThreshold = heightDifference < HEIGHT_THRESHOLD;
            //check if hands are moving
            var isLeftHandStopped = !this.isHandMoving(this.leftPosHistory) && leftHandValid;
            var isRightHandStopped = !this.isHandMoving(this.rightPosHistory) && rightHandValid;
            //check for calibration:
            if (isWithinAngleThreshold &&
                isWithinHeightThreshold &&
                (isLeftHandStopped || isRightHandStopped)) {
                this.calibrationFrames++;
                if (this.calibrationFrames > 60) {
                    this.canCalibrate = false;
                    this.startCalibrationComplete();
                }
            }
            else {
                this.calibrationFrames = 0;
            }
            this.circleAnim.setLoadingAmount(this.calibrationFrames / CALIBRATION_FRAME_COUNT);
        }
        update() {
            super.update();
            if (!this.canCalibrate) {
                return;
            }
            var poseValid = false;
            var camPos = this.cameraTransform.getWorldPosition();
            var textPos = new vec3(0, 0, 1);
            var textRot = quat.quatIdentity();
            if (this.isMobileConnected()) {
                //HANDLE MOBILE
                var phoneForward = SIK_1.SIK.MobileInputData.rotation.multiplyVec3(vec3.up());
                var mobilePosition = SIK_1.SIK.MobileInputData.position.add(phoneForward.uniformScale(20));
                poseValid = this.camComp.isSphereVisible(mobilePosition, 2);
                this.instructionText.text = poseValid ? mobileConfirmText : mobileText;
                if (poseValid) {
                    this.desiredPosition = mobilePosition;
                    var worldPhoneForward = phoneForward.cross(vec3.up()).normalize();
                    //rotate UI to align with gravity
                    this.desiredRotation = this.desiredRotation = quat.lookAt(worldPhoneForward, vec3.up());
                    this.desiredRotation = this.desiredRotation.multiply(quat.fromEulerVec(new vec3(-Math.PI / 2, -Math.PI / 2, 0)));
                    //move text up
                    textPos = new vec3(0, 10, 6);
                    //phone is already slow, dont interpolate
                    this.trans.setWorldPosition(this.desiredPosition);
                    this.trans.setWorldRotation(this.desiredRotation);
                }
                else {
                    //position UI in front of camera
                    this.desiredPosition = camPos.add(this.cameraTransform.forward.uniformScale(-DEFAULT_SCREEN_DISTANCE));
                    this.desiredRotation = quat.lookAt(this.cameraTransform.forward, vec3.up());
                }
                this.setCircleColor(poseValid);
                //set UI instructions base on phone tracking state
                textRot = poseValid
                    ? quat.fromEulerVec(new vec3(Math.PI / 4, 0, 0))
                    : quat.quatIdentity();
            }
            else {
                //HANDLE HANDS
                var rightHandValid = this.rightHand.isTracked() &&
                    this.camComp.isSphereVisible(this.rightHand.thumbTip.position, 2);
                var leftHandValid = this.leftHand.isTracked() &&
                    this.camComp.isSphereVisible(this.leftHand.thumbTip.position, 2);
                var isEitherHandValid = rightHandValid || leftHandValid;
                //set UI instructions base on hand tracking state
                textRot = isEitherHandValid
                    ? quat.fromEulerVec(new vec3(Math.PI / 4, 0, 0))
                    : quat.quatIdentity();
                this.setCircleColor(isEitherHandValid);
                //keep track of hand positions
                if (leftHandValid)
                    this.updateHandPosition(this.leftHand);
                if (rightHandValid)
                    this.updateHandPosition(this.rightHand);
                if (isEitherHandValid) {
                    //position UI in between hands
                    var thumbCenter = this.rightHand.thumbTip.position
                        .add(this.leftHand.thumbTip.position)
                        .uniformScale(0.5);
                    var indexCenter = this.rightHand.pinkyTip.position
                        .add(this.leftHand.pinkyTip.position)
                        .uniformScale(0.5);
                    var handRight = this.cameraTransform.right;
                    if (leftHandValid && rightHandValid) {
                        this.desiredPosition = thumbCenter.add(indexCenter).uniformScale(0.5);
                        //make UI rotate with both hands when available
                        handRight = this.rightHand
                            .getPalmCenter()
                            .sub(this.leftHand.getPalmCenter())
                            .normalize();
                    }
                    else {
                        //position in camera space
                        var handPos = leftHandValid
                            ? this.leftHand.thumbTip.position
                                .add(this.leftHand.indexTip.position)
                                .uniformScale(0.5)
                            : this.rightHand.thumbTip.position
                                .add(this.rightHand.indexTip.position)
                                .uniformScale(0.5);
                        var offset = leftHandValid ? 7 : -7;
                        this.desiredPosition = handPos.add(this.cameraTransform.right.uniformScale(offset));
                    }
                    //rotate UI to align with gravity
                    var handForward = handRight.cross(vec3.up()).normalize();
                    this.desiredRotation = quat
                        .lookAt(handForward, vec3.up())
                        .multiply(quat.fromEulerVec(new vec3(-Math.PI / 2, 0, 0)));
                    //move text up
                    textPos = new vec3(0, 10, 6);
                    poseValid = true;
                }
                else {
                    //position UI in front of camera
                    this.desiredPosition = camPos.add(this.cameraTransform.forward.uniformScale(-DEFAULT_SCREEN_DISTANCE));
                    this.desiredRotation = quat.lookAt(this.cameraTransform.forward, vec3.up());
                }
                //check calibration status
                if (isEitherHandValid) {
                    //set slightly lower for hand thickness
                    this.desiredPosition.y -= HAND_OFFSET;
                    this.updateCalibration(leftHandValid, rightHandValid);
                }
            }
            if (this.isAnyPoseValid != poseValid) {
                this.isAnyPoseValid = poseValid;
                print("Valid pose state changed: " + poseValid);
                this.onPoseStateChanged();
            }
            //interpolate UI
            this.textTrans.setLocalPosition(vec3.lerp(this.textTrans.getLocalPosition(), textPos, getDeltaTime() * this.interpolateSpeed));
            this.textTrans.setLocalRotation(quat.slerp(this.textTrans.getLocalRotation(), textRot, getDeltaTime() * this.interpolateSpeed));
            //set parent transform
            this.trans.setWorldPosition(vec3.lerp(this.trans.getWorldPosition(), this.desiredPosition, getDeltaTime() * this.interpolateSpeed));
            this.trans.setWorldRotation(quat.slerp(this.trans.getWorldRotation(), this.desiredRotation, getDeltaTime() * this.interpolateSpeed));
        }
    };
    __setFunctionName(_classThis, "TableTop");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TableTop = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TableTop = _classThis;
})();
exports.TableTop = TableTop;
//# sourceMappingURL=TableTop.js.map