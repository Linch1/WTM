import { FileReader } from "../files/FileReader";
import { StringComposeReader } from "../files/StringComposeReader";
import { StringComposeWriter } from "../files/StringComposeWriter";
import { visualJson } from "../Types/manageVisual.jsons";
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

  public readonly ASSETS_RELATIVE_PATH: string = ConstVisuals.visualsAssetsDirectory;
  public readonly STYLES_RELATIVE_PATH: string = StringComposeWriter.concatenatePaths(
    ConstVisuals.visualsAssetsDirectory,
    ConstVisuals.visualsAssetsCssDirectory
  );
  public readonly LIB_RELATIVE_PATH: string = StringComposeWriter.concatenatePaths(
    ConstVisuals.visualsAssetsDirectory,
    ConstVisuals.visualsAssetsLibDirectory
  );
  public readonly SCRIPTS_RELATIVE_PATH: string = StringComposeWriter.concatenatePaths(
    ConstVisuals.visualsAssetsDirectory,
    ConstVisuals.visualsAssetsJsDirectory
  );;
  public readonly JSON_FILE_NAME: string = ConstVisuals.visualsJsonFile;
  public readonly HTML_DEFAULT_FILE_NAME: string  = ConstVisuals.visualsHtmlDefaultFileName;
  public readonly HTML_RENDERED_FILE_NAME: string  = ConstVisuals.visualsHtmlRenderFileName;

  public readonly RENDER_FILE_PATH: string;
  public readonly DEFAULT_FILE_PATH: string;
  public readonly ASSETS_PATH: string;
  public readonly STYLES_PATH: string;
  public readonly SCRIPTS_PATH: string;
  public readonly LIB_PATH: string;

  public readonly VISUAL_FOLDER: string;

  public readonly INIT_RENDER_FILE_CONTENT: string = ConstVisuals.visualsHtmlRenderContent;
  public readonly INIT_DEFAULT_FILE_CONTENT: string = ConstVisuals.visualsHtmlDefaultContent;

  public readonly JSON_FILE_PATH: string;
  public JSON_FILE_CONTENT: visualJson = ConstVisuals.getVisualsJsonContent();

  /**
   * @description create a visual with the given informations
   * @param VISUALS_FOLDER the path to the visuals folder
   * @param VISUAL_NAME the name of the visual to create
   * @param projectType the typo of the project where the visual will be included
   */
  constructor(public VISUALS_FOLDER: string, public VISUAL_NAME: string, projectType: ProjectTypes = ProjectTypes.html) {
    
    this.VISUAL_FOLDER = StringComposeWriter.concatenatePaths(this.VISUALS_FOLDER, this.VISUAL_NAME);
    this.JSON_FILE_CONTENT.visual.name = this.VISUAL_NAME;
    this.JSON_FILE_CONTENT.visual.projectType = projectType as ProjectTypes;
    this.JSON_FILE_PATH = StringComposeWriter.concatenatePaths(
      this.getDirPath(),
      this.JSON_FILE_NAME
    );
    if( !FileReader.existsPath(this.JSON_FILE_PATH) && !projectType ){
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
    this.LIB_PATH = StringComposeWriter.concatenatePaths(
      this.getDirPath(),
      this.LIB_RELATIVE_PATH
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
  public getStylesDirPath(): string {
    return this.STYLES_PATH;
  }
  /**
   * @description get the visual lib folder path 
   */
  public getLibDirPath(): string {
    return this.LIB_PATH;
  }
  /**
   * @description get the path to the directory of an element added in the visual lib
   * @param libElemName the name of the element inside the lib
   */
  public getLibElemDirPath(libElemName: string): string {
    return StringComposeWriter.concatenatePaths(this.LIB_PATH, libElemName);
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
   * @description get the visual scripts folder path
   */
  public getScriptsDirPath(): string {
    return this.SCRIPTS_PATH;
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
