import { StringComposeReader, StringComposeWriter } from "../../files";
import { AbstractGeneralView } from "../../Abstracts/AbstractGeneralView";
import { IncludeFunctions } from "../../Enums/common.includeFunctions";
import { extensions } from "../../Enums/common.extension";
import { checkMapProjectTypeToExtension } from "../../Checkers/check.mapProjectTypeToExtension";
import { ProjectTypes } from "../..";
import { ConstViews } from "../../Constants/const.views";

export class View extends AbstractGeneralView {
  constructor( viewsPath : string, pageName: string, projectType: ProjectTypes) {

    let viewsDefaultFolder: string = ConstViews.Directory;
    let viewsDefaultPrefix: string = ConstViews.Prefix;
    let viewsDefaultJsonFolder: string = ConstViews.JsonDirectory;

    let extension: extensions = checkMapProjectTypeToExtension(projectType);

    // the viewsPath point to the views directory, if not the default viewsFolderName is at the end of the path and the directory will be created
    viewsPath = viewsPath.trim();
    if( !(StringComposeReader.getPathLastElem(viewsPath) == viewsDefaultFolder) )
      viewsPath = StringComposeWriter.concatenatePaths(viewsPath, viewsDefaultFolder);

    pageName = pageName.trim();

    let viewsDefaultJsonFolderPath: string = StringComposeWriter.concatenatePaths(viewsPath, `${viewsDefaultJsonFolder}`);
    
    if( pageName.includes(viewsDefaultPrefix) ) pageName = pageName.replace(viewsDefaultPrefix, "");
    extension = extension.trim() as extensions;

    let currentViewJsonPath = StringComposeWriter.concatenatePaths(viewsPath, `${viewsDefaultJsonFolder}/${pageName.toLowerCase().split(" ").join("-")}.json`);
    let viewsCommonJsonPath: string = StringComposeWriter.concatenatePaths(viewsPath, viewsDefaultJsonFolder, ConstViews.CommonJsonFile);
    let viewsCommonDefaultBuildPath: string = StringComposeWriter.concatenatePaths(viewsPath, `${ConstViews.CommonContentFileName}.${extension}`);
    
    super(
      pageName,
      projectType,
      viewsPath,
      viewsDefaultPrefix,
      viewsDefaultJsonFolderPath,
      currentViewJsonPath,
      viewsCommonJsonPath,
      viewsCommonDefaultBuildPath
    );
    this.initialize();
  }
  getIncludeFunction(path: string): string {
    return IncludeFunctions.include(path, this.getProjectType());
  }
}
