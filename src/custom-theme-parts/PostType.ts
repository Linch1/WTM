import { nestedStringsArrays } from "../types/customTypes";
import { FileReader } from "../files/FileReader";
import { FileWriter } from "../files/FileWriter";
import { CommentsIdentifiers } from "../comments-identifiers/CommentsIdentifiers";

class PostType {
  
  public readonly ALREADY_PRESENT =
    "ERROR: The custom post type already exists";
  public readonly PATH = "assets/functions/custom-post-types/";
  public readonly DEFAULT_BUILD = this.PATH + "default.php";
  public readonly IDENTIFIER_NAME = "POST-TYPES";
  public readonly IDENTIFIER_NAME_DISPLAYED = "POST-TYPES-DISPLAYED-NAME";
  public readonly IDENTIFIER_NAME_SINGULAR = "POST-TYPES-SINGULAR-NAME";

  constructor(
    public themePath: string,
    public readonly postType: string,
    public readonly postTypeDisplayName: string,
    public readonly postTypeNameSingular: string
  ) {}

  /**
   * @description create the file of the given custom widget area () and populate it with the default params ) if not exists
   */
  public create(skipIfExists: boolean = false): void {
    /* get the post type path*/
    let postTypePath: string = FileReader.concatenatePaths(
      this.themePath,
      this.PATH,
      `${this.postType}.php`
    );
    if (FileReader.existsFile(postTypePath)  && !skipIfExists )
      throw new Error(this.ALREADY_PRESENT);

    let defaultContent: string = FileReader.readFile(
      FileReader.concatenatePaths(this.themePath, this.DEFAULT_BUILD)
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
