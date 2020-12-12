import { nestedStringsArrays } from "../types/customTypes";
import { FileReader } from "../files/FileReader";
import { FileWriter } from "../files/FileWriter";
import { CommentsIdentifiers } from "../comments-identifiers/CommentsIdentifiers";

class WidgetArea {

  public readonly ALREADY_PRESENT =
    "ERROR: The custom widget area already exists";
  public readonly PATH = "assets/functions/custom-widget-areas/";
  public readonly DEFAULT_BUILD = this.PATH + "default.php";
  public readonly IDENTIFIER_NAME = "WIDGET-AREA";

  constructor(public themePath: string, public readonly widgetAreaName: string) {}

  /**
   * @description create the file of the given custom post type ( and populate it with the default params ) if not exists
   */
  public create(skipIfExists: boolean = false): void {
    /* get the post type path*/
    let widgetAreaPath: string = FileReader.concatenatePaths(
      this.themePath,
      this.PATH,
      `${this.widgetAreaName}.php`
    );

    if (FileReader.existsFile(widgetAreaPath) && !skipIfExists)
      throw new Error(this.ALREADY_PRESENT);

    let defaultContent: string = FileReader.readFile(
      FileReader.concatenatePaths(this.themePath, this.DEFAULT_BUILD)
    );
    let newContent: string = defaultContent;
    newContent = newContent
      .split(
        CommentsIdentifiers.getIdentifierPlaceholder(
          this.IDENTIFIER_NAME,
          false
        )
      )
      .join(this.widgetAreaName);
    FileWriter.writeFile(widgetAreaPath, newContent);
  }
}

export { WidgetArea };
