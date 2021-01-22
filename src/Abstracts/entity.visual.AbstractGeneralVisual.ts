import { FileReader } from "../files/FileReader";
import { StringComposeReader } from "../files/StringComposeReader";
import { StringComposeWriter } from "../files/StringComposeWriter";
import { visualJson } from "../Types/entity.visual.jsons";


export abstract class AbstractGeneralVisual {
  public readonly ERR_VISUAL_ALREADY_EXISTS = "ERR: The visual already exists";
  public readonly ERR_CANNOT_GET_VISUAL_NAME =
    "ERR: Cannot retrive the visual name from the given path";

  public readonly RENDER_FILE_PATH: string;
  public readonly DEFAULT_FILE_PATH: string;
  public readonly INIT_RENDER_FILE_CONTENT: string = "";
  public readonly INIT_DEFAULT_FILE_CONTENT: string = "";

  public readonly JSON_FILE_NAME: string = "WTM.json";
  public readonly JSON_FILE_PATH: string = StringComposeWriter.concatenatePaths(
    this.getDirPath(),
    this.JSON_FILE_NAME
  );
  public JSON_FILE_CONTENT: visualJson = {
    visual: { name: "" },
    identifiers: {
      HTML: {},
      ACF: {},
    },
  };

  /**
   * @description create a visual with the given informations
   * @param VISUAL_FOLDER the folder where the visuale is ( or have to be ) containers
   * @param extension the typo of the visual ( php/ejs/html ... ) _without the dot_
   */
  constructor(public VISUAL_FOLDER: string, extension: string = "php") {
    this.JSON_FILE_CONTENT.visual.name = StringComposeReader.getPathLastElem(
      this.VISUAL_FOLDER
    );
    
    this.RENDER_FILE_PATH = StringComposeWriter.concatenatePaths(
      this.getDirPath(),
      "default." + extension
    );
    this.DEFAULT_FILE_PATH = StringComposeWriter.concatenatePaths(
      this.getDirPath(),
      "render." + extension
    );
    this.init();
    
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
   * @description return the path of the visual based on the this.VISUALS_MAIN_FOLDER
   */
  public getDirPath(): string {
    return StringComposeWriter.concatenatePaths(this.VISUAL_FOLDER);
  }

  public getHtmlDefault(): string{
    return FileReader.readFile(this.DEFAULT_FILE_PATH);
  }
  public getHtmlRender(): string{
    return FileReader.readFile(this.RENDER_FILE_PATH);
  }

}
