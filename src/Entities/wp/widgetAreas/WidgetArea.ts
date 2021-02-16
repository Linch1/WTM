import { FileReader } from "../../../files/FileReader";
import { FileWriter } from "../../../files/FileWriter";
import { StringComposeWriter } from "../../../files/StringComposeWriter";
import { ThemeAux } from "../../../ManageTheme/ThemeAux";
import { widgetAreaParams } from "../../../Types/entity.wp.widgetArea";
import { customPartType } from "../../../Enums/entities.wp.type";
import { customPartPath } from "../../../Enums/entities.wp.path";
import { replaceAllParams } from "../../../Types/files.StringComposerWriter";
import { GeneralWpEntity } from "../GeneralWpEntity";
import { Identifiers } from "../../../Identifiers/Identifiers";
HERE
type params = widgetAreaParams;
class WidgetArea extends GeneralWpEntity<params> {
  
  /**
   * @description intialize the class
   * @param themeAux
   * @param informations the field pageName should also be a valid function name
   */
  constructor(public themeAux: ThemeAux, protected informations: params) {
    super(themeAux, informations);
    this.CUSTOM_PART_NAME = this.getInformations.widgetAreaName;
    this.CUSTOM_PART_TYPE = customPartType.WIDGET_AREA;
    this.FILE_NAME = "WTM-WIDGET-AREA.php";
    
    this.IDENTIFIER_NAME = "WIDGET-AREA";
    this.PARENT_DIR_PATH = customPartPath.WIDGET_AREA;
    this.DEFAULT_BUILD_PATH = StringComposeWriter.concatenatePaths(this.PARENT_DIR_PATH, "default.php");

    this.JSON_PATH = this.themeAux.getInsideWTMPath(this.PARENT_DIR_PATH);
    this.JSON_FILE_PATH = this.themeAux.getInsideWTMPath(this.PARENT_DIR_PATH, `WTM-${this.CUSTOM_PART_NAME}.json`);
    this.initialize();
  }

  /**
   * @description create the file of the given widget area if not exists ( and populate it with the default params )
   */
  public create(skipIfExists: boolean = false): void {
    if (!this.validInformations()) throw new Error(this.ERR_NO_VALID_INFORMATIONS);
    
    let widgetAreaPath: string = this.getPath();

    if (
      FileReader.existsPath(widgetAreaPath) &&
      !this.getInformations.skipIfExists
    )
      throw new Error(this.ERR_ALREADY_PRESENT);

    let defaultContent: string = FileReader.readFile(
      this.themeAux.getInsideThemeAssetsPath(this.DEFAULT_BUILD_PATH)
    );

    let params: replaceAllParams = {};
    params[this.IDENTIFIER_NAME] = this.getInformations.widgetAreaName;

    let newContent: string = defaultContent;
    newContent = Identifiers.replaceAllIdentifiersPlaceholders(
      newContent,
      params
    );

    FileWriter.writeFile(widgetAreaPath, newContent);
    this.saveJson();
  }
}

export { WidgetArea };
