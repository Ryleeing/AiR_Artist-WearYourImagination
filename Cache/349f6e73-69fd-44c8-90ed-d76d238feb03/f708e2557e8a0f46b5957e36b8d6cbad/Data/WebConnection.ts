//==============================================================================
// Web Connection Script - Dynamic Material Image Loader (TypeScript)
// Version: 1.0.0
// Description: Downloads an image from a URL and applies it to a material dynamically
//==============================================================================

@component
export class WebConnection extends BaseScriptComponent {

    @input
    @label("Target Material")
    targetMaterial!: Asset.Material;

    @input("string", "https://picsum.photos/400/600.jpg")
    @label("Image URL")
    imageUrl: string = "https://picsum.photos/400/600.jpg";

    @input("bool", "true")
    @label("Load on Start")
    loadOnStart: boolean = true;

    private remoteServiceModule: RemoteServiceModule;
    private remoteMediaModule: RemoteMediaModule;

    onAwake() {
        // Find the required Lens Studio API assets
        const remoteServiceAssets = global.assetSystem.getAssetByTypeName("RemoteServiceModule");
        const remoteMediaAssets = global.assetSystem.getAssetByTypeName("RemoteMediaModule");

        if (remoteServiceAssets.length === 0 || remoteMediaAssets.length === 0) {
            print("Fatal Error: RemoteServiceModule or RemoteMediaModule assets not found in the project.");
            print("Please add these assets to your project from the Asset Library.");
            return;
        }

        this.remoteServiceModule = remoteServiceAssets[0] as RemoteServiceModule;
        this.remoteMediaModule = remoteMediaAssets[0] as RemoteMediaModule;

        // Load the image on start if enabled
        if (this.loadOnStart) {
            this.downloadAndApplyImage(this.imageUrl);
        }
    }

    /**
     * Downloads the image from the specified URL and applies it to the target material.
     * @param url The HTTPS URL of the image to download.
     */
    private downloadAndApplyImage(url: string): void {
        // Basic Validation
        if (!this.targetMaterial) {
            print("Error: Please assign a 'targetMaterial' in the script properties.");
            return;
        }

        if (!url || url.length === 0) {
            print("Error: Please provide a valid image URL.");
            return;
        }

        if (!this.remoteServiceModule || !this.remoteMediaModule) {
            print("Fatal Error: RemoteServiceModule or RemoteMediaModule not available.");
            return;
        }

        // Create the HTTP Request object
        const request = global.RemoteServiceHttpRequest.create();
        request.url = url;
        request.method = global.RemoteServiceHttpRequest.HttpRequestMethod.Get;

        print("Attempting to dynamically load image from: " + url);

        // Perform the HTTP Request
        this.remoteServiceModule.performHttpRequest(request, (response: RemoteServiceHttpResponse) => {
            if (response.statusCode === 200) {
                print("Download successful. Status: " + response.statusCode + ". Converting to texture...");

                // Convert the successful response (raw data resource) into an Image Texture
                const dynamicResource = response.asResource();

                this.remoteMediaModule.loadResourceAsImageTexture(
                    dynamicResource,
                    (texture: Texture) => {
                        // Success: Apply the Texture to the material
                        print("Texture successfully created and applied to material.");
                        this.targetMaterial.mainPass.baseTex = texture;
                    },
                    (errorMessage: string) => {
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

    /**
     * Public function to change the material's image from a new URL.
     * Call this function from other scripts or UI interactions to update the image.
     * @param newUrl The new image URL to load.
     */
    public changeImage(newUrl: string): void {
        if (newUrl && newUrl.length > 0) {
            this.imageUrl = newUrl;
            this.downloadAndApplyImage(newUrl);
        } else {
            print("Error: Invalid URL provided to changeImage function.");
        }
    }
}

