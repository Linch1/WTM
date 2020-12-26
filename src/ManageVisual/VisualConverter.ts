import { renderTypes } from "../Enums/manageVisual.visual.type";
import { FileReader } from "../files/FileReader";
import { FileWriter } from "../files/FileWriter";
import { StringComposeWriter } from "../files/StringComposeWriter";
import { visualIdentifiersJson } from "../Types/manageVisual.jsons";
import { Visual } from "./Visual";


class VisualConverter extends Visual{
    
    constructor(public VISUAL_FOLDER: string){
        super(VISUAL_FOLDER);
    }

    /**
     * @description replace all the placholders in the inside **default.html**
     * with the identifiers HTML values inside **WTM.json**.
     * then the new html obtained by this operation is wrote inside **render.html**
     */
    renderType(type: renderTypes){
        let html: string = FileReader.readFile(this.getDefaultFilePath());
        let identifiers: visualIdentifiersJson = JSON.parse(FileReader.readFile(this.getIdentifiersFilePath()));
        let newHtml: string = StringComposeWriter.replaceAllIdentifiersHtml(html, identifiers[type]);
        FileWriter.writeFile(this.getRenderFilePath(), newHtml);
    }

}

export { VisualConverter };