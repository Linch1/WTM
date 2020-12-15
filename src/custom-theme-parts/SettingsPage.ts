import { nestedStringsArrays, settingsPageParams } from "../types/customTypes";
import { FileReader } from "../files/FileReader";
import { FileWriter } from "../files/FileWriter";
import { CommentsIdentifiers } from "../comments-identifiers/CommentsIdentifiers";
import { StringComposeWriter } from "../files/StringComposeWriter";
import { ThemeAux } from "../theme/ThemeAux";
import { WpFunctionComposer } from "../files/WpFunctionComposer";

class SettingsPage {
  public readonly ALREADY_PRESENT =
    "ERROR: The custom settings page already exists";
  public readonly EMPTY_QUEUE = "ERROR: There are no pages in the queue";

  public readonly PATH = "custom-settings-page/";
  public readonly DEFAULT_PAGE_BUILD_PATH = this.PATH + "default.php";

  public readonly IDENTIFIER_NAME = "SETTINGS-PAGE";
  public readonly IDENTIFIER_SETTINGS_PAGE_SLUG = "SETTINGS-PAGE-SLUG";
  public readonly IDENTIFIER_SETTINGS_PAGE_NAME = "SETTINGS-PAGE-NAME";
  public readonly IDENTIFIER_SETTINGS_PAGE_NAME_DISPLAY =
    "SETTINGS-PAGE-NAME-DISPLAY";
  public readonly IDENTIFIER_SETTINGS_PAGE_BROWSER_TITLE =
    "SETTINGS-PAGE-BROWSER-TITLE";

  public SETTINGS_PAGE_SLUG =
    ""; /* populated in this.createSettingsPage() it's replaced as an id identifier with the page name */

  public QUEUE: settingsPageParams[] = [];
  /**
   * @description intialize the class
   * @param themePath the theme absolute path
   * @param assetsPath the relative path to the theme's assets folder
   */
  constructor(public themeAux: ThemeAux) {}

  /**
   * @description return the name of the function used to import files of structure(html)/styles(.css) in the given menu page
   * @param page the menu page where to import the files
   */
  public renderFileFunction(page: string): string {
    return `render_file_${page}`;
  }

  /**
   * @description returns the absolute path of the page file
   * @param page the name of the page
   */
  public getSettingsPagePath(page: string): string {
    return this.themeAux.getInsideThemeAssetsPath(this.PATH, `${page}.php`);
  }

  /**
   * @description add the given pages to the queue of creation/importation
   * @param pages a list of the pages to add
   */
  public add(...pages: settingsPageParams[]) {
    for (let page of pages) {
      this.QUEUE.push(page);
    }
  }

  /**
   * @description import the given page in the theme
   * @param page the name of the page to import
   */
  public import(page: string) {
    StringComposeWriter.appendBeetweenChars(
      this.themeAux.THEME_FUNCTIONS_FILE,
      WpFunctionComposer.requirePhpFile(
        StringComposeWriter.concatenatePaths(this.PATH, page)
      ),
      CommentsIdentifiers.getIdentifierImportPair(this.IDENTIFIER_NAME)[0],
      CommentsIdentifiers.getIdentifierImportPair(this.IDENTIFIER_NAME)[1]
    );
  }
  /**
   * @description import all the pages in this.QUEUE
   * @param removeFromQueueOnCreation set this to true for remove the create pages from the this.QUEUE array
   */
  public importAll(removeFromQueueOnCreation: boolean = false): void {
    if (!this.QUEUE.length) throw new Error(this.EMPTY_QUEUE);
    let i;
    for (i = 0; i < this.QUEUE.length; i++) {
      let parameters = this.QUEUE[i];
      if (removeFromQueueOnCreation) {
        this.QUEUE.splice(i, 1);
        i--;
      }
      this.import(parameters.pageName);
    }
  }

  /**
   * @description create the file of the given settings page ({pageName}.php) if not exists ( and populate it with the default params )
   * @pageName the name of the options page to create ( the name of the main page is the same as the menu name )
   * @pageDisplayedName the name of the options page that appears in the Settings main menu
   * @pageBrowserTitle the title of the browser tab when the user visits this options page
   * @skipIfExists it's a boolean value that prevent to throw an error if the given widget area already exists
   */
  public create(
    pageName: string,
    pageDisplayedName: string,
    pageBrowserTitle: string,
    skipIfExists: boolean = false
  ): void {
    this.SETTINGS_PAGE_SLUG = CommentsIdentifiers.getIdentifierId(
      pageName,
      false
    );
    let settingsPagePath: string = this.getSettingsPagePath(pageName);

    if (FileReader.existsFile(settingsPagePath) && !skipIfExists)
      throw new Error(this.ALREADY_PRESENT);

    let defaultContent: string = FileReader.readFile(
      this.themeAux.getInsideThemeAssetsPath(this.DEFAULT_PAGE_BUILD_PATH)
    );

    let newContent: string = defaultContent
      .split(
        CommentsIdentifiers.getIdentifierPlaceholder(
          this.IDENTIFIER_SETTINGS_PAGE_NAME,
          false
        )
      )
      .join(pageName)
      .split(
        CommentsIdentifiers.getIdentifierPlaceholder(
          this.IDENTIFIER_SETTINGS_PAGE_NAME_DISPLAY,
          false
        )
      )
      .join(pageDisplayedName)
      .split(
        CommentsIdentifiers.getIdentifierPlaceholder(
          this.IDENTIFIER_SETTINGS_PAGE_BROWSER_TITLE,
          false
        )
      )
      .join(pageBrowserTitle)
      .split(
        CommentsIdentifiers.getIdentifierPlaceholder(
          this.IDENTIFIER_SETTINGS_PAGE_SLUG,
          false
        )
      )
      .join(this.SETTINGS_PAGE_SLUG);

    FileWriter.writeFile(settingsPagePath, newContent);
  }
  /**
   * @description create all the pages in the queue (this.QUEUE)
   * @param removeFromQueueOnCreation set this to true for remove the create pages from the this.QUEUE array
   */
  public createAll(removeFromQueueOnCreation: boolean = false): void {
    if (!this.QUEUE.length) throw new Error(this.EMPTY_QUEUE);
    let i;
    for (i = 0; i < this.QUEUE.length; i++) {
      let parameters = this.QUEUE[i];
      if (removeFromQueueOnCreation) {
        this.QUEUE.splice(i, 1);
        i--;
      }
      this.create(
        parameters.pageName,
        parameters.pageDisplayedName,
        parameters.pageBrowserTitle,
        parameters.skipIfExists
      );
    }
  }
}

export { SettingsPage };
