import { FileWriter } from "../../files/FileWriter";
import { FileReader } from "../../files/FileReader";
import { ThemeAux } from "../ThemeAux";
import { pagePath, pageTypes } from "./enums/enums";
import { PageBuild } from "./PageBuild";

class Template extends PageBuild {
  constructor(public themeAux: ThemeAux, pageName: string) {
    super(themeAux);
    this.PAGE_NAME = pageName;
    this.PAGE_TYPE = pageTypes.PAGE;
    this.PATH = pagePath.PAGE;
    this.DEFAULT_BUILD_PATH = "template-default.php";
    this.PAGE_PREFIX = "template-";

    this.JSON_INFORMATIONS.name = this.PAGE_NAME;
    this.JSON_FILE_PATH = this.themeAux.getInsideWTMPath(
      "templates",
      `WTM-${this.PAGE_NAME}.json`
    );
    this.JSON_FOLDER_PATH = this.themeAux.getInsideWTMPath("templates");

    this.initialize();
  }

  
}
export { Template };
