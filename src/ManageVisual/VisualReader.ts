import { Visual } from "./Visual";

class VisualReader extends Visual {
    constructor(public VISUALS_MAIN_FOLDER: string){
        super(VISUALS_MAIN_FOLDER);
    }
}

export { VisualReader };
