import { StringComposeWriter } from "../ManageFiles/StringComposeWriter";
import { DependenciesManager } from "./DependenciesManager";

export class DependenciesManagerWriter {
  constructor(public depManager: DependenciesManager) {}
  /**
   * @description set if the project should auto import all it's js/css files
   */
  public setAssetsAutoImport(newOne: boolean) {
    this.depManager.JSON.assetsAutoImport = newOne;
    this.depManager.CLIENT.writer.saveJson();
  }
  public setScripts(scripts: string[]) {
    this.depManager.JSON.scripts = [];
    for (let filePath of scripts) {
      this.addScript(filePath);
    }
    this.depManager.CLIENT.writer.saveJson();
  }
  public setStyles(styles: string[]) {
    this.depManager.JSON.styles = [];
    for (let filePath of styles) {
      this.addStyle(filePath);
    }
    this.depManager.CLIENT.writer.saveJson();
  }

  /**
   * @description add the passed path as style dependency in the visual json
   * @param path
   */
  public addStyle(path: string): void {
    path = path.trim();
    let stylesPath = this.depManager.reader.getAssetsStylesPath();
    let projectPath = this.depManager.reader.getProjectPath();
    if (!path.includes(stylesPath))
      path = StringComposeWriter.concatenatePaths(stylesPath, path);
    if (path.includes(projectPath)) path = path.replace(projectPath, ""); // here
    path = path.startsWith("/") ? path : `/${path}`;
    if (this.depManager.JSON.styles.includes(path)) return;
    this.depManager.JSON.styles.push(path);
    this.depManager.CLIENT.writer.saveJson();
  }

  /**
   * @description add the passed path as script dependency in the visual json
   * @param path
   */
  public addScript(path: string): void {
    path = path.trim();
    let scriptsPath = this.depManager.reader.getAssetsScriptsPath();
    let projectPath = this.depManager.reader.getProjectPath();
    if (!path.includes(scriptsPath))
      path = StringComposeWriter.concatenatePaths(scriptsPath, path);
    if (path.includes(projectPath)) path = path.replace(projectPath, ""); // here
    path = path.startsWith("/") ? path : `/${path}`;

    if (this.depManager.JSON.scripts.includes(path)) return;
    this.depManager.JSON.scripts.push(path);
    this.depManager.CLIENT.writer.saveJson();
  }

  /**
   * @description add the path as script or style based on the extension
   * @param path the path to add
   */
  public addScriptOrStyle(path: string) {
    if (path.endsWith(".js")) this.addScript(path);
    else if (path.endsWith(".css")) this.addStyle(path);
  }

  public importAllStyles(): void {
    let cssPaths = this.depManager.reader.getAssetsAllStylesFilesPaths();
    for (let cssPath of cssPaths) {
      this.addStyle(cssPath);
    }
  }

  public importAllScripts(): void {
    let jsPaths = this.depManager.reader.getAssetsAllScriptsFilesPaths();
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
    if (this.depManager.reader.getAssetsAutoImport()) {
      this.importAllStyles();
      this.importAllScripts();
    }
  }

  /**
   * @description add a script path inside the passed lib
   * - throws an error if the lib doesn't exists
   * @param libName
   * @param scriptPath
   */
  public addLibScript(libName: string, scriptPath: string) {
    if (!this.depManager.JSON.lib[libName]) throw new Error(this.depManager.NO_LIB_FOUND);
    if (!scriptPath.includes(this.depManager.reader.getProjectAssetsLibPath(libName)))
      scriptPath = StringComposeWriter.concatenatePaths(
        this.depManager.reader.getProjectAssetsLibPath(libName),
        scriptPath
      );
    scriptPath = scriptPath.replace(this.depManager.reader.getProjectPath(), ""); // here
    scriptPath = scriptPath.startsWith("/") ? scriptPath : `/${scriptPath}`;
    if (this.depManager.JSON.lib[libName].scripts.includes(scriptPath)) return;

    this.depManager.JSON.lib[libName].scripts.push(scriptPath);
    this.depManager.CLIENT.writer.saveJson();
  }

  /**
   * @description add a style paht inside the passed lib
   * - throws an error if the lib doesn't exists
   * @param libName
   * @param scriptPath
   */
  public addLibStyle(libName: string, stylePath: string) {
    // -> this.initializeLibElem(elemName);
    if (!this.depManager.JSON.lib[libName]) throw new Error(this.depManager.NO_LIB_FOUND);
    if (!stylePath.includes(this.depManager.reader.getProjectAssetsLibPath(libName)))
      stylePath = StringComposeWriter.concatenatePaths(
        this.depManager.reader.getProjectAssetsLibPath(libName),
        stylePath
      );
    stylePath = stylePath.replace(this.depManager.reader.getProjectPath(), ""); // here
    stylePath = stylePath.startsWith("/") ? stylePath : `/${stylePath}`;
    if (this.depManager.JSON.lib[libName].styles.includes(stylePath)) return;

    this.depManager.JSON.lib[libName].styles.push(stylePath);
    this.depManager.CLIENT.writer.saveJson();
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
    if (!this.depManager.JSON.lib[libName]) throw new Error(this.depManager.NO_LIB_FOUND);
    if (this.depManager.JSON.lib[libName].cdn.scripts.includes(cdnUrl)) return;

    this.depManager.JSON.lib[libName].cdn.scripts.push(cdnUrl);
    this.depManager.CLIENT.writer.saveJson();
  }
  /**
   * @description add a cdn to the passed lib
   * - throws an error if the lib doesn't exists
   * @param libName
   * @param cdnUrl
   */
  public addLibCdnStyle(libName: string, cdnUrl: string) {
    if (!this.depManager.JSON.lib[libName]) throw new Error(this.depManager.NO_LIB_FOUND);
    if (this.depManager.JSON.lib[libName].cdn.styles.includes(cdnUrl)) return;

    this.depManager.JSON.lib[libName].cdn.styles.push(cdnUrl);
    this.depManager.CLIENT.writer.saveJson();
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
    if (!this.depManager.JSON.lib[libName]) throw new Error(this.depManager.NO_LIB_FOUND);
    if (!this.depManager.JSON.lib[libName].cdn.scripts.includes(cdnUrl)) return;

    this.depManager.JSON.lib[libName].cdn.scripts.splice( this.depManager.JSON.lib[libName].cdn.scripts.indexOf(cdnUrl), 1 );
    this.depManager.CLIENT.writer.saveJson();
  }
  /**
   * @description emove a cdn style from the lib
   * - throws an error if the lib doesn't exists
   * @param libName
   * @param cdnUrl
   */
  public removeLibCdnStyle(libName: string, cdnUrl: string) {
    if (!this.depManager.JSON.lib[libName]) throw new Error(this.depManager.NO_LIB_FOUND);
    if (!this.depManager.JSON.lib[libName].cdn.styles.includes(cdnUrl)) return;

    this.depManager.JSON.lib[libName].cdn.styles.splice( this.depManager.JSON.lib[libName].cdn.styles.indexOf(cdnUrl), 1 );
    this.depManager.CLIENT.writer.saveJson();
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

  /**
   * @description replace the lib styles with the new passed ones
   * - throws an error if the lib doesn't exists
   * @param libName
   * @param stylesPaths
   */
   public setLibStyles(libName: string, stylesPaths: string[]) {
    if (!this.depManager.JSON.lib[libName]) throw new Error(this.depManager.NO_LIB_FOUND);

    this.depManager.JSON.lib[libName].styles = [];
    for (let stylePath of stylesPaths) {
      this.addLibStyle(libName, stylePath);
    }
    this.depManager.CLIENT.writer.saveJson();
  }

  /**
   * @description replace the lib scripts with the new passed ones
   * - throws an error if the lib doesn't exists
   * @param libName
   * @param scriptsPaths
   */
   public setLibScripts(libName: string, scriptsPaths: string[]) {
    if (!this.depManager.JSON.lib[libName]) throw new Error(this.depManager.NO_LIB_FOUND);

    this.depManager.JSON.lib[libName].scripts = [];
    for (let scriptPath of scriptsPaths) {
      this.addLibScript(libName, scriptPath);
    }
    this.depManager.CLIENT.writer.saveJson();
  }

  public setLibOrder(libName: string, order: number) {
    if (!this.depManager.JSON.lib[libName]) throw new Error(this.depManager.NO_LIB_FOUND);
    this.depManager.JSON.lib[libName].order = order;
    this.depManager.CLIENT.writer.saveJson();
  }

  /**
   * @description import all the common scripts and styles in the project assets directory automatically
   */
   public importAllStylesAndScripts(): void {
    this.importAllStyles();
    this.importAllScripts();
  }
}
