import { FileReader } from "../ManageFiles";
import { StringComposeWriter } from "../ManageFiles/StringComposeWriter";
import { ProjectJsonInformationsLibElem } from "../Types/manageProject.jsonInformations";
import { DependenciesManager } from "./DependenciesManager";

export class DependenciesManagerReader {
  constructor(public depManager: DependenciesManager) {}

  public getProjectPath(): string {
    return this.depManager.CLIENT.reader.getProjectPath();
  }
  /**
   * @description return if the visual has to auto import the assets
   */
  public getAssetsAutoImport(): boolean {
    return this.depManager.JSON.assetsAutoImport;
  }
  /**
   * @description returns the abs path to the project lib path
   * - if the libName is passed it returns the abs path to that specific lib
   */
  public getProjectAssetsLibPath(libName?: string): string {
    if (!this.depManager.CLIENT.ASSETS_LIB_PATH) throw new Error(this.depManager.NO_ASSETS_LIB_PATH);

    if (libName)
      return StringComposeWriter.concatenatePaths(
        this.depManager.CLIENT.ASSETS_LIB_PATH,
        libName
      );
    return this.depManager.CLIENT.ASSETS_LIB_PATH;
  }
  /**
   * @description return the abs path to the project assets directory
   */
   public getAssetsPath(): string {
    return this.depManager.CLIENT.ASSETS_PATH;
  }
  /**
   * @description get the visual styles folder path
   */
   public getAssetsStylesPath(): string {
    return this.depManager.CLIENT.ASSETS_STYLES_PATH;
  }
  /**
   * @description get the visual scripts folder path
   */
   public getAssetsScriptsPath(): string {
    return this.depManager.CLIENT.ASSETS_SCRIPTS_PATH;
  }
  /**
   * @description get the visual lib folder path
   */
   public getAssetsImgPath(): string {
    return this.depManager.CLIENT.ASSETS_IMG_PATH;
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

  /**
   * @description return the current visual styles dependencies
   */
   public getStylesDependencies(): string[] {
    return this.depManager.JSON.styles;
  }

  /**
   * @description return the current visual scripts dependencies
   */
   public getScriptsDependencies(): string[] {
    return this.depManager.JSON.scripts;
  }

  /**
   * @description get the scripts
   */
   public getScripts(): string[] {
    return [...this.depManager.JSON.scripts];
  }

  /**
   * @description get the styles
   */
   public getStyles(): string[] {
    return [...this.depManager.JSON.styles];
  }

  /**
   * @description get the lib dependencies
   */
   public getLibDependencies(  ) {
    return this.depManager.JSON.lib;
  }

  /**
   * @description it returns the dependencies of that specific lib
   * @param libName 
   */
   public getLibDependenciesSpecific( libName: string ){
    if (!this.depManager.JSON.lib[libName]) throw new Error(this.depManager.NO_LIB_FOUND);
    else return this.depManager.JSON.lib[libName];
  }

  public getAllLibCdnScripts( libName?: string ): string[] {
    if( libName ){
      if (!this.depManager.JSON.lib[libName]) throw new Error(this.depManager.NO_LIB_FOUND);
      return [ ...this.depManager.JSON.lib[libName].cdn.scripts ]
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
      if (!this.depManager.JSON.lib[libName]) throw new Error(this.depManager.NO_LIB_FOUND);
      return [ ...this.depManager.JSON.lib[libName].cdn.styles ]
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
    return Object.values( this.depManager.JSON.lib ).sort( ( obj1, obj2 ) => { 
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
    let orderedLibs = Object.keys(this.depManager.JSON.lib).sort(( a, b ) => { 
      let obj1 = this.depManager.JSON.lib[a];
      let obj2 = this.depManager.JSON.lib[b];
      if( obj1.order && obj2.order ) return obj1.order - obj2.order;
      if( !obj1.order && obj2.order ) return -1;
      if( obj1.order && !obj2.order ) return 1;
      else return 0;
    }).reduce(
      (obj: any, key: string) => { 
        obj[key] = this.depManager.JSON.lib[key]; 
        return obj;
      }, 
      {}
    );
    return Object.keys( orderedLibs );
  }

  public getAllLibStyles(libName?: string): string[]{
    if( libName ){
      if (!this.depManager.JSON.lib[libName]) throw new Error(this.depManager.NO_LIB_FOUND);
      return [ ...this.depManager.JSON.lib[libName].styles ]
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
      if (!this.depManager.JSON.lib[libName]) throw new Error(this.depManager.NO_LIB_FOUND);
      return [ ...this.depManager.JSON.lib[libName].scripts ]
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
    return this.depManager.JSON.lib[libName] ? true : false;
  }
}
