
import { Theme } from "./Theme";
import { ThemeWriter } from "./ThemeWriter";
import { ThemeReader } from "./ThemeReader";

/**
 * Initialize the Theme to manage
 */
class ThemeAux extends Theme {

    public reader: ThemeReader; 
    public writer: ThemeWriter;

    constructor(public ThemeFolder: string){
        super(ThemeFolder);
        this.reader = new ThemeReader(this.ThemeFolder);
        this.writer = new ThemeWriter(this.ThemeFolder);
    }


}

export { ThemeAux };