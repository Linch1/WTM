import { nestedStringsArrays } from "../../types/customTypes";
import { FileReader } from "../../files/FileReader";
import { FileWriter } from "../../files/FileWriter";
import { CommentsIdentifiers } from "../../comments-identifiers/CommentsIdentifiers";
import { StringComposeWriter } from "../../files/StringComposeWriter";
import { ThemeAux } from "../../theme/ThemeAux";
import { MenuMainPage } from "./MenuMainPage";
import { MenuSubPage } from "./MenuSubPage";

class Menu {
  /**
   * @description intialize the class
   * @param themeAssetsPath the abs path to the theme's assets folder
   * @param mainPage the menu main page
   * @param subPages an array that contains the menu subpages
   */
  constructor(
    public themeAux: ThemeAux,
    public mainPage: MenuMainPage,
    public subPages: MenuSubPage[]
  ) {}

  public createMenuDirectory() {
    let menuDirectory = this.themeAux.getInsideThemeAssetsPath(
      this.mainPage.PATH,
      `${this.mainPage.getInformations.menuName}`
    );
    if (!FileReader.existsPath(menuDirectory))
      FileWriter.createDirectory(menuDirectory);
  }

  /**
   * @description create the file of the menu main-page ({menuName}/main-page.php) if not exists ( and populate it with the default params )
   * @skipIfExists it's a boolean value that prevent to throw an error if the given widget area already exists
   */
  public createMainPage(skipIfExists: boolean = false): void {
    this.createMenuDirectory();
    this.mainPage.create();
  }
  /**
   * @description import the main page in the theme
   */
  public importMainPage() {
    this.mainPage.import();
  }

  /**
   * @description create the file of the menu sub-pages (${this.MENU_NAME}/sub-${pageName}.php) if not exists ( and populate it with the default params )
   * @skipIfExists it's a boolean value that prevent to throw an error if the given widget area already exists
   */
  public createSubPages(skipIfExists: boolean = false): void {
    let i: number = 0;
    for (i = 0; i < this.subPages.length; i++) {
      let subpage = this.subPages[i];
      subpage.setMenuSlug = this.mainPage.getMenuSlug;
      subpage.setMenuName = this.mainPage.getInformations.menuName;
      subpage.create();
    }
  }
  /**
   * @description import the subpages in the theme
   */
  public importSubPages() {
    let i: number = 0;
    for (i = 0; i < this.subPages.length; i++) {
      let subpage = this.subPages[i];
      subpage.import();
    }
  }
}

export { Menu };
