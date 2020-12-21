import { FileReader } from "../files/FileReader";
import { FileWriter } from "../files/FileWriter";
import { StringComposeWriter } from "../files/StringComposeWriter";
import { visualIdentifiersJson } from "../types/customTypes";
import { Visual } from "./Visual";

class VisualConverter extends Visual{
    
    constructor(public VISUALS_MAIN_FOLDER: string){
        super(VISUALS_MAIN_FOLDER);
    }

    /**
     * @description replace all the placholders in the inside **default.html**
     * with the identifiers values inside **identifiers.json**.
     * then the new html obtained by this operation is wrote inside **render.html**
     */
    renderDefault(){
        let html: string = FileReader.readFile(this.getDefaultFilePath());
        let identifiers: visualIdentifiersJson = JSON.parse(FileReader.readFile(this.getIdentifiersFilePath()));
        let newHtml: string = StringComposeWriter.replaceAllIdentifiersHtml(html, identifiers["HTML"]);
        FileWriter.writeFile(this.getRenderFilePath(), newHtml);
    }
}

export { VisualConverter };