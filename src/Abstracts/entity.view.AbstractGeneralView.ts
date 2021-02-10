import { FileReader } from "../files/FileReader";
import { StringComposeReader } from "../files/StringComposeReader";
import { StringComposeWriter } from "../files/StringComposeWriter";
import { visualJson } from "../Types/entity.visual.jsons";
import { identifierActions } from "../Enums";
import { FileWriter } from "../files/FileWriter";
import { informationsJson } from "../Types/entity.rendering.jsons";
import { replaceAllParams } from "../Types/files.StringComposerWriter";
import { addBlockParams } from "../Types/entity.rendering.params.addBlock";
import { IdentifierHtml } from "../Identifiers/IdentifierHtml";

export abstract class AbstractGeneralView {
  public readonly ERR_NOT_VALID_HTML_BLOCK =
    "ERR: The passed Html block identified by the passed identifier_name doesn't exists in the (template/single) file";
  public readonly ERR_VIEW_NOT_CREATED =
    "ERR: Before calling this method create the view with the .create() method";
  public readonly ERR_VIEW_ALREADY_EXISTS = "ERR: The view already exists";

  public readonly IDENTIFIER_PLACEHOLDER_PAGE_NAME: string = "PAGE-NAME";
  public readonly IDENTIFIER_PLACEHOLDER_PAGE_HEADER: string = "PAGE-HEADER";
  public readonly IDENTIFIER_PLACEHOLDER_PAGE_FOOTER: string = "PAGE-FOOTER";

  public JSON_INFORMATIONS: informationsJson = {
    blocks: { BODY: { open: "", close: "", include: [] } },
    view: { name: "", extension: "php" },
  };
  public JSON_COMMON_INFORMATIONS: {
    header: string;
    footer: string;
  } = { 'header': '', 'footer': ''}
  public COMMON_DEFAULT_BUILD = "";

  /**
   * 
   * @param PAGE_NAME 
   * @param PAGE_EXTENSION 
   * @param PARENT_DIR_PATH Absolute path
   * @param PAGE_PREFIX 
   * @param JSON_FOLDER_PATH Absolute path
   * @param JSON_FILE_PATH Absolute path
   * @param JSON_COMMON_INFORMATIONS_FILE_PATH 
   * @param COMMON_DEFAULT_BUILD_FILE_PATH Absolute path
   */
  constructor(
    public PAGE_NAME: string,
    public PAGE_EXTENSION: string,
    public PARENT_DIR_PATH: string,
    public PAGE_PREFIX: string,
    public JSON_FOLDER_PATH: string,
    public JSON_FILE_PATH: string,
    public JSON_COMMON_INFORMATIONS_FILE_PATH: string,
    public COMMON_DEFAULT_BUILD_FILE_PATH: string
  ) {
    this.JSON_INFORMATIONS.view.name = PAGE_NAME;
    this.JSON_INFORMATIONS.view.extension = PAGE_EXTENSION;
  }

  abstract getIncludeFunction(path: string): string;

  /**
   * @description create the needed file/directories
   */
  public initialize(): void {
    FileWriter.createDirectory(this.PARENT_DIR_PATH);
    FileWriter.createDirectory(this.JSON_FOLDER_PATH);
    FileWriter.createFile(
      this.JSON_COMMON_INFORMATIONS_FILE_PATH,
      JSON.stringify(this.JSON_COMMON_INFORMATIONS)
    );
    FileWriter.createFile( this.COMMON_DEFAULT_BUILD_FILE_PATH, "" );

    this.JSON_COMMON_INFORMATIONS = JSON.parse(
      FileReader.readFile(this.JSON_COMMON_INFORMATIONS_FILE_PATH)
    );

    if (FileReader.existsPath(this.JSON_FILE_PATH)) {
      this.JSON_INFORMATIONS = JSON.parse(
        FileReader.readFile(this.JSON_FILE_PATH)
      );
    }
    if (FileReader.existsPath(this.COMMON_DEFAULT_BUILD_FILE_PATH)) {
        this.COMMON_DEFAULT_BUILD = FileReader.readFile(this.COMMON_DEFAULT_BUILD_FILE_PATH)
    }
  }
  
  getDefaultBuild(): string {
    return this.COMMON_DEFAULT_BUILD;
  }
  getDefaultHeader(): string {
    return this.JSON_COMMON_INFORMATIONS.header;
  }
  getDefaultFooter(): string {
    return this.JSON_COMMON_INFORMATIONS.footer;
  }

  /**
   * @description delete the all the relative files
   */
  public delete(): void {
    FileWriter.removeFile(this.getPath());
    FileWriter.removeFile(this.getPathJson());
  }
  /**
   * @description check if the current view is yet created or not, return true if it is created;
   */
  public isCreated(): boolean {
    return FileReader.existsPath(this.getPath());
  }
  /**
   * @description save the informations of the single/template
   * - the function also **creates it if not exists**
   */
  public saveJson(): void {
    FileWriter.writeFile(
      this.getPathJson(),
      JSON.stringify(this.JSON_INFORMATIONS)
    );
  }
  /**
   * @description get the absolute path to the main file of the single/template
   */
  public getPath(): string {
    return StringComposeWriter.concatenatePaths(
      this.PARENT_DIR_PATH,
      this.getFileName()
    );
  }
  public getName(): string {
    return this.JSON_INFORMATIONS.view.name;
  }
  public setName(name: string) {
    this.JSON_INFORMATIONS.view.name = name;
  }
  public getExtension(): string {
    return this.JSON_INFORMATIONS.view.extension;
  }
  public setExtension(extension: string) {
    this.JSON_INFORMATIONS.view.extension = extension;
  }
  public getFileName(): string {
    return (
      this.PAGE_PREFIX +
      this.PAGE_NAME.toLocaleLowerCase().split(" ").join("-") + '.' + 
      this.getExtension()
    );
  }
  /**
   * @description get the absolute path to the json file of the single/template
   */
  public getPathJson(): string {
    return this.JSON_FILE_PATH;
  }

  /**
   * @description get the existing view blocks
   */
  public getBlocks(): string[] {
    return Object.keys(this.JSON_INFORMATIONS.blocks);
  }

  /**
   * @description create the single/template and populate it's header/footer with the default ones
   */
  public create(): void {
    if (this.isCreated()) {
      throw new Error(this.ERR_VIEW_ALREADY_EXISTS);
    }
    let defaultContent: string = this.getDefaultBuild();
    let params: replaceAllParams = {};
    params[this.IDENTIFIER_PLACEHOLDER_PAGE_NAME] = this.PAGE_NAME;
    params[this.IDENTIFIER_PLACEHOLDER_PAGE_HEADER] = this.getDefaultHeader();
    params[this.IDENTIFIER_PLACEHOLDER_PAGE_FOOTER] = this.getDefaultFooter();

    let newContent: string = defaultContent;
    newContent = StringComposeWriter.replaceAllIdentifiersPlaceholders(
      newContent,
      params
    );
    this.setName(this.PAGE_NAME);
    FileWriter.createFile(
      this.JSON_FILE_PATH,
      JSON.stringify(this.JSON_INFORMATIONS)
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
  public includeRelative(identifier_name: string, path: string): void {
    if (!Object.keys(this.JSON_INFORMATIONS.blocks).includes(identifier_name))
      throw new Error(this.ERR_NOT_VALID_HTML_BLOCK);
    if (!this.isCreated()) throw new Error(this.ERR_VIEW_NOT_CREATED);
    StringComposeWriter.appendBeetweenChars(
      this.getPath(),
      this.getIncludeFunction(path),
      IdentifierHtml.getIdentifierPairHtmlComment(identifier_name)[0],
      IdentifierHtml.getIdentifierPairHtmlComment(identifier_name)[1]
    );
    this.JSON_INFORMATIONS.blocks[identifier_name].include.push(path);
    this.saveJson();
  }

  /**
   * @description add a block in the template/single ( like the BODY block  )
   * - a block starts and ends with an _HTML comment identifier_
   * @param blockInfo.identifier_name the parent of the block the create
   * @param blockInfo.blockName the name of the block
   * @param blockInfo.open how the block start
   * @param blockInfo.close how the block end
   */
  public addBlock(blockInfo: addBlockParams): void {
    if (
      !Object.keys(this.JSON_INFORMATIONS.blocks).includes(
        blockInfo.identifier_name
      )
    )
      throw new Error(this.ERR_NOT_VALID_HTML_BLOCK);
    if (!this.isCreated()) throw new Error(this.ERR_VIEW_NOT_CREATED);

    blockInfo.open = blockInfo.open ? blockInfo.open : "";
    blockInfo.close = blockInfo.close ? blockInfo.close : "";

    let toAdd = `
${blockInfo.open}
${IdentifierHtml.getIdentifierPairHtmlComment(blockInfo.blockName)[0]}   
${IdentifierHtml.getIdentifierPairHtmlComment(blockInfo.blockName)[1]}
${blockInfo.close}
`;
    StringComposeWriter.appendBeetweenChars(
      this.getPath(),
      toAdd,
      IdentifierHtml.getIdentifierPairHtmlComment(blockInfo.identifier_name)[0],
      IdentifierHtml.getIdentifierPairHtmlComment(blockInfo.identifier_name)[1]
    );
    this.JSON_INFORMATIONS.blocks[blockInfo.identifier_name].include.push(
      IdentifierHtml.getIdentifier(blockInfo.blockName)
    );
    this.JSON_INFORMATIONS.blocks[blockInfo.blockName] = {
      open: blockInfo.open,
      close: blockInfo.close,
      include: [],
    };
    this.saveJson();
    StringComposeWriter.makePretty(this.getPath());
  }
}
