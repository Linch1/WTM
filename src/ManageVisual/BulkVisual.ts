import { ProjectTypes } from "../Enums";
import { FileReader } from "../files/FileReader";
import { StringComposeWriter } from "../files/StringComposeWriter";
import { Visual } from "./Visual";

export class BulkVisual {
    
    /**
     * @description read all the visuals of a given type or all the types
     * - it returns also non created visuals if a visual of the specified type is not present. 
     * @param VISUALS_FOLDER the path to the visual**s** folder
     * @param projectType the type of the visuals to be read
     * - if this param is left empty all the visuals of all the types are readed
     */
    constructor(public VISUALS_FOLDER: string, public projectType?: ProjectTypes){}

    public getAllVisuals(): Visual[]{
        let visuals: Visual[] = []; 
        let visualsFolders = FileReader.getDirectories(this.VISUALS_FOLDER);
        for ( let visualFolder of visualsFolders){
            visuals.push(new Visual(this.VISUALS_FOLDER, visualFolder, this.projectType));
        }
        return visuals;
    }

    public findVisual( visualName: string): Visual {
        return new Visual( this.VISUALS_FOLDER, visualName );
    }
 
}
