import {
  Interactable,
  InteractableEventArgs,
} from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";

import { SurfaceDetector } from "./SurfaceDetector";

const DRAG_THRESHOLD = 11; // Minimum distance to start drag in CM
const SPEED = 8; // Interpolation speed

@component
export class SingleSurface extends BaseScriptComponent {
  @input interactable: Interactable;

  desiredPosition = vec3.zero();
  desiredRotation = quat.quatIdentity();

  useDefaultHeight = true;
  lastGroundHeight = 0;

  private trans = null;
  private cameraTransform = null;
  private screenDistance = null;
  private currInteractor = null;
  private touchStartPosition = null;
  private isDragging = false;
  private surfaceDetector: SurfaceDetector = null;

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
    this.surfaceDetector = this.getSceneObject()
      .getComponents("ScriptComponent")
      .find((s) => s instanceof SurfaceDetector) as SurfaceDetector;
  }

  private onStart() {
    this.interactable.onHoverEnter.add((args: InteractableEventArgs) => {
      this.surfaceDetector.onHoverEnter();
    });
    this.interactable.onHoverExit.add((args: InteractableEventArgs) => {
      this.surfaceDetector.onHoverExit();
    });
    this.interactable.onTriggerStart.add((args: InteractableEventArgs) => {
      this.currInteractor = args.interactor;
      this.surfaceDetector.onInteractionStart();
      this.touchStartPosition = this.desiredPosition;
      this.isDragging = false;
    });

    this.interactable.onTriggerCanceled.add((args: InteractableEventArgs) => {
      args.interactor.clearCurrentInteractable();
      this.currInteractor = null;
      this.surfaceDetector.onInteractionCanceled();
    });
    this.interactable.onTriggerEnd.add((args: InteractableEventArgs) => {
      this.currInteractor = null;
      this.surfaceDetector.onInteractionEnd();
    });
  }

  init(camTrans: Transform, transform: Transform, screenDist: number) {
    this.cameraTransform = camTrans;
    this.trans = transform;
    this.screenDistance = screenDist;
    this.setDefaultPose();
  }

  startCalibration() {
    this.useDefaultHeight = true;
    this.lastGroundHeight = 0;
    this.desiredPosition = vec3.zero();
    this.desiredRotation = quat.quatIdentity();
  }

  setDefaultPose() {
    this.desiredPosition = this.cameraTransform
      .getWorldPosition()
      .add(this.cameraTransform.forward.uniformScale(-this.screenDistance));
    this.desiredRotation = this.cameraTransform.getWorldRotation();
    this.trans.setWorldPosition(this.desiredPosition);
    this.trans.setWorldRotation(this.desiredRotation);
  }

  hasFoundPlane() {
    return this.currInteractor != null;
  }

  runHitTest(
    hitTestSession: any,
    min: number,
    max: number,
    onHitTestResult: (hitTestResult: any) => void
  ) {
    var isCapturing = getDeltaTime() < 0.001;
    if (isCapturing) {
      return;
    }

    const rayDirection = this.cameraTransform.forward;
    const camPos = this.cameraTransform.getWorldPosition();
    const rayStart = camPos.add(rayDirection.uniformScale(-min));
    const rayEnd = camPos.add(rayDirection.uniformScale(-max));

    if (hitTestSession != null) {
      hitTestSession.hitTest(rayStart, rayEnd, (hitTestResult) => {
        onHitTestResult(hitTestResult);
      });
    }
  }

  adjustPosition() {
    //find point where camera forward intersects plane
    var planeNormal = this.desiredRotation.multiplyVec3(
      vec3.up().uniformScale(-1)
    );
    var interactorDirection = this.currInteractor.endPoint
      .sub(this.currInteractor.startPoint)
      .normalize();
    var distanceToPlane =
      planeNormal.dot(
        this.desiredPosition.sub(this.currInteractor.startPoint)
      ) / planeNormal.dot(interactorDirection);
    //what point on frozen plane is being pointed to
    var pointPos = this.currInteractor.startPoint.add(
      interactorDirection.uniformScale(distanceToPlane)
    );
    var distance = pointPos.distance(this.touchStartPosition);
    if (distance > DRAG_THRESHOLD && !this.isDragging) {
      this.isDragging = true;
    }
    if (this.isDragging) {
      this.desiredPosition = pointPos;
    }
  }

  interpolatePositionVisuals() {
    this.trans.setWorldPosition(
      vec3.lerp(
        this.trans.getWorldPosition(),
        this.desiredPosition,
        getDeltaTime() * SPEED
      )
    );
    this.trans.setWorldRotation(
      quat.slerp(
        this.trans.getWorldRotation(),
        this.desiredRotation,
        getDeltaTime() * SPEED
      )
    );
  }
}
