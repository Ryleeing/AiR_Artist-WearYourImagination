export abstract class ComponentWithPrintOptions extends BaseScriptComponent {

    @input
    protected editDebugSettings: boolean;

    @ui.group_start("Debug Statements")
    @showIf("editDebugSettings")

    @input("bool", "false")
    @label("Print Info")
    private printDebugStatements: boolean;

    @input("bool", "true")
    @label("Print Warnings")
    private printWarningStatements: boolean;

    @ui.group_end

    @ui.separator

    protected printDebug(message: string): void {
        if (this.printDebugStatements) {
            print(this.name + " - " + message);
        }
    }

    protected printWarning(message: string): void {
        if (this.printWarningStatements) {
            print(this.name + " - WARNING, " + message);
        }
    }
}
