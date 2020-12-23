import { FileReader } from "../../files/FileReader";
import { FileWriter } from "../../files/FileWriter";
import { CommentsIdentifiers } from "../../comments-identifiers/CommentsIdentifiers";
import { StringComposeWriter } from "../../files/StringComposeWriter";
import { WpFunctionComposer } from "../../files/WpFunctionComposer";
import { ThemeAux } from "../../ManageTheme/ThemeAux";
import { postTypeParams } from "./types/types";
import { replaceAllParams } from "../../files/types/types";
import { InterfacecustomPart } from "../InterfacecustomPart";
import { CustomPart } from "../CustomPart";

type params = postTypeParams;
class PostType  extends CustomPart<params> {

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
    this.FILE_NAME = "WTM-POST-TYPE.php";
    this.JSON_NAME = "WTM.json";
    this.IDENTIFIER_NAME = "POST-TYPES";
    this.PATH = "custom-post-types/";
    this.DEFAULT_BUILD_PATH = this.PATH + "default.php";
  }

  /**
   * @description create the file of the given custom widget area if not exists ( and populate it with the default params )
   */
  public create(): void {
    if (!this.validInformations()) throw new Error(this.ERR_NO_VALID_INFORMATIONS);
    this.createDirectory();

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
    newContent = StringComposeWriter.replaceAllIdentifiersPlaceholders(
      newContent,
      params
    );

    FileWriter.writeFile(postTypePath, newContent);
    this.saveJson();
  }
}

export { PostType };
