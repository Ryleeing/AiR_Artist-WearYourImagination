// SliderSizeController.js
// Version: 1.0.0
// Event: Lens Initialized
// Description: Controls the size of an object using a slider

//@input SceneObject targetObject {"label":"Target Object"}
//@input Component.Slider slider {"label":"Slider"}
//@input float sliderMinValue = 0.0 {"label":"Slider Min Value"}
//@input float sliderMaxValue = 1.0 {"label":"Slider Max Value"}
//@input float minScale = 0.1 {"label":"Min Scale"}
//@input float maxScale = 2.0 {"label":"Max Scale"}
//@input bool uniformScale = true {"label":"Uniform Scale"}
//@input vec3 scaleAxis = {"x": 1.0, "y": 1.0, "z": 1.0} {"label":"Scale Axis", "showIf": "uniformScale", "showIfValue": false}

var targetTransform;

function initialize() {
    if (!script.targetObject) {
        print("ERROR: Target Object is not assigned!");
        return;
    }

    if (!script.slider) {
        print("ERROR: Slider is not assigned!");
        return;
    }

    targetTransform = script.targetObject.getTransform();
    
    // Subscribe to slider value changes
    script.slider.onValueChanged.add(function(value) {
        updateObjectSize(value);
    });

    // Set initial size based on slider's current value
    updateObjectSize(script.slider.sliderValue);
}

function updateObjectSize(sliderValue) {
    if (!targetTransform) {
        return;
    }

    // Get slider's start and end values
    var startValue = script.slider.startValue;
    var endValue = script.slider.endValue;
    
    // Remap slider value to scale range [0, 1]
    var normalizedValue = (sliderValue - startValue) / (endValue - startValue);
    normalizedValue = Math.max(0, Math.min(1, normalizedValue)); // Clamp to [0, 1]
    
    // Calculate scale using lerp
    var scale = script.minScale + (script.maxScale - script.minScale) * normalizedValue;

    if (script.uniformScale) {
        // Apply uniform scale to all axes
        targetTransform.setLocalScale(new vec3(scale, scale, scale));
    } else {
        // Apply scale based on scaleAxis vector
        var currentScale = targetTransform.getLocalScale();
        var newScale = new vec3(
            currentScale.x * script.scaleAxis.x * scale,
            currentScale.y * script.scaleAxis.y * scale,
            currentScale.z * script.scaleAxis.z * scale
        );
        targetTransform.setLocalScale(newScale);
    }
}

initialize();

