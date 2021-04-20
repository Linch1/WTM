import { ConstProjects } from "../Constants/const.projects";
import { ProjectTypes } from "../Enums";
import { FileReader } from "../ManageFiles/FileReader";
import { FileWriter } from "../ManageFiles/FileWriter";
import { StringComposeWriter } from "../ManageFiles/StringComposeWriter";
import { visualJson, visualJsonScheletonAsParam } from "../Types";
import { Visual } from "./Visual";

export class VisualInitializer {
    
    constructor( public visual: Visual ){}

    public run() {
        this.visual.JSON_FILE_CONTENT = this.retriveJsonContentIfExists();
    }

    /**
     * @description read the content inside the json file if exists, else returns the default json content
     * @returns 
     */
    public retriveJsonContentIfExists(): visualJson{
        if(FileReader.existsPath(this.visual.JSON_FILE_PATH)){
            return JSON.parse(FileReader.readFile(this.visual.JSON_FILE_PATH));
        }
        return this.visual.JSON_FILE_CONTENT; // if it doesn't exists returns the default one
    }

    public setEmptyJsonScheletonParams( scheleton: visualJsonScheletonAsParam ){
        if( !scheleton.projectType ) scheleton.projectType = ProjectTypes.html;
        if( !scheleton.author ) scheleton.author = "";
        if( !scheleton.authorUrl ) scheleton.authorUrl = "";
        if( !scheleton.githubRepo ) scheleton.githubRepo = "";
        if( !scheleton.assetsAutoImport ) scheleton.assetsAutoImport = false;
        if( !scheleton.projectPath ) scheleton.projectPath = "";
    }

    public updateJsonWithScheletonParams( scheleton: visualJsonScheletonAsParam ){
        this.visual.writer.setProjectPath( scheleton.projectPath as unknown as string );
        this.visual.writer.setProjectType( scheleton.projectType as unknown as ProjectTypes );
        this.visual.writer.setAuthor( scheleton.author as unknown as string );
        this.visual.writer.setAuthorUrl( scheleton.authorUrl as unknown as string );
        this.visual.writer.setGithubRepo( scheleton.githubRepo as unknown as string );
        this.visual.writer.setAssetsAutoImport( scheleton.assetsAutoImport as unknown as boolean );
        this.visual.writer.setName( scheleton.name );
    }

    public populateJsonIfAlreadyCreated(){
        if(FileReader.existsPath(this.visual.JSON_FILE_PATH)){
            this.visual.JSON_FILE_CONTENT = JSON.parse(FileReader.readFile(this.visual.reader.getJsonFilePath()));
        }
    } 
    public setVisualFolder(){
        this.visual.VISUALS_FOLDER = StringComposeWriter.concatenatePaths(this.visual.VISUALS_FOLDER, this.visual.reader.getName());
    }
    public setJsonFilePath(){
        this.visual.JSON_FILE_PATH = StringComposeWriter.concatenatePaths(
            this.visual.reader.getDirPath(), // uses project type
            this.visual.JSON_FILE_NAME
        );
    }
    public setRenderFilePath(){
        this.visual.RENDER_FILE_PATH = StringComposeWriter.concatenatePaths(
            this.visual.reader.getDirPath(),
            this.visual.RENDERED_FILE_NAME + "." + this.visual.reader.getExtension()
          );
    }
    public setDefaultFilePath(){
        this.visual.DEFAULT_FILE_PATH = StringComposeWriter.concatenatePaths(
            this.visual.reader.getDirPath(),
            this.visual.DEFAULT_FILE_NAME + "." + this.visual.reader.getExtension()
        );
    }
    public setAssetsFolder(){
        this.visual.ASSETS_PATH = StringComposeWriter.concatenatePaths(
            this.visual.reader.getDirPath(),
            this.visual.ASSETS_RELATIVE_FOLDER_PATH
          );
    }
    public setAssetsScriptsFolder(){
        this.visual.ASSETS_SCRIPTS_PATH = StringComposeWriter.concatenatePaths(
            this.visual.reader.getDirPath(),
            this.visual.SCRIPTS_RELATIVE_FOLDER_PATH
          );
    }
    public setAssetsStylesFolder(){
        this.visual.ASSETS_STYLES_PATH = StringComposeWriter.concatenatePaths(
            this.visual.reader.getDirPath(),
            this.visual.STYLES_RELATIVE_FOLDER_PATH
          );
    }
    public setAssetsImagesFolder(){
        this.visual.ASSETS_IMG_PATH = StringComposeWriter.concatenatePaths(
            this.visual.reader.getDirPath(),
            this.visual.IMG_RELATIVE_FOLDER_PATH
          );
    }
    public setAssetsLibFolder() {
        if ( !this.visual.reader.isCreated() ) { this.visual.ASSETS_LIB_PATH = ""; } // if empty the depManager will throw an error preventing to edit/create wrong files
        else {
            this.visual.ASSETS_LIB_PATH = StringComposeWriter.concatenatePaths(
                this.visual.reader.getProjectPath(),
                ConstProjects.projectAssetsDirectory,
                ConstProjects.projectAssetsLibDirectory
            );
        }
    }

    /**
     * @description create the visual directory and populate it with the main files [render.html, default.html, identifiers.json]
     * @returns string: the path to the visual folder
     */
    public create(): string {
        let visualPath = this.visual.reader.getDirPath();
        if (FileReader.existsPath(visualPath)) { throw new Error(this.visual.ERR_VISUAL_ALREADY_EXISTS); }
        FileWriter.createDirectory(visualPath);
        FileWriter.createDirectory(this.visual.depManager.reader.getAssetsPath());
        FileWriter.createDirectory(this.visual.depManager.reader.getAssetsScriptsPath());
        FileWriter.createDirectory(this.visual.depManager.reader.getAssetsStylesPath());
        FileWriter.createDirectory(this.visual.depManager.reader.getAssetsImgPath());
        FileWriter.createFile( this.visual.RENDER_FILE_PATH, this.visual.INIT_RENDER_FILE_CONTENT );
        FileWriter.createFile( this.visual.DEFAULT_FILE_PATH, this.visual.INIT_DEFAULT_FILE_CONTENT );
        this.visual.writer.saveJson(); // create the json with the current json content
        return visualPath;
    }
    
}
