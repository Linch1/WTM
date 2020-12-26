import { ThemeAux } from "../../ManageTheme/ThemeAux";
import { GeneralPageEntity } from "./GeneralPageEntity";
import { pageTypes } from "../../Enums/entities.visual.type";
import { pagePath } from "../../Enums/entities.visual.path";

class Template extends GeneralPageEntity {
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
