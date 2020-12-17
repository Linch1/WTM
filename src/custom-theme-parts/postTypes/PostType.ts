import { nestedStringsArrays, postTypeParams } from "../../types/customTypes";
import { FileReader } from "../../files/FileReader";
import { FileWriter } from "../../files/FileWriter";
import { CommentsIdentifiers } from "../../comments-identifiers/CommentsIdentifiers";
import { StringComposeWriter } from "../../files/StringComposeWriter";
import { WpFunctionComposer } from "../../files/WpFunctionComposer";
import { ThemeAux } from "../../theme/ThemeAux";


type params = postTypeParams;
class PostType {
  public readonly ALREADY_PRESENT =
    "ERROR: The custom post type already exists";
  public readonly NO_VALID_INFORMATIONS =
    "ERROR: the informations attribute of this class is not initalized";

  public readonly PATH = "custom-post-types/";
  public readonly DEFAULT_BUILD_PATH = this.PATH + "default.php";
  public readonly IDENTIFIER_NAME = "POST-TYPES";
  public readonly IDENTIFIER_NAME_DISPLAYED = "POST-TYPES-DISPLAYED-NAME";
  public readonly IDENTIFIER_NAME_SINGULAR = "POST-TYPES-SINGULAR-NAME";

  constructor(
    public themeAux: ThemeAux,
    public informations: params = {
      postTypeName: "",
      postTypeDisplayName: "",
      postTypeNameSingular: "",
    }
  ) {}

  /**
   * @description checks if the post types informations are valid, returns true or false
   */
  public emptyInformations(): boolean {
    if (!this.getInformations.postTypeName) return false;
    if (!this.getInformations.postTypeDisplayName) return false;
    if (!this.getInformations.postTypeNameSingular) return false;
    return true;
  }
  public get getInformations(): params  {
    return this.informations;
  }
  public set setInformations(newInformations: params) {
    this.informations = newInformations;
  }

  /**
   * @description returns the absolute path of the post type file
   */
  public getPath(): string {
    return this.themeAux.getInsideThemeAssetsPath(
      this.PATH,
      `${this.getInformations.postTypeName}.php`
    );
  }

  /**
   * @description import the current structure in the theme
   */
  public import() {
    if (this.emptyInformations()) throw new Error(this.NO_VALID_INFORMATIONS);
    StringComposeWriter.appendBeetweenChars(
      this.themeAux.THEME_FUNCTIONS_FILE,
      WpFunctionComposer.requirePhpFile(
        StringComposeWriter.concatenatePaths(this.PATH, this.getInformations.postTypeName)
      ),
      CommentsIdentifiers.getIdentifierImportPair(this.IDENTIFIER_NAME)[0],
      CommentsIdentifiers.getIdentifierImportPair(this.IDENTIFIER_NAME)[1]
    );
  }

  /**
   * @description create the file of the given custom widget area if not exists ( and populate it with the default params )
   * @param skipIfExists it's a boolean value that prevent to throw an error if the given post type already exists
   */
  public create(): void {
    
    if (this.emptyInformations()) throw new Error(this.NO_VALID_INFORMATIONS);

    /* get the post type path*/
    let postTypePath: string = this.getPath();
    if (FileReader.existsPath(postTypePath) && !this.getInformations.skipIfExists)
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
      .join(this.getInformations.postTypeName);
    newContent = newContent
      .split(
        CommentsIdentifiers.getIdentifierPlaceholder(
          this.IDENTIFIER_NAME_DISPLAYED,
          false
        )
      )
      .join(this.getInformations.postTypeDisplayName);
    newContent = newContent
      .split(
        CommentsIdentifiers.getIdentifierPlaceholder(
          this.IDENTIFIER_NAME_SINGULAR,
          false
        )
      )
      .join(this.getInformations.postTypeNameSingular);
    FileWriter.writeFile(postTypePath, newContent);
  }
}

export { PostType };
