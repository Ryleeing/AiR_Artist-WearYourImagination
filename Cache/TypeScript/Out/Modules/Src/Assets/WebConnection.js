"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebConnection = void 0;
var __selfType = requireType("./WebConnection");
function component(target) { target.getTypeName = function () { return __selfType; }; }
//==============================================================================
// Web Connection Script - Dynamic Material Image Loader (TypeScript)
// Version: 1.0.0
// Description: Downloads an image from a URL and applies it to a material dynamically
//==============================================================================
let WebConnection = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var WebConnection = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.targetMaterial = this.targetMaterial;
            this.imageUrl = this.imageUrl;
            this.loadOnStart = this.loadOnStart;
        }
        __initialize() {
            super.__initialize();
            this.targetMaterial = this.targetMaterial;
            this.imageUrl = this.imageUrl;
            this.loadOnStart = this.loadOnStart;
        }
        onAwake() {
            // Find the required Lens Studio API assets
            const remoteServiceAssets = global.assetSystem.getAssetByTypeName("RemoteServiceModule");
            const remoteMediaAssets = global.assetSystem.getAssetByTypeName("RemoteMediaModule");
            if (remoteServiceAssets.length === 0 || remoteMediaAssets.length === 0) {
                print("Fatal Error: RemoteServiceModule or RemoteMediaModule assets not found in the project.");
                print("Please add these assets to your project from the Asset Library.");
                return;
            }
            this.remoteServiceModule = remoteServiceAssets[0];
            this.remoteMediaModule = remoteMediaAssets[0];
            // Load the image on start if enabled
            if (this.loadOnStart) {
                this.downloadAndApplyImage(this.imageUrl);
            }
        }
        /**
         * Downloads the image from the specified URL and applies it to the target material.
         * @param url The HTTPS URL of the image to download.
         */
        downloadAndApplyImage(url) {
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
            this.remoteServiceModule.performHttpRequest(request, (response) => {
                if (response.statusCode === 200) {
                    print("Download successful. Status: " + response.statusCode + ". Converting to texture...");
                    // Convert the successful response (raw data resource) into an Image Texture
                    const dynamicResource = response.asResource();
                    this.remoteMediaModule.loadResourceAsImageTexture(dynamicResource, (texture) => {
                        // Success: Apply the Texture to the material
                        print("Texture successfully created and applied to material.");
                        this.targetMaterial.mainPass.baseTex = texture;
                    }, (errorMessage) => {
                        print("Error during texture conversion: " + errorMessage);
                    });
                }
                else {
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
        changeImage(newUrl) {
            if (newUrl && newUrl.length > 0) {
                this.imageUrl = newUrl;
                this.downloadAndApplyImage(newUrl);
            }
            else {
                print("Error: Invalid URL provided to changeImage function.");
            }
        }
    };
    __setFunctionName(_classThis, "WebConnection");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WebConnection = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WebConnection = _classThis;
})();
exports.WebConnection = WebConnection;
//# sourceMappingURL=WebConnection.js.map