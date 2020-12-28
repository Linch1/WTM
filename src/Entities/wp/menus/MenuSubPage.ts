import { FileReader } from "../../../files/FileReader";
import { FileWriter } from "../../../files/FileWriter";
import { StringComposeWriter } from "../../../files/StringComposeWriter";
import { ThemeAux } from "../../../ManageTheme/ThemeAux";
import { menuSubPageParams } from "../../../Types/entity.wp.menuSubPage";
import { customPartType } from "../../../Enums/entities.wp.type";
import { customPartPath } from "../../../Enums/entities.wp.path";
import { replaceAllParams } from "../../../Types/files.StringComposerWriter";
import { GeneralWpEntity } from "../GeneralWpEntity";

type params = menuSubPageParams;
class MenuSubPage extends GeneralWpEntity<params> {
  public readonly ERR_NO_MENU_SLUG_GIVEN =
    "ERROR: The menu has not the MENU_SLUG initalized. Porbably the main menu page wasn't created.";
  public readonly ERR_NO_MENU_NAME =
    "ERROR: Please assign a menu to the subpage by setting a menu name this.setMenuName( string ); ";

  public readonly IDENTIFIER_MENU_SLUG = "MENU-SLUG";

  public readonly IDENTIFIER_SUB_PAGE_NAME = "MENU-SUB-PAGE-NAME";
  public readonly IDENTIFIER_SUB_PAGE_NAME_DISPLAY =
    "MENU-SUB-PAGE-NAME-DISPLAY";
  public readonly IDENTIFIER_SUB_PAGE_SLUG = "SUB-PAGE-SLUG";
  public readonly IDENTIFIER_SUB_PAGE_BROWSER_TITLE =
    "MENU-SUB-PAGE-BROWSER-TITLE";

  public MENU_SLUG: string = "";
  public MENU_NAME: string = "";

  /**
   * @description intialize the class
   * @param themeAux
   * @param informations the field pageName should also be a valid function name
   */
  constructor(public themeAux: ThemeAux, protected informations: params) {
    super(themeAux, informations);
    this.CUSTOM_PART_NAME = this.getInformations.pageName;
    this.CUSTOM_PART_TYPE = customPartType.MENU;
    this.FILE_NAME = "WTM-SUB-PAGE.php";
    this.IDENTIFIER_NAME = "MENU";
    this.PARENT_DIR_PATH = customPartPath.MENU;
    this.DEFAULT_BUILD_PATH = StringComposeWriter.concatenatePaths(this.PARENT_DIR_PATH, "default-subpage.php");
    this.JSON_PATH = this.themeAux.getInsideWTMPath(this.PARENT_DIR_PATH);
    this.JSON_FILE_PATH = this.themeAux.getInsideWTMPath(this.PARENT_DIR_PATH, `WTM-${this.CUSTOM_PART_NAME}.json`);
  }

  public get getMenuName(): string {
    return this.MENU_NAME;
  }
  public set setMenuName(newMenuName: string) {
    this.MENU_NAME = newMenuName;
  }
  public get getMenuSlug(): string {
    return this.MENU_SLUG;
  }
  public set setMenuSlug(newMenuSlug: string) {
    this.MENU_SLUG = newMenuSlug;
  }

  /**
   * @description not a valid method for this class
   */
  public createDirectory() {
    throw new Error();
  }
  /**
   * @description get the path to the dircetory that contains the custom part
   */
  getDirectory(): string {
    return this.themeAux.getInsideThemeAssetsPath(
      this.PARENT_DIR_PATH,
      this.MENU_NAME
    );
  }
  /**
   * @description get the absolute path to the main file of the custom part
   */
  public getPath(): string {
    return this.getInsideDirectory(`${this.CUSTOM_PART_NAME }-${this.FILE_NAME}`);
  }

  /**
   * @description create the file of the sub page (${this.MENU_NAME}-sub-${pageName}.php) if not exists ( and populate it with the default params )
   */
  public create(skipIfExists: boolean = false): void {
    if (!this.getMenuSlug) throw new Error(this.ERR_NO_MENU_SLUG_GIVEN);
    if (!this.getMenuName) throw new Error(this.ERR_NO_MENU_NAME);
    if (!this.validInformations()) throw new Error(this.ERR_NO_VALID_INFORMATIONS);

    let subPagePath: string = this.getPath();

    if (FileReader.existsPath(subPagePath) && !this.getInformations.skipIfExists)
      throw new Error(this.ERR_ALREADY_PRESENT);

    let defaultContent: string = FileReader.readFile(
      StringComposeWriter.concatenatePaths(
        this.themeAux.ASSETS_CUSTOM_PATH,
        this.DEFAULT_BUILD_PATH
      )
    );

    let params: replaceAllParams = {};
    params[
      this.IDENTIFIER_SUB_PAGE_NAME_DISPLAY
    ] = this.getInformations.pageNameDisplayed;
    params[this.IDENTIFIER_SUB_PAGE_NAME] = this.getInformations.pageName;
    params[
      this.IDENTIFIER_SUB_PAGE_BROWSER_TITLE
    ] = this.getInformations.pageBrowserTitle;
    params[this.IDENTIFIER_MENU_SLUG] = this.getMenuSlug;
    params[
      this.IDENTIFIER_SUB_PAGE_SLUG
    ] = `${this.getMenuName}-${this.informations.pageName}`;

    let newContent: string = defaultContent;
    newContent = StringComposeWriter.replaceAllIdentifiersPlaceholders(
      newContent,
      params
    );

    FileWriter.writeFile(subPagePath, newContent);
  }
}

export { MenuSubPage };
