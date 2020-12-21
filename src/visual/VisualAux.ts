import { Visual } from "./Visual";
import { VisualConverter } from "./VisualConverter";
import { VisualReader } from "./VisualReader";
import { VisualWriter } from "./VisualWriter";


/**
 * Initialize the Theme to manage
 */
class VisualAux extends Visual {

    public reader: VisualReader; 
    public writer: VisualWriter;
    public converter: VisualConverter;

    constructor(public VISUALS_MAIN_FOLDER: string){
        super(VISUALS_MAIN_FOLDER);
        this.reader = new VisualReader(this.VISUALS_MAIN_FOLDER);
        this.writer = new VisualWriter(this.VISUALS_MAIN_FOLDER);
        this.converter = new VisualConverter(this.VISUALS_MAIN_FOLDER);
    }


}

export { VisualAux };