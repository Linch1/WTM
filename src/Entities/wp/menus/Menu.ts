import { FileWriter } from "../../../ManageFiles/FileWriter";
import { ThemeAux } from "../../../ManageTheme/ThemeAux";
import { MenuMainPage } from "./MenuMainPage";
import { MenuSubPage } from "./MenuSubPage";

class Menu {
  public MENU_JSON: {
    [key: string]: {
      [key: string]: string | boolean | undefined;
    };
  } = {};

  public MENU_NAME: string;
  public MENU_SLUG: string;

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
  ) {
    this.MENU_NAME = this.mainPage.getInformations.menuName;
    this.MENU_SLUG = this.mainPage.getMenuSlug;
    this.initialize();
  }

  /**
   * @description create the needed file/directories
   */
  initialize(): void {
    this.createMenuDirectory();
    FileWriter.createDirectory(this.mainPage.getJsonDirectory());
  }
  /**
   * @description delete the all the relative files
   */
  public delete(): void{
    for ( let subpage of this.subPages){
      subpage.delete();
    }
    this.mainPage.delete();
  }

  /**
   * @description create the directory that contains the menu mainPage and subPages
   */
  public createMenuDirectory() {
    FileWriter.createDirectory(
      this.themeAux.getPathInsideThemeAssetsFolder(
        this.mainPage.PARENT_DIR_PATH,
        this.MENU_NAME
      )
    );
  }

  /**
   * @description edit the menu json informations and write them
   * @param key the key to add
   * @param obj the content of the passed key
   */
  public addToMenuJson(
    key: string,
    obj: { [key: string]: string | boolean | undefined }
  ) {
    this.MENU_JSON[key] = obj;
    FileWriter.writeFile(
      this.mainPage.getPathJson(),
      JSON.stringify(this.MENU_JSON)
    );
  }

  /**
   * @description create the file of the menu main-page ({menuName}/main-page.php) if not exists ( and populate it with the default params )
   * @skipIfExists it's a boolean value that prevent to throw an error if the given widget area already exists
   */
  public createMainPage(skipIfExists: boolean = false): void {
    this.mainPage.create();
    this.addToMenuJson(
      this.MENU_NAME,
      this.mainPage.getInformations
    );
  }
  /**
   * @description import the main page in the theme
   */
  public importMainPage() {
    this.mainPage.import();
  }

  /**
   *
   * @description [call after this.createMainPage ] create the file of the menu sub-pages (${this.MENU_NAME}/sub-${pageName}.php) if not exists ( and populate it with the default params )
   * @skipIfExists it's a boolean value that prevent to throw an error if the given widget area already exists
   */
  public createSubPages(skipIfExists: boolean = false): void {
    let i: number = 0;
    for (i = 0; i < this.subPages.length; i++) {
      let subpage = this.subPages[i];
      subpage.setMenuSlug = this.MENU_SLUG;
      subpage.setMenuName = this.MENU_NAME;
      subpage.create();
      this.addToMenuJson(
        subpage.getInformations.pageName,
        subpage.getInformations
      );
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
