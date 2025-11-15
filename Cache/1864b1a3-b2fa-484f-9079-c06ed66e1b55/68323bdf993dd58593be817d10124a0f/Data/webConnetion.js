//==============================================================================
// REQUIRED INPUTS
//==============================================================================

// The Image component (e.g., a Screen Image) to apply the downloaded texture to.
//@input Component.Image targetImage

// The Assets required for network and media operations.
//@input Asset.RemoteServiceModule remoteServiceModule
//@input Asset.RemoteMediaModule remoteMediaModule

// The actual URL for the image download. Must be HTTPS for published Lenses.
//@input string imageUrl = "https://picsum.photos/400/600.jpg"

//==============================================================================
// MAIN LOGIC
//==============================================================================

/**
 * Downloads the image from the specified URL and converts it into a Texture.
 * @param {string} url The HTTPS URL of the image to download.
 */
function downloadAndApplyImage(url) {
    // Basic input validation
    if (!script.targetImage || !script.remoteServiceModule || !script.remoteMediaModule) {
        print("Error: Ensure all script properties (targetImage, remoteServiceModule, remoteMediaModule) are assigned.");
        return;
    }

    // 1. Create the HTTP Request object
    var request = global.RemoteServiceHttpRequest.create();
    request.url = url;
    request.method = global.RemoteServiceHttpRequest.HttpRequestMethod.Get;

    print("Attempting to download image from: " + url);

    // 2. Perform the HTTP Request using the RemoteServiceModule
    script.remoteServiceModule.performHttpRequest(request, function(response) {
        if (response.statusCode === 200) {
            print("Image download successful. Status: " + response.statusCode);
            
            // 3. Convert the raw response data (as a resource) into a Lens Studio Texture
            var dynamicResource = response.asResource();

            script.remoteMediaModule.loadResourceAsImageTexture(
                dynamicResource,
                function(texture) {
                    // 4. Success: Apply the newly created Texture to the target Image component
                    print("Texture loaded successfully. Applying to target image.");
                    
                    // Assign the texture to the base texture property of the material's main pass
                    script.targetImage.mainMaterial.mainPass.baseTex = texture;
                },
                function(errorMessage) {
                    // Error during texture conversion
                    print("Error loading resource as Image Texture: " + errorMessage);
                }
            );
        } else {
            // Error during network request
            print("Network request failed. Status: " + response.statusCode + ", Body: " + response.body);
        }
    });
}

// Bind the download function to an event that runs once after the Lens initializes.
var delayedEvent = script.createEvent("DelayedCallbackEvent");
delayedEvent.bind(function() {
    downloadAndApplyImage(script.imageUrl);
});

// Trigger the event to start the download (0.1s delay to ensure everything is initialized)
delayedEvent.reset(0.1);