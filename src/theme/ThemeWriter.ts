import { nestedStringsArrays } from "../types/customTypes";
import { FileReader } from "../files/FileReader";
import { FileWriter } from "../files/FileWriter";
import { Theme } from "./Theme";
import { ThemeReader } from "./ThemeReader";

class ThemeWriter extends Theme {
  public readonly reader: ThemeReader;

  constructor(public ThemeFolder: string) {
    super(ThemeFolder);
    this.reader = new ThemeReader(ThemeFolder);
  }

  public getThemePath(location: string): string {
    return this.ThemeFolder.endsWith("/")
      ? this.ThemeFolder + location
      : this.ThemeFolder + "/" + location;
  }

  public enqueueStyleFunction(fileToImport: string): string {
    fileToImport = fileToImport.startsWith("/")
      ? fileToImport
      : "/" + fileToImport;
    return `wp_enqueue_style( '${fileToImport.replace("/", "-")}', get_template_directory_uri() . '${fileToImport}', false, '0.0.1', 'all');`;
  }

  public enqueueScriptFunction(fileToImport: string): string {
    fileToImport = fileToImport.startsWith("/")
      ? fileToImport
      : "/" + fileToImport;
    return `wp_enqueue_script( '${fileToImport.replace("/", "-")}', get_template_directory_uri() . '${fileToImport}', array ( 'jquery' ), '0.0.1', true);`;
  }

  // import the style based on
  // stylePath ( inside the theme relatively to the theme main directory: myThemeContainerDir/path/to/style),
  // this.IMPORT_STYLES_FUNCTION_NAME,
  // this.IMPORT_FILE_PATH,
  public importStyle(stylePath: string): void {
    let importString: string = this.enqueueStyleFunction(stylePath); // get the wp syntax for import the style
    FileWriter.appendToFunctionBody(
      this.getThemePath(this.IMPORT_FILE_PATH), // file path
      this.IMPORT_STYLES_FUNCTION_NAME, // function name
      importString // string to append to the function body
    );
  }

  public importScript(scriptPath: string): void {
    let importString: string = this.enqueueScriptFunction(scriptPath); // get the wp syntax for import the script
    FileWriter.appendToFunctionBody(
      this.getThemePath(this.IMPORT_FILE_PATH), // file path
      this.IMPORT_SCRIPTS_FUNCTION_NAME, // function name
      importString // string to append to the function body
    );
  }

  public importFont(fontUrl: string): void {
    let importString: string = this.enqueueStyleFunction(fontUrl); // get the wp syntax for import the style
    FileWriter.appendToFunctionBody(
      this.getThemePath(this.IMPORT_FILE_PATH), // file path
      this.IMPORT_FONTS_FUNCTION_NAME, // function name
      importString // string to append to the function body
    );
  }
}

export { ThemeWriter };
