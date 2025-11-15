"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentWithPrintOptions = void 0;
class ComponentWithPrintOptions extends BaseScriptComponent {
    constructor() {
        super();
        this.editDebugSettings = this.editDebugSettings;
        this.printDebugStatements = this.printDebugStatements;
        this.printWarningStatements = this.printWarningStatements;
    }
    __initialize() {
        super.__initialize();
        this.editDebugSettings = this.editDebugSettings;
        this.printDebugStatements = this.printDebugStatements;
        this.printWarningStatements = this.printWarningStatements;
    }
    printDebug(message) {
        if (this.printDebugStatements) {
            print(this.name + " - " + message);
        }
    }
    printWarning(message) {
        if (this.printWarningStatements) {
            print(this.name + " - WARNING, " + message);
        }
    }
}
exports.ComponentWithPrintOptions = ComponentWithPrintOptions;
//# sourceMappingURL=ComponentWithPrintOptions.js.map