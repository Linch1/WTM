import { StringComposeReader, StringComposeWriter } from "../../files";
import { AbstractGeneralView } from "../../Abstracts/entity.view.AbstractGeneralView";
import { IncludeFunctions } from "../../Enums/common.includeFunctions";
import { extensions } from "../../Enums/common.extension";
import { checkMapProjectTypeToExtension } from "../../Checkers/check.mapProjectTypeToExtension";
import { ProjectTypes } from "../..";

export class View extends AbstractGeneralView {
  constructor( parentAbsPath : string, pageName: string = "", projectType: ProjectTypes) {

    let viewsDefaultFolder: string = 'Views';
    let viewsDefaultPrefix: string = "view-";
    let viewsDefaultJsonFolder: string = "views-json";
    let extension: extensions = checkMapProjectTypeToExtension(projectType);

    parentAbsPath = parentAbsPath.trim();
    if( !(StringComposeReader.getPathLastElem(parentAbsPath) == viewsDefaultFolder))
      parentAbsPath = StringComposeWriter.concatenatePaths(parentAbsPath, viewsDefaultFolder);
    pageName = pageName.trim();

    let viewsDefaultJsonFolderPath: string = StringComposeWriter.concatenatePaths(parentAbsPath, `${viewsDefaultJsonFolder}`);
    
    if( pageName.includes(viewsDefaultPrefix) ) pageName = pageName.replace(viewsDefaultPrefix, "");
    extension = extension.trim() as extensions;

    let currentViewJsonPath = StringComposeWriter.concatenatePaths(parentAbsPath, `${viewsDefaultJsonFolder}/WTM-${pageName.toLowerCase().split(" ").join("-")}.json`);
    let viewsCommonJsonPath: string = StringComposeWriter.concatenatePaths(parentAbsPath, `${viewsDefaultJsonFolder}/common.json`);
    let viewsCommonDefaultBuildPath: string = StringComposeWriter.concatenatePaths(parentAbsPath, `common.${extension}`);
    
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
    return IncludeFunctions.include(path, ProjectTypes.ejs);
  }
}
