import {nestedStringsArrays} from "../types/customTypes";
import { FileReader } from "../files/FileReader";
import { FileWriter } from "../files/FileWriter";

import { Theme } from "./Theme";
import { ThemeWriter } from "./ThemeWriter";
import { ThemeReader } from "./ThemeReader";
import { ThemeComposer } from "./ThemeComposer";

/**
 * Initialize the Theme to manage
 */
class ThemeAux extends Theme {

    public reader: ThemeReader; 
    public writer: ThemeWriter;
    public composer: ThemeComposer;

    constructor(public ThemeFolder: string){
        super(ThemeFolder);
        this.reader = new ThemeReader(this.ThemeFolder);
        this.writer = new ThemeWriter(this.ThemeFolder);
        this.composer = new ThemeComposer(this.ThemeFolder);
    }


}

export { ThemeAux };