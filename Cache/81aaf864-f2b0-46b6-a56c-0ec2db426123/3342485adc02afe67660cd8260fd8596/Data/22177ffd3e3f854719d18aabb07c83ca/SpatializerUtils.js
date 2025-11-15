"use strict";
// filepath: DepthSpatializerUtils.ts
// Utility interfaces and functions for DepthSpatializer
Object.defineProperty(exports, "__esModule", { value: true });
exports.areVerticesSimilar = areVerticesSimilar;
exports.lerpVec3 = lerpVec3;
exports.easeOutCubic = easeOutCubic;
exports.alignVerticesToRectangle = alignVerticesToRectangle;
function areVerticesSimilar(vertices1, vertices2, thresholdCm) {
    if (vertices1.length !== vertices2.length)
        return false;
    const threshold = thresholdCm / 100;
    for (let i = 0; i < vertices1.length; i++) {
        if (vertices1[i].distance(vertices2[i]) > threshold)
            return false;
    }
    return true;
}
function lerpVec3(start, end, t) {
    return vec3.lerp(start, end, t);
}
function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}
function alignVerticesToRectangle(vertices, debug) {
    if (vertices.length !== 4)
        return vertices;
    const [topLeft, topRight, bottomLeft, bottomRight] = vertices;
    const topY = (topLeft.y + topRight.y) / 2;
    const bottomY = (bottomLeft.y + bottomRight.y) / 2;
    const leftX = (topLeft.x + bottomLeft.x) / 2;
    const rightX = (topRight.x + bottomRight.x) / 2;
    const topZ = (topLeft.z + topRight.z) / 2;
    const bottomZ = (bottomLeft.z + bottomRight.z) / 2;
    const leftZ = (topLeft.z + bottomLeft.z) / 2;
    const rightZ = (topRight.z + bottomRight.z) / 2;
    const alignedVertices = [
        new vec3(leftX, topY, (topZ + leftZ) / 2),
        new vec3(rightX, topY, (topZ + rightZ) / 2),
        new vec3(leftX, bottomY, (bottomZ + leftZ) / 2),
        new vec3(rightX, bottomY, (bottomZ + rightZ) / 2)
    ];
    if (debug) {
        print("Rectangle alignment adjustments:");
        for (let i = 0; i < 4; i++) {
            const original = vertices[i];
            const aligned = alignedVertices[i];
            print(`  Vertex ${i}: Δ(${Math.abs(aligned.x - original.x).toFixed(3)}, ${Math.abs(aligned.y - original.y).toFixed(3)}, ${Math.abs(aligned.z - original.z).toFixed(3)})`);
        }
    }
    return alignedVertices;
}
//# sourceMappingURL=SpatializerUtils.js.map