import { Project } from ".";
import { Checker } from "../Checkers/Checker";
import { ConstProjects } from "../Constants/const.projects";
import { extensions } from "../Enums/common.extension";
import { ProjectTypes } from "../Enums/common.projectTypes";
import { FileReader } from "../ManageFiles";
import { ProjectJsonInformations } from "../Types/manageProject.jsonInformations";

export class ProjectReader {
  constructor(public project: Project) {}
  /**
   * @description check if the project is created or not, returns true if yes flase if not
   * @returns boolean
   */
  public isCreated(): boolean {
    return FileReader.existsPath(this.project.PROJECT_JSON_DIR_PATH);
  }

  /**
   * @description get the url of the demo
   * @returns
   */
  public getDemoUrl(): string {
    return this.project.JSON_FILE_CONTENT.demoUrl;
  }
  /**
   * @description returs the project json
   * @returns
   */
  public getJson() {
    return this.project.JSON_FILE_CONTENT;
  }
  /**
   * @description return the name of the porject
   */
  public getName(): string {
    return this.project.JSON_FILE_CONTENT.name;
  }
  /**
   * @description return author of the project
   */
  public getAuthor(): string {
    return this.project.JSON_FILE_CONTENT.author;
  }
  /**
   * @description return author site
   */
  public getAuthorUrl(): string {
    return this.project.JSON_FILE_CONTENT.autorhUrl;
  }
  /**
   * @description return the repo of the project
   */
  public getGithubRepo(): string {
    return this.project.JSON_FILE_CONTENT.githubRepo;
  }
  /**
   * @description return the extension used for the porject based on the projectType
   */
  public getExtension(): extensions {
    return Checker.checkMapProjectTypeToExtension(
        this.project.JSON_FILE_CONTENT.projectType
    );
  }
  /**
   * @description return the type of the project
   */
  public getProjectType(): ProjectTypes {
    return this.project.JSON_FILE_CONTENT.projectType;
  }
  /**
   * @description return the abs path to the project views directory
   */
  public getViewsPath(): string {
    return this.project.JSON_FILE_CONTENT.viewsPath;
  }
  /**
   * @description return the abs path to the project visuals directory
   */
  public getVisualsPath(): string {
    return this.project.JSON_FILE_CONTENT.visualsPath;
  }
  /**
   * @description returns the path to the project directory ( not the WTM-PROJECT directory )
   */
  public getPath(): string {
    return this.project.JSON_FILE_CONTENT.path;
  }
  /**
   *  @description  alias of getPath() to work with the dependenciesManager
   * */
  public getProjectPath(): string {
    return this.getPath();
  }
  /**
   * @description get the json that contains the default values for intialize a visual
   * @returns
   */
  static getDefaultJson(): ProjectJsonInformations {
    return ConstProjects.getProjectsJsonContent();
  }
  /**
   * @description get the keys of the json that contains default values for intialize a visual
   * @returns
   */
  static getDefaultJsonKeys(): string[] {
    return Object.keys(ConstProjects.getProjectsJsonContent());
  }
}
