import { FileWriter } from "../../files/FileWriter";
import { FileReader } from "../../files/FileReader";
import { StringComposeWriter } from "../../files/StringComposeWriter";
import { ThemeAux } from "../../ManageTheme/ThemeAux";
import { GeneralVisual } from "./GeneralVisual";
import { pageTypes } from "../../Enums/entities.visual.type";
import { pagePath } from "../../Enums/entities.visual.path";

class Single extends GeneralVisual {
  constructor(public themeAux: ThemeAux, pageName: string) {
    super(themeAux);
    this.PAGE_NAME = pageName;
    this.PAGE_TYPE = pageTypes.POST;
    this.PATH = pagePath.POST ;
    this.DEFAULT_BUILD_PATH = "single-default.php";
    this.PAGE_PREFIX = "single-";

    this.JSON_INFORMATIONS.name = this.PAGE_NAME;
    this.JSON_FILE_PATH = this.themeAux.getInsideWTMPath(
      "singles",
      `WTM-${this.PAGE_NAME.toLowerCase().split(" ").join("-")}.json`
    );
    this.JSON_FOLDER_PATH = this.themeAux.getInsideWTMPath("singles");

    this.initialize();
  }

  
}
export { Single };
