import { StringComposeReader, StringComposeWriter } from "../../files";
import { AbstractGeneralView } from "../../Abstracts/AbstractGeneralView";
import { IncludeFunctions } from "../../Enums/common.includeFunctions";
import { extensions } from "../../Enums/common.extension";
import { checkMapProjectTypeToExtension } from "../../Checkers/check.mapProjectTypeToExtension";
import { ProjectTypes } from "../..";
import { ConstViews } from "../../Constants/const.views";

export class View extends AbstractGeneralView {
  constructor( parentAbsPath : string, pageName: string, projectType: ProjectTypes) {

    let viewsDefaultFolder: string = ConstViews.viewsDirectory;
    let viewsDefaultPrefix: string = ConstViews.viewsPrefix;
    let viewsDefaultJsonFolder: string = ConstViews.viewsJsonDirectory;

    let extension: extensions = checkMapProjectTypeToExtension(projectType);

    // the parentAbsPath point to the views directory, if not the default viewsFolderName is at the end of the path and the directory will be created
    parentAbsPath = parentAbsPath.trim();
    if( !(StringComposeReader.getPathLastElem(parentAbsPath) == viewsDefaultFolder) )
      parentAbsPath = StringComposeWriter.concatenatePaths(parentAbsPath, viewsDefaultFolder);

    pageName = pageName.trim();

    let viewsDefaultJsonFolderPath: string = StringComposeWriter.concatenatePaths(parentAbsPath, `${viewsDefaultJsonFolder}`);
    
    if( pageName.includes(viewsDefaultPrefix) ) pageName = pageName.replace(viewsDefaultPrefix, "");
    extension = extension.trim() as extensions;

    let currentViewJsonPath = StringComposeWriter.concatenatePaths(parentAbsPath, `${viewsDefaultJsonFolder}/${pageName.toLowerCase().split(" ").join("-")}.json`);
    let viewsCommonJsonPath: string = StringComposeWriter.concatenatePaths(parentAbsPath, viewsDefaultJsonFolder, ConstViews.viewsCommonJsonFile);
    let viewsCommonDefaultBuildPath: string = StringComposeWriter.concatenatePaths(parentAbsPath, `${ConstViews.viewsCommonContentFileName}.${extension}`);
    
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
