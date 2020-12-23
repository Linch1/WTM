import { StringComposeReader } from "../files/StringComposeReader";
import { StringComposeWriter } from "../files/StringComposeWriter";

class Visual {

    public readonly ERR_VISUAL_ALREADY_EXISTS = "ERR: The visual already exists"
    public readonly ERR_CANNOT_GET_VISUAL_NAME = "ERR: Cannot retrive the visual name from the given path"

    public readonly RENDER_FILE: string = "render.php";
    public readonly DEFAULT_FILE: string = "default.php";
    public readonly IDENTIFIERS_FILE: string = "WTM.json";

    public readonly INIT_RENDER_FILE_CONTENT: string = "";
    public readonly INIT_DEFAULT_FILE_CONTENT: string = "";
    public readonly INIT_IDENTIFIERS_FILE_CONTENT: string = "{}";

    public VISUAL_NAME: string = "";

    protected HTML: string = "";

    constructor(public VISUAL_FOLDER: string) {
      this.VISUAL_NAME = this.getVisualName();
    }
    
    /**
     * @description get the visual name from the VISUAL_FOLDER
     */
    public getVisualName(): string{
      return StringComposeReader.getPathLastElem(this.VISUAL_FOLDER);
    }

    /**
     * @description return the path of the visual's render.html file
     */
    public getRenderFilePath(): string{
      return StringComposeWriter.concatenatePaths(this.VISUAL_FOLDER, this.RENDER_FILE)
    }

    /**
     * @description return the path of the visual's WTM.json file
     */
    public getIdentifiersFilePath(): string{
      return StringComposeWriter.concatenatePaths(this.VISUAL_FOLDER, this.IDENTIFIERS_FILE);
    }

    /**
     * @description return the path of the visual's default.html file
     */
    public getDefaultFilePath(): string{
      return StringComposeWriter.concatenatePaths(this.VISUAL_FOLDER, this.DEFAULT_FILE);
    }

    /**
     * @description return the path of the visual based on the this.VISUALS_MAIN_FOLDER
     * @param visualName the name of the visual
     */
    public getVisualPath(): string{
      return StringComposeWriter.concatenatePaths(this.VISUAL_FOLDER);
    }

    get getHtml(){
      return this.HTML;
    }
    
  }
  
  export { Visual };