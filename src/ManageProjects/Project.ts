import {
  StringComposeWriter,
  FileWriter,
  extensions,
  ProjectTypes,
} from "..";
import { ProjectDependenciesManager } from "../ManageDependencies/ProjectDependenciesManager";
import { checkMapProjectTypeToExtension } from "../Checkers/check.mapProjectTypeToExtension";
import { ConstProjects } from "../Constants/const.projects";

import { ProjectJsonInformations } from "../Types/manageProject.jsonInformations";
import { Visual } from "../ManageVisual";
import { identifierActions, IncludeFunctions, renderTypes } from "../Enums";
import { IdentifierHtml, IdentifierPlaceholder } from "../Identifiers";
import { ConstProjectsInit } from "../Constants/const.projects.init";
import { FileReader } from "../files";

export class Project {

  
  public ERR_NO_PATH_EXISTS = "The passed pathd doesn't exists";

  public PROJECT_JSON_FILE_PATH: string;
  public PROJECT_JSON_DIR_PATH: string;

  public depManager: ProjectDependenciesManager;
  public ASSETS_PATH: string;
  public ASSETS_SCRIPTS_PATH: string;
  public ASSETS_STYLES_PATH: string;
  public ASSETS_IMG_PATH: string;
  public ASSETS_LIB_PATH: string;

  public JSON_FILE_CONTENT: ProjectJsonInformations;
  

  /**
   * @description
   * @param projectContentOrPath the initial informations with which the project is created or ( if it already was created ) the project main folder 
   */
  constructor(public projectContentOrPath: ProjectJsonInformations | string) {
    
    if( typeof projectContentOrPath != "string" ) this.JSON_FILE_CONTENT = projectContentOrPath;
    else {
      let jsonFile = StringComposeWriter.concatenatePaths(
        projectContentOrPath,
        ConstProjects.jsonPathInProjectDirectory,
        ConstProjects.jsonProjectFile
      )
      if( FileReader.existsPath( jsonFile )) {
        this.JSON_FILE_CONTENT = JSON.parse( FileReader.readFile( jsonFile ) );
      } else {
        throw new Error( this.ERR_NO_PATH_EXISTS );
      }
    }

    this.PROJECT_JSON_DIR_PATH = StringComposeWriter.concatenatePaths(
      this.getPath(),
      ConstProjects.jsonPathInProjectDirectory
    );
    this.PROJECT_JSON_FILE_PATH = StringComposeWriter.concatenatePaths(
      this.PROJECT_JSON_DIR_PATH,
      ConstProjects.jsonProjectFile
    );
    this.ASSETS_PATH = StringComposeWriter.concatenatePaths(
      this.PROJECT_JSON_DIR_PATH,
      ConstProjects.projectAssetsDirectory
    );
    this.ASSETS_SCRIPTS_PATH = StringComposeWriter.concatenatePaths(
      this.ASSETS_PATH,
      ConstProjects.projectAssetsJsDirectory
    );
    this.ASSETS_STYLES_PATH = StringComposeWriter.concatenatePaths(
      this.ASSETS_PATH,
      ConstProjects.projectAssetsCssDirectory
    );
    this.ASSETS_IMG_PATH = StringComposeWriter.concatenatePaths(
      this.ASSETS_PATH,
      ConstProjects.projectAssetsImgDirectory
    );
    this.ASSETS_LIB_PATH = StringComposeWriter.concatenatePaths(
      this.ASSETS_PATH,
      ConstProjects.projectAssetsLibDirectory
    );
    this.depManager = new ProjectDependenciesManager(this);

    this.initalize();
  }

  public initalize() {
    if( this.isCreated() ) return;
    FileWriter.createDirectory(this.PROJECT_JSON_DIR_PATH);
    FileWriter.createDirectory(this.getViewsPath());
    FileWriter.createDirectory(this.getVisualsPath());
    FileWriter.createDirectory(this.depManager.getAssetsPath());
    FileWriter.createDirectory(this.depManager.getAssetsLibPath());
    FileWriter.createDirectory(this.depManager.getAssetsScriptsPath());
    FileWriter.createDirectory(this.depManager.getAssetsImgPath());
    FileWriter.createDirectory(this.depManager.getAssetsStylesPath());
    FileWriter.createFile(
      this.PROJECT_JSON_FILE_PATH,
      JSON.stringify(this.JSON_FILE_CONTENT)
    );

    this.createDefaultContent();

  }
  
  public buildVisual( name: string ): Visual{
    let visualScheleton = {
      name: name,
      projectPath: this.getPath(),
      projectType: this.getProjectType() as ProjectTypes,
      assetsAutoImport: false,
      author: "",
      authorUrl: "",
      githubRepo: ""
    }
    let visual = new Visual( this.getVisualsPath(), visualScheleton );
    return visual;
  }
  public parseInclude( path: string): string{
    return path.includes( this.getPath() ) ? path.replace( this.getPath(), "") : path;
  }

  public saveJson() {
    FileWriter.writeFile(
      this.PROJECT_JSON_FILE_PATH,
      JSON.stringify(this.JSON_FILE_CONTENT)
    );
  }
  public getJson(){
    return this.JSON_FILE_CONTENT;
  }
  /**
   * @description return the name of the porject
   */
  public getName(): string {
    return this.JSON_FILE_CONTENT.name;
  }
  /**
   * @description return author of the project
   */
  public getAuthor(): string {
    return this.JSON_FILE_CONTENT.author;
  }
  /**
   * @description return author site
   */
  public getAuthorUrl(): string {
    return this.JSON_FILE_CONTENT.autorhUrl;
  }
  /**
   * @description return the repo of the project
   */
  public getGithubRepo(): string {
    return this.JSON_FILE_CONTENT.githubRepo;
  }
  /**
   * @description return the extension used for the porject based on the projectType
   */
  public getExtension(): extensions {
    return checkMapProjectTypeToExtension(
      this.JSON_FILE_CONTENT.projectType
    );
  }
  /**
   * @description return the type of the project
   */
  public getProjectType(): ProjectTypes {
    return this.JSON_FILE_CONTENT.projectType;
  }
  /**
   * @description return the abs path to the project views directory
   */
  public getViewsPath(): string {
    return this.JSON_FILE_CONTENT.viewsPath;
  }
  /**
   * @description return the abs path to the project visuals directory
   */
  public getVisualsPath(): string {
    return this.JSON_FILE_CONTENT.visualsPath;
  }
  /**
   * @description returns the path to the project directory ( not the WTM-PROJECT directory )
   */
  public getPath(): string {
    return this.JSON_FILE_CONTENT.path;
  }
  /**
   *  @description  alias of getPath() to work with the dependenciesManager
   * */
  public getProjectPath(): string {
    return this.getPath();
  }

  public isCreated(): boolean {
    return FileReader.existsPath( this.PROJECT_JSON_DIR_PATH );
  }
  
  /**
   * @description set the path to the project views folder
   */
  public setViewsPath(newOne: string) {
    this.JSON_FILE_CONTENT.viewsPath = newOne;
    this.saveJson();
  }
  /**
   * @description set the name of the project
   */
  public setName(newOne: string) {
    this.JSON_FILE_CONTENT.name = newOne;
    this.saveJson();
  }
  /**
   * @description set the author of the project
   */
  public setAuthor(newOne: string) {
    this.JSON_FILE_CONTENT.author = newOne;
    this.saveJson();
  }
  /**
   * @description set the author url of the project
   */
  public setAuthorUrl(newOne: string) {
    this.JSON_FILE_CONTENT.autorhUrl = newOne;
    this.saveJson();
  }
  /**
   * @description set the github repo of the project
   */
  public setGithubRepo(newOne: string) {
    this.JSON_FILE_CONTENT.githubRepo = newOne;
    this.saveJson();
  }
  public setVisualsPath(newOne: string) {
    this.JSON_FILE_CONTENT.visualsPath = newOne;
    this.saveJson();
  }
  public setPath(newOne: string) {
    this.JSON_FILE_CONTENT.path = newOne;
    this.saveJson();
  }

  public createDefaultContent(){
    // create this default visuals and views if not present
    // - visuals
    let htmlStartView: Visual = this.buildVisual('htmlStart');
    let htmlEndView: Visual = this.buildVisual('htmlEnd');
    if( this.getProjectType() != ProjectTypes.html ){
      if( !htmlStartView.isCreated() ){
        htmlStartView.writer.createVisual();
        htmlStartView.writer.editDefaultHtml(ConstProjectsInit.htmlStart);
        htmlStartView.converter.render( renderTypes.HTML );
      }
      if( !htmlEndView.isCreated() ){
        htmlEndView.writer.createVisual();
        htmlEndView.writer.editDefaultHtml(ConstProjectsInit.htmlEnd);
        htmlEndView.converter.render( renderTypes.HTML );
      }
    }
    
    // - views
    // let index = new View( 'index', new Project( this.getPath() ) );
    // if( !index.isCreated() ){
    //   index.create();
    //   if( this.getProjectType() != ProjectTypes.html ){
    //     let headerInclude = this.parseInclude( IncludeFunctions.include( htmlStartView.getRenderFilePath(), this.getProjectType() ) );
    //     let footerInclude = this.parseInclude( IncludeFunctions.include( htmlEndView.getRenderFilePath(), this.getProjectType() ) );
    //     if( !index.getViewStart() ) index.setViewStart( headerInclude );
    //     if( !index.getViewEnd() ) index.setViewEnd( footerInclude );
    //   } else {
    //     if( !index.getViewStart() ) index.setViewStart( ConstProjectsInit.htmlStart );
    //     if( !index.getViewEnd() ) index.setViewEnd( ConstProjectsInit.htmlEnd );
    //     index.addDefaultScript( ConstProjectsInit.IncludeScriptForHtmlProject ); 
    //   }
    //   index.reCreate();
    // }
  }

}
