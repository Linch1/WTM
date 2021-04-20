import { FileReader, FileWriter, StringComposeWriter } from "../ManageFiles";
import { Project } from "../ManageProjects/Project";
import { BulkVisual } from "../ManageVisual/BulkVisual";
import { ProjectJsonInformations, ProjectJsonInformationsLibElem } from "../Types";
import { DependenciesManager } from "./DependenciesManager";

export class ProjectDependenciesManager extends DependenciesManager{
    public readonly NO_PATH_FOUND = "The given path doesn't exists";
    public readonly LIB_ALREADY_EXISTS = "The passed lib already exists";
    
    public PROJECT_JSON: ProjectJsonInformations;
    constructor( public CLIENT: Project ){
        super(CLIENT);
        this.PROJECT_JSON = this.JSON as ProjectJsonInformations;
    }

    /**
     * @description return an object that contains the visual dependencies
     */
    public getVisualsDependencies() {
        return this.PROJECT_JSON.visualsDependencies;
    }
    /**
     * @description return ann array with all the used visuals css files
     */
    public getVisualsStyles(): string[] {
        let dependencies = this.PROJECT_JSON.visualsDependencies;
        let styles: string[] = [];
        for (let key of Object.keys(dependencies)) {
        let visualDep = dependencies[key];
        styles.push(...visualDep.styles);
        }
        return styles;
    }
    /**
   * @description return ann array with all the used visuals js files
   */
  public getVisualsScripts(): string[] {
    let dependencies = this.PROJECT_JSON.visualsDependencies;
    let scripts: string[] = [];
    for (let key of Object.keys(dependencies)) {
      let visualDep = dependencies[key];
      scripts.push(...visualDep.scripts);
    }
    return scripts;
  }
  /**
   * @description modify the url of the passed lib
   * - throws an error if the lib doesn't exists
   * @param libName 
   * @param libUrl 
   */
  public setLibUrl( libName: string, libUrl: string){
    if(!this.PROJECT_JSON.lib[libName]) throw new Error(this.NO_LIB_FOUND);

    this.PROJECT_JSON.lib[libName].url = libUrl;
    this.CLIENT.writer.saveJson();
  }
  /**
   * @description repopulate the object that contains the visuals dependencies for update it
   */
  public refreshVisualsDependencies() {
    this.PROJECT_JSON.visualsDependencies = {}; // reset the object with the dependencies
    let projectVisuals = new BulkVisual(
      this.CLIENT.reader.getVisualsPath(),
      this.CLIENT.reader.getProjectType()
    ).getAllVisualsFiltered();
    for (let visual of projectVisuals) {
      visual.depManager.writer.autoImportAllCssAndJs();
      let stylesDep: string[] = visual.depManager.reader.getStylesDependencies();
      let scriptsDep: string[] = visual.depManager.reader.getScriptsDependencies();

      if (stylesDep.length || scriptsDep.length) {
        this.PROJECT_JSON.visualsDependencies[visual.reader.getName()] = {
          scripts: scriptsDep,
          styles: stylesDep,
        };
        this.CLIENT.writer.saveJson();
      }
    }
  }
  /**
   * @description repopulate the common scripts and styles of the project automatically detecting the new ones parsing the assets css/js folders
   * - works only if assetsAutoImport is set to true.
   */
  public refreshProjectDependencies(){
    if (this.reader.getAssetsAutoImport()) {
      this.writer.importAllStylesAndScripts();
    }
  }

  /**
   * @description add a lib object to the project PROJECT_JSON
   * @param libName 
   * @param options 
   */
  public addLib( libName: string, options: ProjectJsonInformationsLibElem ){
    if( this.reader.libExists( libName ) ) throw new Error(this.LIB_ALREADY_EXISTS);
    this.PROJECT_JSON.lib[libName] = options;
    FileWriter.createDirectory(this.reader.getProjectAssetsLibPath(libName));
    this.CLIENT.writer.saveJson();
  }
  /**
   * @description returns the name of all the saved lib
   */
  public getAllLib(): string[]{
    return Object.keys( this.PROJECT_JSON.lib );
  }
  /**
   * @description create a new folder in the lib directory and populates it with the content inside the passed pat
   * - if the folder already exists it is deleted and re-created with the new contents
   * @param libName the name of the directory to create inside the lib folder
   * @param path the path that contains the content to clone
   */
  public createLibFromPath( libName: string, path: string){
    if(  !FileReader.existsPath(path) ) throw new Error(this.NO_PATH_FOUND);
    let destinationFolder = StringComposeWriter.concatenatePaths( this.reader.getProjectAssetsLibPath(), libName );
    FileWriter.removeFolderRecursive( destinationFolder );
    FileWriter.createDirectory(destinationFolder);
    FileWriter.copyFolderRecursive( path, destinationFolder );
  }

}