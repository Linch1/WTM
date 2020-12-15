import { nestedStringsArrays, postTypeParams } from "../types/customTypes";
import { FileReader } from "../files/FileReader";
import { FileWriter } from "../files/FileWriter";
import { CommentsIdentifiers } from "../comments-identifiers/CommentsIdentifiers";
import { StringComposeWriter } from "../files/StringComposeWriter";
import { WpFunctionComposer } from "../files/WpFunctionComposer";
import { ThemeAux } from "../theme/ThemeAux";

class PostType {
  public readonly ALREADY_PRESENT =
    "ERROR: The custom post type already exists";
  public readonly EMPTY_QUEUE = "ERROR: There are no post types in the queue";

  public readonly PATH = "custom-post-types/";
  public readonly DEFAULT_BUILD_PATH = this.PATH + "default.php";
  public readonly IDENTIFIER_NAME = "POST-TYPES";
  public readonly IDENTIFIER_NAME_DISPLAYED = "POST-TYPES-DISPLAYED-NAME";
  public readonly IDENTIFIER_NAME_SINGULAR = "POST-TYPES-SINGULAR-NAME";

  public QUEUE: postTypeParams[] = [];

  constructor(public themeAux: ThemeAux) {}

  /**
   * @description returns the absolute path of the post type file
   * @param postTypeName the name of the post type
   */
  public getPostTypePath(postTypeName: string): string {
    return this.themeAux.getInsideThemeAssetsPath(
      this.PATH,
      `${postTypeName}.php`
    );
  }

  /**
   * @description import the given post type in the theme
   * @param postTypeName the name of the post type to import
   */
  public import(postTypeName: string) {
    StringComposeWriter.appendBeetweenChars(
      this.themeAux.THEME_FUNCTIONS_FILE,
      WpFunctionComposer.requirePhpFile(
        StringComposeWriter.concatenatePaths(this.PATH, postTypeName)
      ),
      CommentsIdentifiers.getIdentifierImportPair(this.IDENTIFIER_NAME)[0],
      CommentsIdentifiers.getIdentifierImportPair(this.IDENTIFIER_NAME)[1]
    );
  }
  /**
   * @description import all the post types in this.QUEUE
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
      this.import(parameters.postTypeName);
    }
  }

  /**
   * @description add the given post type to the queue of creation/importation
   * @param postTypes a list of the post types to add
   */
  public add(...postTypes: postTypeParams[]) {
    for (let postType of postTypes) {
      this.QUEUE.push(postType);
    }
  }
  /**
   * @description create the file of the given custom widget area if not exists ( and populate it with the default params )
   * @param postTypeName the name of the post type
   * @param postTypeDisplayName the name of the post type that is displayed in the admin dashboard
   * @param postTypeNameSingular the singular name of the post type
   * @param skipIfExists it's a boolean value that prevent to throw an error if the given post type already exists
   */
  public create(
    postTypeName: string,
    postTypeDisplayName: string,
    postTypeNameSingular: string,
    skipIfExists: boolean = false
  ): void {
    /* get the post type path*/
    let postTypePath: string = this.getPostTypePath(postTypeName);
    if (FileReader.existsFile(postTypePath) && !skipIfExists)
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
      .join(postTypeName);
    newContent = newContent
      .split(
        CommentsIdentifiers.getIdentifierPlaceholder(
          this.IDENTIFIER_NAME_DISPLAYED,
          false
        )
      )
      .join(postTypeDisplayName);
    newContent = newContent
      .split(
        CommentsIdentifiers.getIdentifierPlaceholder(
          this.IDENTIFIER_NAME_SINGULAR,
          false
        )
      )
      .join(postTypeNameSingular);
    FileWriter.writeFile(postTypePath, newContent);
  }
  /**
   * @description create all the post types in the queue (this.QUEUE)
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
        parameters.postTypeName,
        parameters.postTypeDisplayName,
        parameters.postTypeNameSingular,
        parameters.skipIfExists
      );
    }
  }
}

export { PostType };
