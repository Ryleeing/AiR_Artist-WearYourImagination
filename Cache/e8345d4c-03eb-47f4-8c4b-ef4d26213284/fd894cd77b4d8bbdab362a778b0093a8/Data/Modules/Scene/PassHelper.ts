export class PassHelper {
    static setBaseColorAlpha(pass: Pass, alpha: number): void {
        const color: vec4 = pass.baseColor;
        color.w = alpha;
        pass.baseColor = color;
    }

    static cloneAndReplaceMaterial(meshVisual: MaterialMeshVisual): Material {
        const clone: Material = meshVisual.mainMaterial.clone();
        meshVisual.mainMaterial = clone;
        return clone;
    }

    static copyColorWithDifferentAlpha(color: vec4, alpha: number): vec4 {
        return new vec4(color.r, color.g, color.b, alpha);
    }
}
