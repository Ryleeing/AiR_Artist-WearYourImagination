"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSlider = exports.Orientation = void 0;
/**
 * Base slider module.
 */
const DestructionHelper_1 = require("./Modules/Scene/DestructionHelper");
const Event_1 = require("./Modules/Event/Event");
const PassHelper_1 = require("./Modules/Scene/PassHelper");
const ComponentWithPrintOptions_1 = require("./Modules/Debug/ComponentWithPrintOptions");
const SceneHelper_1 = require("./Modules/Scene/SceneHelper");
const SliderData_1 = require("./Slider Prefab/Resources/Scripts/SliderData");
var Orientation;
(function (Orientation) {
    Orientation[Orientation["Horizontal"] = 0] = "Horizontal";
    Orientation[Orientation["Vertical"] = 1] = "Vertical";
})(Orientation || (exports.Orientation = Orientation = {}));
class BaseSlider extends ComponentWithPrintOptions_1.ComponentWithPrintOptions {
    __initialize() {
        super.__initialize();
        this.interactable = this.interactable;
        this.blockTouches = this.blockTouches;
        this.renderOrder = this.renderOrder;
        this.orientation = this.orientation;
        this.startValue = this.startValue;
        this.endValue = this.endValue;
        this.startSliderValue = this.startSliderValue;
        this.stepEnabled = this.stepEnabled;
        this.stepValue = this.stepValue;
        this.prefabSlider = this.prefabSlider;
        this.onValueChanged = new Event_1.Event();
        this.onTouchStart = new Event_1.Event();
        this.onTouchMove = new Event_1.Event();
        this.onTouchEnd = new Event_1.Event();
        this.onEnabledInteractable = new Event_1.Event();
        this.onDisabledInteractable = new Event_1.Event();
        this.destructionHelper = new DestructionHelper_1.DestructionHelper();
        this.sliderPosition = vec2.zero();
        this._sliderValue = 0.0;
        this.touchZoneData = {
            so: null,
            st: null,
            mesh: null,
            spareSO: null,
            spareMesh: null
        };
        this.buttonData = {
            so: null,
            st: null,
            image: null
        };
        this.backgroundData = {
            so: null,
            st: null,
            image: null,
            pass: null
        };
    }
    constructor() {
        super();
        this.interactable = this.interactable;
        this.blockTouches = this.blockTouches;
        this.renderOrder = this.renderOrder;
        this.orientation = this.orientation;
        this.startValue = this.startValue;
        this.endValue = this.endValue;
        this.startSliderValue = this.startSliderValue;
        this.stepEnabled = this.stepEnabled;
        this.stepValue = this.stepValue;
        this.prefabSlider = this.prefabSlider;
        this.onValueChanged = new Event_1.Event();
        this.onTouchStart = new Event_1.Event();
        this.onTouchMove = new Event_1.Event();
        this.onTouchEnd = new Event_1.Event();
        this.onEnabledInteractable = new Event_1.Event();
        this.onDisabledInteractable = new Event_1.Event();
        this.destructionHelper = new DestructionHelper_1.DestructionHelper();
        this.sliderPosition = vec2.zero();
        this._sliderValue = 0.0;
        this.touchZoneData = {
            so: null,
            st: null,
            mesh: null,
            spareSO: null,
            spareMesh: null
        };
        this.buttonData = {
            so: null,
            st: null,
            image: null
        };
        this.backgroundData = {
            so: null,
            st: null,
            image: null,
            pass: null
        };
    }
    /**
     * Sets a new slider value. Value should be in the range [this.startValue, this.endValue].
     * @param value
     */
    set sliderValue(value) {
        value = MathUtils.remap(value, this.startValue, this.endValue, -1.0, 1.0);
        this._setSliderValue(value);
    }
    /**
     * Returns a slider value in the range [this.startValue, this.endValue].
     */
    get sliderValue() {
        return MathUtils.remap(this._sliderValue, -1.0, 1.0, this.startValue, this.endValue);
    }
    enableInteractable() {
        if (this.interactable) {
            return;
        }
        this.interactable = true;
        this.onEnabledInteractable.trigger();
        this.printDebug("slider is interactable");
    }
    disableInteractable() {
        if (!this.interactable) {
            return;
        }
        this.interactable = false;
        this.onDisabledInteractable.trigger();
        this.printDebug("slider is non-interactable");
    }
    /**
     * Initializes all slider's components.
     * @protected
     */
    initialize() {
        this.initializeSO();
        this.initializePrefab();
        this.initializeBackground();
        this.initializeTouchZones();
        this.initializeButton();
        this.initializeInteraction();
        this.initializeDestroy();
        this.initializeTouchBlocking();
        SceneHelper_1.SceneHelper.setRenderOrderRecursively(this.so, this.renderOrder);
    }
    initializeSO() {
        this.so = this.getSceneObject();
        this.st = this.destructionHelper.getOrAddComponent(this.so, "ScreenTransform");
    }
    initializePrefab() {
        this.sliderSO = this.destructionHelper.instantiatePrefab(this.prefabSlider, this.so, "SliderPrefab");
        this.sliderData = this.sliderSO.getComponent(SliderData_1.SliderData.getTypeName());
        if (!this.sliderData) {
            throw new Error("Invalid Script Component with slider data");
        }
        SceneHelper_1.SceneHelper.setRenderLayerRecursively(this.sliderSO, this.so.layer);
    }
    initializeBackground() {
        this.backgroundData.so = this.sliderData.backgroundSO;
        if (!this.backgroundData.so) {
            throw new Error("Invalid Background.");
        }
        this.backgroundData.st = this.backgroundData.so.getComponent('ScreenTransform');
        if (!this.backgroundData.st) {
            throw new Error("Invalid Background Screen Transform.");
        }
    }
    /**
     * Initializes the touch zones (one slider size and the other full screen).
     * @protected
     */
    initializeTouchZones() {
        this.touchZoneData.so = this.sliderData.touchZoneSO;
        this.touchZoneData.spareSO = this.sliderData.spareTouchZoneSO;
        if (!this.touchZoneData.so || !this.touchZoneData.spareSO) {
            throw new Error("Invalid Touch Zone.");
        }
        this.touchZoneData.mesh = this.touchZoneData.so.getComponent('Image');
        this.touchZoneData.st = this.touchZoneData.so.getComponent('ScreenTransform');
        this.touchZoneData.spareMesh = this.touchZoneData.spareSO.getComponent('Image');
        if (!this.touchZoneData.mesh || !this.touchZoneData.spareMesh || !this.touchZoneData.st) {
            throw new Error("Invalid Touch Zone Image.");
        }
    }
    /**
     * Initializes the slider's button(point).
     * @protected
     */
    initializeButton() {
        this.buttonData.so = this.sliderData.buttonSO;
        if (!this.buttonData.so) {
            throw new Error("Invalid Button.");
        }
        this.buttonData.st = this.buttonData.so.getComponent('ScreenTransform');
        if (!this.buttonData.st) {
            throw new Error("Invalid Button Screen Transform.");
        }
        this.buttonData.image = this.buttonData.so.getComponent('Image');
        if (!this.buttonData.image) {
            throw new Error("Invalid Button Image");
        }
        PassHelper_1.PassHelper.cloneAndReplaceMaterial(this.buttonData.image);
        this.backgroundData.image = this.backgroundData.so.getComponent('Image');
        if (!this.backgroundData.image) {
            throw new Error("Invalid Button Background Image");
        }
        PassHelper_1.PassHelper.cloneAndReplaceMaterial(this.backgroundData.image);
        this.backgroundData.pass = this.backgroundData.image.mainPass;
    }
    initializeInteraction() {
        this.interactionC = this.destructionHelper.getOrAddComponent(this.sliderSO, "InteractionComponent");
        this.interactionC.addMeshVisual(this.touchZoneData.mesh);
        this.interactionC.onTouchStart.add((e) => this.touchStart(e));
        this.interactionC.onTouchMove.add((e) => this.touchMove(e));
        this.interactionC.onTouchEnd.add((e) => this.touchEnd(e));
    }
    /**
     * Handles the start of touching the slider and adds full screen touch zone.
     * @param data - event data.
     * @protected
     */
    touchStart(data) {
        if (!this.interactable) {
            return;
        }
        this.interactionC.addMeshVisual(this.touchZoneData.spareMesh);
        this.onTouchStart.trigger(data);
    }
    /**
     * Handles touch moving on the slider and sets a new slider value.
     * @param data - event data.
     * @protected
     */
    touchMove(data) {
        if (!this.interactable) {
            return;
        }
        const touchPosition = this.buttonData.st.screenPointToParentPoint(data.position);
        this._setSliderValue((this.orientation == Orientation.Horizontal) ? touchPosition.x : touchPosition.y);
        this.onTouchMove.trigger(data);
    }
    /**
     * Handles the end of touching the slider and removes full screen touch zone.
     * @param data - event data.
     * @protected
     */
    touchEnd(data) {
        if (!this.interactable) {
            return;
        }
        this.interactionC.removeMeshVisual(this.touchZoneData.spareMesh);
        this.onTouchEnd.trigger(data);
    }
    initializeDestroy() {
        this.createEvent("OnDestroyEvent").bind(() => this.onDestroy());
    }
    /**
     * Destroys all created objects.
     * @protected
     */
    onDestroy() {
        this.destructionHelper.destroyObjects();
    }
    initializeTouchBlocking() {
        if (this.blockTouches) {
            global.touchSystem.touchBlocking = true;
            global.touchSystem.enableTouchBlockingException('TouchTypeNone', true);
            global.touchSystem.enableTouchBlockingException('TouchTypeTouch', true);
            global.touchSystem.enableTouchBlockingException('TouchTypeTap', true);
            global.touchSystem.enableTouchBlockingException('TouchTypeDoubleTap', true);
            global.touchSystem.enableTouchBlockingException('TouchTypeScale', true);
            global.touchSystem.enableTouchBlockingException('TouchTypePan', false);
            global.touchSystem.enableTouchBlockingException('TouchTypeSwipe', false);
        }
    }
    /**
     * Sets the rotation of the slider depending on the selected orientation.
     * @protected
     */
    initializeOrientation() {
        switch (this.orientation) {
            case Orientation.Vertical:
                this.sliderData.sliderAspectRatioSetter.flipAspectRatio();
                this.backgroundData.pass.is_vertical = true;
                this.buttonData.image.stretchMode = StretchMode.FitHeight;
                this.touchZoneData.st.anchors = BaseSlider.VERTICAL_ANCHORS;
                this.touchZoneData.st.offsets = BaseSlider.VERTICAL_OFFSETS;
                break;
            case Orientation.Horizontal:
                this.backgroundData.pass.is_vertical = false;
                this.buttonData.image.stretchMode = StretchMode.FitWidth;
                this.touchZoneData.st.anchors = BaseSlider.HORIZONTAL_ANCHORS;
                this.touchZoneData.st.offsets = BaseSlider.HORIZONTAL_OFFSETS;
                break;
        }
    }
    /**
     * Sets a new slider value. Value should be in the range [-1.0, 1.0].
     * @param value - a new slider value.
     */
    _setSliderValue(value) {
        if (this.stepEnabled) {
            value = this.mapSliderPosition(value);
        }
        value = MathUtils.clamp(value, -1.0, 1.0);
        switch (this.orientation) {
            case Orientation.Horizontal:
                this.sliderPosition.x = value;
                this.sliderPosition.y = 0.0;
                break;
            case Orientation.Vertical:
                this.sliderPosition.x = 0.0;
                this.sliderPosition.y = value;
                break;
        }
        this._sliderValue = value;
        this.buttonData.st.anchors.setCenter(this.sliderPosition);
        this.onValueChanged.trigger(this.sliderValue);
        this.printDebug("new slider value: " + this.sliderValue);
    }
    /**
     * Maps a slider position from a normalized input range [-1.0, 1.0] to a similarly normalized range
     * but adjusted to discrete steps defined by specified start, end, and step values.
     *
     * @param position - the relative slider position in the range [-1.0, 1.0].
     */
    mapSliderPosition(position) {
        const absoluteValue = MathUtils.remap(position, -1.0, 1.0, this.startValue, this.endValue);
        const steppedValue = Math.round((absoluteValue - this.startValue) / this.stepValue) * this.stepValue + this.startValue;
        return MathUtils.remap(steppedValue, this.startValue, this.endValue, -1.0, 1.0);
    }
}
exports.BaseSlider = BaseSlider;
BaseSlider.HORIZONTAL_ANCHORS = Rect.create(-1, 1, -4, 4);
BaseSlider.HORIZONTAL_OFFSETS = Rect.create(0, 0, 0, 0);
BaseSlider.VERTICAL_ANCHORS = Rect.create(-4, 4, -1, 1);
BaseSlider.VERTICAL_OFFSETS = Rect.create(0, 0, 0, 0);
//# sourceMappingURL=BaseSlider.js.map