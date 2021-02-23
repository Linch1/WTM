import { StringComposeWriter, FileWriter, extensions, BulkVisual, ProjectTypes, Visual, ConstVisuals } from "..";
import { checkMapProjectTypeToExtension } from "../Checkers/check.mapProjectTypeToExtension";
import { ConstProjects } from "../Constants/const.projects";
import { FileReader, StringComposeReader } from "../files";

import { ProjectJsonInformations } from "../Types/manageProject.jsonInformations";


export class Project{
    
    public PROJECT_JSON_FILE_PATH: string;
    public PROJECT_JSON_DIR_PATH: string;

    public PROJECT_ASSETS_DIR_PATH: string;
    public PROJECT_ASSETS_JS_DIR_PATH: string;
    public PROJECT_ASSETS_CSS_DIR_PATH: string;
    public PROJECT_ASSETS_IMG_DIR_PATH: string;
    public PROJECT_ASSETS_LIB_DIR_PATH: string;

    /**
     * @description
     * @param PROJECT_JSON_INFORMATIONS the initial informations with which the project is created
     */
    constructor(
        public PROJECT_JSON_INFORMATIONS: ProjectJsonInformations
    ){

        this.PROJECT_JSON_DIR_PATH = StringComposeWriter.concatenatePaths(
            this.getPath(),
            ConstProjects.jsonPathInProjectDirectory,
        )
        this.PROJECT_JSON_FILE_PATH = StringComposeWriter.concatenatePaths(
            this.PROJECT_JSON_DIR_PATH,
            ConstProjects.jsonProjectFile
        );
        this.PROJECT_ASSETS_DIR_PATH = StringComposeWriter.concatenatePaths(
            this.PROJECT_JSON_DIR_PATH,
            ConstProjects.projectAssetsDirectory
        );
        this.PROJECT_ASSETS_JS_DIR_PATH = StringComposeWriter.concatenatePaths(
            this.PROJECT_ASSETS_DIR_PATH,
            ConstProjects.projectAssetsJsDirectory
        );
        this.PROJECT_ASSETS_CSS_DIR_PATH = StringComposeWriter.concatenatePaths(
            this.PROJECT_ASSETS_DIR_PATH,
            ConstProjects.projectAssetsCssDirectory
        );
        this.PROJECT_ASSETS_IMG_DIR_PATH = StringComposeWriter.concatenatePaths(
            this.PROJECT_ASSETS_DIR_PATH,
            ConstProjects.projectAssetsImgDirectory
        );
        this.PROJECT_ASSETS_LIB_DIR_PATH = StringComposeWriter.concatenatePaths(
            this.PROJECT_ASSETS_DIR_PATH,
            ConstProjects.projectAssetsLibDirectory
        );
        this.initalize();
    }

    public initalize(){
        FileWriter.createDirectory(this.PROJECT_JSON_DIR_PATH);
        FileWriter.createDirectory(this.getViewsPath());
        FileWriter.createDirectory(this.getVisualsPath());
        FileWriter.createDirectory(this.getAssetsPath());
        FileWriter.createDirectory(this.getAssetsLibPath());
        FileWriter.createDirectory(this.getAssetsCssPath());
        FileWriter.createDirectory(this.getAssetsImgPath());
        FileWriter.createDirectory(this.getAssetsJsPath());
        FileWriter.createFile(this.PROJECT_JSON_FILE_PATH, JSON.stringify(this.PROJECT_JSON_INFORMATIONS));
    }
    public saveJson(){
        FileWriter.writeFile(
            this.PROJECT_JSON_FILE_PATH,
            JSON.stringify(this.PROJECT_JSON_INFORMATIONS)
        )
    }
    /**
     * @description return the name of the porject
     */
    public getName(): string{
        return this.PROJECT_JSON_INFORMATIONS.name;
    }
    /**
     * @description return author of the project
     */
    public getAuthor(): string{
        return this.PROJECT_JSON_INFORMATIONS.author;
    }
    /**
     * @description return author site
     */
    public getAuthorUrl(): string{
        return this.PROJECT_JSON_INFORMATIONS.autorhUrl;
    }
    /**
     * @description return the repo of the project
     */
    public getGithubRepo(): string{
        return this.PROJECT_JSON_INFORMATIONS.githubRepo;
    }
    /**
     * @description return the extension used for the porject based on the projectType
     */
    public getExtension(): extensions{
        return checkMapProjectTypeToExtension(this.PROJECT_JSON_INFORMATIONS.projectType);
    }
    /**
     * @description return the type of the project
     */
    public getProjectType(): ProjectTypes{
        return this.PROJECT_JSON_INFORMATIONS.projectType;
    }
    /**
     * @description return the abs path to the project views directory
     */
    public getViewsPath(): string{
        return this.PROJECT_JSON_INFORMATIONS.viewsPath;
    }
    /**
     * @description return the abs path to the project visuals directory
     */
    public getVisualsPath(): string{
        return this.PROJECT_JSON_INFORMATIONS.visualsPath;
    }
    /**
     * @description return the abs path to the project assets directory
     */
    public getAssetsPath(): string{
        return this.PROJECT_ASSETS_DIR_PATH;
    }
    /**
     * @description return the abs path to the project assets lib directory
     */
    public getAssetsLibPath(): string{
        return this.PROJECT_ASSETS_LIB_DIR_PATH;
    }
    /**
     * @description return the abs path to the project assets img directory
     */
    public getAssetsImgPath(): string{
        return this.PROJECT_ASSETS_IMG_DIR_PATH;
    }
    /**
     * @description return the abs path to the project assets css directory
     */
    public getAssetsCssPath(): string{
        return this.PROJECT_ASSETS_CSS_DIR_PATH;
    }
    /**
     * @description return the abs path to the project assets js directory
     */
    public getAssetsJsPath(): string{
        return this.PROJECT_ASSETS_JS_DIR_PATH;
    }
    /**
     * @description return if the project has to auto import the assets
     */
    public getAssetsAutoImport(): boolean{
        return this.PROJECT_JSON_INFORMATIONS.assetsAutoImport;
    }
    /**
     * @description returns the path to the project directory ( not the WTM-PROJECT directory )
     */
    public getPath(): string{
        return this.PROJECT_JSON_INFORMATIONS.path;
    }
    /**
     * @description get all the used js files for the project, the common ones and the visuals ones
     */
    public getScripts(): string[]{
        let scripts = [...this.PROJECT_JSON_INFORMATIONS.scripts, ...this.getVisualsDependenciesJs()]
        return scripts;
    }
    /**
     * @description get all the used css files for the project, the common ones and the visuals ones
     */
    public getStyles(): string[]{
        let styles = [ ...this.PROJECT_JSON_INFORMATIONS.styles, ...this.getVisualsDependenciesCss()];
        return styles;
    }
    /**
     * @description return an object that contains the visual dependencies
     */
    public getVisualsDependencies(){
        return this.PROJECT_JSON_INFORMATIONS.visualsDependencies;
    }
    /**
     * @description return ann array with all the used visuals css files
     */
    public getVisualsDependenciesCss(): string[]{
        let dependencies = this.PROJECT_JSON_INFORMATIONS.visualsDependencies;
        let styles: string[] = [];
        for ( let key of Object.keys(dependencies)){
            let visualDep = dependencies[key];
            styles.push(...visualDep.styles)
        }
        return styles;
    }
    /**
     * @description return ann array with all the used visuals js files
     */
    public getVisualsDependenciesJs(): string[]{
        let dependencies = this.PROJECT_JSON_INFORMATIONS.visualsDependencies;
        let scripts: string[] = [];
        for ( let key of Object.keys(dependencies)){
            let visualDep = dependencies[key];
            scripts.push(...visualDep.scripts)
        }
        return scripts;
    }
    /**
     * @description set the path to the project views folder
     */
    public setViewsPath(newOne: string){
        this.PROJECT_JSON_INFORMATIONS.viewsPath = newOne;
        this.saveJson();
    }
    /**
     * @description set the name of the project
     */
    public setName(newOne: string){
        this.PROJECT_JSON_INFORMATIONS.name = newOne;
        this.saveJson();
    }
    /**
     * @description set the author of the project
     */
    public setAuthor(newOne: string){
        this.PROJECT_JSON_INFORMATIONS.author = newOne;
        this.saveJson();
    }
    /**
     * @description set the author url of the project
     */
    public setAuthorUrl(newOne: string){
        this.PROJECT_JSON_INFORMATIONS.autorhUrl = newOne;
        this.saveJson();
    }
    /**
     * @description set the github repo of the project
     */
    public setGithubRepo(newOne: string){
        this.PROJECT_JSON_INFORMATIONS.githubRepo = newOne;
        this.saveJson();
    }
    /**
     * @description set if the project should auto import all it's js/css files
     */
    public setAssetsAutoImport(newOne: boolean){
        this.PROJECT_JSON_INFORMATIONS.assetsAutoImport = newOne;
        this.saveJson();
    }
    public setVisualsPath(newOne: string){
        this.PROJECT_JSON_INFORMATIONS.visualsPath = newOne;
        this.saveJson();
    }
    public setPath(newOne: string){
        this.PROJECT_JSON_INFORMATIONS.path = newOne;
        this.saveJson();
    }
    public addCss( path: string){
        if( path.includes(this.getPath())) path = path.replace(this.getPath(), "");
        this.PROJECT_JSON_INFORMATIONS.scripts.push(path);
        this.saveJson();
    }
    public addJs( path: string){
        if( path.includes(this.getPath())) path = path.replace(this.getPath(), "");
        this.PROJECT_JSON_INFORMATIONS.styles.push(path);
        this.saveJson();
    }
    public getAssetsAllCssFilesPaths(){
        return FileReader.folderTreePaths( FileReader.readFolderTree( this.getAssetsCssPath() ) );
    }
    public getAssetsAllJsFilesPaths(){
        return FileReader.folderTreePaths( FileReader.readFolderTree( this.getAssetsJsPath() ) );
    }
    public importAllCss(): void{
        let cssPaths = this.getAssetsAllCssFilesPaths();
        for ( let cssPath of cssPaths ){
          this.addCss( cssPath );
        }
      }
      public importAllJs(): void{
        let jsPaths = this.getAssetsAllJsFilesPaths();
        for ( let jsPath of jsPaths ){
          this.addJs( jsPath );
        }
      }
      public importAllCssAndJs(): void{
        if( this.getAssetsAutoImport() ){
          this.importAllCss();
          this.importAllJs();
        }
      }
    /**
     * @description parse styles/scripts dependencies of a visual for append to all the paths that starts with ./ or those who doesn't contains a '/' char the basePath
     * @param basePath the path to the visual scripts/styles folder based on the passed dep array
     * @param dep the array of dependencies, it contains a list of path to scripts/styles
     */
    public parseVisualStringArrayOfDependencies( basePath: string, dep: string[] ): string[]{
        for ( let i = 0; i<dep.length; i++){
            let path = dep[i]
            // if is relative visual path add the visual abs path at the start
            if( path.startsWith('./') ) {
                path = path.replace('./', '');
                path = StringComposeWriter.concatenatePaths( basePath, path )
                dep[i] = path;
            }
        }
        return dep;
    }
    /**
     * @description repopulate the object that contains the visuals dependencies for update it
     */
    public refreshVisualsDependencies(){
        this.PROJECT_JSON_INFORMATIONS.visualsDependencies = {}; // reset the object with the dependencies
        let projectVisuals = new BulkVisual(this.getVisualsPath(), this.getProjectType()).getAllVisualsFiltered();
        for ( let visual of projectVisuals){
            let stylesDep: string[] = visual.getStylesDependencies();
            let scriptsDep: string[] = visual.getScriptsDependencies();

            stylesDep = this.parseVisualStringArrayOfDependencies(visual.getAssetsCssDirPath(), stylesDep);
            scriptsDep = this.parseVisualStringArrayOfDependencies(visual.getAssetsJsDirPath(), scriptsDep);

            if( stylesDep.length || scriptsDep.length ){
                this.PROJECT_JSON_INFORMATIONS.visualsDependencies[visual.getName()] = {
                    scripts: scriptsDep,
                    styles: stylesDep
                }
                this.saveJson();
            }
        }
    }
    /**
     * @description repopulate the object that contains the visuals libraries for update it
     */
    // public refreshVisualsLib(){
    //     this.PROJECT_JSON_INFORMATIONS.visualsLib = {}; // reset the object with the dependencies
    //     let projectVisuals = new BulkVisual(this.getVisualsPath(), this.getProjectType()).getAllVisualsFiltered();
    //     for ( let visual of projectVisuals){
    //         let visualLibs = visual.getLibDependencies();
    //         for ( let elemName of Object.keys(visualLibs) ){
    //             let libScripts = visualLibs[elemName].scripts;
    //             let libStyles = visualLibs[elemName].styles;
    //             libStyles = this.parseVisualStringArrayOfDependencies(visual.getLibElemDirPath(elemName), libScripts);
    //             libScripts = this.parseVisualStringArrayOfDependencies(visual.getLibElemDirPath(elemName), libStyles);
    //             if( !this.PROJECT_JSON_INFORMATIONS.visualsLib[elemName] ) 
    //                 this.PROJECT_JSON_INFORMATIONS.visualsLib[elemName] = ConstProjects.getVisualsLibElemContent();

    //             let savedLibScripts = this.PROJECT_JSON_INFORMATIONS.visualsLib[elemName].scripts;
    //             let savedLibStyles = this.PROJECT_JSON_INFORMATIONS.visualsLib[elemName].styles;
    //             // reverse loop on scripts to check if a file of the same lib was already importes
    //             for ( let i = 0; i < libScripts.length; i++ ){
    //                 let libElem = libScripts[ libScripts.length - 1 - i ];
    //                 for ( let j = 0; j < savedLibScripts.length; j++){
    //                     let savedLibElem = savedLibScripts[ savedLibScripts.length - 1 - j ];
    //                     let alreadyImported = StringComposeReader.checkLibPathsSameEnd(savedLibElem, libElem);
    //                     if ( alreadyImported ) {
    //                         libScripts.splice(libScripts.length - 1 - i, 1);
    //                         break;
    //                     }
    //                 }
    //             }
    //             // reverse loop on styles to check if a file of the same lib was already importes
    //             for ( let i = 0; i < libStyles.length; i++ ){
    //                 let libElem = libStyles[ libStyles.length - 1 - i ];
    //                 for ( let j = 0; j < savedLibStyles.length; j++){
    //                     let savedLibElem = savedLibStyles[ savedLibStyles.length - 1 - j ];
    //                     let alreadyImported = StringComposeReader.checkLibPathsSameEnd(savedLibElem, libElem);
    //                     if ( alreadyImported ) {
    //                         libStyles.splice(libStyles.length - 1 - i, 1);
    //                         break;
    //                     }
    //                 }
    //             }

    //             this.PROJECT_JSON_INFORMATIONS.visualsLib[elemName].visuals.push(visual.getName());
    //             this.PROJECT_JSON_INFORMATIONS.visualsLib[elemName].scripts.push(...libScripts);
    //             this.PROJECT_JSON_INFORMATIONS.visualsLib[elemName].styles.push(...libStyles);
    //         }
    //     }
    // }

}