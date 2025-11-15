"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YOLODetectionProcessor = void 0;
const DetectionHelpers_1 = require("./DetectionHelpers");
const NativeLogger_1 = require("SpectaclesInteractionKit.lspkg/Utils/NativeLogger");
// Create a logger instance for this class
const log = new NativeLogger_1.default("YOLODetectionProcessor");
/**
 * Processes YOLO model outputs to extract detections
 */
class YOLODetectionProcessor {
    constructor(classLabels, scoreThreshold, iouThreshold, debugLogging) {
        // YOLO model configuration
        this.anchors = [
            [
                [144, 300],
                [304, 220],
                [288, 584],
            ],
            [
                [568, 440],
                [768, 972],
                [1836, 1604],
            ],
            [
                [48, 64],
                [76, 144],
                [160, 112],
            ],
        ];
        this.strides = [16, 32, 8];
        this.grids = [];
        this.boxes = [];
        this.scores = [];
        this.classLabels = classLabels;
        this.scoreThreshold = scoreThreshold;
        this.iouThreshold = iouThreshold;
        this.debugLogging = debugLogging;
    }
    /**
     * Initialize the processor with model inputs/outputs
     */
    initialize(outputs, inputs) {
        // Build grids for YOLO processing
        this.grids = [];
        for (let i = 0; i < outputs.length; i++) {
            const shape = outputs[i].shape;
            this.grids.push(this.makeGrid(shape.x, shape.y));
        }
        this.inputShape = inputs[0].shape;
        if (this.debugLogging) {
            log.d(`Initialized YOLO processor with ${outputs.length} outputs`);
            log.d(`Input shape: ${this.inputShape.x}x${this.inputShape.y}x${this.inputShape.z}`);
            for (let i = 0; i < outputs.length; i++) {
                const shape = outputs[i].shape;
                log.d(`Output ${i}: Shape ${shape.x}x${shape.y}x${shape.z}`);
            }
        }
    }
    /**
     * Create grid for YOLO processing
     */
    makeGrid(nx, ny) {
        const grids = [];
        for (let dy = 0; dy < ny; dy++) {
            const grid = [];
            for (let dx = 0; dx < nx; dx++) {
                grid.push([dx, dy]);
            }
            grids.push(grid);
        }
        return grids;
    }
    /**
     * Parse YOLO model outputs
     */
    parseYolo7Outputs(outputs) {
        this.boxes = [];
        this.scores = [];
        const numHeads = outputs.length;
        const classCount = this.classLabels.length;
        // Debugging variables
        let totalBoxes = 0;
        let boxesOverThreshold = 0;
        let highestScore = 0;
        let highestScoreClass = -1;
        for (let i = 0; i < numHeads; i++) {
            const output = outputs[i];
            const data = output.data;
            const shape = output.shape;
            const nx = shape.x;
            const ny = shape.y;
            const step = classCount + 4 + 1;
            // [nx, ny, 255] -> [nx, ny, n_anchors(3), n_outputs(classCount + 4 + 1)]
            for (let dy = 0; dy < ny; dy++) {
                for (let dx = 0; dx < nx; dx++) {
                    for (let da = 0; da < this.anchors.length; da++) {
                        totalBoxes++;
                        const idx = dy * nx * this.anchors.length * step +
                            dx * this.anchors.length * step +
                            da * step;
                        // 0-1: xy, 2-3: wh, 4: conf, 5-5+classCount: scores
                        let x = data[idx];
                        let y = data[idx + 1];
                        let w = data[idx + 2];
                        let h = data[idx + 3];
                        const conf = data[idx + 4];
                        // Track highest confidence
                        if (conf > highestScore) {
                            highestScore = conf;
                        }
                        if (conf > this.scoreThreshold) {
                            boxesOverThreshold++;
                            // YOLO-specific transformations
                            x = (x * 2 - 0.5 + this.grids[i][dy][dx][0]) * this.strides[i];
                            y = (y * 2 - 0.5 + this.grids[i][dy][dx][1]) * this.strides[i];
                            w = w * w * this.anchors[i][da][0];
                            h = h * h * this.anchors[i][da][1];
                            const res = { cls: 0, score: 0 };
                            const box = [
                                x / this.inputShape.x,
                                y / this.inputShape.y,
                                w / this.inputShape.x,
                                h / this.inputShape.y,
                            ];
                            for (let nc = 0; nc < classCount; nc++) {
                                const classScore = data[idx + 5 + nc] * conf;
                                if (classScore > this.scoreThreshold &&
                                    classScore > res.score) {
                                    res.cls = nc;
                                    res.score = classScore;
                                    // Track highest class score
                                    if (classScore > highestScore) {
                                        highestScore = classScore;
                                        highestScoreClass = nc;
                                    }
                                }
                            }
                            if (res.score > 0) {
                                this.boxes.push(box);
                                this.scores.push(res);
                            }
                        }
                    }
                }
            }
        }
        // Add detailed debug message about YOLO output parsing
        if (this.debugLogging) {
            if (this.boxes.length === 0) {
                log.d(`No detections after parsing YOLO outputs. Examined ${totalBoxes} boxes, ${boxesOverThreshold} were above confidence threshold. Highest score: ${highestScore.toFixed(3)}`);
                if (highestScoreClass >= 0) {
                    log.d(`Highest scoring class (${highestScoreClass} - ${this.getClassLabel(highestScoreClass)}) didn't meet thresholds`);
                }
                // If highest score is close to threshold, suggest lowering it
                if (highestScore > 0 &&
                    highestScore < this.scoreThreshold &&
                    highestScore > this.scoreThreshold * 0.5) {
                    log.d(`TIP: Consider lowering score threshold from ${this.scoreThreshold} to ${(highestScore * 0.9).toFixed(3)} to detect objects`);
                }
            }
            else {
                log.d(`Found ${this.boxes.length} detections from ${totalBoxes} potential boxes`);
            }
        }
        // Apply non-maximum suppression
        const detections = DetectionHelpers_1.DetectionHelpers.nms(this.boxes, this.scores, this.scoreThreshold, this.iouThreshold).sort(DetectionHelpers_1.DetectionHelpers.compareByScoreReversed);
        // Apply labels to detections
        for (let i = 0; i < detections.length; i++) {
            if (this.classLabels.length > detections[i].index &&
                this.classLabels[detections[i].index]) {
                detections[i].label = this.classLabels[detections[i].index];
            }
        }
        return detections;
    }
    /**
     * Get class label by index
     */
    getClassLabel(index) {
        if (index >= 0 && index < this.classLabels.length) {
            return this.classLabels[index];
        }
        return `class_${index}`;
    }
}
exports.YOLODetectionProcessor = YOLODetectionProcessor;
//# sourceMappingURL=YOLODetectionProcessor.js.map