import { ThemeAux } from "../../ManageTheme/ThemeAux";
import { pagePath } from "../../Enums/entities.visual.path";
import { AbstractGeneralView } from "../../Abstracts/AbstractGeneralView";
import { WpFunctionComposer } from "../../files/WpFunctionComposer";
import { ProjectTypes } from "../..";
import { MapProjectTypeToExtension, WTMPathsAndConstants } from "../../Enums";

export class Template extends AbstractGeneralView {


  constructor( themeAux: ThemeAux, pageName: string ) {

    let parentAbsPath: string = themeAux.getInsideThemePath(WTMPathsAndConstants.wpTemplatesDirectory);
    let viewsDefaultPrefix: string = WTMPathsAndConstants.wpTemplatePrefix;
    let projectType = ProjectTypes.wordpress;
    pageName = pageName.trim();
    if( pageName.includes(viewsDefaultPrefix) ) pageName = pageName.replace(viewsDefaultPrefix, "");

    let currentViewJsonPath = themeAux.getInsideWTMPath(
      pagePath.PAGE,
      `${pageName.toLowerCase().split(" ").join("-")}.json`
    );
    let viewsDefaultJsonFolderPath: string = themeAux.getInsideWTMPath(pagePath.PAGE);
    let viewsCommonJsonPath: string = themeAux.getInsideWTMPath(
      WTMPathsAndConstants.viewsJsonDirectory,
      `${WTMPathsAndConstants.wpTemplatePrefix}-${WTMPathsAndConstants.viewsCommonJsonFile}` // if the prefix is removed the singles common file and templates common file overlaps ( becouse they use the same name )
    );
    let viewsCommonDefaultBuildPath: string = themeAux.getInsideThemePath(
      `${WTMPathsAndConstants.viewsCommonContentFileName}.${MapProjectTypeToExtension[projectType]}`
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
    this.COMMON_DEFAULT_BUILD = WTMPathsAndConstants.wpTemplateCommonContent; // change the default content used to create the custom view
    this.initialize();
  }
  
  getIncludeFunction(path: string): string {
    return  WpFunctionComposer.includeRelative(path);
  }

  
}
