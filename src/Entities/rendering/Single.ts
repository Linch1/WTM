import { ThemeAux } from "../../ManageTheme/ThemeAux";
import { pagePath } from "../../Enums/entities.visual.path";
import { AbstractGeneralView } from "../../Abstracts/AbstractGeneralView";
import { WpFunctionComposer } from "../../files/WpFunctionComposer";
import { ProjectTypes } from "../../Enums";
import { checkMapProjectTypeToExtension } from "../../Checkers/check.mapProjectTypeToExtension";

export class Single extends AbstractGeneralView {


  constructor( themeAux: ThemeAux, pageName: string ) {

    let parentAbsPath: string = themeAux.getInsideThemePath("");
    let viewsDefaultPrefix: string = "single-";
    let projectType = ProjectTypes.wordpress;
    pageName = pageName.trim();
    let extension = checkMapProjectTypeToExtension(projectType);
    if( pageName.includes(viewsDefaultPrefix) ) pageName = pageName.replace(viewsDefaultPrefix, "");

    let currentViewJsonPath = themeAux.getInsideWTMPath(
      pagePath.POST,
      `WTM-${pageName.toLowerCase().split(" ").join("-")}.json`
    );
    let viewsDefaultJsonFolderPath: string = themeAux.getInsideWTMPath(pagePath.POST);
    let viewsCommonJsonPath: string = themeAux.getInsideWTMPath(
      "theme-rendering",
      `common.json`
    );
    let viewsCommonDefaultBuildPath: string = themeAux.getInsideThemePath(
      `common.${extension}`
    );
    super(
      pageName,
      projectType,
      parentAbsPath,
      viewsDefaultPrefix,
      viewsDefaultJsonFolderPath,
      currentViewJsonPath,
      viewsCommonJsonPath,
      viewsCommonDefaultBuildPath
    );

    this.initialize();
  }
  
  getIncludeFunction(path: string): string {
    return  WpFunctionComposer.includeRelative(path);
  }

  
}
