import { PlacementMode, PlacementSettings } from "./PlacementSettings";
import { HandHintsController } from "./HandHintsController";
import { Singleton } from "../Decorators/Singleton";
import { SurfaceDetector } from "./SurfaceDetector";
import { TableTop } from "./TableTop";

// public static getInstance: () => SIKLogLevelProvider

const CALIBRATE_AUDIOTRACK: AudioTrackAsset = requireAsset(
  "../Sounds/CalibrateSnap.mp3"
) as AudioTrackAsset;

const HANDHINTS_PREFAB: ObjectPrefab = requireAsset(
  "../Prefabs/HandHints.prefab"
) as ObjectPrefab;

const PLACEMENT_MODE_PREFABS: ObjectPrefab[] = [
  requireAsset("../Prefabs/HorizontalPlacement__PLACE_IN_SCENE.prefab") as ObjectPrefab,
  requireAsset("../Prefabs/VerticalPlacement__PLACE_IN_SCENE.prefab") as ObjectPrefab,
  requireAsset("../Prefabs/TableTopPlacement__PLACE_IN_SCENE.prefab") as ObjectPrefab,
];

@Singleton
export class SurfacePlacementController {
  public static getInstance: () => SurfacePlacementController;

  private handHindsController: HandHintsController = null;
  private currDetector: SurfaceDetector = null;

  private sceneObject: SceneObject = null;

  public constructor() {
    this.sceneObject = global.scene.createSceneObject(
      "SurfacePlacementController"
    );

    this.init();
  }

  private init() {
    let audioComponent = this.sceneObject.createComponent("AudioComponent");
    audioComponent.audioTrack = CALIBRATE_AUDIOTRACK;

    var handHintsObj = HANDHINTS_PREFAB.instantiate(this.sceneObject);
    this.handHindsController = handHintsObj.getComponent(
      HandHintsController.getTypeName()
    );
    this.handHindsController.disableHint();
  }

  startSurfacePlacement(
    settings: PlacementSettings,
    callback: (pos: vec3, rot: quat) => void
  ) {
    if (this.currDetector != null) {
      //in case mode is changed remove current detector
      this.stopSurfacePlacement();
    }
    //create new one and init
    var detectorObj = PLACEMENT_MODE_PREFABS[
      settings.placementMode
    ].instantiate(this.sceneObject);
    this.currDetector = detectorObj
      .getComponents("ScriptComponent")
      .find((s) => s instanceof SurfaceDetector) as SurfaceDetector;

    if (settings.placementMode == PlacementMode.NEAR_SURFACE) {
      var tableTop = detectorObj.getComponent(TableTop.getTypeName());
      tableTop.setOptions(settings);
    }

    this.currDetector.init(this.handHindsController);
    //start surface placement on desired mode
    this.currDetector.startSurfaceCalibration(callback);
  }

  stopSurfacePlacement() {
    if (this.currDetector) {
      this.handHindsController.disableHint();
      this.currDetector.onDestroy();
      this.currDetector.getSceneObject().destroy();
      this.currDetector = null;
    }
  }
}
