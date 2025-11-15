@component
export class SliderData extends BaseScriptComponent {
    @input
    backgroundSO: SceneObject;

    @input
    touchZoneSO: SceneObject;

    @input
    spareTouchZoneSO: SceneObject;

    @input
    buttonSO: SceneObject;

    @input
    counterSO: SceneObject;

    @input("Component.ScriptComponent")
    sliderAspectRatioSetter: ScriptComponent & {flipAspectRatio: () => void};
}
