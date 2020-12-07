import { nestedStringsArrays } from "../types/customTypes";
import { FileReader } from "../files/FileReader";
import { FileWriter } from "../files/FileWriter";
import {Theme} from "./Theme";
import {ThemeWriter} from "./ThemeWriter";

class ThemeReader extends Theme {

    constructor(public ThemeFolder: string){
        super(ThemeFolder);
    }

}

export { ThemeReader };