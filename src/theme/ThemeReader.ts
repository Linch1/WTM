import { nestedStringsArrays } from "../types/customTypes";
import { FileReader } from "../files/FileReader";
import { FileWriter } from "../files/FileWriter";
import {Theme} from "./Theme";
import {ThemeWriter} from "./ThemeWriter";

/**
 * This class is used to perform the read actions on the Theme
 * Like reading a custom post type or a page or other things like that
 */
class ThemeReader extends Theme {

    constructor(public ThemeFolder: string){
        super(ThemeFolder);
    }

}

export { ThemeReader };