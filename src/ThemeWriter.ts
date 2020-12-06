import {
    nestedStringsArrays, 
    readFileContent
} from "./customTypes";
import {FileManager} from "./FileManager";
import {Theme} from "./Theme";
import {ThemeReader} from "./ThemeReader";

class ThemeWriter extends Theme {

    public readonly IMPORT_STYLES_FUNCTION_NAME: string = "add_css_";
    public readonly IMPORT_FONTS_FUNCTION_NAME: string = "add_fonts";
    public readonly IMPORT_SCRIPTS_FUNCTION_NAME: string = "add_scripts";

    public readonly IMPORT_FILE_PATH: string = "assets/functions/first-setup.php";
    
    public readonly reader: ThemeReader;

    constructor(public ThemeFolder: string){
        super(ThemeFolder);
        this.reader = new ThemeReader(ThemeFolder);
    }

    public getThemePath(location: string): string{
        return this.ThemeFolder.endsWith("/") ? this.ThemeFolder + location : this.ThemeFolder + "/" + location;
    }

    // import the style based on
    // stylePath ( inside the theme relatively to the theme main directory: myThemeContainerDir/path/to/style),
    // this.IMPORT_STYLES_FUNCTION_NAME,
    // this.IMPORT_FILE_PATH,
    public importStyle(stylePath: string): void {
        let fileContent: readFileContent = this.reader.readFunctionBody(
            this.getThemePath(this.IMPORT_FILE_PATH), 
            this.IMPORT_STYLES_FUNCTION_NAME
        ); // get the import file content
        let functionBody: string = fileContent.functionBody; // get the function body to edit
        let importString: string = this.enqueueStyleFunction(stylePath); // get the wp syntax for import the style
        functionBody = functionBody.endsWith(";") ? `${functionBody}\n${importString}` : `${functionBody};\n${importString}`; // add the file importation
        this.editFileFunction(fileContent, functionBody); // edit the file
    }

    public enqueueStyleFunction(fileToImport: string): string{
        fileToImport = fileToImport.startsWith("/") ? fileToImport : "/" + fileToImport;
        return `wp_enqueue_style( '${fileToImport.replace("/", "-")}', get_template_directory_uri() . "${fileToImport}", false, '0.0.1', 'all');`
    }

    public importScript(scriptPath: string): void {
        // se è della lib va importato nel file di setup.php
        // se e dei partials va importato nel file di setup.php
    }

    public importFont(fontUrl: string): void {
        // Google Fonts are imported as the css files
        this.importStyle(fontUrl);
    }

    public editFileFunction(fileContent: readFileContent, newFunctionBody: string){
        let functions: string[] = fileContent.functionsArray;
        let functionIndex: number = fileContent.functionIndex;
        fileContent.targetFunctionCloseSplit[0] = newFunctionBody;
        fileContent.targetFunctionOpenSplit[1] = fileContent.targetFunctionCloseSplit.join("}");
        functions[functionIndex] = fileContent.targetFunctionOpenSplit.join("{");
        console.log(functions.join("\nfunction ")); 
    }

}

export { ThemeWriter };