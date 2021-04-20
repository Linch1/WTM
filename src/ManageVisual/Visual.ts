import { FileReader } from "../ManageFiles/FileReader";
import { StringComposeWriter } from "../ManageFiles/StringComposeWriter";
import { visualJson, visualJsonScheletonAsParam } from "../Types/manageVisual.jsons";
import { ProjectTypes, renderTypes } from "../Enums";
import { ConstVisuals } from "../Constants/const.visuals";
import { ConstProjects } from "../Constants/const.projects";
import { VisualReader } from "../ManageVisual/VisualReader";
import { VisualWriter } from "../ManageVisual/VisualWriter";
import { VisualRender } from "./VisualRender";
import { VisualsDependenciesManager } from "../ManageDependencies/VisualsDependenciesManager";
import { VisualInitializer } from "./VisualInitializer";



export class Visual {

  public readonly ERR_VISUAL_ALREADY_EXISTS = "ERR: The visual already exists";
  public readonly ERR_EMPTY_PROJECT_PATH = "The path to the project of the current visual is empty on undefined";
  public readonly ERR_CANNOT_GET_VISUAL_NAME =
    "ERR: Cannot retrive the visual name from the given path";
  public readonly ERR_VISUAL_NOT_CREATED =
    "ERR: Before calling this method create the visual with the myVisual.writer.createVisual() method";
  public readonly ERR_NO_PROJECT_TYPE_PROVIDED = "Please provide the visual project type. If not provided it means that the visual already exists and it can be take from it's json, in this case the visual doesn't exists so this cannot be done."

  public depManager: VisualsDependenciesManager;
  public readonly ASSETS_RELATIVE_FOLDER_PATH: string = ConstVisuals.AssetsDirectory;
  public readonly STYLES_RELATIVE_FOLDER_PATH: string = StringComposeWriter.concatenatePaths(
    ConstVisuals.AssetsDirectory,
    ConstVisuals.AssetsCssDirectory
  );
  public readonly IMG_RELATIVE_FOLDER_PATH: string = StringComposeWriter.concatenatePaths(
    ConstVisuals.AssetsDirectory,
    ConstVisuals.AssetsImgDirectory
  );
  public readonly SCRIPTS_RELATIVE_FOLDER_PATH: string = StringComposeWriter.concatenatePaths(
    ConstVisuals.AssetsDirectory,
    ConstVisuals.AssetsJsDirectory
  );;
  public readonly JSON_FILE_NAME: string = ConstVisuals.JsonFile;
  public readonly DEFAULT_FILE_NAME: string  = ConstVisuals.DefaultFileName;
  public readonly RENDERED_FILE_NAME: string  = ConstVisuals.RenderFileName;

  public RENDER_FILE_PATH: string = "";
  public DEFAULT_FILE_PATH: string = "";
  public ASSETS_PATH: string = "";
  public ASSETS_STYLES_PATH: string = "";
  public ASSETS_SCRIPTS_PATH: string = "";
  public ASSETS_IMG_PATH: string = "";
  public ASSETS_LIB_PATH: string = "";

  public VISUAL_FOLDER: string = "";

  public readonly INIT_RENDER_FILE_CONTENT: string = ConstVisuals.RenderContent;
  public readonly INIT_DEFAULT_FILE_CONTENT: string = ConstVisuals.DefaultContent;

  public JSON_FILE_PATH: string = "";
  public JSON_FILE_CONTENT: visualJson = ConstVisuals.getVisualsJsonContent();


  public reader: VisualReader;
  public writer: VisualWriter;
  public render: VisualRender;
  public initializer: VisualInitializer;

  /**
   * @description create a visual with the given informations
   * @param VISUALS_FOLDER the path to the visuals folder
   * @param VISUAL_NAME the name of the visual to create
   * @param projectType the typo of the project where the visual will be included
   */
  constructor(public VISUALS_FOLDER: string, public VISUAL_SCHELETON: visualJsonScheletonAsParam) {

    /*
    set the main objects to manage visuals
    */
    this.reader = new VisualReader(this);
    this.writer = new VisualWriter(this);
    this.render = new VisualRender(this);
    this.depManager = new VisualsDependenciesManager(this);
    this.initializer = new VisualInitializer( this );
    
    /* 
     set the correct paths to files and directories of the visual but
     withouth creating them, this are created once that the method
     -> this.intializer.createVisual() 
     is called 
     */
    this.initializer.setEmptyJsonScheletonParams( this.VISUAL_SCHELETON ); // init empty scheleton params
    this.initializer.updateJsonWithScheletonParams( this.VISUAL_SCHELETON ); // use scheleton params to populate the json
    this.initializer.setVisualFolder(); // init the visual folder
    this.initializer.setJsonFilePath(); // init the json file path 
    this.initializer.populateJsonIfAlreadyCreated(); // populate the json content with the informations in the json file ( if it already exists )
    if( !FileReader.existsPath(this.JSON_FILE_PATH) && !this.reader.getProjectType() ) throw new Error(this.ERR_NO_PROJECT_TYPE_PROVIDED);
    this.initializer.setRenderFilePath();
    this.initializer.setDefaultFilePath();
    this.initializer.setAssetsFolder();
    this.initializer.setAssetsScriptsFolder();
    this.initializer.setAssetsStylesFolder();
    this.initializer.setAssetsImagesFolder();
    this.initializer.setAssetsLibFolder();
  }

  /**
   * @description does the following:
   * - **edit** the default html
   * - **re-populate** the identifiers based on the new html
   * - **render** the new html
   * @param newHtml
   * @param renderType
   */
  public update(newHtml: string, renderType: renderTypes) {
    if(!this.reader.isCreated()) throw new Error(this.ERR_VISUAL_NOT_CREATED);
    this.writer.editDefaultHtml(newHtml);
    this.writer.populateIdentifiers();
    this.render.render(renderType);
  }

  
  
}
