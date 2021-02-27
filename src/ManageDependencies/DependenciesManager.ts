import { FileReader } from "../files";
import { StringComposeWriter } from "../files/StringComposeWriter";
import { Project } from "../ManageProjects";
import { Visual } from "../ManageVisual/Visual";
import { ProjectJsonInformations, ProjectJsonInformationsLibElem } from "../Types/manageProject.jsonInformations";
import { visualJson } from "../Types/manageVisual.jsons";

export class DependenciesManager {
  public JSON: ProjectJsonInformations | visualJson;
  public readonly NO_LIB_FOUND = "The given lib doesn't exists";
  public readonly NO_ASSETS_LIB_PATH = "The given ASSETS_LIB_PATH is undefined or empty "
  public readonly ERR_EMPTY_PROJECT_PATH = "The path to the project of the current visual is empty on undefined";

  constructor(public CLIENT: Visual | Project) {
    this.JSON = CLIENT.getJson();
  }

  public getProjectPath(): string{
    return this.CLIENT.getProjectPath();
  }
  /**
   * @description return if the visual has to auto import the assets
   */
  public getAssetsAutoImport(): boolean {
    return this.JSON.assetsAutoImport;
  }
  /**
   * @description returns the abs path to the project lib path
   * - if the libName is passed it returns the abs path to that specific lib
   */
  public getProjectAssetsLibPath(libName?: string): string {
    
    if( !this.CLIENT.ASSETS_LIB_PATH ) throw new Error( this.NO_ASSETS_LIB_PATH )
    
    if (libName)
      return StringComposeWriter.concatenatePaths(
        this.CLIENT.ASSETS_LIB_PATH,
        libName
      );
    return this.CLIENT.ASSETS_LIB_PATH;
  }
  /**
   * @description set if the project should auto import all it's js/css files
   */
  public setAssetsAutoImport(newOne: boolean) {
    this.JSON.assetsAutoImport = newOne;
    this.CLIENT.saveJson();
  }
  /**
   * @description return the abs path to the project assets directory
   */
  public getAssetsPath(): string {
    return this.CLIENT.ASSETS_PATH;
  }
  /**
   * @description get the visual styles folder path
   */
  public getAssetsStylesPath(): string {
    return this.CLIENT.ASSETS_STYLES_PATH;
  }
  /**
   * @description get the visual scripts folder path
   */
  public getAssetsScriptsPath(): string {
    return this.CLIENT.ASSETS_SCRIPTS_PATH;
  }

  /**
   * @description get the visual lib folder path
   */
  public getAssetsImgPath(): string {
    return this.CLIENT.ASSETS_IMG_PATH;
  }

  public setScripts(scripts: string[]) {
    this.JSON.scripts = [];
    for (let filePath of scripts) {
      this.addScript(filePath);
    }
    this.CLIENT.saveJson();
  }

  public setStyles(styles: string[]) {
    this.JSON.styles = [];
    for (let filePath of styles) {
      this.addStyle(filePath);
    }
    this.CLIENT.saveJson();
  }
  /**
   * @description add the passed path as style dependency in the visual json
   * @param path
   */
  public addStyle(path: string): void {
    path = path.trim();
    let stylesPath = this.getAssetsStylesPath();
    let projectPath = this.getProjectPath();
    if (!path.includes(stylesPath))
      path = StringComposeWriter.concatenatePaths(stylesPath, path);
    if (path.includes(projectPath)) path = path.replace(projectPath, "");

    if (this.JSON.styles.includes(path)) return;
    this.JSON.styles.push(path);
    this.CLIENT.saveJson();
  }
  /**
   * @description add the passed path as script dependency in the visual json
   * @param path
   */
  public addScript(path: string): void {
    path = path.trim();
    let scriptsPath = this.getAssetsScriptsPath();
    let projectPath = this.getProjectPath();
    if (!path.includes(scriptsPath))
      path = StringComposeWriter.concatenatePaths(scriptsPath, path);
    if (path.includes(projectPath)) path = path.replace(projectPath, "");

    if (this.JSON.scripts.includes(path)) return;
    this.JSON.scripts.push(path);
    this.CLIENT.saveJson();
  }
  /**
   * @description add the path as script or style based on the extension
   * @param path the path to add
   */
  public addScriptOrStyle(path: string) {
    if (path.endsWith(".js")) this.addScript(path);
    else if (path.endsWith(".css")) this.addStyle(path);
  }

  public getAssetsAllStylesFilesPaths() {
    return FileReader.folderTreePaths(
      FileReader.readFolderTree(this.getAssetsStylesPath())
    );
  }
  
  public getAssetsAllScriptsFilesPaths() {
    return FileReader.folderTreePaths(
      FileReader.readFolderTree(this.getAssetsScriptsPath())
    );
  }
  public importAllStyles(): void {
    let cssPaths = this.getAssetsAllStylesFilesPaths();
    for (let cssPath of cssPaths) {
      this.addStyle(cssPath);
    }
  }
  public importAllScripts(): void {
    let jsPaths = this.getAssetsAllScriptsFilesPaths();
    for (let jsPath of jsPaths) {
      this.addScript(jsPath);
    }
  }

  /**
   * @description import all the scripts and styles of the visual automatically
   */
  public autoImportAllCssAndJs(): void {
    this.setScripts([]);
    this.setStyles([]);
    if (this.getAssetsAutoImport()) {
      this.importAllStyles();
      this.importAllScripts();
    }
  }
  /**
   * @description return the current visual styles dependencies
   */
  public getStylesDependencies(): string[] {
    return this.JSON.styles;
  }
  /**
   * @description return the current visual scripts dependencies
   */
  public getScriptsDependencies(): string[] {
    return this.JSON.scripts;
  }

  /**
   * @description get the scripts
   */
  public getScripts(): string[] {
    return [...this.JSON.scripts];
  }
  /**
   * @description get the styles
   */
  public getStyles(): string[] {
    return [...this.JSON.styles];
  }

  /**
   * @description get the lib dependencies
   */
  public getLibDependencies(  ) {
    return this.JSON.lib;
  }
  /**
   * @description it returns the dependencies of that specific lib
   * @param libName 
   */
  public getLibDependenciesSpecific( libName: string ){
    if (!this.JSON.lib[libName]) throw new Error(this.NO_LIB_FOUND);
    else return this.JSON.lib[libName];
  }

  /**
   * @description add a script path inside the passed lib
   * - throws an error if the lib doesn't exists
   * @param libName
   * @param scriptPath
   */
  public addLibScript(libName: string, scriptPath: string) {
    // -> this.initializeLibElem(elemName);
    if (!this.JSON.lib[libName]) throw new Error(this.NO_LIB_FOUND);
    if (!scriptPath.includes(this.getProjectAssetsLibPath(libName)))
      scriptPath = StringComposeWriter.concatenatePaths(
        this.getProjectAssetsLibPath(libName),
        scriptPath
      );
    scriptPath = scriptPath.replace(this.getProjectPath(), "");
    if (this.JSON.lib[libName].scripts.includes(scriptPath)) return;

    this.JSON.lib[libName].scripts.push(scriptPath);
    this.CLIENT.saveJson();
  }
  /**
   * @description add a style paht inside the passed lib
   * - throws an error if the lib doesn't exists
   * @param libName
   * @param scriptPath
   */
  public addLibStyle(libName: string, stylePath: string) {
    // -> this.initializeLibElem(elemName);
    if (!this.JSON.lib[libName]) throw new Error(this.NO_LIB_FOUND);
    if (!stylePath.includes(this.getProjectAssetsLibPath(libName)))
      stylePath = StringComposeWriter.concatenatePaths(
        this.getProjectAssetsLibPath(libName),
        stylePath
      );
    stylePath = stylePath.replace(this.getProjectPath(), "");
    if (this.JSON.lib[libName].styles.includes(stylePath)) return;

    this.JSON.lib[libName].styles.push(stylePath);
    this.CLIENT.saveJson();
  }
  /**
   * @description add the path as script or style based on the extension
   * @param libName the lib name where to add the path
   * @param path the path to add
   */
  public addLibScriptOrStyle(libName: string, path: string) {
    if (path.endsWith(".js")) this.addLibScript(libName, path);
    else if (path.endsWith(".css")) this.addLibStyle(libName, path);
  }

  /**
   * @description add a cdn to the passed lib
   * - throws an error if the lib doesn't exists
   * @param libName
   * @param cdnUrl
   */
  public addLibCdnScript(libName: string, cdnUrl: string) {
    if (!this.JSON.lib[libName]) throw new Error(this.NO_LIB_FOUND);
    if (this.JSON.lib[libName].cdn.scripts.includes(cdnUrl)) return;

    this.JSON.lib[libName].cdn.scripts.push(cdnUrl);
    this.CLIENT.saveJson();
  }
  /**
   * @description add a cdn to the passed lib
   * - throws an error if the lib doesn't exists
   * @param libName
   * @param cdnUrl
   */
  public addLibCdnStyle(libName: string, cdnUrl: string) {
    if (!this.JSON.lib[libName]) throw new Error(this.NO_LIB_FOUND);
    if (this.JSON.lib[libName].cdn.styles.includes(cdnUrl)) return;

    this.JSON.lib[libName].cdn.styles.push(cdnUrl);
    this.CLIENT.saveJson();
  }
  /**
   * @description add the path as script or style based on the extension
   * @param libName the lib name where to add the cdn
   * @param cdnUrl the cdn to add
   */
  public addLibCdnScriptOrStyle(libName: string, cdnUrl: string) {
    if (cdnUrl.endsWith(".js")) this.addLibCdnScript(libName, cdnUrl);
    else if (cdnUrl.endsWith(".css")) this.addLibCdnStyle(libName, cdnUrl);
  }
  /**
   * @description remove a cdn script from the lib
   * - throws an error if the lib doesn't exists
   * @param libName
   * @param cdnUrl
   */
  public removeLibCdnScript(libName: string, cdnUrl: string) {
    if (!this.JSON.lib[libName]) throw new Error(this.NO_LIB_FOUND);
    if (!this.JSON.lib[libName].cdn.scripts.includes(cdnUrl)) return;

    this.JSON.lib[libName].cdn.scripts.splice( this.JSON.lib[libName].cdn.scripts.indexOf(cdnUrl), 1 );
    this.CLIENT.saveJson();
  }
  /**
   * @description emove a cdn style from the lib
   * - throws an error if the lib doesn't exists
   * @param libName
   * @param cdnUrl
   */
  public removeLibCdnStyle(libName: string, cdnUrl: string) {
    if (!this.JSON.lib[libName]) throw new Error(this.NO_LIB_FOUND);
    if (!this.JSON.lib[libName].cdn.styles.includes(cdnUrl)) return;

    this.JSON.lib[libName].cdn.styles.splice( this.JSON.lib[libName].cdn.styles.indexOf(cdnUrl), 1 );
    this.CLIENT.saveJson();
  }
  public removeLibCdnScriptOrStyle(libName: string, cdnUrl: string) {
    if (cdnUrl.endsWith(".js")) this.removeLibCdnScript(libName, cdnUrl);
    else if (cdnUrl.endsWith(".css")) this.removeLibCdnStyle(libName, cdnUrl);
  }
  public removeMultipleLibCdnScripts( libName: string, cdnUrls: string[] ){
    for( let url of cdnUrls ) this.removeLibCdnScript( libName, url )
  }
  public removeMultipleLibCdnStyles( libName: string, cdnUrls: string[] ){
    for( let url of cdnUrls ) this.removeLibCdnStyle( libName, url )
  }
  public removeMultipleLibCdnScriptsOrStyles(libName: string, cdnUrls: string[] ) {
    for( let url of cdnUrls ){
      if (url.endsWith(".js")) this.removeLibCdnScript(libName, url);
      else if (url.endsWith(".css")) this.removeLibCdnStyle(libName, url);
    }
  }

  public getAllLibCdnScripts( libName?: string ): string[] {
    if( libName ){
      if (!this.JSON.lib[libName]) throw new Error(this.NO_LIB_FOUND);
      return [ ...this.JSON.lib[libName].cdn.scripts ]
    } else {
      let cdnScripts: string[] = [];
      for ( let libValue of this.getAllLibValuesWithOrder() ){
        cdnScripts.push( ...libValue.cdn.scripts )
      }
      return cdnScripts
    }
    
  }
  
  public getAllLibCdnStyles( libName?: string ): string[] {
    if( libName ){
      if (!this.JSON.lib[libName]) throw new Error(this.NO_LIB_FOUND);
      return [ ...this.JSON.lib[libName].cdn.styles ]
    } else {
      let cdnStyles: string[] = [];
      for ( let libValue of this.getAllLibValuesWithOrder() ){
        cdnStyles.push( ...libValue.cdn.styles )
      }
      return cdnStyles
    }
  }

  /**
   * @description returns an array with all the lib dependencies ordered by the order number
   */
  public getAllLibValuesWithOrder(): ProjectJsonInformationsLibElem[] {
    return Object.values( this.JSON.lib ).sort( ( obj1, obj2 ) => { 
      if( obj1.order && obj2.order ) return obj1.order - obj2.order;
      if( !obj1.order && obj2.order ) return -1;
      if( obj1.order && !obj2.order ) return 1;
      else return 0;
    });
  }

  /**
   * @description returns an array that contains the names of the libs in order
   * - the order is given by the '[libNameDependencies].oreder' value in each lib
   */
  public getAllLibKeysWithOrder(): string[] {    
    let orderedLibs = Object.keys(this.JSON.lib).sort(( a, b ) => { 
      let obj1 = this.JSON.lib[a];
      let obj2 = this.JSON.lib[b];
      if( obj1.order && obj2.order ) return obj1.order - obj2.order;
      if( !obj1.order && obj2.order ) return -1;
      if( obj1.order && !obj2.order ) return 1;
      else return 0;
    }).reduce(
      (obj: any, key: string) => { 
        obj[key] = this.JSON.lib[key]; 
        return obj;
      }, 
      {}
    );
    return Object.keys( orderedLibs );
  }

  /**
   * @description replace the lib styles with the new passed ones
   * - throws an error if the lib doesn't exists
   * @param libName
   * @param stylesPaths
   */
  public setLibStyles(libName: string, stylesPaths: string[]) {
    if (!this.JSON.lib[libName]) throw new Error(this.NO_LIB_FOUND);

    this.JSON.lib[libName].styles = [];
    for (let stylePath of stylesPaths) {
      this.addLibStyle(libName, stylePath);
    }
    this.CLIENT.saveJson();
  }
  /**
   * @description replace the lib scripts with the new passed ones
   * - throws an error if the lib doesn't exists
   * @param libName
   * @param scriptsPaths
   */
  public setLibScripts(libName: string, scriptsPaths: string[]) {
    if (!this.JSON.lib[libName]) throw new Error(this.NO_LIB_FOUND);

    this.JSON.lib[libName].scripts = [];
    for (let scriptPath of scriptsPaths) {
      this.addLibScript(libName, scriptPath);
    }
    this.CLIENT.saveJson();
  }
  public setLibOrder(libName: string, order: number) {
    if (!this.JSON.lib[libName]) throw new Error(this.NO_LIB_FOUND);
    this.JSON.lib[libName].order = order;
    this.CLIENT.saveJson();
  }
  public getAllLibStyles(libName?: string): string[]{
    if( libName ){
      if (!this.JSON.lib[libName]) throw new Error(this.NO_LIB_FOUND);
      return [ ...this.JSON.lib[libName].styles ]
    } else {
      let styles: string[] = [];
      for ( let libValue of this.getAllLibValuesWithOrder() ){
        styles.push( ...libValue.styles )
      }
      return styles
    }
  }
  public getAllLibScripts(libName?: string): string[]{
    if( libName ){
      if (!this.JSON.lib[libName]) throw new Error(this.NO_LIB_FOUND);
      return [ ...this.JSON.lib[libName].scripts ]
    } else {
      let scripts: string[] = [];
      for ( let libValue of this.getAllLibValuesWithOrder() ){
        scripts.push( ...libValue.scripts )
      }
      return scripts
    }
  }
  /**
   * @description returns true if the lib already exists
   */
  public libExists( libName: string ): boolean {
    return this.JSON.lib[libName] ? true : false;
  }
  /**
   * @description import all the common scripts and styles in the project assets directory automatically
   */
  public importAllStylesAndScripts(): void {
    this.importAllStyles();
    this.importAllScripts();
  }
}
