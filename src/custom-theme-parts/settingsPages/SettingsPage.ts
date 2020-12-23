import { FileReader } from "../../files/FileReader";
import { FileWriter } from "../../files/FileWriter";
import { CommentsIdentifiers } from "../../comments-identifiers/CommentsIdentifiers";
import { StringComposeWriter } from "../../files/StringComposeWriter";
import { ThemeAux } from "../../ManageTheme/ThemeAux";
import { WpFunctionComposer } from "../../files/WpFunctionComposer";
import { settingsPageParams } from "./types/types";
import { replaceAllParams } from "../../files/types/types";
import { InterfacecustomPart } from "../InterfacecustomPart";
import { CustomPart } from "../CustomPart";

type params = settingsPageParams;
class SettingsPage extends CustomPart<params> {

  public readonly PATH = "custom-settings-page/";
  public readonly DEFAULT_BUILD_PATH = this.PATH + "default.php";

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
  constructor(public themeAux: ThemeAux, protected informations: params) {
    super(themeAux, informations);
    this.CUSTOM_PART_NAME = this.getInformations.pageName;
    this.FILE_NAME = "WTM-SETTINGS-PAGE.php";
    this.JSON_NAME = "WTM.json";
    this.IDENTIFIER_NAME = "SETTINGS-PAGE";
  }

  /**
   * @description create the file of the given settings page ({pageName}.php) if not exists ( and populate it with the default params )
   */
  public create(skipIfExists: boolean = false): void {
    if (!this.validInformations()) throw new Error(this.ERR_NO_VALID_INFORMATIONS);
    this.createDirectory();
    this.SETTINGS_PAGE_SLUG = CommentsIdentifiers.getIdentifierId(
      this.getInformations.pageName,
      false
    );
    let settingsPagePath: string = this.getPath();

    if (FileReader.existsPath(settingsPagePath) && !skipIfExists)
      throw new Error(this.ERR_ALREADY_PRESENT);

    let defaultContent: string = FileReader.readFile(
      this.themeAux.getInsideThemeAssetsPath(this.DEFAULT_BUILD_PATH)
    );

    let params: replaceAllParams = {};
    params[this.IDENTIFIER_SETTINGS_PAGE_NAME] = this.getInformations.pageName;
    params[
      this.IDENTIFIER_SETTINGS_PAGE_NAME_DISPLAY
    ] = this.getInformations.pageDisplayedName;
    params[
      this.IDENTIFIER_SETTINGS_PAGE_BROWSER_TITLE
    ] = this.getInformations.pageBrowserTitle;
    params[this.IDENTIFIER_SETTINGS_PAGE_SLUG] = this.SETTINGS_PAGE_SLUG;

    let newContent: string = defaultContent;
    newContent = StringComposeWriter.replaceAllIdentifiersPlaceholders(
      newContent,
      params
    );

    FileWriter.writeFile(settingsPagePath, newContent);
    this.saveJson();
  }
}

export { SettingsPage };
