import { FileReader } from "../files/FileReader";
import { StringComposeReader } from "../files/StringComposeReader";
import { StringComposeWriter } from "../files/StringComposeWriter";
import { visualJson, visualJsonScheletonAsParam } from "../Types/manageVisual.jsons";
import { extensions, ProjectTypes, renderTypes } from "../Enums";
import { checkMapProjectTypeToExtension } from "../Checkers/check.mapProjectTypeToExtension";
import { ConstVisuals } from "../Constants/const.visuals";
import { FileWriter } from "../files/FileWriter";
import { ConstProjects } from "../Constants/const.projects";
import { VisualReader } from "../ManageVisual/VisualReader";
import { VisualWriter } from "../ManageVisual/VisualWriter";
import { VisualConverter } from "../ManageVisual/VisualConverter";
import { VisualsDependenciesManager } from "../ManageDependencies/VisualsDependenciesManager";


export class Visual {
  public readonly ERR_VISUAL_ALREADY_EXISTS = "ERR: The visual already exists";
  public readonly ERR_EMPTY_PROJECT_PATH = "The path to the project of the current visual is empty on undefined";
  public readonly ERR_CANNOT_GET_VISUAL_NAME =
    "ERR: Cannot retrive the visual name from the given path";
  public readonly ERR_VISUAL_NOT_CREATED =
    "ERR: Before calling this method create the visual with the myVisual.writer.createVisual() method";
  public readonly WERR_NO_PROJECT_TYPE_PROVIDED = "Please provide the visual project type. If not provided it means that the visual already exists and it can be take from it's json, in this case the visual doesn't exists so this cannot be done."

  public depManager: VisualsDependenciesManager;
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
  public readonly ASSETS_STYLES_PATH: string;
  public readonly ASSETS_SCRIPTS_PATH: string;
  public readonly ASSETS_IMG_PATH: string;
  public readonly ASSETS_LIB_PATH: string;

  public readonly VISUAL_FOLDER: string;

  public readonly INIT_RENDER_FILE_CONTENT: string = ConstVisuals.HtmlRenderContent;
  public readonly INIT_DEFAULT_FILE_CONTENT: string = ConstVisuals.HtmlDefaultContent;

  public readonly JSON_FILE_PATH: string;
  public JSON_FILE_CONTENT: visualJson = ConstVisuals.getVisualsJsonContent();


  public reader: VisualReader;
  public writer: VisualWriter;
  public converter: VisualConverter;

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
    if( !this.VISUAL_SCHELETON.projectPath ) this.VISUAL_SCHELETON.projectPath = "";
    
    this.JSON_FILE_CONTENT.projectPath = this.VISUAL_SCHELETON.projectPath;
    this.JSON_FILE_CONTENT.projectType = this.VISUAL_SCHELETON.projectType;
    this.JSON_FILE_CONTENT.author = this.VISUAL_SCHELETON.author;
    this.JSON_FILE_CONTENT.authorUrl = this.VISUAL_SCHELETON.authorUrl;
    this.JSON_FILE_CONTENT.githubRepo = this.VISUAL_SCHELETON.githubRepo;
    this.JSON_FILE_CONTENT.assetsAutoImport = this.VISUAL_SCHELETON.assetsAutoImport;
    this.JSON_FILE_CONTENT.name = this.VISUAL_SCHELETON.name;

    this.VISUAL_FOLDER = StringComposeWriter.concatenatePaths(this.VISUALS_FOLDER, this.getName());
    
    this.JSON_FILE_PATH = StringComposeWriter.concatenatePaths(
      this.getDirPath(), // uses project type
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
    this.ASSETS_SCRIPTS_PATH = StringComposeWriter.concatenatePaths(
      this.getDirPath(),
      this.SCRIPTS_RELATIVE_PATH
    );
    this.ASSETS_IMG_PATH = StringComposeWriter.concatenatePaths(
      this.getDirPath(),
      this.IMG_RELATIVE_PATH
    );
    this.ASSETS_STYLES_PATH = StringComposeWriter.concatenatePaths(
      this.getDirPath(),
      this.STYLES_RELATIVE_PATH
    );
    if ( !this.isCreated() ) this.ASSETS_LIB_PATH = "";
    else this.ASSETS_LIB_PATH = StringComposeWriter.concatenatePaths(
      this.getProjectPath(),
      ConstProjects.projectAssetsDirectory,
      ConstProjects.projectAssetsLibDirectory
    );

    this.reader = new VisualReader(this);
    this.writer = new VisualWriter(this);
    this.converter = new VisualConverter(this);
    this.depManager = new VisualsDependenciesManager(this);

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
    return this.JSON_FILE_CONTENT.name;
  }
  /**
   * @description get the visual project type
   */
  public getProjectType(): ProjectTypes {
    return this.JSON_FILE_CONTENT.projectType;
  }
  /**
   * @description get the path to the project in which the visual is
   */
  public getProjectPath(): string {
    let path = this.JSON_FILE_CONTENT.projectPath;
    if( !path ) throw new Error( this.ERR_EMPTY_PROJECT_PATH )
    return path;
  }
  /**
   * @description get the visual extension
   */
  public getExtension(): extensions {
    return checkMapProjectTypeToExtension(this.JSON_FILE_CONTENT.projectType);
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

  public getJson(){
    return this.JSON_FILE_CONTENT;
  }

  public saveJson() {
    FileWriter.writeFile(
      this.JSON_FILE_PATH,
      JSON.stringify(this.JSON_FILE_CONTENT)
    );
  }

  /**
   * @description does the following:
   * - **edit** the default html
   * - **re-populate** the identifiers based on the new html
   * - **render** the new html
   * @param newHtml
   * @param renderType
   */
  public Vupdate(newHtml: string, renderType: renderTypes) {
    if(!this.isCreated()) throw new Error(this.ERR_VISUAL_NOT_CREATED);
    this.writer.editDefaultHtml(newHtml);
    this.writer.populateIdentifiers();
    this.converter.render(renderType);
  }
  public getFallbackVisual(): Visual | undefined{
    let fbVisual = new Visual(this.getVisualsPath(), { name: this.getName(), projectType: ProjectTypes.html });
    if( fbVisual.isCreated() ) return fbVisual;
    else return undefined;
  }
  /**
   * @description returns the visual if is created
   * - returns the fallback if the visual is not created
   * - returns undefined if also the fallback doesn't exists
   */
  public getVisualFiltered(): Visual | undefined{
    if( this.isCreated() ) return this;
    else return this.getFallbackVisual();
  }
  
  

  /**
   * @description initalize the lib-elem dependencies if the elem is not yet present
   * @param elemName the name of the lib to intialize
   */
  public initializeLibElem(elemName: string){
    if ( !this.JSON_FILE_CONTENT.lib[elemName] ) {
      this.JSON_FILE_CONTENT.lib[elemName] = ConstVisuals.getVisualsLibElemContent();
    }
  }
  
}
