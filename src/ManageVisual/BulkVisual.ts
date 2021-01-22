import { FileReader } from "../files/FileReader";
import { StringComposeWriter } from "../files/StringComposeWriter";
import { visualJson } from "../Types";
import { Visual } from "./Visual";

export class BulkVisual {
    
    constructor(public VISUALS_FOLDER: string){}

    public getAllVisuals(): Visual[]{
        let visuals: Visual[] = []; 
        let visualsFolders = FileReader.getDirectories(this.VISUALS_FOLDER);
        for ( let visualFolder of visualsFolders){
            let visualFolderPath = StringComposeWriter.concatenatePaths(this.VISUALS_FOLDER, visualFolder);
            visuals.push(new Visual(visualFolderPath));
        }
        return visuals;
    }
 
}
