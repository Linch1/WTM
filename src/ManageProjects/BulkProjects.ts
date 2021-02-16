import { StringComposeWriter, FileWriter } from "..";
import { WTMPathsAndConstants } from "../Enums/common.pathsAndConstants";
import { FileReader } from "../files";
import { ProjectJsonInformations } from "../Types/manageProject.jsonInformations";
import { ProjectsJson } from "../Types/manageProject.jsonProjects";
import { ProjectsCache } from "../Types/manageProject.projectsCache";
import { Project } from "./Project";



export class BulkProjects{
    public PROJECTS_CACHE: ProjectsCache = {};
    public PROJECTS_JSON_DIR_PATH = StringComposeWriter.concatenatePaths(
        this.PROJECT_DIR_PATH,
        WTMPathsAndConstants.jsonProjectsDirectory
    );
    public PROJECTS_JSON_FILE_PATH = StringComposeWriter.concatenatePaths(
        this.PROJECTS_JSON_DIR_PATH,
        WTMPathsAndConstants.jsonProjectsFile
    );
    public PROJECTS_JSON_INFORMATIONS: ProjectsJson = {
        projectPaths: []
    }
    constructor( public PROJECT_DIR_PATH: string ){
        // create the dire and the file if not exists
        FileWriter.createDirectory(this.PROJECTS_JSON_DIR_PATH);
        FileWriter.createFile(this.PROJECTS_JSON_FILE_PATH, JSON.stringify(this.PROJECTS_JSON_INFORMATIONS));
        // initalize the json informations
        this.PROJECTS_JSON_INFORMATIONS = JSON.parse(
            FileReader.readFile(this.PROJECTS_JSON_FILE_PATH)
        );
        this.refreshProjectsCache();
    }
    public saveJson(){
        FileWriter.writeFile(this.PROJECTS_JSON_FILE_PATH, JSON.stringify(this.PROJECTS_JSON_INFORMATIONS));
    }
    /**
     * @description update the projects cache and return it's values as an array
     */
    public readProjects(): Project[] {
        this.refreshProjectsCache();
        return Object.values(this.PROJECTS_CACHE);
    }
    /**
     * @description update the objects that contains the saved projects,
     * the object is of the type _projectsCache_
     */
    public refreshProjectsCache(): void{
        for ( let projectPath of this.PROJECTS_JSON_INFORMATIONS.projectPaths ){
            let projectInfos: ProjectJsonInformations = JSON.parse(
                FileReader.readFile(
                    StringComposeWriter.concatenatePaths(
                        projectPath,
                        WTMPathsAndConstants.jsonPathInProjectDirectory,
                        WTMPathsAndConstants.jsonProjectFile
                    )
                )
            );
            let project = new Project(projectInfos);
            this.PROJECTS_CACHE[projectInfos.name] = project;
        }
    }
    /**
     * @description get a project by it's name, it returns the project if
     * it is present in the PROJECTS_CACHE else null.
     * @param projectName the name of the project to retrive
     */
    public getProjectByName(projectName: string): Project | undefined{
        if( this.PROJECTS_CACHE[projectName] ) return this.PROJECTS_CACHE[projectName] 
        else return undefined;
    }
    /**
     * @description add a new project
     * @param infos 
     */
    public addProject(infos: ProjectJsonInformations){
        this.PROJECTS_CACHE[infos.name] = new Project( infos );
        this.PROJECTS_JSON_INFORMATIONS.projectPaths.push(infos.path);
        this.saveJson();
    }
}