//==============================================================================
// Image URL Changer - Example script to dynamically change material images
// Version: 1.0.0
// Event: Lens Initialized
// Description: Example script showing how to change material images dynamically
//              Can be triggered by UI buttons, sliders, or other interactions
//==============================================================================

//@input Component.Script webConnectionScript {"label":"Web Connection Script"}
//@input string[] imageUrls = ["https://picsum.photos/400/600.jpg", "https://picsum.photos/500/700.jpg"] {"label":"Image URLs Array"}
//@input int currentImageIndex = 0 {"label":"Current Image Index"}

/**
 * Changes to the next image in the array
 */
script.nextImage = function() {
    if (!script.webConnectionScript) {
        print("Error: Web Connection Script not assigned!");
        return;
    }
    
    if (!script.imageUrls || script.imageUrls.length === 0) {
        print("Error: No image URLs provided!");
        return;
    }
    
    script.currentImageIndex = (script.currentImageIndex + 1) % script.imageUrls.length;
    var newUrl = script.imageUrls[script.currentImageIndex];
    
    print("Changing to image " + (script.currentImageIndex + 1) + " of " + script.imageUrls.length);
    script.webConnectionScript.changeImage(newUrl);
};

/**
 * Changes to the previous image in the array
 */
script.previousImage = function() {
    if (!script.webConnectionScript) {
        print("Error: Web Connection Script not assigned!");
        return;
    }
    
    if (!script.imageUrls || script.imageUrls.length === 0) {
        print("Error: No image URLs provided!");
        return;
    }
    
    script.currentImageIndex = (script.currentImageIndex - 1 + script.imageUrls.length) % script.imageUrls.length;
    var newUrl = script.imageUrls[script.currentImageIndex];
    
    print("Changing to image " + (script.currentImageIndex + 1) + " of " + script.imageUrls.length);
    script.webConnectionScript.changeImage(newUrl);
};

/**
 * Changes to a specific image by index
 * @param {number} index The index of the image in the array
 */
script.changeToImage = function(index) {
    if (!script.webConnectionScript) {
        print("Error: Web Connection Script not assigned!");
        return;
    }
    
    if (!script.imageUrls || script.imageUrls.length === 0) {
        print("Error: No image URLs provided!");
        return;
    }
    
    if (index < 0 || index >= script.imageUrls.length) {
        print("Error: Index out of range!");
        return;
    }
    
    script.currentImageIndex = index;
    var newUrl = script.imageUrls[index];
    
    print("Changing to image " + (index + 1) + " of " + script.imageUrls.length);
    script.webConnectionScript.changeImage(newUrl);
};

/**
 * Changes to a specific image by URL
 * @param {string} url The URL of the image to load
 */
script.changeToUrl = function(url) {
    if (!script.webConnectionScript) {
        print("Error: Web Connection Script not assigned!");
        return;
    }
    
    if (!url || url.length === 0) {
        print("Error: Invalid URL provided!");
        return;
    }
    
    script.webConnectionScript.changeImage(url);
};

