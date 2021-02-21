import { StringComposeWriter, FileWriter, extensions, BulkVisual, ProjectTypes, Visual, ConstVisuals } from "..";
import { checkMapProjectTypeToExtension } from "../Checkers/check.mapProjectTypeToExtension";
import { ConstProjects } from "../Constants/const.projects";
import { StringComposeReader } from "../files";

import { ProjectJsonInformations } from "../Types/manageProject.jsonInformations";


export class Project{
    
    public PROJECT_JSON_FILE_PATH: string;
    public PROJECT_JSON_DIR_PATH: string;
    
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
        )
        this.initalize();
    }

    public initalize(){
        FileWriter.createDirectory(this.PROJECT_JSON_DIR_PATH);
        FileWriter.createDirectory(this.getViewsPath());
        FileWriter.createDirectory(this.getVisualsPath());
        FileWriter.createFile(this.PROJECT_JSON_FILE_PATH, JSON.stringify(this.PROJECT_JSON_INFORMATIONS));
    }
    public saveJson(){
        FileWriter.writeFile(
            this.PROJECT_JSON_FILE_PATH,
            JSON.stringify(this.PROJECT_JSON_INFORMATIONS)
        )
    }
    public getName(): string{
        return this.PROJECT_JSON_INFORMATIONS.name;
    }
    public getExtension(): extensions{
        return checkMapProjectTypeToExtension(this.PROJECT_JSON_INFORMATIONS.projectType);
    }
    public getProjectType(): ProjectTypes{
        return this.PROJECT_JSON_INFORMATIONS.projectType;
    }
    public getViewsPath(): string{
        return this.PROJECT_JSON_INFORMATIONS.viewsPath;
    }
    public getVisualsPath(): string{
        return this.PROJECT_JSON_INFORMATIONS.visualsPath;
    }
    public getPath(): string{
        return this.PROJECT_JSON_INFORMATIONS.path;
    }
    public getScripts(): string[]{
        let scripts = [...this.PROJECT_JSON_INFORMATIONS.scripts, ...this.getVisualsDependenciesScripts()]
        return scripts;
    }
    public getStyles(): string[]{
        let styles = [ ...this.PROJECT_JSON_INFORMATIONS.styles, ...this.getVisualsDependenciesStyles()];
        return styles;
    }
    public getVisualsDependencies(){
        return this.PROJECT_JSON_INFORMATIONS.visualsDependencies;
    }
    public getVisualsDependenciesStyles(): string[]{
        let dependencies = this.PROJECT_JSON_INFORMATIONS.visualsDependencies;
        let styles: string[] = [];
        for ( let key of Object.keys(dependencies)){
            let visualDep = dependencies[key];
            styles.push(...visualDep.styles)
        }
        return styles;
    }
    public getVisualsDependenciesScripts(): string[]{
        let dependencies = this.PROJECT_JSON_INFORMATIONS.visualsDependencies;
        let scripts: string[] = [];
        for ( let key of Object.keys(dependencies)){
            let visualDep = dependencies[key];
            scripts.push(...visualDep.scripts)
        }
        return scripts;
    }
    public setViewsPath(newOne: string){
        this.PROJECT_JSON_INFORMATIONS.viewsPath = newOne;
        this.saveJson();
    }
    public setName(newOne: string){
        this.PROJECT_JSON_INFORMATIONS.name = newOne;
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
    public addScript( path: string){
        if( path.includes(this.getPath())) path = path.replace(this.getPath(), "");
        this.PROJECT_JSON_INFORMATIONS.scripts.push(path);
        this.saveJson();
    }
    public addStyle( path: string){
        if( path.includes(this.getPath())) path = path.replace(this.getPath(), "");
        this.PROJECT_JSON_INFORMATIONS.styles.push(path);
        this.saveJson();
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
            if( path.startsWith('./') || !path.includes('/') ) {
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

            stylesDep = this.parseVisualStringArrayOfDependencies(visual.getStylesDirPath(), stylesDep);
            scriptsDep = this.parseVisualStringArrayOfDependencies(visual.getScriptsDirPath(), scriptsDep);

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
    public refreshVisualsLib(){
        this.PROJECT_JSON_INFORMATIONS.visualsLib = {}; // reset the object with the dependencies
        let projectVisuals = new BulkVisual(this.getVisualsPath(), this.getProjectType()).getAllVisualsFiltered();
        for ( let visual of projectVisuals){
            let visualLibs = visual.getLibDependencies();
            for ( let elemName of Object.keys(visualLibs) ){
                let libScripts = visualLibs[elemName].scripts;
                let libStyles = visualLibs[elemName].styles;
                libStyles = this.parseVisualStringArrayOfDependencies(visual.getLibElemDirPath(elemName), libScripts);
                libScripts = this.parseVisualStringArrayOfDependencies(visual.getLibElemDirPath(elemName), libStyles);
                if( !this.PROJECT_JSON_INFORMATIONS.visualsLib[elemName] ) 
                    this.PROJECT_JSON_INFORMATIONS.visualsLib[elemName] = ConstProjects.getVisualsLibElemContent();

                let savedLibScripts = this.PROJECT_JSON_INFORMATIONS.visualsLib[elemName].scripts;
                let savedLibStyles = this.PROJECT_JSON_INFORMATIONS.visualsLib[elemName].styles;
                // reverse loop on scripts to check if a file of the same lib was already importes
                for ( let i = 0; i < libScripts.length; i++ ){
                    let libElem = libScripts[ libScripts.length - 1 - i ];
                    for ( let j = 0; j < savedLibScripts.length; j++){
                        let savedLibElem = savedLibScripts[ savedLibScripts.length - 1 - j ];
                        let alreadyImported = StringComposeReader.checkLibPathsSameEnd(savedLibElem, libElem);
                        if ( alreadyImported ) {
                            libScripts.splice(libScripts.length - 1 - i, 1);
                            break;
                        }
                    }
                }
                // reverse loop on styles to check if a file of the same lib was already importes
                for ( let i = 0; i < libStyles.length; i++ ){
                    let libElem = libStyles[ libStyles.length - 1 - i ];
                    for ( let j = 0; j < savedLibStyles.length; j++){
                        let savedLibElem = savedLibStyles[ savedLibStyles.length - 1 - j ];
                        let alreadyImported = StringComposeReader.checkLibPathsSameEnd(savedLibElem, libElem);
                        if ( alreadyImported ) {
                            libStyles.splice(libStyles.length - 1 - i, 1);
                            break;
                        }
                    }
                }

                this.PROJECT_JSON_INFORMATIONS.visualsLib[elemName].visuals.push(visual.getName());
                this.PROJECT_JSON_INFORMATIONS.visualsLib[elemName].scripts.push(...libScripts);
                this.PROJECT_JSON_INFORMATIONS.visualsLib[elemName].styles.push(...libStyles);
            }
        }
    }

}