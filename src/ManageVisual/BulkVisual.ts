import { ProjectTypes } from "../Enums";
import { FileReader } from "../ManageFiles/FileReader";
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
            visuals.push(new Visual(this.VISUALS_FOLDER, {name: visualFolder, projectType: this.projectType}));
        }
        return visuals;
    }
    /**
     * @description read all the visuals of a given type
     * - replace the non existing visuals with their fallback visuals
     * - remove the visual from the list if it is not create and also it's fallback is not created.
     * @param VISUALS_FOLDER the path to the visual**s** folder
     * @param projectType the type of the visuals to be read
     * - if this param is left empty all the visuals of all the types are readed
     */
    public getAllVisualsFiltered(): Visual[]{
        let visuals: Visual[] = []; 
        let visualsFolders = FileReader.getDirectories(this.VISUALS_FOLDER);
        for ( let visualFolder of visualsFolders){
            let visual = new Visual(this.VISUALS_FOLDER, {name: visualFolder, projectType: this.projectType});
            if( !visual.reader.isCreated() ){
                let fbVisual = visual.reader.getFallbackVisual();
                if( fbVisual ) visual = fbVisual;
                else continue;
            }
            visuals.push(visual);
        }
        return visuals;
    }

    public findVisual( visualName: string): Visual {
        return new Visual( this.VISUALS_FOLDER, {name: visualName} );
    }
 
}
