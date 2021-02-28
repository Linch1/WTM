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
import { View } from "../Entities";
import { IdentifierHtml } from "../Identifiers";

export class Project {

  
  

  public PROJECT_JSON_FILE_PATH: string;
  public PROJECT_JSON_DIR_PATH: string;

  public depManager: ProjectDependenciesManager;
  public ASSETS_PATH: string;
  public ASSETS_SCRIPTS_PATH: string;
  public ASSETS_STYLES_PATH: string;
  public ASSETS_IMG_PATH: string;
  public ASSETS_LIB_PATH: string;
  

  /**
   * @description
   * @param JSON_FILE_CONTENT the initial informations with which the project is created
   */
  constructor(public JSON_FILE_CONTENT: ProjectJsonInformations) {
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
    
    // create this default visuals and views if not present
    // - visuals
    let header = this.buildVisual('header');
    let footer = this.buildVisual('footer');
    let scriptImplementer = this.buildVisual('add-scripts');
    let stylesImplementer = this.buildVisual('add-styles');
    let addScriptsIdentifier = IdentifierHtml.getIdentifierWithAction( ConstProjects.IdentifierScripts, identifierActions.EXECUTABLE, false);
    let addStylesIdentifier = IdentifierHtml.getIdentifierWithAction( ConstProjects.IdentifierStyles, identifierActions.EXECUTABLE, false);

    if( !header.isCreated() ){
      header.writer.createVisual();
      header.writer.editDefaultHtml(ConstProjects.htmlStart);
      header.converter.render( renderTypes.HTML );
    }
    if( !footer.isCreated() ){
      footer.writer.createVisual();
      footer.writer.editDefaultHtml(ConstProjects.htmlFooter);
      footer.converter.render( renderTypes.HTML );
    }
    if( !scriptImplementer.isCreated() ){
      scriptImplementer.writer.createVisual();
      scriptImplementer.writer.editDefaultHtml(addScriptsIdentifier + ConstProjects.htmlEnd);
      scriptImplementer.converter.render( renderTypes.HTML );
    }
    if( !stylesImplementer.isCreated() ){
      stylesImplementer.writer.createVisual();
      stylesImplementer.writer.editDefaultHtml(addStylesIdentifier);
      stylesImplementer.converter.render(renderTypes.HTML);
    }
    
    // - views
    let index = new View( this.getViewsPath(), 'index', this.getProjectType() );
    if( !index.isCreated() ){
      index.create();
      let headerInclude = this.parseInclude( IncludeFunctions.include( header.getRenderFilePath(), this.getProjectType() ) );
      let footerInclude = this.parseInclude( IncludeFunctions.include( footer.getRenderFilePath(), this.getProjectType() ) );
      let stylesImplementerInclude = this.parseInclude( IncludeFunctions.include( stylesImplementer.getRenderFilePath(), this.getProjectType() ) );
      let scriptImplementerInclude = this.parseInclude( IncludeFunctions.include( scriptImplementer.getRenderFilePath(), this.getProjectType() ) );
      if( !index.getDefaultHeader() ) index.setDefaultHeader( headerInclude + stylesImplementerInclude );
      if( !index.getDefaultFooter() ) index.setDefaultFooter( footerInclude + scriptImplementerInclude );
      if ( this.getProjectType() == ProjectTypes.html ) index.addDefaultScript( ConstProjects.htmlProjectIncludeJs ); 
      index.reloadJson();
      index.reCreate();
    }
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
  // alias of getPath() to work with the dependenciesManager
  public getProjectPath(): string {
    return this.getPath();
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

}
