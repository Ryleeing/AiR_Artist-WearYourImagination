/**
 * Slider
 * Version 0.0.10
 *
 * Slider UI element with counter option.
 *
 * API:
 *
 * enableInteractable(): void
 * disableInteractable(): void
 * getCounterValue(): number
 * enableCounter(): void
 * disableCounter(): void
 * sliderValue: number
 * counterTextSize: number
 * trackBarColor: vec3
 * sliderOpacity: number
 *
 * Events:
 *
 * onValueChanged - triggers with passed slider value in the range [this.startValue, this.endValue].
 * onTouchStart - triggers with passed TouchStartEventArgs data.
 * onTouchMove - triggers with passed TouchMoveEventArgs data.
 * onTouchEnd - triggers with passed TouchEndEventArgs data.
 * onEnabledInteractable
 * onDisabledInteractable
 */

import { BaseSlider, Orientation } from "./BaseSlider";
import { EventCallbacks, CallbackType, CustomFunctions, BehaviorScript } from "./Modules/BehaviorSupport/EventCallbacks";

export type CounterData = {
    so: SceneObject,
    st: ScreenTransform,
    text: Text
};

@component
export class Slider extends BaseSlider {

    @ui.separator

    @input
    @label("Counter")
    private counterEnabled: boolean;

    @input("int")
    @showIf("counterEnabled")
    private readonly fractionDigits: number;

    @ui.separator

    @input
    private readonly trackBar: boolean;

    @input("vec3", "{1.0, 1.0, 0.0}") // yellow
    @label("Color")
    @showIf("trackBar")
    @widget(new ColorWidget())
    private readonly _trackBarColor: vec3;

    @ui.separator

    @input
    private readonly eventCallbacks: boolean;

    @ui.group_start("Event Callbacks")
    @showIf("eventCallbacks")

    @input("int", "0")
    @widget(new ComboBoxWidget()
        .addItem("None", 0)
        .addItem("Behavior Script", 1)
        .addItem("Behavior Custom", 2)
        .addItem("Custom Function", 3))
    private readonly callbackType: CallbackType;

    @input
    @showIf("callbackType", 1)
    private readonly onValueChangedBehaviors: ScriptComponent[];

    @input
    @showIf("callbackType", 2)
    private readonly onValueChangedCustomTriggers: string[];

    @input
    @showIf("callbackType", 3)
    @allowUndefined
    private readonly onValueChangedFunctions: CustomFunctions[];

    @ui.group_end

    private static readonly COUNTER_OFFSET: number = 0.125;
    private static readonly COUNTER_ANCHOR_OFFSET_VERTICAL: number = 1.5;
    private static readonly COUNTER_ANCHOR_OFFSET_HORIZONTAL: number = 0.5;

    private readonly counterData: CounterData;

    constructor() {
        super();
        this.counterData = {
            so: null,
            st: null,
            text: null
        };
    }

    onAwake() {
        this.initialize();
    }

    set counterTextSize(textSize: number) {
        this.counterData.text.size = textSize;
    }

    get counterTextSize(): number {
        return this.counterData.text.size;
    }

    set trackBarColor(value: vec3) {
        this.backgroundData.pass.foreground_color = value;
    }

    get trackBarColor(): vec3 {
        return this.backgroundData.pass.foreground_color;
    }

    set sliderOpacity(value: number) {
        this.backgroundData.pass.background_alpha = value;
    }

    get sliderOpacity(): number {
        return this.backgroundData.pass.background_alpha;
    }

    getCounterValue(): number {
        return +this.counterData.text.text;
    }

    enableCounter(): void {
        this.counterEnabled = true;
        this.counterData.so.enabled = true;
        this.updateCounter(this._sliderValue);
    }

    disableCounter(): void {
        this.counterEnabled = false;
        this.counterData.so.enabled = false;
    }

    /**
     * Initializes all slider's components.
     * @protected
     */
    override initialize(): void {
        super.initialize();
        this.initializeCounter();
        this.initializeOrientation();
        this.initializeEventCallbacks();
        this.updateTrackBar(-1.0);
        this.sliderValue = this.startSliderValue;
        this.backgroundData.pass.foreground_color = this._trackBarColor;
    }

    private initializeCounter(): void {
        this.counterData.so = this.sliderData.counterSO;
        if (!this.counterData.so) {
            throw new Error("Invalid Counter.");
        }
        this.counterData.st = this.counterData.so.getComponent('ScreenTransform');
        if (!this.counterData.st) {
            throw new Error("Invalid Counter Screen Transform.");
        }
        this.counterData.text = this.counterData.so.getComponent('Text');
        if (!this.counterData.text) {
            throw new Error("Invalid Counter Text.");
        }
        this.counterData.so.enabled = this.counterEnabled;
    }

    /**
     * Expands 'initializeOrientation' method and changes the position of the counter depending on the orientation.
     * @protected
     */
    override initializeOrientation(): void {
        super.initializeOrientation();
        switch (this.orientation) {
            case Orientation.Vertical:
                this.counterData.st.anchors.setCenter(new vec2(Slider.COUNTER_ANCHOR_OFFSET_VERTICAL, 0.0));
                this.counterData.st.offsets.setCenter(new vec2(Slider.COUNTER_OFFSET, 0.0));
                this.counterData.text.horizontalAlignment = HorizontalAlignment.Left;
                break;
            case Orientation.Horizontal:
                this.counterData.st.anchors.setCenter(new vec2(0.0, Slider.COUNTER_ANCHOR_OFFSET_HORIZONTAL));
                this.counterData.st.offsets.setCenter(new vec2(0.0, Slider.COUNTER_OFFSET));
                this.counterData.text.horizontalAlignment = HorizontalAlignment.Center;
                break;
        }
    }

    /**
     * Adds listeners to `onValueChanged` event.
     * @private
     */
    private initializeEventCallbacks(): void {
        if (this.eventCallbacks && this.callbackType !== CallbackType.None) {
            this.onValueChanged.add(EventCallbacks.invokeCallbackFromInputs({
                name: "onValueChanged",
                type: this.callbackType,
                behaviorScripts: this.onValueChangedBehaviors as any as BehaviorScript[],
                behaviorSystemTriggers: this.onValueChangedCustomTriggers,
                scriptFunctions: this.onValueChangedFunctions
            }));
        }
    }

    /**
     * Sets a new slider value. Value should be in the range [-1.0, 1.0].
     * @param value - a new slider value.
     */
    override _setSliderValue(value: number): void {
        super._setSliderValue(value);
        if (this.counterEnabled) {
            this.updateCounter(this._sliderValue);
        }
        if (this.trackBar) {
            this.updateTrackBar(this._sliderValue);
        }
    }

    /**
     * Updates the counter value according to the slider value.
     * @param sliderValue - current slider's value in the range [-1.0, 1.0].
     * @private
     */
    private updateCounter(sliderValue: number): void {
        this.counterData.text.text = MathUtils.remap(sliderValue, -1.0, 1.0, this.startValue, this.endValue).toFixed(this.fractionDigits);
    }

    /**
     * Updates the trackBar value according to the slider value.
     * @param sliderValue - current slider's value in the range [-1.0, 1.0].
     * @private
     */
    private updateTrackBar(sliderValue: number): void {
        this.backgroundData.pass.slider_value = (sliderValue + 1) / 2;
    }
}
