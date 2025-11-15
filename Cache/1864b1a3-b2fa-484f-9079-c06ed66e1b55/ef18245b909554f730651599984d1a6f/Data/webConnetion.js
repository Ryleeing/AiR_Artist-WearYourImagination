//==============================================================================
// REQUIRED INPUTS
//==============================================================================

//@input Component.Image targetImage
//@input string imageUrl = "https://picsum.photos/400/600.jpg"

//==============================================================================
// INTERNAL ASSET LOOKUP
//==============================================================================

// Safely attempts to find the required Lens Studio API assets.
var remoteServiceModule = global.assetSystem.getAssetByTypeName("RemoteServiceModule")[0];
var remoteMediaModule = global.assetSystem.getAssetByTypeName("RemoteMediaModule")[0];

//==============================================================================
// IMAGE DOWNLOAD AND APPLICATION FUNCTION
//==============================================================================

/**
 * Downloads the image from the specified URL and applies it to the target image component.
 * @param {string} url The HTTPS URL of the image.
 */
function downloadAndApplyImage(url) {
    
    // 1. Basic Validation
    if (!script.targetImage) {
        print("Error: Please assign a 'targetImage' component in the script properties.");
        return;
    }
    if (!remoteServiceModule || !remoteMediaModule) {
        print("Fatal Error: RemoteServiceModule or RemoteMediaModule assets not found in the project.");
        return;
    }

    // 2. Create the HTTP Request object
    var request = global.RemoteServiceHttpRequest.create();
    request.url = url;
    request.method = global.RemoteServiceHttpRequest.HttpRequestMethod.Get;

    print("Attempting to dynamically load image from: " + url);

    // 3. Perform the HTTP Request
    remoteServiceModule.performHttpRequest(request, function(response) {
        if (response.statusCode === 200) {
            print("Download successful. Converting to texture...");
            
            // 4. Convert the successful response (raw data resource) into an Image Texture
            var dynamicResource = response.asResource();

            remoteMediaModule.loadResourceAsImageTexture(
                dynamicResource,
                function(texture) {
                    // 5. Success: Apply the Texture
                    print("Texture successfully created and applied.");
                    
                    // Assign the texture to the base texture property of the target image's material
                    script.targetImage.mainMaterial.mainPass.baseTex = texture;
                },
                function(errorMessage) {
                    print("Error during texture conversion: " + errorMessage);
                }
            );
        } else {
            print("Network request failed. Status: " + response.statusCode);
        }
    });
}

//==============================================================================
// INITIALIZATION
//==============================================================================

// Use a DelayedCallbackEvent to ensure the system is ready before starting the download
var startEvent = script.createEvent("DelayedCallbackEvent");
startEvent.bind(function() {
    downloadAndApplyImage(script.imageUrl);
});

// Start the download process 0.1 seconds after the Lens initializes.
startEvent.reset(0.1);