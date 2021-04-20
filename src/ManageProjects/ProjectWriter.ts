import { ConstProjectsInit } from "../Constants/const.projects.init";
import { ConstVisuals } from "../Constants/const.visuals";
import { IncludeFunctions } from "../Enums/common.includeFunctions";
import { ProjectTypes } from "../Enums/common.projectTypes";
import { renderTypes } from "../Enums/manageVisual.renderType";
import { FileWriter } from "../ManageFiles/FileWriter";
import { View } from "../ManageView/View";
import { Visual } from "../ManageVisual/Visual";
import { ProjectJsonInformations } from "../Types/manageProject.jsonInformations";
import { Project } from "./Project";

export class ProjectWriter {
  constructor(public project: Project) {}

  /**
   * @description saves the project json
   */
  public saveJson() {
    FileWriter.writeFile(
        this.project.PROJECT_JSON_FILE_PATH,
      JSON.stringify(this.project.JSON_FILE_CONTENT)
    );
  }

  /**
   * @description set the demo url
   * @param newOne
   */
  public setDemoUrl(newOne: string): void {
    this.project.JSON_FILE_CONTENT.demoUrl = newOne;
  }

  /**
   * @description set the path to the project views folder
   */
  public setViewsPath(newOne: string) {
    this.project.JSON_FILE_CONTENT.viewsPath = newOne;
    this.saveJson();
  }
  /**
   * @description set the name of the project
   */
  public setName(newOne: string) {
    this.project.JSON_FILE_CONTENT.name = newOne;
    this.saveJson();
  }
  /**
   * @description set the author of the project
   */
  public setAuthor(newOne: string) {
    this.project.JSON_FILE_CONTENT.author = newOne;
    this.saveJson();
  }
  /**
   * @description replace the project json with the passed one
   * @param json
   */
  public setJson(json: ProjectJsonInformations) {
    this.project.JSON_FILE_CONTENT = json;
    this.saveJson();
  }
  /**
   * @description set the author url of the project
   */
  public setAuthorUrl(newOne: string) {
    this.project.JSON_FILE_CONTENT.autorhUrl = newOne;
    this.saveJson();
  }
  /**
   * @description set the github repo of the project
   */
  public setGithubRepo(newOne: string) {
    this.project.JSON_FILE_CONTENT.githubRepo = newOne;
    this.saveJson();
  }
  public setVisualsPath(newOne: string) {
    this.project.JSON_FILE_CONTENT.visualsPath = newOne;
    this.saveJson();
  }
  public setPath(newOne: string) {
    this.project.JSON_FILE_CONTENT.path = newOne;
    this.saveJson();
  }

  public createDefaultContent() {
    // create this default visuals and views if not present

    // - visuals
    let htmlStartVisual: Visual = this.createVisual("htmlStart");
    let htmlEndVisual: Visual = this.createVisual("htmlEnd");
    if (this.project.reader.getProjectType() != ProjectTypes.html) {
      if (!htmlStartVisual.reader.isCreated()) {
        htmlStartVisual.initializer.create();
        htmlStartVisual.writer.editDefaultHtml(ConstProjectsInit.htmlStart);
        htmlStartVisual.render.render(renderTypes.HTML);
      }
      if (!htmlEndVisual.reader.isCreated()) {
        htmlEndVisual.initializer.create();
        htmlEndVisual.writer.editDefaultHtml(ConstProjectsInit.htmlEnd);
        htmlEndVisual.render.render(renderTypes.HTML);
      }
    }
    
    // - views
    let index = new View("index", new Project(this.project.reader.getPath()));
    if (!index.reader.isCreated()) {
      index.writer.create();
      if (this.project.reader.getProjectType() != ProjectTypes.html) {
        let headerInclude = this.parsePathToInclude(
          IncludeFunctions.include(
            htmlStartVisual.reader.getRenderFilePath(),
            this.project.reader.getProjectType()
          )
        );
        let footerInclude = this.parsePathToInclude(
          IncludeFunctions.include(
            htmlEndVisual.reader.getRenderFilePath(),
            this.project.reader.getProjectType()
          )
        );
        if (!index.reader.getViewStart())
          index.writer.setViewStart(headerInclude);
        if (!index.reader.getViewEnd()) index.writer.setViewEnd(footerInclude);
      } else {
        if (!index.reader.getViewStart())
          index.writer.setViewStart(ConstProjectsInit.htmlStart);
        if (!index.reader.getViewEnd())
          index.writer.setViewEnd(ConstProjectsInit.htmlEnd);
        index.writer.addDefaultScript(
          ConstProjectsInit.IncludeScriptForHtmlProject
        );
      }
      index.writer.reCreate();
    }
  }

  /**
   * @description removes ( if present ) from the passed path the project path and returns the path 'relative' to the project directory
   * @param path 
   * @returns 
   */
   public parsePathToInclude(path: string): string {
    return path.includes(this.project.reader.getPath())
      ? path.replace(this.project.reader.getPath(), "")
      : path;
  }

  /**
   * @description creates and returns a visual with the passed name ( the project type and path are inherted form the project )
   * @param name 
   * @returns 
   */
  public createVisual(name: string): Visual {
    let visualScheleton = ConstVisuals.getVisualsJsonContent();
    visualScheleton.name = name;
    visualScheleton.projectPath = this.project.reader.getPath();
    visualScheleton.projectType = this.project.reader.getProjectType() as ProjectTypes;
    let visual = new Visual(this.project.reader.getVisualsPath(), visualScheleton);
    return visual;
  }
}
