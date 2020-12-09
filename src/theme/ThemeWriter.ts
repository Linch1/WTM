import { nestedStringsArrays } from "../types/customTypes";
import { FileReader } from "../files/FileReader";
import { FileWriter } from "../files/FileWriter";
import { Theme } from "./Theme";
import { ThemeReader } from "./ThemeReader";
import { CustomPostType } from "../custom-post-types/CustomPostType";

class ThemeWriter extends Theme {
  public readonly reader: ThemeReader;

  constructor(public ThemeFolder: string) {
    super(ThemeFolder);
    this.reader = new ThemeReader(ThemeFolder);
  }

  public getThemePath(location: string): string {
    return FileReader.concatenatePaths(this.ThemeFolder, location);
  }
  /**
   * @description return the syntax of the function for correctly import a style file in wordpress
   * @param fileToImport the file path to import in the WP theme
   */
  public enqueueStyleFunction(fileToImport: string): string {
    fileToImport = fileToImport.startsWith("/")
      ? fileToImport
      : "/" + fileToImport;
    return `wp_enqueue_style( '${fileToImport.replace(
      "/",
      "[WTM]$"
    )}', get_template_directory_uri() . '${fileToImport}', false, '0.0.1', 'all');`;
  }
  /**
   * @description return the syntax of the function for correctly import a script file in wordpress
   * @param fileToImport the file path to import in the WP theme
   */
  public enqueueScriptFunction(fileToImport: string): string {
    fileToImport = fileToImport.startsWith("/")
      ? fileToImport
      : "/" + fileToImport;
    return `wp_enqueue_script( '${fileToImport.replace(
      "/",
      "[WTM]$"
    )}', get_template_directory_uri() . '${fileToImport}', array ( 'jquery' ), '0.0.1', true);`;
  }

  /**
   * @description import in the WP theme given style file
   * @param stylePath the file path to the style file
   */
  public importStyle(stylePath: string): void {
    let importString: string = this.enqueueStyleFunction(stylePath); // get the wp syntax for import the style
    FileWriter.appendToFunctionBody(
      this.getThemePath(this.IMPORT_FILE_PATH), // file path
      this.IMPORT_STYLES_FUNCTION_NAME, // function name
      importString // string to append to the function body
    );
  }
  /**
   * @description import in the WP theme given script file
   * @param scriptPath the file path to the script file
   */
  public importScript(scriptPath: string): void {
    let importString: string = this.enqueueScriptFunction(scriptPath); // get the wp syntax for import the script
    FileWriter.appendToFunctionBody(
      this.getThemePath(this.IMPORT_FILE_PATH), // file path
      this.IMPORT_SCRIPTS_FUNCTION_NAME, // function name
      importString // string to append to the function body
    );
  }
  /**
   * @description import in the WP theme given font url
   * @param fontUrl the url of the font to import ( google font )
   */
  public importFont(fontUrl: string): void {
    let importString: string = this.enqueueStyleFunction(fontUrl); // get the wp syntax for import the style
    FileWriter.appendToFunctionBody(
      this.getThemePath(this.IMPORT_FILE_PATH), // file path
      this.IMPORT_FONTS_FUNCTION_NAME, // function name
      importString // string to append to the function body
    );
  }

  // public importCustomPostType(postTypeObject: CustomPostType): void {
  //   FileWriter.addAfterCommentIdentifier(
  //     this.getThemePath(this.FUNCTIONS_FILE),
  //     postTypeObject.IMPORT_IDENTIFIER,
  //     FileReader.concatenatePaths(
  //       postTypeObject.PATH,
  //       postTypeObject.postType
  //     )
  //   );
  // }
}

export { ThemeWriter };
