import { ThemeAux } from "../../ManageTheme/ThemeAux";
import { pagePath } from "../../Enums/entities.visual.path";
import { AbstractGeneralView } from "../../Abstracts/AbstractGeneralView";
import { WpFunctionComposer } from "../../files/WpFunctionComposer";
import { ProjectTypes } from "../..";
import { MapProjectTypeToExtension } from "../../Enums";
import { ConstWordpress } from "../../Constants/wordpress/const.wp";
import { ConstViews } from "../../Constants/const.views";

export class Template extends AbstractGeneralView {


  constructor( themeAux: ThemeAux, pageName: string ) {

    let parentAbsPath: string = themeAux.getPathInsideThemeFolder(ConstWordpress.wpTemplatesDirectory);
    let viewsDefaultPrefix: string = ConstWordpress.wpTemplatePrefix;
    let projectType = ProjectTypes.wordpress;
    pageName = pageName.trim();
    if( pageName.includes(viewsDefaultPrefix) ) pageName = pageName.replace(viewsDefaultPrefix, "");

    let currentViewJsonPath = themeAux.getPathInsideJsonFolder(
      pagePath.PAGE,
      `${pageName.toLowerCase().split(" ").join("-")}.json`
    );
    let viewsDefaultJsonFolderPath: string = themeAux.getPathInsideJsonFolder(pagePath.PAGE);
    let viewsCommonJsonPath: string = themeAux.getPathInsideJsonFolder(
      ConstViews.JsonDirectory,
      `${ConstWordpress.wpTemplatePrefix}-${ConstViews.CommonJsonFile}` // if the prefix is removed the singles common file and templates common file overlaps ( becouse they use the same name )
    );
    let viewsCommonDefaultBuildPath: string = themeAux.getPathInsideThemeFolder(
      `${ConstViews.CommonContentFileName}.${MapProjectTypeToExtension[projectType]}`
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
    this.COMMON_DEFAULT_BUILD = ConstWordpress.wpTemplateCommonContent; // change the default content used to create the custom view
    this.initialize();
  }
  
  getIncludeFunction(path: string): string {
    return  WpFunctionComposer.includeRelative(path);
  }

  
}
