import { widgetAreaParams, nestedStringsArrays } from "../types/customTypes";
import { FileReader } from "../files/FileReader";
import { FileWriter } from "../files/FileWriter";
import { CommentsIdentifiers } from "../comments-identifiers/CommentsIdentifiers";
import { StringComposeWriter } from "../files/StringComposeWriter";
import { WpFunctionComposer } from "../files/WpFunctionComposer";
import { ThemeAux } from "../theme/ThemeAux";

class WidgetArea {
  public readonly ALREADY_PRESENT =
    "ERROR: The custom widget area already exists";
  public readonly EMPTY_QUEUE = "ERROR: There are no post types in the queue";

  public readonly PATH = "custom-widget-areas/";
  public readonly DEFAULT_BUILD_PATH = this.PATH + "default.php";
  public readonly IDENTIFIER_NAME = "WIDGET-AREA";

  public QUEUE: widgetAreaParams[] = [];

  constructor(public themeAux: ThemeAux) {}

  /**
   * @description returns the absolute path of the widget area file
   * @param widgetAreaName the name of the widget area
   */
  public getWidgetAreaPagePath(widgetAreaName: string): string {
    return this.themeAux.getInsideThemeAssetsPath(
      this.PATH,
      `${widgetAreaName}.php`
    );
  }
  /**
   * @description import the given widget area in the theme
   * @param widgetAreaName the name of the widget area to import
   */
  public import(widgetAreaName: string) {
    StringComposeWriter.appendBeetweenChars(
      this.themeAux.THEME_FUNCTIONS_FILE,
      WpFunctionComposer.requirePhpFile(
        StringComposeWriter.concatenatePaths(this.PATH, widgetAreaName)
      ),
      CommentsIdentifiers.getIdentifierImportPair(this.IDENTIFIER_NAME)[0],
      CommentsIdentifiers.getIdentifierImportPair(this.IDENTIFIER_NAME)[1]
    );
  }
  /**
   * @description import all the widget areas in this.QUEUE
   * @param removeFromQueueOnCreation set this to true for remove the create post types from the this.QUEUE array
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
      this.import(parameters.widgetAreaName);
    }
  }

  /**
   * @description add the given widget areas to the queue of creation/importation
   * @param widgetAreas a list of the widget areas to add
   */
  public add(...widgetAreas: widgetAreaParams[]) {
    for (let widgetArea of widgetAreas) {
      this.QUEUE.push(widgetArea);
    }
  }

  /**
   * @description create the file of the given widget area if not exists ( and populate it with the default params )
   * @skipIfExists it's a boolean value that prevent to throw an error if the given widget area already exists
   * @widgetAreaName the name of the widget area
   */
  public create(widgetAreaName: string, skipIfExists: boolean = false): void {
    let widgetAreaPath: string = this.getWidgetAreaPagePath(widgetAreaName);

    if (FileReader.existsFile(widgetAreaPath) && !skipIfExists)
      throw new Error(this.ALREADY_PRESENT);

    let defaultContent: string = FileReader.readFile(
      this.themeAux.getInsideThemeAssetsPath(this.DEFAULT_BUILD_PATH)
    );
    let newContent: string = defaultContent;
    newContent = newContent
      .split(
        CommentsIdentifiers.getIdentifierPlaceholder(
          this.IDENTIFIER_NAME,
          false
        )
      )
      .join(widgetAreaName);
    FileWriter.writeFile(widgetAreaPath, newContent);
  }
  /**
   * @description create all the widget areas in the queue (this.QUEUE)
   * @param removeFromQueueOnCreation set this to true for remove the created post types from the this.PAGES array
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
        parameters.widgetAreaName
      );
    }
  }
}

export { WidgetArea };
