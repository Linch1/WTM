import { StringComposeWriter } from "../files/StringComposeWriter";

class Visual {

    public readonly DEFAULT_FILE: string = "default.html";
    public readonly IDENTIFIERS_FILE: string = "identifiers.json";
    public readonly RENDER_FILE: string = "render.html";
  
    constructor(public VISUALS_MAIN_FOLDER: string) {
    }
    
    /**
     * @description return the path of the visual's render.html file
     */
    public getRenderFilePath(): string{
      return StringComposeWriter.concatenatePaths(this.VISUALS_MAIN_FOLDER, this.RENDER_FILE)
    }

    /**
     * @description return the path of the visual's identifiers.json file
     */
    public getIdentifiersFilePath(): string{
      return StringComposeWriter.concatenatePaths(this.VISUALS_MAIN_FOLDER, this.IDENTIFIERS_FILE);
    }

    /**
     * @description return the path of the visual's default.html file
     */
    public getDefaultFilePath(): string{
      return StringComposeWriter.concatenatePaths(this.VISUALS_MAIN_FOLDER, this.DEFAULT_FILE);
    }
    
  }
  
  export { Visual };