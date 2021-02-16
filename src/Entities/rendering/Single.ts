import { ThemeAux } from "../../ManageTheme/ThemeAux";
import { pagePath } from "../../Enums/entities.visual.path";
import { AbstractGeneralView } from "../../Abstracts/AbstractGeneralView";
import { WpFunctionComposer } from "../../files/WpFunctionComposer";
import { ProjectTypes, WTMPathsAndConstants } from "../../Enums";
import { checkMapProjectTypeToExtension } from "../../Checkers/check.mapProjectTypeToExtension";

export class Single extends AbstractGeneralView {


  constructor( themeAux: ThemeAux, pageName: string ) {

    let parentAbsPath: string = themeAux.getInsideThemePath(WTMPathsAndConstants.wpSinglesDirectory);
    let viewsDefaultPrefix: string = WTMPathsAndConstants.wpSinglePrefix;
    let projectType = ProjectTypes.wordpress;
    pageName = pageName.trim();
    let extension = checkMapProjectTypeToExtension(projectType);
    if( pageName.includes(viewsDefaultPrefix) ) pageName = pageName.replace(viewsDefaultPrefix, "");

    let currentViewJsonPath = themeAux.getInsideWTMPath(
      pagePath.POST,
      `${pageName.toLowerCase().split(" ").join("-")}.json`
    );
    let viewsDefaultJsonFolderPath: string = themeAux.getInsideWTMPath(pagePath.POST);
    let viewsCommonJsonPath: string = themeAux.getInsideWTMPath(
      WTMPathsAndConstants.viewsJsonDirectory,
      `${WTMPathsAndConstants.wpTemplatePrefix}-${WTMPathsAndConstants.viewsCommonJsonFile}` // if the prefix is removed the singles common file and templates common file overlaps ( becouse they use the same name )
    );
    let viewsCommonDefaultBuildPath: string = themeAux.getInsideThemePath(
      `${WTMPathsAndConstants.viewsCommonContentFileName}.${extension}`
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
    this.COMMON_DEFAULT_BUILD = WTMPathsAndConstants.wpSingleCommonContent; // change the default content used to create the custom view
    this.initialize();
  }
  
  getIncludeFunction(path: string): string {
    return  WpFunctionComposer.includeRelative(path);
  }

  
}
