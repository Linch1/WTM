import {nestedStringsArrays} from "./customTypes";
import {FileManager} from "./FileManager";
import {Theme} from "./Theme";
import {ThemeWriter} from "./ThemeWriter";

class ThemeInitializer extends Theme {

    constructor(public ThemeFolder: string){
        super(ThemeFolder);
    }

}

export { ThemeInitializer };