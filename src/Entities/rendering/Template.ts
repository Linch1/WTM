import { ThemeAux } from "../../ManageTheme/ThemeAux";
import { pagePath } from "../../Enums/entities.visual.path";
import { AbstractGeneralView } from "../../Abstracts/AbstractGeneralView";
import { WpFunctionComposer } from "../../files/WpFunctionComposer";
import { ProjectTypes } from "../..";
import { MapProjectTypeToExtension } from "../../Enums";

export class Template extends AbstractGeneralView {


  constructor( themeAux: ThemeAux, pageName: string ) {

    let parentAbsPath: string = themeAux.getInsideThemePath("");
    let viewsDefaultPrefix: string = "template-";
    let projectType = ProjectTypes.wordpress;
    pageName = pageName.trim();
    if( pageName.includes(viewsDefaultPrefix) ) pageName = pageName.replace(viewsDefaultPrefix, "");

    let currentViewJsonPath = themeAux.getInsideWTMPath(
      pagePath.PAGE,
      `WTM-${pageName.toLowerCase().split(" ").join("-")}.json`
    );
    let viewsDefaultJsonFolderPath: string = themeAux.getInsideWTMPath(pagePath.PAGE);
    let viewsCommonJsonPath: string = themeAux.getInsideWTMPath(
      "theme-rendering",
      `common.json`
    );
    let viewsCommonDefaultBuildPath: string = themeAux.getInsideThemePath(
      `common.${MapProjectTypeToExtension[projectType]}`
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
