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
exports.CircleAnimation = void 0;
var __selfType = requireType("./CircleAnimation");
function component(target) { target.getTypeName = function () { return __selfType; }; }
let CircleAnimation = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var CircleAnimation = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.calRenderer = this.calRenderer;
            this.audio = this.audio;
            this.startSize = 0;
            this.desiredLoadAmount = 0;
            this.startCompleteAnimTime = 0;
            this.updateEvent = null;
            this.audioPlayed = false;
            this.onCompleteCallback = null;
        }
        __initialize() {
            super.__initialize();
            this.calRenderer = this.calRenderer;
            this.audio = this.audio;
            this.startSize = 0;
            this.desiredLoadAmount = 0;
            this.startCompleteAnimTime = 0;
            this.updateEvent = null;
            this.audioPlayed = false;
            this.onCompleteCallback = null;
        }
        onAwake() {
            this.startSize = this.calRenderer.mainPass.StartSize;
            this.calRenderer.mainPass.Amount = 0;
            this.calRenderer.mainPass.CurrSize = this.startSize;
        }
        setLoadAmount(amount) {
            this.desiredLoadAmount = amount;
            if (this.desiredLoadAmount == 1) {
                this.startCompleteAnimTime = getTime();
            }
        }
        update() {
            const currAmount = this.calRenderer.mainPass.Amount;
            if (currAmount < .01) {
                this.calRenderer.mainPass.CurrSize = this.PingPong(this.startSize * 2, this.startSize * 3, getTime() * .75);
            }
            else if (currAmount > .99) {
                if (!this.audioPlayed) {
                    this.audioPlayed = true;
                    this.audio.play(1);
                }
                this.calRenderer.mainPass.CurrSize = this.PingPong(0.095, 0, (getTime() - this.startCompleteAnimTime) * 1);
                if (this.calRenderer.mainPass.CurrSize < .001) {
                    this.calRenderer.mainPass.CurrSize = 0;
                    this.onCompleteCallback?.();
                    this.removeEvent(this.updateEvent);
                }
            }
            this.calRenderer.mainPass.Amount = MathUtils.lerp(currAmount, this.desiredLoadAmount, getDeltaTime() * 6);
        }
        PingPong(min, max, t) {
            var range = max - min;
            var freq = t * (Math.PI * 2);
            return min + (0.5 * (1 + Math.sin(freq)) * range);
        }
        startCalibration(callback) {
            this.audioPlayed = false;
            this.onCompleteCallback = callback;
            this.calRenderer.mainPass.Amount = 0;
            this.desiredLoadAmount = 0;
            this.updateEvent = this.createEvent("UpdateEvent");
            this.updateEvent.bind(() => {
                this.update();
            });
        }
    };
    __setFunctionName(_classThis, "CircleAnimation");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CircleAnimation = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CircleAnimation = _classThis;
})();
exports.CircleAnimation = CircleAnimation;
//# sourceMappingURL=CircleAnimation.js.map