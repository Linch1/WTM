import { StringComposeWriter } from "../../files/StringComposeWriter";
import { ThemeAux } from "../ThemeAux";
import { pageTypes } from "./enums/enums";
import { PageBuild } from "./PageBuild";

class Single extends PageBuild {
    constructor(public themeAux: ThemeAux, pageName: string){
        super(themeAux);
        this.PAGE_NAME = pageName;
        this.PAGE_TYPE = pageTypes.POST;
        this.PATH = "singles/"
        this.DEFAULT_BUILD_PATH = "single-default.php";
        this.FILE_NAME = "WTM-SINGLE.php";
        this.JSON_NAME = "WTM.json";
        this.JSON_INFORMATIONS.name = this.PAGE_NAME;
    }

    
}
export { Single }