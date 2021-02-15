import { ProjectTypes } from "../Enums";
import { FileReader } from "../files/FileReader";
import { StringComposeWriter } from "../files/StringComposeWriter";
import { Visual } from "./Visual";

export class BulkVisual {
    
    /**
     * @param VISUALS_FOLDER the folder where the visual are contained
     * @param projectType the type of the project where the visual will be included
     */
    constructor(public VISUALS_FOLDER: string, public projectType: ProjectTypes){}

    public getAllVisuals(): Visual[]{
        let visuals: Visual[] = []; 
        let visualsFolders = FileReader.getDirectories(this.VISUALS_FOLDER);
        for ( let visualFolder of visualsFolders){
            let visualFolderPath = StringComposeWriter.concatenatePaths(this.VISUALS_FOLDER, visualFolder);
            visuals.push(new Visual(visualFolderPath, this.projectType));
        }
        return visuals;
    }
 
}
