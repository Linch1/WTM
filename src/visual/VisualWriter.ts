import { Visual } from "./Visual";

class VisualWriter extends Visual{
    constructor(public VISUALS_MAIN_FOLDER: string){
        super(VISUALS_MAIN_FOLDER);
    }
}

export { VisualWriter };
