"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CameraService = exports.CameraType = void 0;
const WorldCameraFinderProvider_1 = require("SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider");
var CameraType;
(function (CameraType) {
    CameraType[CameraType["Main"] = 0] = "Main";
    CameraType[CameraType["SpecsLeft"] = 1] = "SpecsLeft";
    CameraType[CameraType["SpecsRight"] = 2] = "SpecsRight";
})(CameraType || (exports.CameraType = CameraType = {}));
class CameraService {
    static getInstance() {
        if (!CameraService.instance) {
            CameraService.instance = new CameraService();
        }
        return CameraService.instance;
    }
    constructor() {
        this._mainCamera = WorldCameraFinderProvider_1.default.getInstance().getComponent();
        /*
        private _screenCropTexture: Texture = requireAsset(
          "ScreenCropTexture"
        ) as Texture;
        */
        this.cameraModule = require("LensStudio:CameraModule");
        this.isEditor = global.deviceInfoSystem.isEditor();
        this.init();
    }
    init() {
        this._sceneObject = global.scene.createSceneObject("CameraService");
        this._script = this._sceneObject.createComponent("ScriptComponent");
        this._script.createEvent("OnStartEvent").bind(() => {
            var camID = this.isEditor
                ? CameraModule.CameraId.Default_Color
                : CameraModule.CameraId.Default_Color;
            var camRequest = CameraModule.createCameraRequest();
            camRequest.cameraId = camID;
            camRequest.imageSmallerDimension = this.isEditor ? 352 : 756;
            //this.camTexture = this._deviceCameraTexture; //this.cameraModule.requestCamera(camRequest) as Texture;
            this.camTexture = this.cameraModule.requestCamera(camRequest);
            var camTexControl = this.camTexture.control;
            /*
            //var cropTexControl = this.screenCropCameraTexture
              .control as CropTextureProvider;
            cropTexControl.inputTexture = this.camTexture;
            */
            camTexControl.onNewFrame.add(() => { });
            if (this.isEditor) {
                return;
            }
            var leftTrackingCamera = global.deviceInfoSystem.getTrackingCameraForId(camID);
            var rightTrackingCamera = global.deviceInfoSystem.getTrackingCameraForId(CameraModule.CameraId.Right_Color);
            this.setUpVirtualCamera(CameraType.SpecsLeft, leftTrackingCamera);
            this.setUpVirtualCamera(CameraType.SpecsRight, rightTrackingCamera);
        });
    }
    setUpVirtualCamera(cameraType, trackingCam) {
        let cameraObj = global.scene.createSceneObject("SpecsLeftCamera");
        let cameraComponent = cameraObj.createComponent("Camera");
        cameraComponent.devicePropertyUsage = Camera.DeviceProperty.None;
        if (cameraType === CameraType.SpecsLeft) {
            cameraObj.name = "SpecsLeftCamera";
            this._specsLeftCamera = cameraComponent;
        }
        else {
            //Assuming CameraType.SpecsRight
            cameraObj.name = "SpecsRightCamera";
            this._specsRightCamera = cameraComponent;
        }
        cameraObj.setParent(this._mainCamera.sceneObject);
        //set pose
        var camTrans = cameraObj.getTransform();
        camTrans.setLocalTransform(trackingCam.pose);
        //set intrinsics
        var aspect = trackingCam.resolution.x / trackingCam.resolution.y;
        cameraComponent.aspect = aspect;
        const avgFocalLengthPixels = (trackingCam.focalLength.x + trackingCam.focalLength.y) / 2;
        const fovRadians = 2 * Math.atan(trackingCam.resolution.y / 2 / avgFocalLengthPixels);
        cameraComponent.fov = fovRadians;
    }
    worldToEditorCameraSpace(worldPos) {
        return this.cameraToScreenSpace(this._mainCamera, worldPos);
    }
    worldToTrackingLeftCameraSpace(worldPos) {
        return this.cameraToScreenSpace(this._specsLeftCamera, worldPos);
    }
    worldToTrackingRightCameraSpace(worldPos) {
        return this.cameraToScreenSpace(this._specsRightCamera, worldPos);
    }
    cameraToScreenSpace(camComp, worldPos) {
        var screenPoint = camComp.worldSpaceToScreenSpace(worldPos);
        var localX = this.Remap(screenPoint.x, 0, 1, -1, 1);
        var localY = this.Remap(screenPoint.y, 1, 0, -1, 1);
        return new vec2(localX, localY);
    }
    /*
    get screenCropCameraTexture() {
      return this._screenCropTexture;
    }
      */
    get cameraTexture() {
        return this.camTexture;
    }
    get mainCameraTransform() {
        return this._mainCamera.getTransform();
    }
    Remap(value, low1, high1, low2, high2) {
        return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
    }
    getCamera(cameraType) {
        if (cameraType === CameraType.Main) {
            return this._mainCamera; //global.deviceInfoSystem.getTrackingCamera();
        }
        if (cameraType === CameraType.SpecsLeft) {
            return this._specsLeftCamera; //global.deviceInfoSystem.getTrackingCameraForId(CameraModule.CameraId.Left_Color);
        }
        if (cameraType === CameraType.SpecsRight) {
            return this._specsRightCamera; //global.deviceInfoSystem.getTrackingCameraForId(CameraModule.CameraId.Right_Color);
        }
        throw new Error("Invalid camera type");
    }
}
exports.CameraService = CameraService;
//# sourceMappingURL=CameraService.js.map