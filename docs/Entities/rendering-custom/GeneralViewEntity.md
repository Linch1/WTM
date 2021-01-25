
class GeneralViewEntity {

  constructor(parentAbsPath : string,) {}

  /**
   * @description create the needed file/directories
   */
  public initialize(): void {}
  /**
   * @description delete the all the relative files
   */
  public delete(): void{}

  /**
   * @description save the informations of the single/template
   * - the function also **creates it if not exists**
   */
  public saveJson(): void {}

  /**
   * @description get the absolute path to the main file of the single/template
   */
  public getPath(): string {}
  public getFileName(): string {}
  
  /**
   * @description get the absolute path to the json file of the single/template
   */
  public getPathJson(): string {}

  

  /**
   * @description create the single/template and populate it's header/footer with the default ones
   */
  public create(): void {}

  /**
   * @description include the given path in the block identified by the passed identifier_name
   * - the aviable blocks can be viewed from _this.IDENTIFIERS_HTML_BLOCKS_
   * @param identifier_name
   * @param path
   */
  public includeRelative(identifier_name: string, path: string): void {}

  /**
   * @description add a block in the template/single ( like the BODY block  )
   * - a block starts and ends with an _HTML comment identifier_
   * @param blockInfo.identifier_name the parent of the block the create
   * @param blockInfo.blockName the name of the block
   * @param blockInfo.open how the block start
   * @param blockInfo.close how the block end
   */
  public addBlock(blockInfo: addBlockParams): void {}

}