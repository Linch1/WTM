import { nestedStringsArrays } from "../types/customTypes";
import { FileReader } from "../files/FileReader";
import { FileWriter } from "../files/FileWriter";
import { CommentsIdentifiers } from "../comments-identifiers/CommentsIdentifiers";
import { StringComposeWriter } from "../files/StringComposeWriter";

class PostType {
  
  public readonly ALREADY_PRESENT =
    "ERROR: The custom post type already exists";
  public readonly PATH = "custom-post-types/";
  public readonly DEFAULT_BUILD_PATH = this.PATH + "default.php";
  public readonly IDENTIFIER_NAME = "POST-TYPES";
  public readonly IDENTIFIER_NAME_DISPLAYED = "POST-TYPES-DISPLAYED-NAME";
  public readonly IDENTIFIER_NAME_SINGULAR = "POST-TYPES-SINGULAR-NAME";

  constructor(
    public themeAssetsPath: string,
    public readonly postType: string,
    public readonly postTypeDisplayName: string,
    public readonly postTypeNameSingular: string
  ) {}

  /**
   * @description create the file of the given custom widget area if not exists ( and populate it with the default params ) 
   * @skipIfExists it's a boolean value that prevent to throw an error if the given post type already exists
   */
  public create(skipIfExists: boolean = false): void {
    /* get the post type path*/
    let postTypePath: string = StringComposeWriter.concatenatePaths(
      this.themeAssetsPath,
      this.PATH,
      `${this.postType}.php`
    );
    if (FileReader.existsFile(postTypePath)  && !skipIfExists )
      throw new Error(this.ALREADY_PRESENT);

    let defaultContent: string = FileReader.readFile(
      StringComposeWriter.concatenatePaths(this.themeAssetsPath, this.DEFAULT_BUILD_PATH)
    );

    let newContent: string = defaultContent;
    newContent = newContent
      .split(CommentsIdentifiers.getIdentifierPlaceholder(this.IDENTIFIER_NAME, false))
      .join(this.postType);
    newContent = newContent
      .split(CommentsIdentifiers.getIdentifierPlaceholder(this.IDENTIFIER_NAME_DISPLAYED, false))
      .join(this.postTypeDisplayName);
    newContent = newContent
      .split(CommentsIdentifiers.getIdentifierPlaceholder(this.IDENTIFIER_NAME_SINGULAR, false))
      .join(this.postTypeNameSingular);
    FileWriter.writeFile(postTypePath, newContent);
  }

}

export { PostType };
