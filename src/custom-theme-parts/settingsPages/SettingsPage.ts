import {
  nestedStringsArrays,
  replaceAllParams,
  settingsPageParams,
} from "../../types/customTypes";
import { FileReader } from "../../files/FileReader";
import { FileWriter } from "../../files/FileWriter";
import { CommentsIdentifiers } from "../../comments-identifiers/CommentsIdentifiers";
import { StringComposeWriter } from "../../files/StringComposeWriter";
import { ThemeAux } from "../../theme/ThemeAux";
import { WpFunctionComposer } from "../../files/WpFunctionComposer";

type params = settingsPageParams;
class SettingsPage {
  public readonly ALREADY_PRESENT =
    "ERROR: The custom settings page already exists";
  public readonly NO_VALID_INFORMATIONS =
    "ERROR: the informations attribute of this class is not initalized";

  public readonly PATH = "custom-settings-page/";
  public readonly DEFAULT_BUILD_PATH = this.PATH + "default.php";

  public readonly IDENTIFIER_NAME = "SETTINGS-PAGE";
  public readonly IDENTIFIER_SETTINGS_PAGE_SLUG = "SETTINGS-PAGE-SLUG";
  public readonly IDENTIFIER_SETTINGS_PAGE_NAME = "SETTINGS-PAGE-NAME";
  public readonly IDENTIFIER_SETTINGS_PAGE_NAME_DISPLAY =
    "SETTINGS-PAGE-NAME-DISPLAY";
  public readonly IDENTIFIER_SETTINGS_PAGE_BROWSER_TITLE =
    "SETTINGS-PAGE-BROWSER-TITLE";

  public SETTINGS_PAGE_SLUG =
    ""; /* populated in this.createSettingsPage() it's replaced as an id identifier with the page name */

  /**
   * @description intialize the class
   * @param themeAux
   * @param informations the field pageName should also be a valid function name
   */
  constructor(
    public themeAux: ThemeAux,
    private informations: params = {
      pageName: "",
      pageBrowserTitle: "",
      pageDisplayedName: "",
    }
  ) {}

  /**
   * @description checks if the post types informations are valid, returns true or false
   */
  public validInformations(): boolean {
    if (!this.informations.pageName) return false;
    if (!this.informations.pageBrowserTitle) return false;
    if (!this.informations.pageDisplayedName) return false;
    return true;
  }
  public get getInformations(): params {
    return this.informations;
  }
  /**
   * @param newInformations the field pageName should also be a valid function name
   */
  public set setInformations(newInformations: params) {
    this.informations = newInformations;
  }

  /**
   * @description return the name of the function used to import files of structure(html)/styles(.css) in the given menu page
   * @param page the menu page where to import the files
   */
  public renderFileFunction(page: string): string {
    return `render_file_${page}`;
  }

  /**
   * @description returns the absolute path of the page file
   */
  public getPath(): string {
    return this.themeAux.getInsideThemeAssetsPath(
      this.PATH,
      `${this.getInformations.pageName}.php`
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
          this.getInformations.pageName
        )
      ),
      CommentsIdentifiers.getIdentifierImportPair(this.IDENTIFIER_NAME)[0],
      CommentsIdentifiers.getIdentifierImportPair(this.IDENTIFIER_NAME)[1]
    );
  }

  /**
   * @description create the file of the given settings page ({pageName}.php) if not exists ( and populate it with the default params )
   * @skipIfExists it's a boolean value that prevent to throw an error if the given widget area already exists
   */
  public create(skipIfExists: boolean = false): void {
    if (!this.validInformations()) throw new Error(this.NO_VALID_INFORMATIONS);
    this.SETTINGS_PAGE_SLUG = CommentsIdentifiers.getIdentifierId(
      this.getInformations.pageName,
      false
    );
    let settingsPagePath: string = this.getPath();

    if (FileReader.existsPath(settingsPagePath) && !skipIfExists)
      throw new Error(this.ALREADY_PRESENT);

    let defaultContent: string = FileReader.readFile(
      this.themeAux.getInsideThemeAssetsPath(this.DEFAULT_BUILD_PATH)
    );

    
    let params: replaceAllParams = {};
    params[this.IDENTIFIER_SETTINGS_PAGE_NAME] =  this.getInformations.pageName;
    params[this.IDENTIFIER_SETTINGS_PAGE_NAME_DISPLAY] =  this.getInformations.pageDisplayedName;
    params[this.IDENTIFIER_SETTINGS_PAGE_BROWSER_TITLE] =  this.getInformations.pageBrowserTitle;
    params[this.IDENTIFIER_SETTINGS_PAGE_SLUG] =  this.SETTINGS_PAGE_SLUG;
    
    let newContent: string = defaultContent;
    newContent = StringComposeWriter.replaceAllIdentifiersPlaceholders(newContent, params);

    FileWriter.writeFile(settingsPagePath, newContent);
  }
}

export { SettingsPage };
