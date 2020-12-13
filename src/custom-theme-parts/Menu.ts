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
  public MENU_NAME: string = "";

  constructor(public themeAssetsPath: string) {}

  /**
   * @description create the file of the given widget area if not exists ( and populate it with the default params )
   * @menuName the name of the menu to create ( the name of the main page is the same as the menu name )
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
    let mainPagePath: string = StringComposeWriter.concatenatePaths(
      this.themeAssetsPath,
      this.PATH,
      `menu-${menuName}.php`
    );

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
   * @description create the file of the given widget area if not exists ( and populate it with the default params )
   * @pageName the name of the menu to create ( the name of the main page is the same as the menu name )
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

    let subPagePath: string = StringComposeWriter.concatenatePaths(
      this.themeAssetsPath,
      this.PATH,
      `${this.MENU_NAME}-sub-${pageName}.php`
    );

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
