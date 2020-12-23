import { FileReader } from "../files/FileReader";
import { FileWriter } from "../files/FileWriter";
import { StringComposeWriter } from "../files/StringComposeWriter";

import { Visual } from "./Visual";
import { renderTypes } from "./enums/enums"
import { visualIdentifiersJson } from "./types/types";

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