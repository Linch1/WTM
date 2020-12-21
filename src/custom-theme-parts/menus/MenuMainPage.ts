import { menuMainPageParams, replaceAllParams } from "../../types/customTypes";
import { FileReader } from "../../files/FileReader";
import { FileWriter } from "../../files/FileWriter";
import { CommentsIdentifiers } from "../../comments-identifiers/CommentsIdentifiers";
import { StringComposeWriter } from "../../files/StringComposeWriter";
import { WpFunctionComposer } from "../../files/WpFunctionComposer";
import { ThemeAux } from "../../theme/ThemeAux";

type params = menuMainPageParams;
class MenuMainPage {
  public readonly ALREADY_PRESENT = "ERROR: The custom menu already exists";
  public readonly NO_VALID_INFORMATIONS =
    "ERROR: the informations attribute of this class is not initalized";
  public readonly NO_MENU_SLUG_GIVEN =
    "ERROR: The menu has not the MENU_SLUG initalized. Porbably the main menu page wasn't created.";

  public readonly PATH = "custom-menu/";
  public readonly DEFAULT_BUILD_PATH = this.PATH + "default-mainpage.php";

  public readonly IDENTIFIER_NAME = "MENU";
  public readonly IDENTIFIER_MENU_SLUG = "MENU-SLUG";

  public readonly IDENTIFIER_MAIN_PAGE_NAME = "MENU-MAIN-PAGE-NAME";
  public readonly IDENTIFIER_MAIN_PAGE_NAME_DISPLAY =
    "MENU-MAIN-PAGE-NAME-DISPLAY";
  public readonly IDENTIFIER_MAIN_PAGE_BROWSER_TITLE =
    "MENU-MAIN-PAGE-BROWSER-TITLE";

  public MENU_SLUG: string =
    ""; /* populated in this.createMainPage() it's replaced as an id identifier with the menu name */

  /**
   * @description intialize the class
   * @param themeAux
   * @param informations the field menuName should be also a valid function name
   */
  constructor(
    public themeAux: ThemeAux,
    private informations: params = {
      menuName: "",
      menuDisplayedName: "",
      pageBrowserTitle: "",
    }
  ) {}

  /**
   * @description checks if the post types informations are valid, returns true or false
   */
  public validInformations(): boolean {
    if (!this.informations.menuName) return false;
    if (!this.informations.menuDisplayedName) return false;
    if (!this.informations.pageBrowserTitle) return false;
    return true;
  }
  public get getInformations(): params {
    return this.informations;
  }
  /**
   * @param newInformations the field menuName should be also a valid function name
   */
  public set setInformations(newInformations: params) {
    this.informations = newInformations;
  }

  /**
   * @description return the name of the function used to import files of structure(html)/styles(.css) in the given menu page
   * @param page the menu page where to import the files
   */
  public importRenderFileFunction(page: string): string {
    return `render_file_${page}`;
  }

  /**
   * @description returns the absuolute path of the main-page file
   * @param page the name of the main-page
   */
  public getPath(): string {
    return this.themeAux.getInsideThemeAssetsPath(
      this.PATH,
      `${this.getInformations.menuName}`,
      `main-page.php`
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
          this.getPath()
        )
      ),
      CommentsIdentifiers.getIdentifierImportPair(this.IDENTIFIER_NAME)[0],
      CommentsIdentifiers.getIdentifierImportPair(this.IDENTIFIER_NAME)[1]
    );
  }

  /**
   * @description create the file of the given menu (menu-{menuName}.php) if not exists ( and populate it with the default params )
   * @menuName the name of the menu to create ( the name of the main page is the same as the menu name )
   * @menuDisplayedName the name of the menu that appears in the admin dashboard
   * @pageBrowserTitle the title of the browser tab when the user visits this page
   * @skipIfExists it's a boolean value that prevent to throw an error if the given widget area already exists
   */
  public create(): void {
    if (!this.validInformations()) throw new Error(this.NO_VALID_INFORMATIONS);
    this.setMenuSlug = CommentsIdentifiers.getIdentifierId(
      this.getInformations.menuName,
      false
    );
    let mainPagePath: string = this.getPath();

    if (
      FileReader.existsPath(mainPagePath) &&
      !this.getInformations.skipIfExists
    )
      throw new Error(this.ALREADY_PRESENT);

    let defaultContent: string = FileReader.readFile(
      StringComposeWriter.concatenatePaths(
        this.themeAux.ASSETS_CUSTOM_PATH,
        this.DEFAULT_BUILD_PATH
      )
    );

    let params: replaceAllParams = {};
    params[this.IDENTIFIER_MAIN_PAGE_NAME] =  this.getInformations.menuName;
    params[this.IDENTIFIER_MAIN_PAGE_NAME_DISPLAY] =  this.getInformations.menuDisplayedName;
    params[this.IDENTIFIER_MAIN_PAGE_BROWSER_TITLE] =  this.getInformations.pageBrowserTitle;
    params[this.IDENTIFIER_MENU_SLUG] =  this.getMenuSlug;
    
    let newContent: string = defaultContent;
    newContent = StringComposeWriter.replaceAllIdentifiersPlaceholders(newContent, params);

    FileWriter.writeFile(mainPagePath, newContent);
  }

  public get getMenuSlug(): string {
    return this.MENU_SLUG;
  }
  public set setMenuSlug(newMenuSlug: string) {
    this.MENU_SLUG = newMenuSlug;
  }
}

export { MenuMainPage };
