import { FileReader } from "../../../files/FileReader";
import { FileWriter } from "../../../files/FileWriter";
import { StringComposeWriter } from "../../../files/StringComposeWriter";
import { ThemeAux } from "../../../ManageTheme/ThemeAux";
import { customPartType } from "../../../Enums/entities.wp.type";
import { customPartPath } from "../../../Enums/entities.wp.path";
import { replaceAllParams } from "../../../Types/files.StringComposerWriter";
import { postTypeParams } from "../../../Types/entity.wp.postType";
import { GeneralWpEntity } from "../GeneralWpEntity";
import { Identifiers } from "../../../Identifiers/Identifiers";

type params = postTypeParams;
class PostType  extends GeneralWpEntity<params> {

  public readonly IDENTIFIER_NAME_DISPLAYED = "POST-TYPES-DISPLAYED-NAME";
  public readonly IDENTIFIER_NAME_SINGULAR = "POST-TYPES-SINGULAR-NAME";



  /**
   * @description intialize the class
   * @param themeAux
   * @param informations the field pageName should also be a valid function name
   */
  constructor(public themeAux: ThemeAux, protected informations: params) {
    super(themeAux, informations);
    this.CUSTOM_PART_NAME = this.getInformations.postTypeName;
    this.CUSTOM_PART_TYPE = customPartType.POST_TYPE;
    this.FILE_NAME = "WTM-POST-TYPE.php";
    this.IDENTIFIER_NAME = "POST-TYPES";
    this.PARENT_DIR_PATH = customPartPath.POST_TYPE;
    this.DEFAULT_BUILD_PATH = StringComposeWriter.concatenatePaths(this.PARENT_DIR_PATH, "default.php");
    this.JSON_PATH = this.themeAux.getInsideWTMPath(this.PARENT_DIR_PATH);
    this.JSON_FILE_PATH = this.themeAux.getInsideWTMPath(this.PARENT_DIR_PATH, `WTM-${this.CUSTOM_PART_NAME}.json`);
    this.initialize();
  }

  /**
   * @description create the file of the given custom widget area if not exists ( and populate it with the default params )
   */
  public create(): void {
    if (!this.validInformations()) throw new Error(this.ERR_NO_VALID_INFORMATIONS);

    /* get the post type path*/
    let postTypePath: string = this.getPath();
    if (
      FileReader.existsPath(postTypePath) &&
      !this.getInformations.skipIfExists
    )
      throw new Error(this.ERR_ALREADY_PRESENT);

    let defaultContent: string = FileReader.readFile(
      this.themeAux.getInsideThemeAssetsPath(this.DEFAULT_BUILD_PATH)
    );

    let params: replaceAllParams = {};
    params[this.IDENTIFIER_NAME] = this.getInformations.postTypeName;
    params[
      this.IDENTIFIER_NAME_DISPLAYED
    ] = this.getInformations.postTypeDisplayName;
    params[
      this.IDENTIFIER_NAME_SINGULAR
    ] = this.getInformations.postTypeNameSingular;

    let newContent: string = defaultContent;
    newContent = Identifiers.replaceAllIdentifiersPlaceholders(
      newContent,
      params
    );

    FileWriter.writeFile(postTypePath, newContent);
    this.saveJson();
  }
}

export { PostType };
