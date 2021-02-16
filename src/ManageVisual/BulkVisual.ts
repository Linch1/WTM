import { ProjectTypes } from "../Enums";
import { FileReader } from "../files/FileReader";
import { StringComposeWriter } from "../files/StringComposeWriter";
import { Visual } from "./Visual";

export class BulkVisual {
    
    /**
     * @param VISUALS_FOLDER the path to the visual**s** folder
     * @param projectType the type of the visuals to be read
     * - if empty all the visuals of all the types are readed
     */
    constructor(public VISUALS_FOLDER: string, public projectType?: ProjectTypes){}

    public getAllVisuals(): Visual[]{
        let visuals: Visual[] = []; 
        let visualsFolders = FileReader.getDirectories(this.VISUALS_FOLDER);
        for ( let visualFolder of visualsFolders){
            let visualFolderPath = StringComposeWriter.concatenatePaths(this.VISUALS_FOLDER, visualFolder);
            visuals.push(new Visual(visualFolderPath, this.projectType));
        }
        return visuals;
    }

    public findVisual( visualName: string): Visual {
        let visualFolder = StringComposeWriter.concatenatePaths(
            this.VISUALS_FOLDER,
            visualName
        );
        return new Visual( visualFolder );
    }
 
}
