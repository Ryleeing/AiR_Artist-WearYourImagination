/**
 * Base slider module.
 */
import { DestructionHelper } from "./Modules/Scene/DestructionHelper";
import { Event } from "./Modules/Event/Event";
import { PassHelper } from "./Modules/Scene/PassHelper";
import { ComponentWithPrintOptions } from "./Modules/Debug/ComponentWithPrintOptions";
import { SceneHelper } from "./Modules/Scene/SceneHelper";
import { SliderData } from "./Slider Prefab/Resources/Scripts/SliderData";

export type TouchZoneData = {
    so: SceneObject,
    spareSO: SceneObject,
    mesh: Image,
    spareMesh: Image,
    st: ScreenTransform
};

export type ButtonData = {
    so: SceneObject,
    st: ScreenTransform,
    image: Image
};

export type BackgroundData = {
    so: SceneObject,
    st: ScreenTransform,
    image: Image,
    pass: Pass
};

export enum Orientation {
    Horizontal,
    Vertical
}

export class BaseSlider extends ComponentWithPrintOptions {

    @input('bool', 'true')
    protected interactable: boolean;

    @input("bool", "true")
    @label("Block System Swipe")
    @hint("Blocks Snapchat's default swipe and pan behaviours.")
    protected readonly blockTouches: boolean;

    @ui.separator

    @input("int")
    protected readonly renderOrder: number;

    @ui.separator

    @input("int")
    @widget(new ComboBoxWidget()
        .addItem("Horizontal", 0)
        .addItem("Vertical", 1))
    protected readonly orientation: Orientation;

    @input("float", "0.0")
    protected readonly startValue: number;

    @input("float", "1.0")
    protected readonly endValue: number;

    @input("float", "0.5")
    @label("Initial Value")
    protected readonly startSliderValue: number;

    @ui.separator

    @input
    @label("Step")
    protected readonly stepEnabled: boolean;

    @input
    @showIf("stepEnabled")
    @label("Step")
    protected readonly stepValue: number;

    @input
    protected readonly prefabSlider: ObjectPrefab;

    onValueChanged: Event<number> = new Event();
    onTouchStart: Event<TouchStartEventArgs> = new Event();
    onTouchMove: Event<TouchMoveEventArgs> = new Event();
    onTouchEnd: Event<TouchEndEventArgs> = new Event();
    onEnabledInteractable: Event = new Event();
    onDisabledInteractable: Event = new Event();

    protected readonly destructionHelper: DestructionHelper = new DestructionHelper();
    protected readonly backgroundData: BackgroundData;
    protected readonly buttonData: ButtonData;
    protected readonly touchZoneData: TouchZoneData;

    private static readonly HORIZONTAL_ANCHORS: Rect = Rect.create(-1, 1, -4, 4);
    private static readonly HORIZONTAL_OFFSETS: Rect = Rect.create(0, 0, 0, 0);
    private static readonly VERTICAL_ANCHORS: Rect = Rect.create(-4, 4, -1, 1);
    private static readonly VERTICAL_OFFSETS: Rect = Rect.create(0, 0, 0, 0);

    protected so: SceneObject;
    protected st: ScreenTransform;
    protected sliderSO: SceneObject;
    protected sliderData: SliderData;
    protected interactionC: InteractionComponent;

    protected sliderPosition: vec2 = vec2.zero();
    protected _sliderValue: number = 0.0;

    constructor() {
        super();
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
    set sliderValue(value: number) {
        value = MathUtils.remap(value, this.startValue, this.endValue, -1.0, 1.0);
        this._setSliderValue(value);
    }

    /**
     * Returns a slider value in the range [this.startValue, this.endValue].
     */
    get sliderValue(): number {
        return MathUtils.remap(this._sliderValue, -1.0, 1.0, this.startValue, this.endValue);
    }

    enableInteractable(): void {
        if (this.interactable) {
            return;
        }
        this.interactable = true;
        this.onEnabledInteractable.trigger();
        this.printDebug("slider is interactable");
    }

    disableInteractable(): void {
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
    protected initialize(): void {
        this.initializeSO();
        this.initializePrefab();
        this.initializeBackground();
        this.initializeTouchZones();
        this.initializeButton();
        this.initializeInteraction();
        this.initializeDestroy();
        this.initializeTouchBlocking();
        SceneHelper.setRenderOrderRecursively(this.so, this.renderOrder);
    }

    protected initializeSO(): void {
        this.so = this.getSceneObject();
        this.st = this.destructionHelper.getOrAddComponent(this.so, "ScreenTransform");
    }

    protected initializePrefab(): void {
        this.sliderSO = this.destructionHelper.instantiatePrefab(this.prefabSlider, this.so, "SliderPrefab");
        this.sliderData = this.sliderSO.getComponent(SliderData.getTypeName());
        if (!this.sliderData) {
            throw new Error("Invalid Script Component with slider data");
        }
        SceneHelper.setRenderLayerRecursively(this.sliderSO, this.so.layer);
    }

    protected initializeBackground(): void {
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
    protected initializeTouchZones(): void {
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
    protected initializeButton(): void {
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
        PassHelper.cloneAndReplaceMaterial(this.buttonData.image);
        this.backgroundData.image = this.backgroundData.so.getComponent('Image');
        if (!this.backgroundData.image) {
            throw new Error("Invalid Button Background Image");
        }
        PassHelper.cloneAndReplaceMaterial(this.backgroundData.image);
        this.backgroundData.pass = this.backgroundData.image.mainPass;
    }

    protected initializeInteraction(): void {
        this.interactionC = this.destructionHelper.getOrAddComponent(this.sliderSO, "InteractionComponent");
        this.interactionC.addMeshVisual(this.touchZoneData.mesh);
        this.interactionC.onTouchStart.add((e: TouchStartEventArgs) => this.touchStart(e));
        this.interactionC.onTouchMove.add((e: TouchMoveEventArgs) => this.touchMove(e));
        this.interactionC.onTouchEnd.add((e: TouchEndEventArgs) => this.touchEnd(e));
    }

    /**
     * Handles the start of touching the slider and adds full screen touch zone.
     * @param data - event data.
     * @protected
     */
    protected touchStart(data: TouchStartEventArgs): void {
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
    protected touchMove(data: TouchMoveEventArgs): void {
        if (!this.interactable) {
            return;
        }
        const touchPosition: vec2 = this.buttonData.st.screenPointToParentPoint(data.position);
        this._setSliderValue((this.orientation == Orientation.Horizontal) ? touchPosition.x : touchPosition.y);
        this.onTouchMove.trigger(data);
    }

    /**
     * Handles the end of touching the slider and removes full screen touch zone.
     * @param data - event data.
     * @protected
     */
    protected touchEnd(data: TouchEndEventArgs): void {
        if (!this.interactable) {
            return;
        }
        this.interactionC.removeMeshVisual(this.touchZoneData.spareMesh);
        this.onTouchEnd.trigger(data);
    }

    protected initializeDestroy(): void {
        this.createEvent("OnDestroyEvent").bind(() => this.onDestroy());
    }

    /**
     * Destroys all created objects.
     * @protected
     */
    protected onDestroy(): void {
        this.destructionHelper.destroyObjects();
    }

    protected initializeTouchBlocking(): void {
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
    protected initializeOrientation(): void {
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
    protected _setSliderValue(value: number): void {
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
    private mapSliderPosition(position: number): number {
        const absoluteValue: number = MathUtils.remap(position, -1.0, 1.0, this.startValue, this.endValue);
        const steppedValue: number = Math.round((absoluteValue - this.startValue) / this.stepValue) * this.stepValue + this.startValue;
        return MathUtils.remap(steppedValue, this.startValue, this.endValue, -1.0, 1.0);
    }
}
