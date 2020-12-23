import { ThemeAux } from "../ThemeAux";
import { pageTypes } from "./enums/enums";
import { PageBuild } from "./PageBuild";

class Template extends PageBuild{
    constructor(public themeAux: ThemeAux, pageName: string){
        super(themeAux);
        this.PAGE_NAME = pageName;
        this.PAGE_TYPE = pageTypes.PAGE;
        this.PATH = "page-templates/"
        this.DEFAULT_BUILD_PATH = "template-default.php";
        this.FILE_NAME = "WTM-TEMPLATE.php";
        this.JSON_NAME = "WTM.json";
        this.JSON_INFORMATIONS.name = this.PAGE_NAME;
    }
}
export { Template }