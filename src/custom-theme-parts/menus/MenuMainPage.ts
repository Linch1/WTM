import { FileReader } from "../../files/FileReader";
import { FileWriter } from "../../files/FileWriter";
import { CommentsIdentifiers } from "../../comments-identifiers/CommentsIdentifiers";
import { StringComposeWriter } from "../../files/StringComposeWriter";
import { WpFunctionComposer } from "../../files/WpFunctionComposer";
import { ThemeAux } from "../../ManageTheme/ThemeAux";
import { menuMainPageParams } from "./types/types";
import { replaceAllParams } from "../../files/types/types";
import { InterfacecustomPart } from "../InterfacecustomPart";
import { CustomPart } from "../CustomPart";

type params = menuMainPageParams;
class MenuMainPage extends CustomPart<params> {
  public readonly ERR_NO_MENU_SLUG_GIVEN =
    "ERROR: The menu has not the MENU_SLUG initalized. Porbably the main menu page wasn't created.";

  public readonly IDENTIFIER_NAME = "MENU";
  public readonly IDENTIFIER_MENU_SLUG = "MENU-SLUG";

  public readonly IDENTIFIER_MAIN_PAGE_NAME = "MENU-MAIN-PAGE-NAME";
  public readonly IDENTIFIER_MAIN_PAGE_NAME_DISPLAY =
    "MENU-MAIN-PAGE-NAME-DISPLAY";
  public readonly IDENTIFIER_MAIN_PAGE_BROWSER_TITLE =
    "MENU-MAIN-PAGE-BROWSER-TITLE";

  public MENU_SLUG: string =
    ""; /* populated in this.createMainPage() it's replaced as an id identifier with the menu name */
  public get getMenuSlug(): string {
    return this.MENU_SLUG;
  }
  public set setMenuSlug(newMenuSlug: string) {
    this.MENU_SLUG = newMenuSlug;
  }

  /**
   * @description intialize the class
   * @param themeAux
   * @param informations the field pageName should also be a valid function name
   */
  constructor(public themeAux: ThemeAux, protected informations: params) {
    super(themeAux, informations);
    this.CUSTOM_PART_NAME = this.getInformations.menuName;
    this.FILE_NAME = "WTM-MAIN-PAGE.php";
    this.JSON_NAME = "WTM.json";
    this.IDENTIFIER_NAME = "MENU";
    this.PATH = "custom-menu/";
    this.DEFAULT_BUILD_PATH = this.PATH + "default-mainpage.php";
  }

  /**
   * @description not a valid method for this class
   */
  public createDirectory() {
    throw new Error();
  }

  /**
   * @description create the file of the given menu (menu-{menuName}.php) if not exists ( and populate it with the default params )
   */
  public create(): void {
    if (!this.validInformations()) throw new Error(this.ERR_NO_VALID_INFORMATIONS);
    this.setMenuSlug = CommentsIdentifiers.getIdentifierId(
      this.getInformations.menuName,
      false
    );
    let mainPagePath: string = this.getPath();

    if (
      FileReader.existsPath(mainPagePath) &&
      !this.getInformations.skipIfExists
    )
      throw new Error(this.ERR_ALREADY_PRESENT);

    let defaultContent: string = FileReader.readFile(
      StringComposeWriter.concatenatePaths(
        this.themeAux.ASSETS_CUSTOM_PATH,
        this.DEFAULT_BUILD_PATH
      )
    );

    let params: replaceAllParams = {};
    params[this.IDENTIFIER_MAIN_PAGE_NAME] = this.getInformations.menuName;
    params[
      this.IDENTIFIER_MAIN_PAGE_NAME_DISPLAY
    ] = this.getInformations.menuDisplayedName;
    params[
      this.IDENTIFIER_MAIN_PAGE_BROWSER_TITLE
    ] = this.getInformations.pageBrowserTitle;
    params[this.IDENTIFIER_MENU_SLUG] = this.getMenuSlug;

    let newContent: string = defaultContent;
    newContent = StringComposeWriter.replaceAllIdentifiersPlaceholders(
      newContent,
      params
    );

    FileWriter.writeFile(mainPagePath, newContent);
  }
}

export { MenuMainPage };
