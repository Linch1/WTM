import { AbstractGeneralView } from "../../Abstracts/AbstractGeneralView";
import { IncludeFunctions } from "../../Enums/common.includeFunctions";
import { ConstViews } from "../../Constants/const.views";
import { Project } from "../../ManageProjects";

export class View extends AbstractGeneralView {
  constructor( pageName: string, project: Project) {
    let viewsDefaultPrefix: string = ConstViews.Prefix;
    pageName = pageName.trim();
    if( pageName.includes(viewsDefaultPrefix) ) pageName = pageName.replace(viewsDefaultPrefix, "");
    super( pageName, project );
    this.initialize();
  }
  getIncludeFunction(path: string): string {
    return IncludeFunctions.include(path, this.getProjectType());
  }
}
