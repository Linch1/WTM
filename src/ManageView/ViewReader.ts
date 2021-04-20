
import { ConstViews } from "../Constants/const.views";
import { extensions } from "../Enums/common.extension";
import { IncludeFunctions } from "../Enums/common.includeFunctions";
import { ProjectTypes } from "../Enums/common.projectTypes";
import { FileReader, StringComposeReader } from "../ManageFiles";
import { StringComposeWriter } from "../ManageFiles/StringComposeWriter";
import { Identifiers } from "../Identifiers/Identifiers";
import { Visual } from "../ManageVisual/Visual";
import { viewJson } from "../Types/entity.rendering.jsons";
import { View } from "./View";
import { Checker } from "../Checkers/Checker";

export class ViewReader {

    constructor(public view: View) {}

    /**
     * @description get the default content to add in all the newly created views,
     * it is taken from inside the file: this.COMMON_DEFAULT_BUILD_FILE_PATH
     */
    getDefaultBuild(): string {
        return this.view.COMMON_DEFAULT_BUILD;
    }
    /**
     * @description get the common viewStart ( it is inside the this.JSON_COMMON_INFORMATIONS_FILE_PATH)
     */
    getViewStart(): string {
        return this.view.JSON_COMMON_INFORMATIONS.viewStart;
    }
  /**
   * @description get the common viewEnd ( it is inside the this.JSON_COMMON_INFORMATIONS_FILE_PATH)
   */
   getViewEnd(): string {
    return this.view.JSON_COMMON_INFORMATIONS.viewEnd;
  }
  getDefaultScripts(): string {
    return this.view.JSON_COMMON_INFORMATIONS.scripts.join('\n');
  }
  getDefaultStyles(): string {
    return this.view.JSON_COMMON_INFORMATIONS.styles.join('\n');
  }
  /**
   * @description returns the blocks object of the view
   */
   public getBlocks(): viewJson["blocks"] {
    return JSON.parse(JSON.stringify(this.view.JSON_FILE_CONTENT.blocks)); 
  }
  /**
   * @description get the name of the view
   */
   public getName(): string {
    return this.view.JSON_FILE_CONTENT.name;
  }
  /**
   * @description get the existing view blocks
   */
   public getBlocksNames(): string[] {
    return Object.keys(this.view.JSON_FILE_CONTENT.blocks);
  }
  /**
   * @description get the absolute path to the json file of the single/template
   */
   public getPathJson(): string {
    return this.view.JSON_FILE_PATH;
  }
  /**
   * @description returns the view file name ( not the path ) 
   */
   public getFileName(): string {
    return (
      this.view.PAGE_PREFIX +
      this.getName().toLocaleLowerCase().split(" ").join("-") + '.' + 
      this.getExtension()
    );
  }

  /**
   * @description get the view prefix ( default: "view-" )
   * @returns 
   */
  public getViewPrefix(): string { 
    return this.view.PAGE_PREFIX;
  }

  /**
   * @description get the project type of the view
   */
   public getProjectType(): ProjectTypes {
    return this.view.JSON_FILE_CONTENT.projectType;
  }
  public getProjectPath(): string{
    return this.view.VIEWS_FOLDER;
  }
  /**
   * @description get the extension of the view
   */
   public getExtension(): extensions {
    return Checker.checkMapProjectTypeToExtension(this.view.JSON_FILE_CONTENT.projectType);
  }
  /**
   * @description get the json that contains the default values for intialize a newly created view json
   * @returns 
   */
   static getDefaultJson(): viewJson  {
    return ConstViews.getViewsJsonContent()
  }
  public getJson(){
    return this.view.JSON_FILE_CONTENT;
  }
  /**
   * @description get the absolute path to the main file of the view
   */
   public getPath(): string {
    return StringComposeWriter.concatenatePaths(
      this.view.VIEWS_FOLDER,
      this.getFileName()
    );
  }
  /**
   * @description get the keys of the json that contains default values for intialize a visual
   * @returns 
   */
   static getDefaultJsonKeys(): string[]{
    return Object.keys(ConstViews.getViewsJsonContent());
  }
  /**
   * @description check if the current view is yet created or not, return true if it is created;
   */
   public isCreated(): boolean {
    return FileReader.existsPath(this.getPath());
  }

  /**
   * @description analize and returns the correcct path to include when adding the visual to a view
   * @param visual the visualthat will be included in the view
   * @returns the path to include in the view
   */
   public getVisualPathToInclude( visual: Visual ): string{
    let pathToRenderFile = visual.reader.getRenderFilePath() 
    let renderFileName = StringComposeReader.getPathLastElem(pathToRenderFile);
    let relativePathFromCurrentViewToRenderFile = StringComposeWriter.relativePath(
      this.getPath(),
      pathToRenderFile
    );
    let pathToInclude;
    if( this.getProjectType() == ProjectTypes.html ){
      // use relative path if the project is html
      pathToInclude = StringComposeWriter.concatenatePaths(relativePathFromCurrentViewToRenderFile, renderFileName);
    } else {
      // else in the when includeed the variable containing the path to the folder will be concatenated to the path
      // ex: <?php include(TEMPLATEPATH.'${path}');?>
      pathToInclude = pathToRenderFile.replace( visual.reader.getProjectPath(), "" );
      pathToInclude = pathToInclude.startsWith('/') ? pathToInclude : '/' + pathToInclude;
      if( !IncludeFunctions.include(pathToInclude, this.getProjectType() ).includes(IncludeFunctions.TEMPLATEPATH) )
        throw new Error(this.view.ERR_TYPE_NOT_FOUND)
    }
    return pathToInclude;
  }

  /**
   * @description returns all the included visuals inside the view
   * @returns 
   */
   public getIncludedVisuals(){
    let startBlock = 'BODY';
    return this.getIncludedVisualsRecursive( startBlock );
  }
  public getIncludedVisualsRecursive( currentBlock: string ): string[] {
    let blocks = this.view.JSON_FILE_CONTENT.blocks;
    let visuals: string[] = [];
    for( let included of blocks[currentBlock].include ){
      if( Identifiers.checkCommentIdentifier(included) ) visuals.push( ...this.getIncludedVisualsRecursive( Identifiers.getIdentifierTypeName(included)[1] ) )
      else visuals.push( included );
    }
    return visuals;
  }

  getIncludeFunction(path: string): string {
    return IncludeFunctions.include(path, this.getProjectType());
  }

  /**
   * @description check if all the visuals are created for the current project type or as html ( fallback ), if not this function throws an error.
   */
   public checkIfIncludedVisualsExists(): void{
    // check if all the visuals can be included correctly
    let visualsInsideView = this.getIncludedVisuals();
    for( let visualName of visualsInsideView ){
      let visual = new Visual( 
        this.view.PROJECT.reader.getVisualsPath(), 
        {name: visualName, projectType: this.getProjectType()} 
      ).reader.getVisualFiltered();
      if( !visual ) throw new Error( this.view.ERR_NO_AVIABLE_VISUAL_TO_INCLUDE );
    }
  }

  /**
   * @description returns the correct path to add as source when including the link or script
   * @param styleOrCssPath the path to the css/js ( absolute path or the path starting from inside the project folder )
   * @returns the path to add as the js/css source
   */
   public getStyleOrCssPathToInclude( styleOrCssPath: string ): string{
    let viewPathInsideProject = this.getPath().replace( this.view.PROJECT.reader.getPath(), "" );
    viewPathInsideProject = viewPathInsideProject.startsWith('/') ? viewPathInsideProject : '/' + viewPathInsideProject;
    let fileName = StringComposeReader.getPathLastElem(styleOrCssPath);
    let relativePathFromCurrentViewToScript = StringComposeWriter.relativePath( viewPathInsideProject, styleOrCssPath);
    let projectType = this.getProjectType();
    let newPath: string;
    if( projectType == ProjectTypes.html){
      newPath = StringComposeWriter.concatenatePaths( relativePathFromCurrentViewToScript, fileName );
    } else {
      let styleOrCssPathInsideProject = styleOrCssPath.replace( this.view.PROJECT.reader.getPath(), "" );
      newPath = IncludeFunctions.parsePath(styleOrCssPathInsideProject, projectType);
      if( !(projectType in ProjectTypes) ) { throw new Error( this.view.ERR_TYPE_NOT_FOUND )}
    }
    //@ts-ignore
    return newPath;
  }
}
