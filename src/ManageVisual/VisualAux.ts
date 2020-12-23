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

    constructor(public VISUAL_FOLDER: string){
        super(VISUAL_FOLDER);
        this.reader = new VisualReader(this.VISUAL_FOLDER);
        this.writer = new VisualWriter(this.VISUAL_FOLDER);
        this.converter = new VisualConverter(this.VISUAL_FOLDER);
    }


}

export { VisualAux };