import { FileReader } from "../files/FileReader";
import { StringComposeReader } from "../files/StringComposeReader";
import { StringComposeWriter } from "../files/StringComposeWriter";
import { visualJson, visualJsonScheletonAsParam } from "../Types/manageVisual.jsons";
import { extensions, ProjectTypes } from "../Enums";
import { checkMapProjectTypeToExtension } from "../Checkers/check.mapProjectTypeToExtension";
import { ConstVisuals } from "../Constants/const.visuals";


export abstract class AbstractGeneralVisual {
  public readonly ERR_VISUAL_ALREADY_EXISTS = "ERR: The visual already exists";
  public readonly ERR_CANNOT_GET_VISUAL_NAME =
    "ERR: Cannot retrive the visual name from the given path";
  public readonly ERR_VISUAL_NOT_CREATED =
    "ERR: Before calling this method create the visual with the myVisual.writer.createVisual() method";
  public readonly WERR_NO_PROJECT_TYPE_PROVIDED = "Please provide the visual project type. If not provided it means that the visual already exists and it can be take from it's json, in this case the visual doesn't exists so this cannot be done."

  public readonly ASSETS_RELATIVE_PATH: string = ConstVisuals.AssetsDirectory;
  public readonly STYLES_RELATIVE_PATH: string = StringComposeWriter.concatenatePaths(
    ConstVisuals.AssetsDirectory,
    ConstVisuals.AssetsCssDirectory
  );
  public readonly IMG_RELATIVE_PATH: string = StringComposeWriter.concatenatePaths(
    ConstVisuals.AssetsDirectory,
    ConstVisuals.AssetsImgDirectory
  );
  public readonly SCRIPTS_RELATIVE_PATH: string = StringComposeWriter.concatenatePaths(
    ConstVisuals.AssetsDirectory,
    ConstVisuals.AssetsJsDirectory
  );;
  public readonly JSON_FILE_NAME: string = ConstVisuals.JsonFile;
  public readonly HTML_DEFAULT_FILE_NAME: string  = ConstVisuals.HtmlDefaultFileName;
  public readonly HTML_RENDERED_FILE_NAME: string  = ConstVisuals.HtmlRenderFileName;

  public readonly RENDER_FILE_PATH: string;
  public readonly DEFAULT_FILE_PATH: string;
  public readonly ASSETS_PATH: string;
  public readonly STYLES_PATH: string;
  public readonly SCRIPTS_PATH: string;
  public readonly IMG_PATH: string;

  public readonly VISUAL_FOLDER: string;

  public readonly INIT_RENDER_FILE_CONTENT: string = ConstVisuals.HtmlRenderContent;
  public readonly INIT_DEFAULT_FILE_CONTENT: string = ConstVisuals.HtmlDefaultContent;

  public readonly JSON_FILE_PATH: string;
  public JSON_FILE_CONTENT: visualJson = ConstVisuals.getVisualsJsonContent();

  /**
   * @description create a visual with the given informations
   * @param VISUALS_FOLDER the path to the visuals folder
   * @param VISUAL_NAME the name of the visual to create
   * @param projectType the typo of the project where the visual will be included
   */
  constructor(public VISUALS_FOLDER: string, public VISUAL_SCHELETON: visualJsonScheletonAsParam) {
    
    if( !this.VISUAL_SCHELETON.projectType ) this.VISUAL_SCHELETON.projectType = ProjectTypes.html;
    if( !this.VISUAL_SCHELETON.author ) this.VISUAL_SCHELETON.author = "";
    if( !this.VISUAL_SCHELETON.authorUrl ) this.VISUAL_SCHELETON.authorUrl = "";
    if( !this.VISUAL_SCHELETON.githubRepo ) this.VISUAL_SCHELETON.githubRepo = "";
    if( !this.VISUAL_SCHELETON.assetsAutoImport ) this.VISUAL_SCHELETON.assetsAutoImport = false;
    //@ts-ignore the properties will be always defined, this error is skippable
    this.JSON_FILE_CONTENT.visual = this.VISUAL_SCHELETON;

    this.VISUAL_FOLDER = StringComposeWriter.concatenatePaths(this.VISUALS_FOLDER, this.getName());
    
    this.JSON_FILE_PATH = StringComposeWriter.concatenatePaths(
      this.getDirPath(),
      this.JSON_FILE_NAME
    );
    if( !FileReader.existsPath(this.JSON_FILE_PATH) && !this.getProjectType() ){
      throw new Error(this.WERR_NO_PROJECT_TYPE_PROVIDED);
    }

    this.init();
    this.RENDER_FILE_PATH = StringComposeWriter.concatenatePaths(
      this.getDirPath(),
      this.HTML_RENDERED_FILE_NAME + "." + this.getExtension()
    );
    this.DEFAULT_FILE_PATH = StringComposeWriter.concatenatePaths(
      this.getDirPath(),
      this.HTML_DEFAULT_FILE_NAME + "." + this.getExtension()
    );
    this.ASSETS_PATH = StringComposeWriter.concatenatePaths(
      this.getDirPath(),
      this.ASSETS_RELATIVE_PATH
    );
    this.SCRIPTS_PATH = StringComposeWriter.concatenatePaths(
      this.getDirPath(),
      this.SCRIPTS_RELATIVE_PATH
    );
    this.IMG_PATH = StringComposeWriter.concatenatePaths(
      this.getDirPath(),
      this.IMG_RELATIVE_PATH
    );
    this.STYLES_PATH = StringComposeWriter.concatenatePaths(
      this.getDirPath(),
      this.STYLES_RELATIVE_PATH
    );
    
  }

  /**
   * @description returns true if the current visual was created
   */
  public isCreated(): boolean{
    return FileReader.existsPath(this.getDirPath());
  }

  public init(){
    if(FileReader.existsPath(this.JSON_FILE_PATH)){
      this.JSON_FILE_CONTENT = JSON.parse(FileReader.readFile(this.JSON_FILE_PATH));
    }
  }

  /**
   * @description get the visual name 
   */
  public getName(): string {
    return this.JSON_FILE_CONTENT.visual.name;
  }
  /**
   * @description return if the visual has to auto import the assets
   */
  public getAssetsAutoImport(): boolean{
    return this.JSON_FILE_CONTENT.visual.assetsAutoImport;
  }
  /**
   * @description get the visual project type
   */
  public getProjectType(): ProjectTypes {
    return this.JSON_FILE_CONTENT.visual.projectType;
  }
  /**
   * @description get the visual extension
   */
  public getExtension(): extensions {
    return checkMapProjectTypeToExtension(this.JSON_FILE_CONTENT.visual.projectType);
  }
  /**
   * @description get the visual assets folder path
   */
  public getAssetsDirPath(): string {
    return this.ASSETS_PATH;
  }
  /**
   * @description get the visual styles folder path
   */
  public getAssetsCssDirPath(): string {
    return this.STYLES_PATH;
  }
  public getAssetsAllCssFilesPaths(): string[] {
    let cssFiles = FileReader.folderTreePaths( FileReader.readFolderTree( this.getAssetsCssDirPath() ) );
    let parsedFiles: string[] = [];
    for ( let file of cssFiles ){
      file = file.replace( this.getAssetsCssDirPath(), "");
      parsedFiles.push(file) 
    }
    return parsedFiles;
  }
  /**
   * @description get the visual scripts folder path
   */
  public getAssetsJsDirPath(): string {
    return this.SCRIPTS_PATH;
  }
  public getAssetsAllJsFilesPaths(): string[] {
    let jsFiles = FileReader.folderTreePaths( FileReader.readFolderTree( this.getAssetsJsDirPath() ) );
    let parsedFiles: string[] = [];
    for ( let file of jsFiles ){
      file = file.replace( this.getAssetsJsDirPath(), "");
      parsedFiles.push(file) 
    }
    return parsedFiles;
  }
  /**
   * @description get the visual lib folder path 
   */
  public getAssetsImgDirPath(): string {
    return this.IMG_PATH;
  }
  /**
   * @description get the lib dependencies of the current visual
   */
  public getLibDependencies(){
    return this.JSON_FILE_CONTENT.lib;
  }
  /**
   * @description return the current visual styles dependencies
   */
  public getStylesDependencies(): string[]{
    return this.JSON_FILE_CONTENT.dependencies.styles;
  }
  
  /**
   * @description return the current visual scripts dependencies
   */
  public getScriptsDependencies(): string[]{
    return this.JSON_FILE_CONTENT.dependencies.scripts;
  }
  /**
   * @description returns the path to the visual folder
   */
  public getDirPath(): string {
    return StringComposeWriter.concatenatePaths(this.VISUAL_FOLDER, this.getProjectType());
  }
  /**
   * @description return the path of the visuals directory
   */
  public getVisualsPath(): string {
    return this.VISUALS_FOLDER; // returns the path to the visuals directory
  }
  /**
   * @description return the abs path of the visual default file
   */
  public getDefaultFilePath(): string{
    return this.DEFAULT_FILE_PATH;
  }
  /**
   * @description return the abs path of the visual render file
   */
  public getRenderFilePath(): string{
    return this.RENDER_FILE_PATH;
  }
  /**
   * @description return the name of the render file ( _without the extension_ )
   */
  public getRenderFileName(): string{
    return this.HTML_RENDERED_FILE_NAME;
  }
  /**
   * @description get the text contained in the _default.**_ file
   */
  public getHtmlDefault(): string{
    return FileReader.readFile(this.DEFAULT_FILE_PATH);
  }
  /**
   * @description get the text contained in the _render.**_ file
   */
  public getHtmlRender(): string{
    return FileReader.readFile(this.RENDER_FILE_PATH);
  }

}
