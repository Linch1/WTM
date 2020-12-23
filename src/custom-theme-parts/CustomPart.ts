import { StringComposeWriter } from "../files/StringComposeWriter";
import { ThemeAux } from "../ManageTheme/ThemeAux";
import { InterfacecustomPart } from "./InterfacecustomPart";

import { FileReader } from "../files/FileReader";
import { FileWriter } from "../files/FileWriter";
import { CommentsIdentifiers } from "../comments-identifiers/CommentsIdentifiers";
import { WpFunctionComposer } from "../files/WpFunctionComposer";

class CustomPart<T> implements InterfacecustomPart {
  public readonly ERR_NO_VALID_INFORMATIONS =
    "ERR: the informations attribute of this class are not correctly initalized";
  public readonly ERR_ALREADY_PRESENT =
    "ERROR: The custom part area already exists";

  public PATH: string = "";
  public DEFAULT_BUILD_PATH: string = "";
  protected FILE_NAME = "WTM-SETTINGS-PAGE.php";
  protected JSON_NAME = "WTM.json";
  protected IDENTIFIER_NAME = "SETTINGS-PAGE";
  protected CUSTOM_PART_NAME = "";

  /**
   * @description intialize the class
   * @param themeAux
   * @param informations the field pageName should also be a valid function name
   */
  constructor(public themeAux: ThemeAux, protected informations: T) {}

  /**
   * @description checks if the post types informations are valid, returns true or false
   */
  public validInformations(): boolean {
    let valid = true;
    for (let key in this.getInformations) {
      if (key == "skipIfExists") continue;
      else valid = !!this.getInformations[key] && valid;
    }
    return valid;
  }

  /**
   * @param newInformations the field pageName should also be a valid function name
   */
  public set setInformations(newInformations: T) {
    this.informations = newInformations;
  }
  public get getInformations(): T {
    return this.informations;
  }

  /**
   * @description return the name of the function used to import files of structure(html)/styles(.css) in the given menu page
   * @param page the menu page where to import the files
   */
  public renderFileFunction(page: string): string {
    return `render_file_${page}`;
  }

  /**
   * @description get the path to the dircetory that contains the custom part
   */
  getDirectory(): string {
    return this.themeAux.getInsideThemeAssetsPath(
      this.PATH,
      this.CUSTOM_PART_NAME
    );
  }
  /**
   * @description get the path to a file inside the custom part's directory
   * @param file the file for which retrive the path
   */
  public getInsideDirectory(file: string): string {
    return StringComposeWriter.concatenatePaths(this.getDirectory(), file);
  }
  /**
   * @description get the absolute path to the main file of the custom part
   */
  public getPath(): string {
    return this.getInsideDirectory(this.FILE_NAME);
  }
  /**
   * @description returns the absolute path of the json file that contains the relevant informations of the custom part
   */
  public getJsonPath(): string {
    return this.getInsideDirectory(this.JSON_NAME);
  }
  /**
   * @description save the informations of the custom part
   */
  public saveJson(): void {
    FileWriter.writeFile(
      this.getJsonPath(),
      JSON.stringify(this.getInformations)
    );
  }
  /**
   * @description creates the element directory
   */
  public createDirectory() {
    let directory = this.themeAux.getInsideThemeAssetsPath(
      this.PATH,
      this.CUSTOM_PART_NAME
    );
    if (!FileReader.existsPath(directory))
      FileWriter.createDirectory(directory);
  }

  /**
   * @description import the current structure in the theme
   */
  public import() {
    if (!this.validInformations())
      throw new Error(this.ERR_NO_VALID_INFORMATIONS);
    StringComposeWriter.appendBeetweenChars(
      this.themeAux.THEME_FUNCTIONS_FILE,
      WpFunctionComposer.requirePhpFile(
        StringComposeWriter.concatenatePaths(this.PATH, this.CUSTOM_PART_NAME)
      ),
      CommentsIdentifiers.getIdentifierImportPair(this.IDENTIFIER_NAME)[0],
      CommentsIdentifiers.getIdentifierImportPair(this.IDENTIFIER_NAME)[1]
    );
  }

  create(): void {
    throw new Error("Method not implemented.");
  }
}

export { CustomPart };
