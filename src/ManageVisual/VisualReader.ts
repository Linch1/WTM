
import { Checker } from "../Checkers/Checker";
import { ConstVisuals } from "../Constants/const.visuals";
import { extensions } from "../Enums/common.extension";
import { ProjectTypes } from "../Enums/common.projectTypes";
import { FileReader } from "../ManageFiles/FileReader";
import { StringComposeWriter } from "../ManageFiles/StringComposeWriter";
import { visualJson } from "../Types/manageVisual.jsons";
import { Visual } from "./Visual";

class VisualReader {
  constructor(public visual: Visual) {}

  /**
   * @description read the visual json and bind it to the visual
   */
  public read(){
    if(!this.visual.reader.isCreated()) throw new Error(this.visual.ERR_VISUAL_NOT_CREATED);
    let visualJsonContent: visualJson = JSON.parse(FileReader.readFile(this.visual.JSON_FILE_PATH));
    this.visual.JSON_FILE_CONTENT = visualJsonContent;
  }

  /**
   * @description get the json that contains the default values for intialize a visual
   * @returns 
   */
   static getJsonIntializer(): visualJson {
    return ConstVisuals.getVisualsJsonContent()
  }

  /**
   * @description get the keys of the json that contains default values for intialize a visual
   * @returns 
   */
   static getJsonKeysIntializer(): string[]{
    return Object.keys(ConstVisuals.getVisualsJsonContent());
  }

  /**
   * @description get the visual name 
   */
   public getName(): string {
    return this.visual.JSON_FILE_CONTENT.name;
  }
  /**
   * @description get the visual project type
   */
  public getProjectType(): ProjectTypes {
    return this.visual.JSON_FILE_CONTENT.projectType;
  }
  /**
   * @description get the path to the project in which the visual is
   */
  public getProjectPath(): string {
    let path = this.visual.JSON_FILE_CONTENT.projectPath;
    if( !path ) throw new Error( this.visual.ERR_EMPTY_PROJECT_PATH )
    return path;
  }
  /**
   * @description get the visual extension
   */
  public getExtension(): extensions {
    return Checker.checkMapProjectTypeToExtension(this.visual.JSON_FILE_CONTENT.projectType);
  }

  /**
   * @description returns the path to the visual json
   * @returns 
   */
  public getJsonFilePath(): string{
    return this.visual.JSON_FILE_PATH;
  }
  
  /**
   * @description returns the path to the visual folder
   */
  public getDirPath(): string {
    return StringComposeWriter.concatenatePaths(this.visual.VISUAL_FOLDER, this.getProjectType());
  }
  /**
   * @description return the path of the visuals directory
   */
  public getVisualsPath(): string {
    return this.visual.VISUALS_FOLDER; // returns the path to the visuals directory
  }
  /**
   * @description return the abs path of the visual default file
   */
  public getDefaultFilePath(): string{
    return this.visual.DEFAULT_FILE_PATH;
  }
  /**
   * @description return the abs path of the visual render file
   */
  public getRenderFilePath(): string{
    return this.visual.RENDER_FILE_PATH;
  }
  /**
   * @description return the name of the render file ( _without the extension_ )
   */
  public getRenderFileName(): string{
    return this.visual.RENDERED_FILE_NAME;
  }
  /**
   * @description get the text contained in the _default.**_ file
   */
  public getHtmlDefault(): string{
    return FileReader.readFile(this.visual.DEFAULT_FILE_PATH);
  }
  /**
   * @description get the text contained in the _render.**_ file
   */
  public getHtmlRender(): string{
    return FileReader.readFile(this.visual.RENDER_FILE_PATH);
  }

  public getJson(){
    return this.visual.JSON_FILE_CONTENT;
  }

  /**
   * @description returns true if the current visual exists
   */
   public isCreated(): boolean{
    return FileReader.existsPath(this.getDirPath());
  }

  /**
   * @description returns the fallback visual object if exists,  else returns undefined
   * @returns 
   */
  public getFallbackVisual(): Visual | undefined{
    let fbVisual = new Visual(this.getVisualsPath(), { name: this.getName(), projectType: ProjectTypes.html });
    if( fbVisual.reader.isCreated() ) return fbVisual;
    else return undefined;
  }
  /**
   * @description returns the visual if is created
   * - returns the fallback if the visual is not created
   * - returns undefined if also the fallback doesn't exists
   */
  public getVisualFiltered(): Visual | undefined{
    if( this.isCreated() ) return this.visual;
    else return this.getFallbackVisual();
  }

}

export { VisualReader };
