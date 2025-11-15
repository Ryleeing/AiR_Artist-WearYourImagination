// @input float desiredAspectRatio = 1.0 {widget:"slider", min:0.1, max:10.0, step:0.01, label:"Aspect Ratio"}

script.flipAspectRatio = () => {
    script.desiredAspectRatio = 1 / script.desiredAspectRatio;
};

const screenTransform = script.getSceneObject().getComponent("ScreenTransform");

if (screenTransform) {
    const measurementSO = global.scene.createSceneObject("MeasurementSO");
    const measurementTransform = measurementSO.createComponent("ScreenTransform");
    measurementTransform.anchors.setSize(vec2.zero());
    measurementTransform.offsets.setSize(vec2.one());

    script.createEvent("OnStartEvent").bind((ev) => {
        measureAndApplyAspect();
        measurementSO.destroy();
    });

    function measureAndApplyAspect() {
        const currentScreenSize = screenTransform.localPointToScreenPoint(vec2.one())
            .sub(screenTransform.localPointToScreenPoint(vec2.zero()));
        const currentAspect = currentScreenSize.x / currentScreenSize.y;
        const measurementSize = measurementTransform.localPointToScreenPoint(vec2.one())
            .sub(measurementTransform.localPointToScreenPoint(vec2.zero()));
        const screenAspect = measurementSize.x / measurementSize.y;
        const scaleFactor = script.desiredAspectRatio / currentAspect * screenAspect;
        const size = screenTransform.anchors.getSize();
        scaleFactor > 1 ? size.y /= scaleFactor : size.x *= scaleFactor;
        screenTransform.anchors.setSize(size);
    }
}
