import { FileWriter } from "../../files/FileWriter";
import { FileReader } from "../../files/FileReader";
import { StringComposeWriter } from "../../files/StringComposeWriter";
import { replaceAllParams } from "../../files/types/types";
import { ThemeAux } from "../ThemeAux";
import { pageTypes } from "./enums/enums";
import { defaultJson, informationsJson } from "./types/types";
import { WpFunctionComposer } from "../../files/WpFunctionComposer";
import { CommentsIdentifiers } from "../../comments-identifiers/CommentsIdentifiers";

class PageBuild {
  public readonly ERR_NOT_VALID_HTML_BLOCK =
    "ERR: The passed Html block identified by the passed identifier_name doesn't exists in the (template/single) file";

  public PAGE_NAME: string = "";
  public PAGE_TYPE: pageTypes = pageTypes.PAGE;
  public PATH = "";
  public DEFAULT_BUILD_PATH: string = "";

  public readonly IDENTIFIERS_HTML_BLOCKS: string[] = ["BODY"]; /* pair */
  public readonly IDENTIFIER_PLACEHOLDER_PAGE_NAME: string = "PAGE-NAME";
  public readonly IDENTIFIER_PLACEHOLDER_PAGE_TYPE: string = "PAGE-TYPE";
  public readonly IDENTIFIER_PLACEHOLDER_PAGE_HEADER: string = "PAGE-HEADER";
  public readonly IDENTIFIER_PLACEHOLDER_PAGE_FOOTER: string = "PAGE-FOOTER";

  public FILE_NAME: string = "WTM-TEMPLATE.php";
  public JSON_NAME: string = "WTM.json";

  // public JSON_DEFAULT: defaultJson = JSON.parse(
  //   FileReader.readFile("./default.json")
  // );
  public JSON_DEFAULT: defaultJson = {
    "post": {
        "header": "",
        "footer": ""
    },
    "page": {
        "header": "",
        "footer": ""
    }
}
  public JSON_INFORMATIONS: informationsJson = {
    include: [],
    blocks: { BODY: { open: "", close: "" } },
    name: "",
  };

  constructor(public themeAux: ThemeAux) {}

  /**
   * @description creates the single/template directory
   */
  public createDirectory() {
    let directory = this.getDirectory();
    if (!FileReader.existsPath(directory))
      FileWriter.createDirectory(directory);
  }
  /**
   * @description get the path to the dircetory that contains the single/template
   */
  getDirectory(): string {
    return this.themeAux.getInsideThemePath(
      this.PATH,
      this.PAGE_NAME.toLocaleLowerCase().split(" ").join("-")
    );
  }
  /**
   * @description get the path to a file inside the (single/template)'s directory
   * @param file the file for which retrive the path
   */
  public getInsideDirectory(file: string): string {
    return StringComposeWriter.concatenatePaths(this.getDirectory(), file);
  }
  /**
   * @description get the absolute path to the main file of the single/template
   */
  public getPath(): string {
    return this.getInsideDirectory(this.FILE_NAME);
  }
  /**
   * @description returns the absolute path of the json file that contains the relevant informations of the single/template
   */
  public getJsonPath(): string {
    return this.getInsideDirectory(this.JSON_NAME);
  }
  /**
   * @description save the informations of the single/template
   */
  public saveJson(): void {
    FileWriter.writeFile(
      this.getJsonPath(),
      JSON.stringify(this.JSON_INFORMATIONS)
    );
  }


  /**
   * @description create the single/template and populate it's header/footer with the default ones
   */
  public create(): void {
    this.createDirectory();
    let defaultContent: string = FileReader.readFile(
      this.themeAux.getInsideThemePath(this.DEFAULT_BUILD_PATH)
    );

    let params: replaceAllParams = {};
    params[this.IDENTIFIER_PLACEHOLDER_PAGE_NAME] = this.PAGE_NAME;
    params[this.IDENTIFIER_PLACEHOLDER_PAGE_TYPE] = this.PAGE_TYPE;
    params[this.IDENTIFIER_PLACEHOLDER_PAGE_HEADER] = this.JSON_DEFAULT[
      this.PAGE_TYPE
    ].header;
    params[this.IDENTIFIER_PLACEHOLDER_PAGE_FOOTER] = this.JSON_DEFAULT[
      this.PAGE_TYPE
    ].footer;

    let newContent: string = defaultContent;
    newContent = StringComposeWriter.replaceAllIdentifiersPlaceholders(
      newContent,
      params
    );

    FileWriter.writeFile(this.getPath(), newContent);
    this.saveJson();
  }

  /**
   * @description include the given path in the block identified by the passed identifier_name
   * - the aviable blocks can be viewed from _this.IDENTIFIERS_HTML_BLOCKS_
   * @param identifier_name
   * @param path
   */
  public includeRelative(identifier_name: string, path: string) {
    if (!this.IDENTIFIERS_HTML_BLOCKS.includes(identifier_name))
      throw new Error(this.ERR_NOT_VALID_HTML_BLOCK);
    StringComposeWriter.appendBeetweenChars(
      this.getPath(),
      WpFunctionComposer.includeRelative(path),
      CommentsIdentifiers.getIdentifierHtmlPair(identifier_name)[0],
      CommentsIdentifiers.getIdentifierHtmlPair(identifier_name)[1]
    );
    this.JSON_INFORMATIONS.include.push(path);
    this.saveJson();
  }
}
export { PageBuild };
