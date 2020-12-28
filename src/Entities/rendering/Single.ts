import { ThemeAux } from "../../ManageTheme/ThemeAux";
import { GeneralPageEntity } from "./GeneralPageEntity";
import { pageTypes } from "../../Enums/entities.visual.type";
import { pagePath } from "../../Enums/entities.visual.path";

class Single extends GeneralPageEntity {
  constructor(public themeAux: ThemeAux, pageName: string) {
    super(themeAux);
    this.PAGE_NAME = pageName;
    this.PAGE_TYPE = pageTypes.POST;
    this.PARENT_DIR_PATH = pagePath.POST ;
    this.DEFAULT_BUILD_PATH = "single-default.php";
    this.PAGE_PREFIX = "single-";

    this.JSON_INFORMATIONS.name = this.PAGE_NAME;
    this.JSON_FILE_PATH = this.themeAux.getInsideWTMPath(
      pagePath.POST,
      `WTM-${this.PAGE_NAME.toLowerCase().split(" ").join("-")}.json`
    );
    this.JSON_FOLDER_PATH = this.themeAux.getInsideWTMPath(pagePath.POST);

    this.initialize();
  }

  
}
export { Single };
