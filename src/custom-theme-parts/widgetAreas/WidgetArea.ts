import { widgetAreaParams, nestedStringsArrays } from "../../types/customTypes";
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

  constructor(
    public themeAux: ThemeAux,
    public informations: params = {
      widgetAreaName: "",
    }
  ) {}

  /**
   * @description checks if the post types informations are valid, returns true or false
   */
  public emptyInformations(): boolean {
    if (!this.informations.widgetAreaName) return false;
    return true;
  }
  public get getInformations(): params {
    return this.informations;
  }
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
    if (this.emptyInformations()) throw new Error(this.NO_VALID_INFORMATIONS);
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
    if (this.emptyInformations()) throw new Error(this.NO_VALID_INFORMATIONS);
    let widgetAreaPath: string = this.getPath();

    if (FileReader.existsPath(widgetAreaPath) && !skipIfExists)
      throw new Error(this.ALREADY_PRESENT);

    let defaultContent: string = FileReader.readFile(
      this.themeAux.getInsideThemeAssetsPath(this.DEFAULT_BUILD_PATH)
    );
    let newContent: string = defaultContent;
    newContent = newContent
      .split(
        CommentsIdentifiers.getIdentifierPlaceholder(
          this.IDENTIFIER_NAME,
          false
        )
      )
      .join(this.getInformations.widgetAreaName);
    FileWriter.writeFile(widgetAreaPath, newContent);
  }
}

export { WidgetArea };
