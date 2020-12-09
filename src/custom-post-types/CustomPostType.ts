import { nestedStringsArrays } from "../types/customTypes";
import { FileReader } from "../files/FileReader";
import { FileWriter } from "../files/FileWriter";
import { CommentsIdentifiers } from "../comments-identifiers/CommentsIdentifiers";

class CustomPostType {
  /* 
    [CPT-WTM] post type name
    [CPTS-WTM] post type singular name
    [CPTN-WTM] post type name displayed in menu
    */

  public readonly ALREADY_PRESENT =
    "ERROR: THE CUSTOM POST TYPE ALREADY EXISTS";
  public readonly PATH = "assets/functions/custom-post-types/";
  public readonly DEFAULT_BUILD = this.PATH + "default.php";
  public readonly PLACEHOLDER_NAME = CommentsIdentifiers.getIdentifierPlaceholder("CPT");
  public readonly PLACEHOLDER_NAME_DISPLAYED = CommentsIdentifiers.getIdentifierPlaceholder("CPTN");
  public readonly PLACEHOLDER_NAME_SINGULAR = CommentsIdentifiers.getIdentifierPlaceholder("CPTS");;
  public readonly IMPORT_IDENTIFIER = CommentsIdentifiers.getIdentifierImport("CPT");

  constructor(
    public themePath: string,
    public readonly postType: string,
    public readonly postTypeDisplayName: string,
    public readonly postTypeNameSingular: string
  ) {}

  /**
   * @description create the file of the given custom post type ( and populate it with the default params ) if not exists
   */
  public create(): void {
    /* get the post type path*/
    let postTypePath: string = FileReader.concatenatePaths(
      this.themePath,
      this.PATH,
      `${this.postType}.php`
    );
    if (FileReader.existsFile(postTypePath))
      throw new Error(this.ALREADY_PRESENT);
    let defaultContent: string = FileReader.readFile(
      FileReader.concatenatePaths(this.themePath, this.DEFAULT_BUILD)
    );
    let newContent: string = defaultContent;
    newContent = newContent
      .split(this.PLACEHOLDER_NAME)
      .join(this.postType);
    newContent = newContent
      .split(this.PLACEHOLDER_NAME_DISPLAYED)
      .join(this.postTypeDisplayName);
    newContent = newContent
      .split(this.PLACEHOLDER_NAME_SINGULAR)
      .join(this.postTypeNameSingular);
    FileWriter.writeFile(postTypePath, newContent);
  }

}

export { CustomPostType };
