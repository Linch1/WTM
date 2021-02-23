import { ThemeAux } from "../../ManageTheme/ThemeAux";
import { pagePath } from "../../Enums/entities.visual.path";
import { AbstractGeneralView } from "../../Abstracts/AbstractGeneralView";
import { WpFunctionComposer } from "../../files/WpFunctionComposer";
import { ProjectTypes } from "../../Enums";
import { checkMapProjectTypeToExtension } from "../../Checkers/check.mapProjectTypeToExtension";
import { ConstWordpress } from "../../Constants/wordpress/const.wp";
import { ConstViews } from "../../Constants/const.views";

export class Single extends AbstractGeneralView {


  constructor( themeAux: ThemeAux, pageName: string ) {

    let parentAbsPath: string = themeAux.getPathInsideThemeFolder(ConstWordpress.wpSinglesDirectory);
    let viewsDefaultPrefix: string = ConstWordpress.wpSinglePrefix;
    let projectType = ProjectTypes.wordpress;
    pageName = pageName.trim();
    let extension = checkMapProjectTypeToExtension(projectType);
    if( pageName.includes(viewsDefaultPrefix) ) pageName = pageName.replace(viewsDefaultPrefix, "");

    let currentViewJsonPath = themeAux.getPathInsideJsonFolder(
      pagePath.POST,
      `${pageName.toLowerCase().split(" ").join("-")}.json`
    );
    let viewsDefaultJsonFolderPath: string = themeAux.getPathInsideJsonFolder(pagePath.POST);
    let viewsCommonJsonPath: string = themeAux.getPathInsideJsonFolder(
      ConstViews.JsonDirectory,
      `${ConstWordpress.wpTemplatePrefix}-${ConstViews.CommonJsonFile}` // if the prefix is removed the singles common file and templates common file overlaps ( becouse they use the same name )
    );
    let viewsCommonDefaultBuildPath: string = themeAux.getPathInsideThemeFolder(
      `${ConstViews.CommonContentFileName}.${extension}`
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
    this.COMMON_DEFAULT_BUILD = ConstWordpress.wpSingleCommonContent; // change the default content used to create the custom view
    this.initialize();
  }
  
  getIncludeFunction(path: string): string {
    return  WpFunctionComposer.includeRelative(path);
  }

  
}
