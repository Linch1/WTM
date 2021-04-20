
import { ConstProjects } from "../Constants/const.projects";
import { FileWriter } from "../ManageFiles/FileWriter";
import { StringComposeWriter } from "../ManageFiles/StringComposeWriter";
import { Project } from "./Project";

export class ProjectInitializer{
    
    constructor( public project:  Project ){}

    public setProjectJsonFolderPath(){
        this.project.PROJECT_JSON_DIR_PATH = StringComposeWriter.concatenatePaths(
            this.project.reader.getPath(),
            ConstProjects.jsonPathInProjectDirectory
        );
    }
    public setProjectJsonFilePath(){
        this.project.PROJECT_JSON_FILE_PATH = StringComposeWriter.concatenatePaths(
            this.project.PROJECT_JSON_DIR_PATH,
            ConstProjects.jsonProjectFile
          );
    }
    public setAssetsFolderPath(){
        this.project.ASSETS_PATH = StringComposeWriter.concatenatePaths(
            this.project.PROJECT_JSON_DIR_PATH,
            ConstProjects.projectAssetsDirectory
          );
    }
    
    public setAssetsScriptsFolderPath(){
        this.project.ASSETS_SCRIPTS_PATH = StringComposeWriter.concatenatePaths(
            this.project.ASSETS_PATH,
            ConstProjects.projectAssetsJsDirectory
          );
    }
    public setAssetsStylesFolderPath(){
        this.project.ASSETS_STYLES_PATH = StringComposeWriter.concatenatePaths(
            this.project.ASSETS_PATH,
            ConstProjects.projectAssetsCssDirectory
          );
    }
    public setAssetsImagesFolderPath(){
        this.project.ASSETS_IMG_PATH = StringComposeWriter.concatenatePaths(
            this.project.ASSETS_PATH,
            ConstProjects.projectAssetsImgDirectory
          );
    }
    public setAssetsLibFolderPath(){
        this.project.ASSETS_LIB_PATH = StringComposeWriter.concatenatePaths(
            this.project.ASSETS_PATH,
            ConstProjects.projectAssetsLibDirectory
          );
    }

    public create() {
        if (this.project.reader.isCreated()) return;
        FileWriter.createDirectory(this.project.PROJECT_JSON_DIR_PATH);
        FileWriter.createDirectory(this.project.reader.getViewsPath());
        FileWriter.createDirectory(this.project.reader.getVisualsPath());
        FileWriter.createDirectory(this.project.depManager.reader.getAssetsPath());
        FileWriter.createDirectory(this.project.depManager.reader.getProjectAssetsLibPath());
        FileWriter.createDirectory(this.project.depManager.reader.getAssetsScriptsPath());
        FileWriter.createDirectory(this.project.depManager.reader.getAssetsImgPath());
        FileWriter.createDirectory(this.project.depManager.reader.getAssetsStylesPath());
        FileWriter.createFile(
            this.project.PROJECT_JSON_FILE_PATH,
          JSON.stringify(this.project.JSON_FILE_CONTENT)
        );
        this.project.writer.createDefaultContent();
    }
}