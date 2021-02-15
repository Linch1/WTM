import { FileReader } from "../files/FileReader";
import { StringComposeReader } from "../files/StringComposeReader";
import { StringComposeWriter } from "../files/StringComposeWriter";
import { visualJson } from "../Types/entity.visual.jsons";
import { extensions, ProjectTypes } from "../Enums";
import { checkMapProjectTypeToExtension } from "../Checkers/check.mapProjectTypeToExtension";


export abstract class AbstractGeneralVisual {
  public readonly ERR_VISUAL_ALREADY_EXISTS = "ERR: The visual already exists";
  public readonly ERR_CANNOT_GET_VISUAL_NAME =
    "ERR: Cannot retrive the visual name from the given path";
  public readonly ERR_VISUAL_NOT_CREATED =
    "ERR: Before calling this method create the visual with the myVisual.writer.createVisual() method";

  public readonly ASSETS_RELATIVE_PATH: string = '/assets/css/';
  public readonly STYLES_RELATIVE_PATH: string = '/assets/css/';
  public readonly SCRIPTS_RELATIVE_PATH: string = '/assets/js/';
  public readonly JSON_FILE_NAME: string = "WTM.json";
  public readonly HTML_DEFAULT_FILE_NAME: string  = "default";
  public readonly HTML_RENDERED_FILE_NAME: string  = "render";

  public readonly RENDER_FILE_PATH: string;
  public readonly DEFAULT_FILE_PATH: string;
  public readonly ASSETS_PATH: string;
  public readonly STYLES_PATH: string;
  public readonly SCRIPTS_PATH: string;

  public readonly INIT_RENDER_FILE_CONTENT: string = "";
  public readonly INIT_DEFAULT_FILE_CONTENT: string = "";

  public readonly JSON_FILE_PATH: string = StringComposeWriter.concatenatePaths(
    this.getDirPath(),
    this.JSON_FILE_NAME
  );
  public JSON_FILE_CONTENT: visualJson = {
    visual: { name: "", projectType: ProjectTypes.ejs },
    identifiers: {
      HTML: {
        "!STATIC!": {},
        "!ALL!": {},
        "!EXEC!": {}
      },
      ACF: {
        "!STATIC!": {},
        "!ALL!": {},
        "!EXEC!": {}
      },
    },
    dependencies: {
      scripts: [],
      styles: []
    }
  };

  /**
   * @description create a visual with the given informations
   * @param VISUAL_FOLDER the folder where the visuale is ( or have to be ) containers
   * @param projectType the typo of the project where the visual will be included
   */
  constructor(public VISUAL_FOLDER: string, projectType: ProjectTypes) {
    this.JSON_FILE_CONTENT.visual.name = StringComposeReader.getPathLastElem(
      this.VISUAL_FOLDER
    );
    this.JSON_FILE_CONTENT.visual.projectType = projectType;

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
   * @description get the visual name from the VISUAL_FOLDER
   */
  public getName(): string {
    return this.JSON_FILE_CONTENT.visual.name;
  }

  /**
   * @description get the visual name from the VISUAL_FOLDER
   */
  public getProjectType(): ProjectTypes {
    return this.JSON_FILE_CONTENT.visual.projectType;
  }
  /**
   * @description get the visual name from the VISUAL_FOLDER
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
   * @description return the path of the visual based on the this.VISUALS_MAIN_FOLDER
   */
  public getDirPath(): string {
    return StringComposeWriter.concatenatePaths(this.VISUAL_FOLDER);
  }
  /**
   * @description return the path of the visual based on the this.VISUALS_MAIN_FOLDER
   */
  public getVisualsPath(): string {
    let parentDirPaths = this.VISUAL_FOLDER.split('/');
    parentDirPaths.pop()
    return parentDirPaths.join('/');
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
