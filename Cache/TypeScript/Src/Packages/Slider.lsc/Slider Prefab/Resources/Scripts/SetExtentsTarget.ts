@component
export class SetExtentsTarget extends BaseScriptComponent {
    @input
    private image: Image;

    @input
    @label("Extents Target")
    private extentsST: ScreenTransform;

    onAwake() {
        this.image.extentsTarget = this.extentsST;
    }
}
