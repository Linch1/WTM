
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
        this.reader = new ThemeReader(this);
        this.writer = new ThemeWriter(this);
        this.composer = new ThemeComposer(this);
    }


}

export { ThemeAux };