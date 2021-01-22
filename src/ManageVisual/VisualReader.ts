
import { FileReader } from "../files/FileReader";
import { visualJson } from "../Types/entity.visual.jsons";
import { Visual } from "./Visual";

class VisualReader {
  constructor(public visual: Visual) {}

  /**
   * @description read the visual json bind it to the visual
   */
  public read(){
    let visualJsonContent: visualJson = JSON.parse(FileReader.readFile(this.visual.JSON_FILE_PATH));
    this.visual.JSON_FILE_CONTENT = visualJsonContent;
  }

}

export { VisualReader };
