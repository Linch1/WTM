import { ConstViews } from "../Constants/const.views";
import { ProjectTypes } from "../Enums/common.projectTypes";
import { FileWriter } from "../ManageFiles/FileWriter";
import { IdentifierHtml } from "../Identifiers/IdentifierHtml";
import { Identifiers } from "../Identifiers/Identifiers";
import { Visual } from "../ManageVisual/Visual";
import { viewJson } from "../Types/entity.rendering.jsons";
import { addBlockParams } from "../Types/entity.rendering.params.addBlock";
import { replaceAllParams } from "../Types/files.StringComposerWriter";
import { View } from "./View";

export class ViewWriter {


  constructor(public view: View) {}


  setViewStart(newOne: string) {
    this.view.JSON_COMMON_INFORMATIONS.viewStart = newOne;
    this.saveCommonInformationsJson();
  }
  /**
   * @description set the name of the view
   * @param name 
   */
   public setName(name: string) {
    this.view.JSON_FILE_CONTENT.name = name;
  }
  setViewEnd(newOne: string) {
    this.view.JSON_COMMON_INFORMATIONS.viewEnd = newOne;
    this.saveCommonInformationsJson();
  }
  /**
   * @description set the project type of the view
   * @param type 
   */
   public setProjectType(type: ProjectTypes) {
    this.view.JSON_FILE_CONTENT.projectType = type;
  }
  setDefaultScripts(scripts: string[]) {
    this.view.JSON_COMMON_INFORMATIONS.scripts = scripts;
    this.saveCommonInformationsJson();
  }
  /**
   * @description set the blocks object to the view with the passed one
   * @param newBlocks 
   */
   public setBlocks( newBlocks: viewJson["blocks"] ): void {
    this.view.JSON_FILE_CONTENT.blocks = newBlocks;
    this.saveJson();
  }
  /**
   * @description add a script in the default scripts
   * @param script the script to add ( including open and close script tag )
   */
  addDefaultScript(script: string) {
    if (this.view.JSON_COMMON_INFORMATIONS.scripts.includes(script)) return;
    this.view.JSON_COMMON_INFORMATIONS.scripts.push(script);
    this.saveCommonInformationsJson();
  }
  setDefaultStyles(styles: string[]) {
    this.view.JSON_COMMON_INFORMATIONS.styles = styles;
    this.saveCommonInformationsJson();
  }
  /**
   * @description add a style in the default styles
   * @param style the style to add ( including open and close style tag / link tag for cdn or paths )
   */
  addDefaultStyle(style: string) {
    if (this.view.JSON_COMMON_INFORMATIONS.styles.includes(style)) return;
    this.view.JSON_COMMON_INFORMATIONS.styles.push(style);
    this.saveCommonInformationsJson();
  }
  /**
   * @description save the informations of the single/template
   * - the function also **creates it if not exists**
   */
  public saveJson(): void {
    FileWriter.writeFile(
      this.view.reader.getPathJson(),
      JSON.stringify(this.view.JSON_FILE_CONTENT)
    );
  }
  public saveCommonInformationsJson(): void {
    FileWriter.writeFile(
      this.view.JSON_COMMON_INFORMATIONS_FILE_PATH,
      JSON.stringify(this.view.JSON_COMMON_INFORMATIONS)
    );
  }
  /**
   * @description delete the all the relative files
   */
  public delete(): void {
    FileWriter.removeFile(this.view.reader.getPath());
    FileWriter.removeFile(this.view.reader.getPathJson());
  }
  public setJson( json: viewJson ){
    this.view.JSON_FILE_CONTENT = json;
    this.saveJson();
  }

  /**
   * @description recreates the view. It prevent recreation and raises an error if the included visuals doesn't exists
   */
   public reCreate(): void {
    // check that the visuals exists before recreate ( and possible breaking ) the visual
    this.view.reader.checkIfIncludedVisualsExists();
    // starts the recreation
    this.create(true);
    let blocks = this.view.reader.getBlocks();
    this.reCreateBlocksRecursive(
      blocks,
      ConstViews.CommonBaseBlock
    );
  }
  /**
   * 
   * @param blocks the blocks object of this.JSON_FILE_CONTENT.
   * @param currentBlock the block to analize
   * @param blockInfo informations of the custom block to add 
   * @param blockInfo.parentBlockName the parent of the block the create
   * @param blockInfo.blockName the name of the block
   * @param blockInfo.open how the block start
   * @param blockInfo.close how the block end
   */
   private reCreateBlocksRecursive(
    blocks: viewJson["blocks"], 
    currentBlock: string, 
    blockInfo?: addBlockParams
     ): void {
    // if the current block is also inside in another block it should have the data-path attribute
    if ( blockInfo ) {
      this.view.render.buildAddBlock(blockInfo);
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
        let visual = new Visual( this.view.PROJECT.reader.getVisualsPath(), {name: pathToInclude, projectType: this.view.reader.getProjectType()} ).reader.getVisualFiltered();
        //@ts-ignore the check that the visual is not undefined is done in this.reCreate()
        this.buildIncludeRelative(currentBlock, visual);
      }
    }
  }
  /**
   * @description create the single/template and populate it's header/footer with the default ones
   * @param continueIfAlreadyExists if set to true the create method doesn't throw an error if the view already exists
   *  
   */
   public create( continueIfAlreadyExists: boolean = false): void {
    if (this.view.reader.isCreated() && !continueIfAlreadyExists) {
      throw new Error(this.view.ERR_VIEW_ALREADY_EXISTS);
    }
    let defaultContent: string = this.view.reader.getDefaultBuild();
    let params: replaceAllParams = {};
    params[this.view.IDENTIFIER_PLACEHOLDER_PAGE_NAME] = this.view.VIEW_NAME;
    params[this.view.IDENTIFIER_PLACEHOLDER_PAGE_START] = this.view.reader.getViewStart();
    params[this.view.IDENTIFIER_PLACEHOLDER_PAGE_END] = this.view.reader.getViewEnd();
    params[this.view.IDENTIFIER_PLACEHOLDER_DEFAULT_SCRIPTS] = this.view.reader.getDefaultScripts();
    params[this.view.IDENTIFIER_PLACEHOLDER_DEFAULT_STYLES] = this.view.reader.getDefaultStyles();

    let newContent: string = defaultContent;
    newContent = Identifiers.replaceAllIdentifiersPlaceholders(
      newContent,
      params
    );
    newContent = this.view.render.populateScripts( newContent );
    newContent = this.view.render.populateStyles( newContent );
    this.setName(this.view.VIEW_NAME);
    FileWriter.writeFile(
      this.view.JSON_FILE_PATH,
      JSON.stringify(this.view.JSON_FILE_CONTENT)
    );
    FileWriter.writeFile(this.view.reader.getPath(), newContent);
    this.saveJson();
  }


  /**
   * @description build and include the passed path inside the paren block **and saves it into the view's json**
   * @param parentBlockName
   * @param path
   */
   public includeRelative(parentBlockName: string, visual: Visual): void {
    if (!this.view.reader.isCreated()) throw new Error(this.view.ERR_VIEW_NOT_CREATED);
    if( this.view.JSON_FILE_CONTENT.blocks[parentBlockName].include.includes(visual.reader.getName()) ) return;
    this.view.render.buildIncludeRelative(parentBlockName, visual);
    this.view.JSON_FILE_CONTENT.blocks[parentBlockName].include.push(visual.reader.getName());
    this.saveJson();
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
    if (!this.view.reader.isCreated()) { throw new Error(this.view.ERR_VIEW_NOT_CREATED); }
    
    this.view.render.buildAddBlock(blockInfo);
    this.view.JSON_FILE_CONTENT.blocks[blockInfo.parentBlockName].include.push(
      IdentifierHtml.getIdentifier(blockInfo.blockName)
    );
    blockInfo.open = blockInfo.open ? blockInfo.open : "";
    blockInfo.close = blockInfo.close ? blockInfo.close : "";
    this.view.JSON_FILE_CONTENT.blocks[blockInfo.blockName] = {
      open: blockInfo.open,
      close: blockInfo.close,
      include: [],
    };
    this.saveJson();
  }

   

}
