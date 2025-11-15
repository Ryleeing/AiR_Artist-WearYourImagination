// Collage Controller.js
// Version: 1.0.0
// Event: On Awake
// Description: 
// Allows to create an image picker for multiple images
// Create a layout of screen or world images and set them as elemets of Images array

//@input Component.Image[] images { "hint" : "array of image components to swap texture on" }
//@input Asset.Texture imagePicker { "hint" : "image picker texture reference" } 
//@input Asset.Texture placeholderTexture { "hint" : "placeholder texture reference" } 

global.touchSystem.touchBlocking = true;

/** @type {ImagePickerTextureProvider || MediaPickerTextureProvider} */
const imagePickerControl = script.imagePicker.control; // Reference to the image picker provider.

let currentImage = -1;
let counter = 0; // To allow placeholderTexture display, we have to avoid the immediate callback.
let cameras = []; // List of camera references.
let showPickerFunction; 
let hidePickerFunction;

function onStart() {
    // Set the image picker callback and save references to hide and show functions based on the media picker type.
    if (imagePickerControl.isOfType("Provider.ImagePickerTextureProvider")) {
        imagePickerControl.setImageChangedCallback(onImageSelected);
        showPickerFunction = () => { imagePickerControl.showImagePicker(); };
        hidePickerFunction = () => { imagePickerControl.hideImagePicker(); };
    } else if (imagePickerControl.isOfType("Provider.MediaPickerTextureProvider")) {
        imagePickerControl.setFilePickedCallback(onImageSelected);
        showPickerFunction = () => { imagePickerControl.showMediaPicker(); };
        hidePickerFunction = () => { imagePickerControl.hideMediaPicker(); };
    } else {
        print("Incorrect texture set for the Image Picker input.");
        return;
    }
    for (let i = 0; i < script.images.length; i++) {
        // Create cameras and render targets.
        // We render the image picker to a camera and display its output on an image.
        // Disabling a camera component makes its render target freeze, which allows to freeze the current image picker texture 
        // and continue displaying it even if the user changed selection.
        /** @type {SceneObject} */
        let cameraObject = global.scene.createSceneObject("Camera " + i);
        /** @type {Camera} */
        let camera = cameraObject.createComponent("Camera");
        // Create and initialize render target texture.
        /** @type {Texture} */
        let rt = global.scene.createRenderTargetTexture();
        rt.control.useScreenResolution = false; // We will be using image picker resolution instead to preserve aspect ratio.

        camera.renderLayer = LayerSet.makeUnique(); // Unique render layer for this camera.
        camera.renderTarget = rt; // Set this camera's render target texture.
        camera.renderOrder = -1; // Make sure render order is lower than the render order of default camera.
        cameras.push(camera); // Push camera to array for future reference.

        setInputTexture(camera, script.placeholderTexture); 

        rt.control.clearColorOption = ClearColorOption.CustomTexture;

        // Create interaction components.
        let ie = script.images[i].getSceneObject().createComponent("InteractionComponent");
        // Create material copy just in case.        
        script.images[i].mainMaterial = script.images[i].mainMaterial.clone();
        script.images[i].mainMaterial.mainPass.baseTex = rt;

        ie.onTouchStart.add((function (idx) {
            return function () {
                onTap(idx);
            };
        })(i));
    }
}

/**
 * Called on tap, disables all cameras except for the selected one.
 * @param {number} idx 
 */
function onTap(idx) {
    currentImage = idx;

    for (let i = 0; i < script.images.length; i++) {
        cameras[i].enabled = i === idx;
        if (i === idx) {
            setInputTexture(cameras[i], script.placeholderTexture);
            counter = 0;
        }
    }
    showPickerFunction();
}

/**
 * Sets the image to the camera's render target input and adjusts its resolution accordingly.
 * @param {Camera} camera 
 * @param {*} tex 
 */
function setInputTexture(camera, tex) {
    let rt = camera.renderTarget.control;
    rt.inputTexture = tex;
    rt.resolution = new vec2(tex.control.getWidth(), tex.control.getHeight());
}

/**
 * Called when an image is tapped.
 * Applies the texture selected with the image picker and disables it.
 */
function onImageSelected() {
    if (currentImage < 0) {
        return;
    }
    if (counter < 1) {
        counter += 1;
        return;
    }
    setInputTexture(cameras[currentImage], script.imagePicker);

    hidePickerFunction();
}

script.createEvent("OnStartEvent").bind(onStart);