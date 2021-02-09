import { ThemeAux } from "../../ManageTheme/ThemeAux";
import { pageTypes } from "../../Enums/entities.visual.type";
import { pagePath } from "../../Enums/entities.visual.path";
import { FileReader, FileWriter, StringComposeReader, StringComposeWriter } from "../../files";
import { AbstractGeneralView } from "../../Abstracts/entity.view.AbstractGeneralView";

export class View extends AbstractGeneralView {
  constructor( parentAbsPath : string, pageName: string = "", extension: string = "php") {

    let viewsDefaultFolder: string = 'Views';
    let viewsDefaultPrefix: string = "view-";
    let viewsDefaultJsonFolder: string = "views-json";

    parentAbsPath = parentAbsPath.trim();
    if( !(StringComposeReader.getPathLastElem(parentAbsPath) == viewsDefaultFolder))
      parentAbsPath = StringComposeWriter.concatenatePaths(parentAbsPath, viewsDefaultFolder);
    pageName = pageName.trim();

    let viewsDefaultJsonFolderPath: string = StringComposeWriter.concatenatePaths(parentAbsPath, `${viewsDefaultJsonFolder}`);
    
    if( pageName.includes(viewsDefaultPrefix) ) pageName = pageName.replace(viewsDefaultPrefix, "");
    extension = extension.trim();

    let currentViewJsonPath = StringComposeWriter.concatenatePaths(parentAbsPath, `${viewsDefaultJsonFolder}/WTM-${pageName.toLowerCase().split(" ").join("-")}.json`);
    let viewsCommonJsonPath: string = StringComposeWriter.concatenatePaths(parentAbsPath, `${viewsDefaultJsonFolder}/common.json`);
    let viewsCommonDefaultBuildPath: string = StringComposeWriter.concatenatePaths(parentAbsPath, `common.${extension}`);
    
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
    return `<%-include (TEMPLATE_PATH +"${path}", {TEMPLATE_PATH: process.env.PWD})-%>`;
  }
}
