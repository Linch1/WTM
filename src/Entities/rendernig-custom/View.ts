import { ThemeAux } from "../../ManageTheme/ThemeAux";
import { GeneralViewEntity } from "./GeneralViewEntity";
import { pageTypes } from "../../Enums/entities.visual.type";
import { pagePath } from "../../Enums/entities.visual.path";
import { StringComposeWriter } from "../../files";

export class View extends GeneralViewEntity {
  constructor( parentAbsPath : string, pageName: string) {
    super(parentAbsPath);
    this.PAGE_NAME = pageName;
    this.PAGE_TYPE = pageTypes.PAGE;
    
    this.DEFAULT_BUILD = 
`[WTM-PLACEHOLDER-PAGE-HEADER]
<!--<[WTM-HTML-BODY]-->
<!--[WTM-HTML-BODY]>-->
[WTM-PLACEHOLDER-PAGE-FOOTER]
`;
    this.PAGE_PREFIX = "template-";

    this.PARENT_DIR_PATH = StringComposeWriter.concatenatePaths(parentAbsPath, "Views");
    this.JSON_FOLDER_PATH = StringComposeWriter.concatenatePaths(parentAbsPath, "Views/views-json");
    this.JSON_DEFAULT_FILE_PATH = StringComposeWriter.concatenatePaths(parentAbsPath, "Views/views-json/default.json");
    
    this.JSON_INFORMATIONS.name = this.PAGE_NAME;
    this.JSON_FILE_PATH = StringComposeWriter.concatenatePaths(parentAbsPath, `Views/views-json/WTM-${this.PAGE_NAME}.json`);

    this.initialize();
  }

  
}
