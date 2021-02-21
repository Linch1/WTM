import { StringComposeWriter, FileWriter, extensions, BulkVisual, ProjectTypes } from "..";
import { checkMapProjectTypeToExtension } from "../Checkers/check.mapProjectTypeToExtension";
import { ConstProjects } from "../Constants/const.projects";

import { ProjectJsonInformations } from "../Types/manageProject.jsonInformations";


export class Project{
    
    public PROJECT_JSON_FILE_PATH: string;
    public PROJECT_JSON_DIR_PATH: string;

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
    public refreshVisualsDependencies(){
        let projectVisuals = new BulkVisual(this.getVisualsPath(), this.getProjectType()).getAllVisuals();
        for ( let visual of projectVisuals){
            if( !visual.isCreated() ){
                let fbVisual = visual.getFallbackVisual();
                if( fbVisual ) visual = fbVisual;
                else continue;
            }
            let stylesDep: string[] = visual.getStylesDependencies();
            let scriptsDep: string[] = visual.getScriptsDependencies();
            // parse styles dep for replace all the paths that starts with ./ or those who doesn't contains a '/' char
            for ( let i = 0; i<stylesDep.length; i++){
                let path = stylesDep[i]
                // if is relative visual path add the visual abs path at the start
                if( path.startsWith('./') || !path.includes('/') ) {
                    path = path.replace('./', '');
                    path = StringComposeWriter.concatenatePaths(
                        visual.getStylesDirPath(),
                        path
                    )
                    stylesDep[i] = path;
                }
            }
            // parse scripts dep for replace all the paths that starts with ./ or those who doesn't contains a '/' char
            for ( let i = 0; i<scriptsDep.length; i++){
                let path = scriptsDep[i]
                if( path.startsWith('./') || !path.includes('/') ) {
                    path = path.replace('./', '');
                    path = StringComposeWriter.concatenatePaths(
                        visual.getScriptsDirPath(),
                        path
                    )
                    scriptsDep[i] = path;
                }
            }
            if( stylesDep.length || scriptsDep.length ){
                this.PROJECT_JSON_INFORMATIONS.visualsDependencies[visual.getName()] = {
                    scripts: scriptsDep,
                    styles: stylesDep
                }
                this.saveJson();
            }
        }
    }

}