import { widgetAreaParams, nestedStringsArrays, replaceAllParams } from "../../types/customTypes";
import { FileReader } from "../../files/FileReader";
import { FileWriter } from "../../files/FileWriter";
import { CommentsIdentifiers } from "../../comments-identifiers/CommentsIdentifiers";
import { StringComposeWriter } from "../../files/StringComposeWriter";
import { WpFunctionComposer } from "../../files/WpFunctionComposer";
import { ThemeAux } from "../../theme/ThemeAux";

type params = widgetAreaParams;
class WidgetArea {
  public readonly ALREADY_PRESENT =
    "ERROR: The custom widget area already exists";
  public readonly NO_VALID_INFORMATIONS =
    "ERROR: the informations attribute of this class is not initalized";

  public readonly PATH = "custom-widget-areas/";
  public readonly DEFAULT_BUILD_PATH = this.PATH + "default.php";
  public readonly IDENTIFIER_NAME = "WIDGET-AREA";

  /**
   * 
   * @param themeAux 
   * @param informations the field widgetAreaName should also be a valid function name
   */
  constructor(
    public themeAux: ThemeAux,
    private informations: params = {
      widgetAreaName: "",
    }
  ) {}

  /**
   * @description checks if the post types informations are valid, returns true or false
   */
  public validInformations(): boolean {
    if (!this.informations.widgetAreaName) return false;
    return true;
  }
  public get getInformations(): params {
    return this.informations;
  }
  /**
   * @param newInformations the field widgetAreaName should also be a valid function name
   */
  public set setInformations(newInformations: params) {
    this.informations = newInformations;
  }

  /**
   * @description returns the absolute path of the widget area file
   */
  public getPath(): string {
    return this.themeAux.getInsideThemeAssetsPath(
      this.PATH,
      `${this.getInformations.widgetAreaName}.php`
    );
  }

  /**
   * @description import the current structure in the theme
   */
  public import() {
    if (!this.validInformations()) throw new Error(this.NO_VALID_INFORMATIONS);
    StringComposeWriter.appendBeetweenChars(
      this.themeAux.THEME_FUNCTIONS_FILE,
      WpFunctionComposer.requirePhpFile(
        StringComposeWriter.concatenatePaths(
          this.PATH,
          this.getInformations.widgetAreaName
        )
      ),
      CommentsIdentifiers.getIdentifierImportPair(this.IDENTIFIER_NAME)[0],
      CommentsIdentifiers.getIdentifierImportPair(this.IDENTIFIER_NAME)[1]
    );
  }

  /**
   * @description create the file of the given widget area if not exists ( and populate it with the default params )
   * @skipIfExists it's a boolean value that prevent to throw an error if the given widget area already exists
   */
  public create(skipIfExists: boolean = false): void {
    if (!this.validInformations()) throw new Error(this.NO_VALID_INFORMATIONS);
    let widgetAreaPath: string = this.getPath();

    if (FileReader.existsPath(widgetAreaPath) && !skipIfExists)
      throw new Error(this.ALREADY_PRESENT);

    let defaultContent: string = FileReader.readFile(
      this.themeAux.getInsideThemeAssetsPath(this.DEFAULT_BUILD_PATH)
    );
    
    let params: replaceAllParams = {};
    params[this.IDENTIFIER_NAME] =  this.getInformations.widgetAreaName;
    
    let newContent: string = defaultContent;
    newContent = StringComposeWriter.replaceAllIdentifiersPlaceholders(newContent, params);
    
    FileWriter.writeFile(widgetAreaPath, newContent);
  }
}

export { WidgetArea };
