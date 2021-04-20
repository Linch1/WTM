import { FileReader } from "../../../ManageFiles/FileReader";
import { FileWriter } from "../../../ManageFiles/FileWriter";
import { ThemeAux } from "../../../ManageTheme/ThemeAux";
import { menuMainPageParams } from "../../../Types/entity.wp.menuMainPage";
import { customPartType } from "../../../Enums/entities.wp.type";
import { customPartPath } from "../../../Enums/entities.wp.path";
import { replaceAllParams } from "../../../Types/files.StringComposerWriter";
import { GeneralWpEntity } from "../GeneralWpEntity";
import { IdentifierId } from "../../../Identifiers/IdentifierId";
import { Identifiers } from "../../../Identifiers/Identifiers";
import { ConstWordpressMenuMainPage } from "../../../Constants/wordpress/const.wp.menu.mainPage";

type params = menuMainPageParams;
class MenuMainPage extends GeneralWpEntity<params> {
  public readonly ERR_NO_MENU_SLUG_GIVEN =
    "ERROR: The menu has not the MENU_SLUG initalized. Porbably the main menu page wasn't created.";

  public readonly IDENTIFIER_MENU_SLUG = ConstWordpressMenuMainPage.IdentifierSlug;
  public readonly IDENTIFIER_NAME = ConstWordpressMenuMainPage.IdentifierName;
  public readonly IDENTIFIER_MAIN_PAGE_NAME_DISPLAY = ConstWordpressMenuMainPage.IdentifierNameToDisplay;
  public readonly IDENTIFIER_MAIN_PAGE_BROWSER_TITLE = ConstWordpressMenuMainPage.IdentifierBrowserTitle;
  public readonly FILE_NAME = ConstWordpressMenuMainPage.File;
  public readonly DEFAULT_CONTENT = ConstWordpressMenuMainPage.Content;

  public MENU_SLUG: string = ""; // populated in this.createMainPage() it's replaced as an id identifier with the menu name

  /**
   * @description intialize the class
   * @param themeAux
   * @param informations the field menuName should also be a valid function name, so without spaces and hyphens
   */
  constructor(public themeAux: ThemeAux, protected informations: params) {
    super(themeAux, informations);
    this.CUSTOM_PART_NAME = this.getInformations.menuName;
    this.CUSTOM_PART_TYPE = customPartType.MENU;
    this.PARENT_DIR_PATH = customPartPath.MENU;
    this.JSON_PATH = this.themeAux.getPathInsideJsonFolder(this.PARENT_DIR_PATH);
    this.JSON_FILE_PATH = this.themeAux.getPathInsideJsonFolder(this.PARENT_DIR_PATH, `${this.CUSTOM_PART_NAME}.json`);
    this.setMenuSlug = IdentifierId.getIdentifier(
      this.getInformations.menuName,
      false
    );
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
    return this.themeAux.getPathInsideThemeAssetsFolder(
      this.PARENT_DIR_PATH,
      this.getInformations.menuName
    );
  }
  /**
   * @description get the absolute path to the main file of the custom part
   */
  public getPath(): string {
    return this.getInsideDirectory(`${this.CUSTOM_PART_NAME }-${this.FILE_NAME}`);
  }
  /**
   * @description returns the absolute path of the json file that contains the relevant informations of the custom part
   */
  public getJsonDirectory(): string {
    return this.JSON_PATH;
  }

  /**
   * @description create the file of the given menu (menu-{menuName}.php) if not exists ( and populate it with the default params )
   */
  public create(): void {
    if (!this.validInformations()) throw new Error(this.ERR_NO_VALID_INFORMATIONS);
    
    let mainPagePath: string = this.getPath();

    if (
      FileReader.existsPath(mainPagePath) &&
      !this.getInformations.skipIfExists
    )
      throw new Error(this.ERR_ALREADY_PRESENT);

    let params: replaceAllParams = {};
    params[this.IDENTIFIER_NAME] = this.getInformations.menuName;
    params[
      this.IDENTIFIER_MAIN_PAGE_NAME_DISPLAY
    ] = this.getInformations.menuDisplayedName;
    params[
      this.IDENTIFIER_MAIN_PAGE_BROWSER_TITLE
    ] = this.getInformations.pageBrowserTitle;
    params[this.IDENTIFIER_MENU_SLUG] = this.getMenuSlug;

    let newContent: string = this.DEFAULT_CONTENT;
    newContent = Identifiers.replaceAllIdentifiersPlaceholders(
      newContent,
      params
    );

    FileWriter.writeFile(mainPagePath, newContent);
  }
}

export { MenuMainPage };
