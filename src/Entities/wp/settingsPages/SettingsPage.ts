import { FileReader } from "../../../files/FileReader";
import { FileWriter } from "../../../files/FileWriter";
import { StringComposeWriter } from "../../../files/StringComposeWriter";
import { ThemeAux } from "../../../ManageTheme/ThemeAux";
import { settingsPageParams } from "../../../Types/entity.wp.settingsPage";
import { customPartType } from "../../../Enums/entities.wp.type";
import { customPartPath } from "../../../Enums/entities.wp.path";
import { replaceAllParams } from "../../../Types/files.StringComposerWriter";
import { GeneralWpEntity } from "../GeneralWpEntity";
import { IdentifierId } from "../../../Identifiers/IdentifierId";

type params = settingsPageParams;
class SettingsPage extends GeneralWpEntity<params> {

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
    this.CUSTOM_PART_TYPE = customPartType.SETTINGS_PAGE;
    this.FILE_NAME = "WTM-SETTINGS-PAGE.php";
    this.PATH = customPartPath.SETTINGS_PAGE;
    this.DEFAULT_BUILD_PATH = StringComposeWriter.concatenatePaths(this.PATH, "default.php");
    this.IDENTIFIER_NAME = "SETTINGS-PAGE";

    this.JSON_PATH = this.themeAux.getInsideWTMPath(this.PATH);
    this.JSON_FILE_PATH = this.themeAux.getInsideWTMPath(this.PATH, `WTM-${this.CUSTOM_PART_NAME}.json`);
    this.initialize();
  }

  /**
   * @description create the file of the given settings page ({pageName}.php) if not exists ( and populate it with the default params )
   */
  public create(skipIfExists: boolean = false): void {
    if (!this.validInformations()) throw new Error(this.ERR_NO_VALID_INFORMATIONS);
    this.SETTINGS_PAGE_SLUG = IdentifierId.getIdentifier(
      this.getInformations.pageName,
      false
    );
    let settingsPagePath: string = this.getPath();

    if (FileReader.existsPath(settingsPagePath) && !this.getInformations.skipIfExists)
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
