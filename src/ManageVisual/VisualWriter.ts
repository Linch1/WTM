import { FileWriter } from "../files/FileWriter";
import { FileReader } from "../files/FileReader";
import { visualJsonIdentifiers } from "../Types/manageVisual.jsons";
import { Identifiers } from "../Identifiers/Identifiers";
import { Visual } from "./Visual";
import { identifierActions, renderTypes } from "../Enums";
import { identifiersAttributesType } from "../Types/identifiers.attributes";
import { ConstVisuals } from "../Constants";
import { timeStamp } from "console";
import { StringComposeWriter } from "../files";

export class VisualWriter {

  public ERR_NOT_RENDER_IDENTIFIER = "During the population of the identifier was found a non registered RENDER identifier, check the enum renderTypes."

  constructor(public visual: Visual) {}

  /**
   * @description create the visual directory and populate it with the main files [render.html, default.html, identifiers.json]
   * @returns string: the path to the visual folder
   */
  public createVisual(): string {
    let visualPath = this.visual.getDirPath();
    if (FileReader.existsPath(visualPath)) {
      throw new Error(this.visual.ERR_VISUAL_ALREADY_EXISTS);
    }
    
    FileWriter.createDirectory(visualPath);
    FileWriter.createDirectory(this.visual.getAssetsDirPath());
    FileWriter.createDirectory(this.visual.getAssetsJsDirPath());
    FileWriter.createDirectory(this.visual.getAssetsCssDirPath());
    FileWriter.createDirectory(this.visual.getAssetsImgDirPath());

    FileWriter.createFile(
      this.visual.RENDER_FILE_PATH,
      this.visual.INIT_RENDER_FILE_CONTENT
    );
    FileWriter.createFile(
      this.visual.DEFAULT_FILE_PATH,
      this.visual.INIT_DEFAULT_FILE_CONTENT
    );
    this.saveJson();
    
    return visualPath;
  }

  public saveJson() {
    FileWriter.writeFile(
      this.visual.JSON_FILE_PATH,
      JSON.stringify(this.visual.JSON_FILE_CONTENT)
    );
  }

  public setName(name: string){
    this.visual.JSON_FILE_CONTENT.visual.name = name;
    this.saveJson();
  }
  public setAuthor(author: string){
    this.visual.JSON_FILE_CONTENT.visual.author = author;
    this.saveJson();
  }
  public setAssetsAutoImport(autoImport: boolean){
    this.visual.JSON_FILE_CONTENT.visual.assetsAutoImport = autoImport;
    this.saveJson();
  }
  public setAuthorUrl(url: string){
    this.visual.JSON_FILE_CONTENT.visual.authorUrl = url;
    this.saveJson();
  }
  public setGithubRepo(name: string){
    this.visual.JSON_FILE_CONTENT.visual.name = name;
    this.saveJson();
  }

  /**
   * @description add the passed path as style dependency in the visual json
   * @param path 
   */
  public addStyle(path: string): void{
    path = path.trim();
    let stylesPath = this.visual.getAssetsCssDirPath();
    let projectPath = this.visual.getProjectDirPath();
    if( !path.includes(stylesPath) ) path = StringComposeWriter.concatenatePaths(stylesPath, path);
    if( path.includes(projectPath) ) path = path.replace(projectPath, "");

    if( this.visual.JSON_FILE_CONTENT.dependencies.styles.includes(path)) return;
    this.visual.JSON_FILE_CONTENT.dependencies.styles.push(path);
    this.saveJson();
  }
  /**
   * @description add the passed path as script dependency in the visual json
   * @param path 
   */
  public addScript(path: string): void{
    path = path.trim();
    let scriptsPath = this.visual.getAssetsJsDirPath();
    let projectPath = this.visual.getProjectDirPath();
    if( !path.includes(scriptsPath) ) path = StringComposeWriter.concatenatePaths(scriptsPath, path);
    if( path.includes(projectPath) ) path = path.replace(projectPath, "");

    if( this.visual.JSON_FILE_CONTENT.dependencies.scripts.includes(path)) return;
    this.visual.JSON_FILE_CONTENT.dependencies.scripts.push(path);
    this.saveJson();
  }
  /**
   * @description add the passed path as script lib dependency
   * @param elemName the path to add as lib dependency
   */
  public addLibScript(elemName: string, path: string): void{
    this.initializeLibElem(elemName);
    path = path.trim();
    if( this.visual.JSON_FILE_CONTENT.lib[elemName].scripts.includes(path)) return;
    this.visual.JSON_FILE_CONTENT.lib[elemName].scripts.push(path);
    this.saveJson();
  }
  /**
   * @description add the passed path as style lib dependency
   * @param elemName the path to add as lib dependency
   */
  public addLibStyle(elemName: string, path: string): void{
    this.initializeLibElem(elemName);
    path = path.trim();
    if( this.visual.JSON_FILE_CONTENT.lib[elemName].styles.includes(path)) return;
    this.visual.JSON_FILE_CONTENT.lib[elemName].styles.push(path);
    this.saveJson();
  }
  public importAllStyles(): void{
    let cssPaths = this.visual.getAssetsAllCssFilesPaths();
    for ( let cssPath of cssPaths ){
      this.addStyle( cssPath );
    }
  }
  public importAllScripts(): void{
    let jsPaths = this.visual.getAssetsAllJsFilesPaths();
    for ( let jsPath of jsPaths ){
      this.addScript( jsPath );
    }
  }
  /**
   * @description import all the scripts and styles of the visual automatically
   */
  public autoImportAllCssAndJs(): void{
    if( this.visual.getAssetsAutoImport() ){
      this.importAllStyles();
      this.importAllScripts();
    }
  }
  /**
   * @description initalize the lib-elem dependencies if the elem is not yet present
   * @param elemName the name of the lib to intialize
   */
  public initializeLibElem(elemName: string){
    if ( !this.visual.JSON_FILE_CONTENT.lib[elemName] ) {
      this.visual.JSON_FILE_CONTENT.lib[elemName] = ConstVisuals.getVisualsLibElemContent();
    }
  }
  

  /**
   * @description populate the WTM.json file of the given visual with the identifiers contained in default.##
   */
  public populateIdentifiers() {
    if(!this.visual.isCreated()) throw new Error(this.visual.ERR_VISUAL_NOT_CREATED);
    
    let identifiersJson: visualJsonIdentifiers = this.visual.JSON_FILE_CONTENT.identifiers;
    let identfiers: string[] = Identifiers.getContainedIdentifiers(
      this.visual.DEFAULT_FILE_PATH,
      identifierActions.ALL
    );
    for (let _knownIdentifier in identifiersJson){
      for (let foundIdentifier of identfiers) {
        
        let [TYPE, ACTION, NAME] = Identifiers.getIdentifierTypeActionName(foundIdentifier);
        let ATTRIBUTES: identifiersAttributesType = Identifiers.getIdentifierAttributes(foundIdentifier);
        if( ! (TYPE in renderTypes ) ) {
          throw new Error(this.ERR_NOT_RENDER_IDENTIFIER);
        }
        let castType = TYPE as unknown as renderTypes;
        
        identifiersJson[castType][ACTION][NAME] = ATTRIBUTES ;
      }
    }
    FileWriter.writeFile(
      this.visual.JSON_FILE_PATH,
      JSON.stringify(this.visual.JSON_FILE_CONTENT)
    );
  }
  

  /**
   * @description replace the current default html with the passed one
   * @param newHtml the new html to use
   */
  public editDefaultHtml(newHtml: string){
    if(!this.visual.isCreated()) throw new Error(this.visual.ERR_VISUAL_NOT_CREATED);
    FileWriter.writeFile(this.visual.DEFAULT_FILE_PATH, newHtml);
  }

}
