import { FileReader } from "../files/FileReader";
import { StringComposeWriter } from "../files/StringComposeWriter";
import { extensions,  identifierActions,  identifierType,  ProjectTypes } from "../Enums";
import { FileWriter } from "../files/FileWriter";
import { informationsJson } from "../Types/entity.rendering.jsons";
import { replaceAllParams } from "../Types/files.StringComposerWriter";
import { addBlockParams } from "../Types/entity.rendering.params.addBlock";
import { IdentifierHtml } from "../Identifiers/IdentifierHtml";
import { IdentifierPlaceholder, Identifiers } from "../Identifiers";
import { checkMapProjectTypeToExtension } from "../Checkers/check.mapProjectTypeToExtension";
import { ConstViews } from "../Constants/const.views";
import { Project } from "../ManageProjects/Project";
import { Visual } from "../ManageVisual";

export abstract class AbstractGeneralView {
  public readonly ERR_NOT_VALID_HTML_BLOCK =
    "ERR: The passed Html block identified by the passed parentBlockName doesn't exists in the (template/single) file";
  public readonly ERR_VIEW_NOT_CREATED =
    "ERR: Before calling this method create the view with the .create() method";
  public readonly ERR_VIEW_ALREADY_EXISTS = "ERR: The view already exists";
  public readonly ERR_VISUAL_NO_EXISTS = "The passed visual doesn't exists";

  public readonly IDENTIFIER_PLACEHOLDER_PAGE_NAME: string = ConstViews.IdentifierPageName;
  public readonly IDENTIFIER_PLACEHOLDER_PAGE_START: string = ConstViews.IdentifierPageStart;
  public readonly IDENTIFIER_PLACEHOLDER_PAGE_END: string = ConstViews.IdentifierPageEnd;

  public readonly IDENTIFIER_PLACEHOLDER_DEFAULT_SCRIPTS: string = ConstViews.IdentifierDefaultScripts;
  public readonly IDENTIFIER_PLACEHOLDER_DEFAULT_STYLES: string = ConstViews.IdentifierDefaultStyles;

  public PAGE_PROJECT_TYPE: ProjectTypes;
  public VIEWS_FOLDER: string;
  public PAGE_PREFIX: string;
  public JSON_FOLDER_PATH: string;
  public JSON_FILE_PATH: string;
  public JSON_COMMON_INFORMATIONS_FILE_PATH: string;
  public COMMON_DEFAULT_BUILD_FILE_PATH: string;

  public JSON_INFORMATIONS: informationsJson = ConstViews.getViewsJsonInformations();
  public JSON_COMMON_INFORMATIONS = ConstViews.getViewsCommonJsonInformations( );
  public COMMON_DEFAULT_BUILD = ConstViews.CommonContent; // modified in wp themes and singles

  /**
   * 
   * @param PAGE_NAME 
   * @param PAGE_EXTENSION 
   * @param VIEWS_FOLDER Absolute path
   * @param PAGE_PREFIX 
   * @param JSON_FOLDER_PATH Absolute path
   * @param JSON_FILE_PATH Absolute path
   * @param JSON_COMMON_INFORMATIONS_FILE_PATH 
   * @param COMMON_DEFAULT_BUILD_FILE_PATH Absolute path
   */
  constructor(
    
    public PAGE_NAME: string,
    public PROJECT: Project,

  ) {
    this.PAGE_PREFIX = ConstViews.Prefix;
    this.VIEWS_FOLDER = this.PROJECT.getViewsPath();
    this.PAGE_PROJECT_TYPE = this.PROJECT.getProjectType();
    this.JSON_FOLDER_PATH = StringComposeWriter.concatenatePaths(this.VIEWS_FOLDER, ConstViews.JsonDirectory);
    this.JSON_FILE_PATH = StringComposeWriter.concatenatePaths(this.VIEWS_FOLDER, `${ConstViews.JsonDirectory}/${this.PAGE_NAME.toLowerCase().split(" ").join("-")}.json`);
    this.COMMON_DEFAULT_BUILD_FILE_PATH = StringComposeWriter.concatenatePaths(this.VIEWS_FOLDER, `${ConstViews.CommonContentFileName}.${checkMapProjectTypeToExtension(this.PAGE_PROJECT_TYPE)}`);
    this.JSON_COMMON_INFORMATIONS_FILE_PATH = StringComposeWriter.concatenatePaths(this.VIEWS_FOLDER, ConstViews.JsonDirectory, ConstViews.CommonJsonFile);
    this.JSON_INFORMATIONS.view.name = PAGE_NAME;
    this.JSON_INFORMATIONS.view.projectType = this.PAGE_PROJECT_TYPE;
  }

  /**
   * @description return the syntax for correctly include a file in the view ex:
   * - Wordpress: _< ?php include (TEMPLATEPATH . path ); ?>_
   * - ejs: _<%-include(TEMPLATE_PATH+path)%>_
   */
  abstract getIncludeFunction(path: string): string;

  /**
   * @description create the needed files and directories
   */
  public initialize(): void {
    FileWriter.createDirectory(this.VIEWS_FOLDER);
    FileWriter.createDirectory(this.JSON_FOLDER_PATH);
    FileWriter.createFile(
      this.JSON_COMMON_INFORMATIONS_FILE_PATH,
      JSON.stringify(this.JSON_COMMON_INFORMATIONS)
    );
    FileWriter.createFile( this.COMMON_DEFAULT_BUILD_FILE_PATH, this.COMMON_DEFAULT_BUILD );

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
  
  /**
   * @description get the default content to add in all the newly created views,
   * it is taken from inside the file: this.COMMON_DEFAULT_BUILD_FILE_PATH
   */
  getDefaultBuild(): string {
    return this.COMMON_DEFAULT_BUILD;
  }
  /**
   * @description get the common viewStart ( it is inside the this.JSON_COMMON_INFORMATIONS_FILE_PATH)
   */
  getViewStart(): string {
    return this.JSON_COMMON_INFORMATIONS.viewStart;
  }
  setViewStart( newOne: string ) {
    this.JSON_COMMON_INFORMATIONS.viewStart = newOne;
    this.saveCommonInformationsJson();
  }
  /**
   * @description get the common viewEnd ( it is inside the this.JSON_COMMON_INFORMATIONS_FILE_PATH)
   */
  getViewEnd(): string {
    return this.JSON_COMMON_INFORMATIONS.viewEnd;
  }
  setViewEnd( newOne: string ) {
    this.JSON_COMMON_INFORMATIONS.viewEnd = newOne;
    this.saveCommonInformationsJson();
  }
  getDefaultScripts(): string {
    return this.JSON_COMMON_INFORMATIONS.scripts.join('\n');
  }
  /**
   * @description add a script in the default scripts
   * @param style the script to add ( including open and close script tag )
   */
  addDefaultScript( script: string ){
    if( this.JSON_COMMON_INFORMATIONS.scripts.includes( script ) ) return;
    this.JSON_COMMON_INFORMATIONS.scripts.push( script );
    this.saveCommonInformationsJson();
  }
  setDefaultScripts( scripts: string[] ) {
    this.JSON_COMMON_INFORMATIONS.scripts = scripts;
    this.saveCommonInformationsJson();
  }
  getDefaultStyles(): string {
    return this.JSON_COMMON_INFORMATIONS.styles.join('\n');
  }
  /**
   * @description add a style in the default styles
   * @param style the style to add ( including open and close style tag / link tag for cdn or paths )
   */
  addDefaultStyle( style: string ){
    if( this.JSON_COMMON_INFORMATIONS.styles.includes( style ) ) return;
    this.JSON_COMMON_INFORMATIONS.styles.push( style );
    this.saveCommonInformationsJson();
  }
  setDefaultStyles( styles: string[] ) {
    this.JSON_COMMON_INFORMATIONS.styles = styles;
    this.saveCommonInformationsJson();
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
  public saveCommonInformationsJson(): void {
    FileWriter.writeFile(
      this.JSON_COMMON_INFORMATIONS_FILE_PATH,
      JSON.stringify(this.JSON_COMMON_INFORMATIONS)
    );
  }
  /**
   * @description get the absolute path to the main file of the view
   */
  public getPath(): string {
    return StringComposeWriter.concatenatePaths(
      this.VIEWS_FOLDER,
      this.getFileName()
    );
  }
  /**
   * @description get the name of the view
   */
  public getName(): string {
    return this.JSON_INFORMATIONS.view.name;
  }
  /**
   * @description set the name of the view
   * @param name 
   */
  public setName(name: string) {
    this.JSON_INFORMATIONS.view.name = name;
  }
  public getProjectPath(): string{
    return this.VIEWS_FOLDER;
  }
  /**
   * @description get the extension of the view
   */
  public getExtension(): extensions {
    return checkMapProjectTypeToExtension(this.JSON_INFORMATIONS.view.projectType);
  }
  /**
   * @description set the project type of the view
   * @param type 
   */
  public setProjectType(type: ProjectTypes) {
    this.JSON_INFORMATIONS.view.projectType = type;
  }
  /**
   * @description get the project type of the view
   */
  public getProjectType(): ProjectTypes {
    return this.JSON_INFORMATIONS.view.projectType;
  }
  /**
   * @description returns the view file name ( not the path ) 
   */
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
  public getBlocksNames(): string[] {
    return Object.keys(this.JSON_INFORMATIONS.blocks);
  }
  /**
   * @description returns the blocks object of the view
   */
  public getBlocks(): informationsJson["blocks"] {
    return JSON.parse(JSON.stringify(this.JSON_INFORMATIONS.blocks)); 
  }
  /**
   * @description set the blocks object to the view with the passed one
   * @param newBlocks 
   */
  public setBlocks( newBlocks: informationsJson["blocks"] ): void {
    this.JSON_INFORMATIONS.blocks = newBlocks;
    this.saveJson();
  }

  public reCreate(): void {

    this.create(true);
    let blocks = this.getBlocks();
    this.reCreateBlocksRecursive(
      blocks,
      ConstViews.CommonBaseBlock
    );

  }
  /**
   * 
   * @param blocks the blocks object of this.JSON_INFORMATIONS.
   * @param currentBlock the block to analize
   * @param blockInfo informations of the custom block to add 
   * @param blockInfo.parentBlockName the parent of the block the create
   * @param blockInfo.blockName the name of the block
   * @param blockInfo.open how the block start
   * @param blockInfo.close how the block end
   */
  private reCreateBlocksRecursive(
    blocks: informationsJson["blocks"], 
    currentBlock: string, 
    blockInfo?: addBlockParams
     ): void {
    // if the current block is also inside in another block it should have the data-path attribute
    if ( blockInfo ) {
      this.buildAddBlock(blockInfo);
    } 
    for ( let pathToInclude of blocks[currentBlock].include ){
      if( Identifiers.checkCommentIdentifier(pathToInclude) ){
        let blockToAddName = Identifiers.getIdentifierTypeName(pathToInclude)[1];
        this.reCreateBlocksRecursive(
          blocks, 
          blockToAddName, 
          {
            parentBlockName: currentBlock,
            blockName: blockToAddName,
            open: blocks[blockToAddName].open,
            close: blocks[blockToAddName].close,
          }
        );
      } else {
        this.buildIncludeRelative(currentBlock, new Visual( this.PROJECT.getVisualsPath(), {name: pathToInclude} ));
      }
    }
  }

  /**
   * @description create the single/template and populate it's header/footer with the default ones
   * @param continueIfAlreadyExists if set to true the create method doesn't throw an error if the view already exists
   *  
   */
  public create( continueIfAlreadyExists: boolean = false): void {
    if (this.isCreated() && !continueIfAlreadyExists) {
      throw new Error(this.ERR_VIEW_ALREADY_EXISTS);
    }
    let defaultContent: string = this.getDefaultBuild();
    let params: replaceAllParams = {};
    params[this.IDENTIFIER_PLACEHOLDER_PAGE_NAME] = this.PAGE_NAME;
    params[this.IDENTIFIER_PLACEHOLDER_PAGE_START] = this.getViewStart();
    params[this.IDENTIFIER_PLACEHOLDER_PAGE_END] = this.getViewEnd();
    params[this.IDENTIFIER_PLACEHOLDER_DEFAULT_SCRIPTS] = this.getDefaultScripts();
    params[this.IDENTIFIER_PLACEHOLDER_DEFAULT_STYLES] = this.getDefaultStyles();

    let newContent: string = defaultContent;
    newContent = Identifiers.replaceAllIdentifiersPlaceholders(
      newContent,
      params
    );
    newContent = this.populateScripts( newContent );
    newContent = this.populateStyles( newContent );
    this.setName(this.PAGE_NAME);
    FileWriter.writeFile(
      this.JSON_FILE_PATH,
      JSON.stringify(this.JSON_INFORMATIONS)
    );
    FileWriter.writeFile(this.getPath(), newContent);
    this.saveJson();
  }

  /**
   * @description build and include the passed path inside the paren block **and saves it into the view's json**
   * @param parentBlockName
   * @param path
   */
  public includeRelative(parentBlockName: string, visual: Visual): void {
    if (!this.isCreated()) throw new Error(this.ERR_VIEW_NOT_CREATED);
    if( this.JSON_INFORMATIONS.blocks[parentBlockName].include.includes(visual.getName()) ) return;
    this.buildIncludeRelative(parentBlockName, visual);
    this.JSON_INFORMATIONS.blocks[parentBlockName].include.push(visual.getName());
    this.saveJson();
  }
  /**
   * @description include the given path in the block identified by the passed parentBlockName **without** saving it into the view's json
   * - for save it also in the json call this.includeRelative()
   * @param parentBlockName
   * @param path
   */
  public buildIncludeRelative(parentBlockName: string, visual: Visual): void {
    if( !visual.isCreated() ) throw new Error(this.ERR_VISUAL_NO_EXISTS);

    if (!Object.keys(this.JSON_INFORMATIONS.blocks).includes(parentBlockName))
      throw new Error(this.ERR_NOT_VALID_HTML_BLOCK);
    StringComposeWriter.appendBeetweenStrings(
      this.getPath(),
      this.getIncludeFunction(visual.getRenderFilePath().replace( this.PROJECT.getPath(), "")), // parse path
      IdentifierHtml.getIdentifierPairHtmlComment(parentBlockName)[0],
      IdentifierHtml.getIdentifierPairHtmlComment(parentBlockName)[1]
    );
  }

  /**
   * @description add a block in the template/single ( like the BODY block  ) **and saves it into the view's json**
   * - a block starts and ends with an _HTML comment identifier_
   * @param blockInfo.parentBlockName the parent of the block the create
   * @param blockInfo.blockName the name of the block
   * @param blockInfo.open how the block start
   * @param blockInfo.close how the block end
   * @param addToJson true if the include has also to be stored in the json, _duafult: true_
   */
  public addBlock(blockInfo: addBlockParams): void {
    
    if (!this.isCreated()) { throw new Error(this.ERR_VIEW_NOT_CREATED); }
    
    this.buildAddBlock(blockInfo);
    this.JSON_INFORMATIONS.blocks[blockInfo.parentBlockName].include.push(
      IdentifierHtml.getIdentifier(blockInfo.blockName)
    );
    blockInfo.open = blockInfo.open ? blockInfo.open : "";
    blockInfo.close = blockInfo.close ? blockInfo.close : "";
    this.JSON_INFORMATIONS.blocks[blockInfo.blockName] = {
      open: blockInfo.open,
      close: blockInfo.close,
      include: [],
    };
    this.saveJson();
   
    
  }
  /**
   * @description add a block in the view ( like the BODY block  ) **without** saving it into the view's json
   * - a block starts and ends with an _HTML comment identifier_
   * - for save it also in the json call this.addBlock()
   * @param blockInfo.parentBlockName the parent of the block the create
   * @param blockInfo.blockName the name of the block
   * @param blockInfo.open how the block start
   * @param blockInfo.close how the block end
   * @param addToJson true if the include has also to be stored in the json, _duafult: true_
   */
  public buildAddBlock(blockInfo: addBlockParams): void {
    if (
      !Object.keys(this.JSON_INFORMATIONS.blocks).includes(
        blockInfo.parentBlockName
      )
    ) { throw new Error(this.ERR_NOT_VALID_HTML_BLOCK); }
    blockInfo.open = blockInfo.open ? blockInfo.open : "";
    blockInfo.close = blockInfo.close ? blockInfo.close : "";

    let toAdd = `
${blockInfo.open}
${IdentifierHtml.getIdentifierPairHtmlComment(blockInfo.blockName)[0]}   
${IdentifierHtml.getIdentifierPairHtmlComment(blockInfo.blockName)[1]}
${blockInfo.close}
`;
    StringComposeWriter.appendBeetweenStrings(
      this.getPath(),
      toAdd,
      IdentifierHtml.getIdentifierPairHtmlComment(blockInfo.parentBlockName)[0],
      IdentifierHtml.getIdentifierPairHtmlComment(blockInfo.parentBlockName)[1]
    );
    StringComposeWriter.makePretty(this.getPath());
  }

  public populateScripts( text: string ): string{
    let scripts = [ 
      ...this.PROJECT.depManager.getAllLibCdnScripts(), 
      ...this.PROJECT.depManager.getAllLibScripts(),
      ...this.PROJECT.depManager.getScripts(),
      ...this.PROJECT.depManager.getVisualsScripts()
    ]
    for ( let i = 0; i < scripts.length; i++){
      scripts[i] = `<script type="module" src="${scripts[i]}" ></script>`
    }
    let tagStart = `
      <div 
      id="${ConstViews.IdentifierScripts}" 
      data-action="${identifierActions.EXECUTABLE}" 
      data-type="${identifierType.PLACEHOLDER}" 
      data-name="${ConstViews.IdentifierScripts}" 
      >`;
    tagStart = tagStart.replace(/\n/g,' '); // removes the \n chars
    tagStart = tagStart.replace(/[ \t]+/g,' '); // convert sequences of white spaces to a single white space
    
    let tagEnd = `</div>`;
    let finalBlock = tagStart + scripts.join('\n') + tagEnd;
    return text.replace(
      IdentifierPlaceholder.getIdentifierWithAction(ConstViews.IdentifierScripts, identifierActions.EXECUTABLE),
      finalBlock
    )
  } 
  public populateStyles( text: string ): string{
    let styles = [ 
      ...this.PROJECT.depManager.getAllLibCdnStyles(), 
      ...this.PROJECT.depManager.getAllLibStyles(),
      ...this.PROJECT.depManager.getStyles(),
      ...this.PROJECT.depManager.getVisualsStyles()
    ]
    for ( let i = 0; i < styles.length; i++){
      styles[i] = `<link rel="stylesheet" href="${styles[i]}">`
    }
    let tagStart = `
      <div 
      id="${ConstViews.IdentifierScripts}" 
      data-action="${identifierActions.EXECUTABLE}" 
      data-type="${identifierType.PLACEHOLDER}" 
      data-name="${ConstViews.IdentifierScripts}" 
      >`;
    tagStart = tagStart.replace(/\n/g,' '); // removes the \n chars
    tagStart = tagStart.replace(/[ \t]+/g,' '); // conver sequences of white spaces to a single white space

    let tagEnd = `</div>`;
    let finalBlock = tagStart + styles.join('\n') + tagEnd;
    return text.replace(
      IdentifierPlaceholder.getIdentifierWithAction(ConstViews.IdentifierStyles, identifierActions.EXECUTABLE),
      finalBlock
    )
  }
}
