//@input SceneObject targetObject {"label":"Target Object"}
//@input Component.Slider slider {"label":"Slider"}
//@input float sliderMinValue = 0.0 {"label":"Slider Min Value"}
//@input float sliderMaxValue = 1.0 {"label":"Slider Max Value"}
//@input float minScale = 0.1 {"label":"Min Scale"}
//@input float maxScale = 2.0 {"label":"Max Scale"}
//@input bool uniformScale = true {"label":"Uniform Scale"}
//@input vec3 scaleAxis = {"x": 1.0, "y": 1.0, "z": 1.0} {"label":"Scale Axis", "showIf": "uniformScale", "showIfValue": false}

@component
export class SliderSizeController extends Component {

    private targetTransform: Transform;

    onAwake() {
        if (!this.targetObject) {
            print("ERROR: Target Object is not assigned!");
            return;
        }

        if (!this.slider) {
            print("ERROR: Slider is not assigned!");
            return;
        }

        this.targetTransform = this.targetObject.getTransform();
        
        // Subscribe to slider value changes
        this.slider.onValueChanged.add((value: number) => {
            this.updateObjectSize(value);
        });

        // Set initial size based on slider's current value
        this.updateObjectSize(this.slider.sliderValue);
    }

    private updateObjectSize(sliderValue: number): void {
        if (!this.targetTransform) {
            return;
        }

        // Remap slider value from [sliderMinValue, sliderMaxValue] to [0, 1]
        const normalizedValue = MathUtils.remap(
            sliderValue, 
            this.sliderMinValue, 
            this.sliderMaxValue, 
            0.0, 
            1.0
        );
        
        // Clamp to ensure it's between 0 and 1
        const clampedValue = MathUtils.clamp(normalizedValue, 0.0, 1.0);
        
        // Calculate scale using lerp
        const scale = MathUtils.lerp(this.minScale, this.maxScale, clampedValue);

        if (this.uniformScale) {
            // Apply uniform scale to all axes
            this.targetTransform.setLocalScale(new vec3(scale, scale, scale));
        } else {
            // Apply scale based on scaleAxis vector
            const currentScale = this.targetTransform.getLocalScale();
            const newScale = new vec3(
                currentScale.x * this.scaleAxis.x * scale,
                currentScale.y * this.scaleAxis.y * scale,
                currentScale.z * this.scaleAxis.z * scale
            );
            this.targetTransform.setLocalScale(newScale);
        }
    }
}

