import { ThemeAux } from "../../ManageTheme/ThemeAux";
import { pagePath } from "../../Enums/entities.visual.path";
import { AbstractGeneralView } from "../../Abstracts/entity.view.AbstractGeneralView";
import { WpFunctionComposer } from "../../files/WpFunctionComposer";
import { extensions } from "../../Enums/extension";

export class Single extends AbstractGeneralView {


  constructor( themeAux: ThemeAux, pageName: string ) {

    let parentAbsPath: string = themeAux.getInsideThemePath("");
    let viewsDefaultPrefix: string = "single-";
    let extension = extensions.php;
    pageName = pageName.trim();
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
    console.log(
      pageName,
      extension,
      parentAbsPath,
      viewsDefaultPrefix,
      viewsDefaultJsonFolderPath,
      currentViewJsonPath,
      viewsCommonJsonPath,
      viewsCommonDefaultBuildPath
    )
    super(
      pageName,
      extension,
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
