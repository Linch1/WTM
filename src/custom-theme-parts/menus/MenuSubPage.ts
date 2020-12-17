import { menuSubPageParams } from "../../types/customTypes";
import { FileReader } from "../../files/FileReader";
import { FileWriter } from "../../files/FileWriter";
import { CommentsIdentifiers } from "../../comments-identifiers/CommentsIdentifiers";
import { StringComposeWriter } from "../../files/StringComposeWriter";
import { WpFunctionComposer } from "../../files/WpFunctionComposer";
import { ThemeAux } from "../../theme/ThemeAux";

type params = menuSubPageParams;
class MenuSubPage {
  public readonly ALREADY_PRESENT = "ERROR: The custom menu already exists";
  public readonly NO_VALID_INFORMATIONS =
    "ERROR: the informations attribute of this class is not initalized";
  public readonly NO_MENU_SLUG_GIVEN =
    "ERROR: The menu has not the MENU_SLUG initalized. Porbably the main menu page wasn't created.";
  public readonly NO_MENU_NAME = "ERROR: Please assign a menu to the subpage by setting a menu name this.setMenuName( string ); "

  public readonly IDENTIFIER_NAME = "MENU";
  public readonly IDENTIFIER_MENU_SLUG = "MENU-SLUG";
  public readonly PATH = "custom-menu/";
  public readonly DEFAULT_BUILD_PATH = this.PATH + "default-subpage.php";

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
   * @param themeAssetsPath the abs path to the theme's assets folder
   */
  constructor(
    public themeAux: ThemeAux,
    public informations: params = {
      pageName: "",
      pageNameDisplayed: "",
      pageBrowserTitle: "",
    }
  ) {}

  /**
   * @description checks if the post types informations are valid, returns true or false
   */
  public emptyInformations(): boolean {
    if (!this.informations.pageName) return false;
    if (!this.informations.pageNameDisplayed) return false;
    if (!this.informations.pageBrowserTitle) return false;
    return true;
  }

  /**
   * @description return the name of the function used to import files of structure(html)/styles(.css) in the given menu page
   * @param page the menu page where to import the files
   */
  public importRenderFileFunction(page: string): string {
    return `render_file_${this.getInformations.pageName}`;
  }

  /**
   * @description return the absolute path of the sub-page file
   * @param page the name of the sub-page
   */
  public getPath(): string {
    if (!this.getMenuName) throw new Error(this.NO_MENU_NAME);
    return this.themeAux.getInsideThemeAssetsPath(
      this.PATH,
      `${this.getMenuName}`,
      `sub-${this.informations.pageName}.php`
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
          this.getPath()
        )
      ),
      CommentsIdentifiers.getIdentifierImportPair(this.IDENTIFIER_NAME)[0],
      CommentsIdentifiers.getIdentifierImportPair(this.IDENTIFIER_NAME)[1]
    );
  }
  /**
   * @description create the file of the sub page (${this.MENU_NAME}-sub-${pageName}.php) if not exists ( and populate it with the default params )
   * @skipIfExists it's a boolean value that prevent to throw an error if the given widget area already exists
   */
  public create(skipIfExists: boolean = false): void {
    if (!this.getMenuSlug) throw new Error(this.NO_MENU_SLUG_GIVEN);
    if (!this.getMenuName) throw new Error(this.NO_MENU_NAME);
    if (this.emptyInformations()) throw new Error(this.NO_VALID_INFORMATIONS);

    let subPagePath: string = this.getPath();

    if (FileReader.existsPath(subPagePath) && !skipIfExists)
      throw new Error(this.ALREADY_PRESENT);

    let defaultContent: string = FileReader.readFile(
      StringComposeWriter.concatenatePaths(
        this.themeAux.ASSETS_CUSTOM_PATH,
        this.DEFAULT_BUILD_PATH
      )
    );

    let newContent: string = defaultContent
      .split(
        CommentsIdentifiers.getIdentifierPlaceholder(
          this.IDENTIFIER_MENU_SLUG,
          false
        )
      )
      .join(this.getMenuSlug)
      .split(
        CommentsIdentifiers.getIdentifierPlaceholder(
          this.IDENTIFIER_SUB_PAGE_NAME_DISPLAY,
          false
        )
      )
      .join(this.informations.pageNameDisplayed)
      .split(
        CommentsIdentifiers.getIdentifierPlaceholder(
          this.IDENTIFIER_SUB_PAGE_NAME,
          false
        )
      )
      .join(this.informations.pageName)
      .split(
        CommentsIdentifiers.getIdentifierPlaceholder(
          this.IDENTIFIER_SUB_PAGE_BROWSER_TITLE,
          false
        )
      )
      .join(this.informations.pageBrowserTitle)
      .split(
        CommentsIdentifiers.getIdentifierPlaceholder(
          this.IDENTIFIER_SUB_PAGE_SLUG,
          false
        )
      )
      .join(this.getMenuName + this.informations.pageName);

    FileWriter.writeFile(subPagePath, newContent);
  }

  public get getInformations(): params {
    return this.informations;
  }
  public set setInformations(newInformations: params) {
    this.informations = newInformations;
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
}

export { MenuSubPage };
