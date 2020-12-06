import {nestedStringsArrays} from "./customTypes";
import {FileManager} from "./FileManager";

class Theme {

    public themeStructure: nestedStringsArrays = [];

    constructor(public ThemeFolder: string){
        this.themeStructure = FileManager.readFolderTree(ThemeFolder);
    }

}

export { Theme };