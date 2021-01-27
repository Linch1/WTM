import { FileReader } from "../files/FileReader";
import { StringComposeWriter } from "../files/StringComposeWriter";
import { visualJson } from "../Types";
import { Visual } from "./Visual";

export class BulkVisual {
    
    /**
     * @param VISUALS_FOLDER the folder where the visual are contained
     * @param extension the extension of the visual files ( php, ejs, html etc...) _without the dot_
     */
    constructor(public VISUALS_FOLDER: string, public extension?: string){}

    public getAllVisuals(): Visual[]{
        let visuals: Visual[] = []; 
        let visualsFolders = FileReader.getDirectories(this.VISUALS_FOLDER);
        for ( let visualFolder of visualsFolders){
            let visualFolderPath = StringComposeWriter.concatenatePaths(this.VISUALS_FOLDER, visualFolder);
            visuals.push(new Visual(visualFolderPath, this.extension));
        }
        return visuals;
    }
 
}
