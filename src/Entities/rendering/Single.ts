import { ThemeAux } from "../../ManageTheme/ThemeAux";
import { GeneralPageEntity } from "./GeneralPageEntity";
import { pageTypes } from "../../Enums/entities.visual.type";
import { pagePath } from "../../Enums/entities.visual.path";

export class Single extends GeneralPageEntity {
  constructor(public themeAux: ThemeAux, pageName: string) {
    super(themeAux);
    this.PAGE_NAME = pageName;
    this.PAGE_TYPE = pageTypes.POST;
    this.PARENT_DIR_PATH = pagePath.POST ;
    this.DEFAULT_BUILD_PATH = "single-default.php";
    this.PAGE_PREFIX = "single-";
    if( this.PAGE_NAME.includes(this.PAGE_PREFIX) ) this.PAGE_NAME = this.PAGE_NAME.replace(this.PAGE_PREFIX, "");

    this.JSON_FILE_PATH = this.themeAux.getInsideWTMPath(
      pagePath.POST,
      `WTM-${this.PAGE_NAME.toLowerCase().split(" ").join("-")}.json`
    );
    this.JSON_FOLDER_PATH = this.themeAux.getInsideWTMPath(pagePath.POST);

    this.initialize();
  }

  
}
