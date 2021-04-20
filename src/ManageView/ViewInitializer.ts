import { Checker } from "../Checkers/Checker";
import { ConstViews } from "../Constants/const.views";
import { FileReader } from "../ManageFiles";
import { FileWriter } from "../ManageFiles/FileWriter";
import { StringComposeWriter } from "../ManageFiles/StringComposeWriter";
import { View } from "./View";

export class ViewIntializer {

    constructor(public view: View ){}

    public parseName(){
        this.view.VIEW_NAME = this.view.VIEW_NAME.trim();
        if( this.view.VIEW_NAME.includes(this.view.reader.getViewPrefix()) ) {
            this.view.VIEW_NAME = this.view.VIEW_NAME.replace(this.view.reader.getViewPrefix(), "");
        }
    }

    public setViewsFolderPath(){
        this.view.VIEWS_FOLDER = this.view.PROJECT.reader.getViewsPath();
    }
    public setJsonFolderPath(){
        this.view.JSON_FOLDER_PATH = StringComposeWriter.concatenatePaths(this.view.VIEWS_FOLDER, ConstViews.JsonDirectory);
    }
    public setJsonFilePath(){
        this.view.JSON_FILE_PATH = StringComposeWriter.concatenatePaths(this.view.VIEWS_FOLDER, `${ConstViews.JsonDirectory}/${this.view.reader.getName().toLowerCase().split(" ").join("-")}.json`);
    }
    public setCommonDefaultBuildFilePath(){
        this.view.COMMON_DEFAULT_BUILD_FILE_PATH = StringComposeWriter.concatenatePaths(this.view.VIEWS_FOLDER, `${ConstViews.CommonContentFileName}.${Checker.checkMapProjectTypeToExtension(this.view.reader.getProjectType())}`);
    }
    public setCommonInformationsFilePath(){
        this.view.JSON_COMMON_INFORMATIONS_FILE_PATH = StringComposeWriter.concatenatePaths(this.view.VIEWS_FOLDER, ConstViews.JsonDirectory, ConstViews.CommonJsonFile);
    }
    /**
   * @description create the needed files and directories
   */
    public create(){
        FileWriter.createDirectory(this.view.VIEWS_FOLDER);
        FileWriter.createDirectory(this.view.JSON_FOLDER_PATH);
        FileWriter.createFile(
            this.view.JSON_COMMON_INFORMATIONS_FILE_PATH,
            JSON.stringify(this.view.JSON_COMMON_INFORMATIONS)
        );
        FileWriter.createFile( this.view.COMMON_DEFAULT_BUILD_FILE_PATH, this.view.COMMON_DEFAULT_BUILD );

        this.view.JSON_COMMON_INFORMATIONS = JSON.parse(
            FileReader.readFile(this.view.JSON_COMMON_INFORMATIONS_FILE_PATH)
        );

        if (FileReader.existsPath(this.view.JSON_FILE_PATH)) {
            this.view.JSON_FILE_CONTENT = JSON.parse( FileReader.readFile(this.view.JSON_FILE_PATH) );
        }
        if (FileReader.existsPath(this.view.COMMON_DEFAULT_BUILD_FILE_PATH)) {
            this.view.COMMON_DEFAULT_BUILD = FileReader.readFile(this.view.COMMON_DEFAULT_BUILD_FILE_PATH)
        }
    }
   
 
}
