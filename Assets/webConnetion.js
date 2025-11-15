//==============================================================================
// Web Connection Script - Dynamic Material Image Loader
// Version: 1.0.0
// Event: Lens Initialized
// Description: Downloads an image from a URL and applies it to a material dynamically
//==============================================================================

//@input Asset.Material targetMaterial {"label":"Target Material"}
//@input Asset.RemoteServiceModule remoteServiceModule {"label":"Remote Service Module"}
//@input Asset.RemoteMediaModule remoteMediaModule {"label":"Remote Media Module"}
//@input string imageUrl = "https://picsum.photos/400/600.jpg" {"label":"Image URL"}
//@input bool loadOnStart = true {"label":"Load on Start"}

//==============================================================================
// IMAGE DOWNLOAD AND APPLICATION FUNCTION
//==============================================================================

/**
 * Downloads the image from the specified URL and applies it to the target material.
 * @param {string} url The HTTPS URL of the image to download.
 */
function downloadAndApplyImage(url) {
    
    // 1. Basic Validation
    if (!script.targetMaterial) {
        print("Error: Please assign a 'targetMaterial' in the script properties.");
        return;
    }
    
    if (!url || url.length === 0) {
        print("Error: Please provide a valid image URL.");
        return;
    }
    
    if (!script.remoteServiceModule || !script.remoteMediaModule) {
        print("Fatal Error: RemoteServiceModule or RemoteMediaModule not assigned.");
        print("Please assign these assets in the script properties.");
        print("You can find them in the Asset Library by searching for 'RemoteServiceModule' and 'RemoteMediaModule'.");
        return;
    }

    // 2. Create the HTTP Request object
    var request = global.RemoteServiceHttpRequest.create();
    request.url = url;
    request.method = global.RemoteServiceHttpRequest.HttpRequestMethod.Get;

    print("Attempting to dynamically load image from: " + url);

    // 3. Perform the HTTP Request
    script.remoteServiceModule.performHttpRequest(request, function(response) {
        if (response.statusCode === 200) {
            print("Download successful. Status: " + response.statusCode + ". Converting to texture...");
            
            // 4. Convert the successful response (raw data resource) into an Image Texture
            var dynamicResource = response.asResource();

            script.remoteMediaModule.loadResourceAsImageTexture(
                dynamicResource,
                function(texture) {
                    // 5. Success: Apply the Texture to the material
                    print("Texture successfully created and applied to material.");
                    
                    // Assign the texture to the base texture property of the material's main pass
                    script.targetMaterial.mainPass.baseTex = texture;
                },
                function(errorMessage) {
                    print("Error during texture conversion: " + errorMessage);
                }
            );
        } else {
            print("Network request failed. Status: " + response.statusCode);
            if (response.body) {
                print("Response body: " + response.body);
            }
        }
    });
}

//==============================================================================
// PUBLIC API - Call this function to change the image dynamically
//==============================================================================

/**
 * Public function to change the material's image from a new URL.
 * Call this function from other scripts or UI interactions to update the image.
 * @param {string} newUrl The new image URL to load.
 */
script.changeImage = function(newUrl) {
    if (newUrl && newUrl.length > 0) {
        script.imageUrl = newUrl;
        downloadAndApplyImage(newUrl);
    } else {
        print("Error: Invalid URL provided to changeImage function.");
    }
};

//==============================================================================
// INITIALIZATION
//==============================================================================

// Load the image on start if enabled
if (script.loadOnStart) {
    downloadAndApplyImage(script.imageUrl);
}

