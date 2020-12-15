import { nestedStringsArrays } from "../types/customTypes";
import { FileReader } from "../files/FileReader";
import { FileWriter } from "../files/FileWriter";
import { CommentsIdentifiers } from "../comments-identifiers/CommentsIdentifiers";
import { StringComposeWriter } from "../files/StringComposeWriter";

class Menu {
  public readonly ALREADY_PRESENT = "ERROR: The custom menu already exists";
  public readonly NO_MENU_SLUG_GIVEN =
    "ERROR: The menu has not the MENU_SLUG initalized. Porbably the main menu page wasn't created.";

  public readonly PATH = "custom-menu/";
  public readonly DEFAULT_MAIN_PAGE_BUILD_PATH =
    this.PATH + "default-mainpage.php";
  public readonly DEFAULT_SUB_PAGE_BUILD_PATH =
    this.PATH + "default-subpage.php";

  public readonly IDENTIFIER_NAME = "MENU";
  public readonly IDENTIFIER_MENU_SLUG = "MENU-SLUG";

  public readonly IDENTIFIER_MAIN_PAGE_NAME = "MENU-MAIN-PAGE-NAME";
  public readonly IDENTIFIER_MAIN_PAGE_NAME_DISPLAY = "MENU-MAIN-PAGE-NAME-DISPLAY";
  public readonly IDENTIFIER_MAIN_PAGE_BROWSER_TITLE =
    "MENU-MAIN-PAGE-BROWSER-TITLE";

  public readonly IDENTIFIER_SUB_PAGE_NAME = "MENU-SUB-PAGE-NAME";
  public readonly IDENTIFIER_SUB_PAGE_NAME_DISPLAY = "MENU-SUB-PAGE-NAME-DISPLAY";
  public readonly IDENTIFIER_SUB_PAGE_SLUG = "SUB-PAGE-SLUG";
  public readonly IDENTIFIER_SUB_PAGE_BROWSER_TITLE =
    "MENU-SUB-PAGE-BROWSER-TITLE";

  public MENU_SLUG: string =
    ""; /* populated in this.createMainPage() it's replaced as an id identifier with the menu name */
  public MENU_NAME: string = ""; /* populated in this.createMainPage() it's replaceD the menu name passed as param */

  /**
   * @description intialize the class
   * @param themeAssetsPath the abs path to the theme's assets folder
   */
  constructor(public themeAssetsPath: string) {}

  /**
   * @description return the name of the function used to import files of structure(html)/styles(.css) in the given menu page
   * @param page the menu page where to import the files
   */
  public importRenderFileFunction(page: string): string{
    return `render_file_${page}`;
  }

  /**
   * @description returns the absuolute path of the main-page file
   * @param page the name of the main-page
   */
  public getMainPagePath(page: string): string{
    return StringComposeWriter.concatenatePaths(
      this.themeAssetsPath,
      this.PATH,
      `menu-${page}.php`
    )
  }
  /**
   * @description return the absolute path of the sub-page file
   * @param page the name of the sub-page
   */
  public getSubPagePath(page: string): string{
    return StringComposeWriter.concatenatePaths(
      this.themeAssetsPath,
      this.PATH,
      `${this.MENU_NAME}-sub-${page}.php`
    )
  }

  /**
   * @description create the file of the given menu (menu-{menuName}.php) if not exists ( and populate it with the default params )
   * @menuName the name of the menu to create ( the name of the main page is the same as the menu name )
   * @menuDisplayedName the name of the menu that appears in the admin dashboard
   * @pageBrowserTitle the title of the browser tab when the user visits this page
   * @skipIfExists it's a boolean value that prevent to throw an error if the given widget area already exists
   */
  public createMainPage(
    menuName: string,
    menuDisplayedName: string,
    pageBrowserTitle: string,
    skipIfExists: boolean = false
  ): void {
    this.MENU_SLUG = CommentsIdentifiers.getIdentifierId(menuName, false);
    this.MENU_NAME = menuName;
    let mainPagePath: string = this.getMainPagePath(menuName);

    if (FileReader.existsFile(mainPagePath) && !skipIfExists)
      throw new Error(this.ALREADY_PRESENT);

    let defaultContent: string = FileReader.readFile(
      StringComposeWriter.concatenatePaths(
        this.themeAssetsPath,
        this.DEFAULT_MAIN_PAGE_BUILD_PATH
      )
    );

    let newContent: string = defaultContent
      .split(
        CommentsIdentifiers.getIdentifierPlaceholder(
          this.IDENTIFIER_MAIN_PAGE_NAME,
          false
        )
      )
      .join(menuName)
      .split(
        CommentsIdentifiers.getIdentifierPlaceholder(
          this.IDENTIFIER_MAIN_PAGE_NAME_DISPLAY,
          false
        )
      )
      .join(menuDisplayedName)
      .split(
        CommentsIdentifiers.getIdentifierPlaceholder(
          this.IDENTIFIER_MAIN_PAGE_BROWSER_TITLE,
          false
        )
      )
      .join(pageBrowserTitle)
      .split(
        CommentsIdentifiers.getIdentifierPlaceholder(
          this.IDENTIFIER_MENU_SLUG,
          false
        )
      )
      .join(this.MENU_SLUG);

    FileWriter.writeFile(mainPagePath, newContent);
  }

  /**
   * @description create the file of the sub page (${this.MENU_NAME}-sub-${pageName}.php) if not exists ( and populate it with the default params )
   * @pageName the name of the menu to create ( the name of the main page is the same as the menu name )
   * @pageNameDisplayed the name of the page that appears in the admin dashboard
   * @pageBrowserTitle the title of the browser tab when the user visits this page
   * @skipIfExists it's a boolean value that prevent to throw an error if the given widget area already exists
   */
  public createSubPage(
    pageName: string,
    pageNameDisplayed: string,
    pageBrowserTitle: string,
    skipIfExists: boolean = false
  ): void {
    if (!this.MENU_SLUG) throw new Error(this.NO_MENU_SLUG_GIVEN);

    let subPagePath: string = this.getSubPagePath(pageName);

    if (FileReader.existsFile(subPagePath) && !skipIfExists)
      throw new Error(this.ALREADY_PRESENT);

    let defaultContent: string = FileReader.readFile(
      StringComposeWriter.concatenatePaths(
        this.themeAssetsPath,
        this.DEFAULT_SUB_PAGE_BUILD_PATH
      )
    );

    let newContent: string = defaultContent
      .split(
        CommentsIdentifiers.getIdentifierPlaceholder(
          this.IDENTIFIER_MENU_SLUG,
          false
        )
      )
      .join(this.MENU_SLUG)
      .split(
        CommentsIdentifiers.getIdentifierPlaceholder(
          this.IDENTIFIER_SUB_PAGE_NAME_DISPLAY,
          false
        )
      )
      .join(pageNameDisplayed)
      .split(
        CommentsIdentifiers.getIdentifierPlaceholder(
          this.IDENTIFIER_SUB_PAGE_NAME,
          false
        )
      )
      .join(pageName)
      .split(
        CommentsIdentifiers.getIdentifierPlaceholder(
          this.IDENTIFIER_SUB_PAGE_BROWSER_TITLE,
          false
        )
      )
      .join(pageBrowserTitle)
      .split(
        CommentsIdentifiers.getIdentifierPlaceholder(
          this.IDENTIFIER_SUB_PAGE_SLUG,
          false
        )
      )
      .join(this.MENU_NAME + pageName);

    FileWriter.writeFile(subPagePath, newContent);
  }
}

export { Menu };
