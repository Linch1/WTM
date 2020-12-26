import { FileReader } from "../files/FileReader";
import { StringComposeReader } from "../files/StringComposeReader";
import { StringComposeWriter } from "../files/StringComposeWriter";
import { visualJson } from "../Types/entity.visual.jsons";


export abstract class AbstractGeneralVisual {
  public readonly ERR_VISUAL_ALREADY_EXISTS = "ERR: The visual already exists";
  public readonly ERR_CANNOT_GET_VISUAL_NAME =
    "ERR: Cannot retrive the visual name from the given path";
  
  public readonly RENDER_FILE_PATH: string = StringComposeWriter.concatenatePaths(
    this.getDirPath(),
    "render.php"
  );
  public readonly DEFAULT_FILE_PATH: string = StringComposeWriter.concatenatePaths(
    this.getDirPath(),
    "default.php"
  );

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

  constructor(public VISUAL_FOLDER: string) {
    this.JSON_FILE_CONTENT.visual.name = StringComposeReader.getPathLastElem(
      this.VISUAL_FOLDER
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
