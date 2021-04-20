import { StringComposeWriter, FileWriter, extensions, ProjectTypes, ProjectReader, ProjectWriter, ProjectRender } from "..";
import { ProjectDependenciesManager } from "../ManageDependencies/ProjectDependenciesManager";
import { ConstProjects } from "../Constants/const.projects";

import { ProjectJsonInformations } from "../Types/manageProject.jsonInformations";
import { FileReader } from "../ManageFiles";
import { ProjectInitializer } from "./ProjectInitializer";

export class Project {
  public ERR_NO_PATH_EXISTS = "The passed pathd doesn't exists";

  public PROJECT_JSON_FILE_PATH: string = "";
  public PROJECT_JSON_DIR_PATH: string = "";

  public depManager: ProjectDependenciesManager;
  public ASSETS_PATH: string = "";
  public ASSETS_SCRIPTS_PATH: string = "";
  public ASSETS_STYLES_PATH: string = "";
  public ASSETS_IMG_PATH: string = "";
  public ASSETS_LIB_PATH: string = "";

  public JSON_FILE_CONTENT: ProjectJsonInformations;

  public reader: ProjectReader;
  public writer: ProjectWriter;
  public render: ProjectRender;
  public initializer: ProjectInitializer;

  /**
   * @description
   * @param projectContentOrPath the initial informations with which the project is created or ( if it already was created ) the project main folder
   */
  constructor(public projectContentOrPath: ProjectJsonInformations | string) {

    /* set the main objects to manage projects */
    this.reader = new ProjectReader(this);
    this.writer = new ProjectWriter(this);
    this.render = new ProjectRender(this);
    this.initializer = new ProjectInitializer(this);

    if (typeof projectContentOrPath != "string")
      this.JSON_FILE_CONTENT = projectContentOrPath;
    else {
      let jsonFile = StringComposeWriter.concatenatePaths(
        projectContentOrPath,
        ConstProjects.jsonPathInProjectDirectory,
        ConstProjects.jsonProjectFile
      );
      if (FileReader.existsPath(jsonFile)) {
        this.JSON_FILE_CONTENT = JSON.parse(FileReader.readFile(jsonFile));
      } else {
        throw new Error(this.ERR_NO_PATH_EXISTS);
      }
    }

    /* 
     set the correct paths to files and directories of the prject but
     withouth creating them, this are created once that the method
     -> this.intializer.create() 
     is called 
     */
    this.initializer.setProjectJsonFolderPath();
    this.initializer.setProjectJsonFilePath();
    this.initializer.setAssetsFolderPath();
    this.initializer.setAssetsScriptsFolderPath();
    this.initializer.setAssetsStylesFolderPath();
    this.initializer.setAssetsImagesFolderPath();
    this.initializer.setAssetsLibFolderPath();

    /* create the files and directories */
    this.initializer.create();

    this.depManager = new ProjectDependenciesManager(this);
  }

  
  
}
