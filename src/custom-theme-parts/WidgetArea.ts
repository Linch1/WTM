import { nestedStringsArrays } from "../types/customTypes";
import { FileReader } from "../files/FileReader";
import { FileWriter } from "../files/FileWriter";
import { CommentsIdentifiers } from "../comments-identifiers/CommentsIdentifiers";
import { StringComposeWriter } from "../files/StringComposeWriter";

class WidgetArea {

  public readonly ALREADY_PRESENT =
    "ERROR: The custom widget area already exists";
  public readonly PATH = "custom-widget-areas/";
  public readonly DEFAULT_BUILD_PATH = this.PATH + "default.php";
  public readonly IDENTIFIER_NAME = "WIDGET-AREA";

  constructor(public themeAssetsPath: string, public readonly widgetAreaName: string) {}

  /**
   * @description create the file of the given widget area if not exists ( and populate it with the default params ) 
   * @skipIfExists it's a boolean value that prevent to throw an error if the given widget area already exists
   */
  public create(skipIfExists: boolean = false): void {

    let widgetAreaPath: string = StringComposeWriter.concatenatePaths(
      this.themeAssetsPath,
      this.PATH,
      `${this.widgetAreaName}.php`
    );

    if (FileReader.existsFile(widgetAreaPath) && !skipIfExists)
      throw new Error(this.ALREADY_PRESENT);

    let defaultContent: string = FileReader.readFile(
      StringComposeWriter.concatenatePaths(this.themeAssetsPath, this.DEFAULT_BUILD_PATH)
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
