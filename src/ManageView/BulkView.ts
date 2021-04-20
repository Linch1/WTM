
import { Checker } from "../Checkers";
import { ConstViews } from "../Constants/const.views";
import { extensions } from "../Enums/common.extension";
import { FileReader } from "../ManageFiles";
import { Project } from "../ManageProjects/Project";
import { View } from "./View";

export class BulkView {
    public viewsPath;
    public prefix;
    public projectType;
    public projectPath;
    constructor(public project: Project ){
        this.viewsPath = this.project.reader.getViewsPath();
        this.prefix = ConstViews.Prefix;
        this.projectType = this.project.reader.getProjectType();
        this.projectPath = this.project.reader.getPath();
    }

    public getAllViews(): View[]{
        let views: View[] = []; 
        let viewsFolderFiles = FileReader.getFiles( this.viewsPath );
        for ( let viewFile of viewsFolderFiles){
            if(!viewFile.startsWith( this.prefix )) continue;
            let viewNameArr: string[] = viewFile.split(".");
            let extension = viewNameArr.pop() as extensions; // remove the extension from the file name
            if(!Checker.checkValidExtension(extension)) continue; // if not valid extension skip it
            viewFile = viewNameArr.join(".");
            views.push( new View( viewFile, this.project ) );
        }
        return views;
    }

    public reCreateAll() {
        for ( let view of this.getAllViews()){
            view.writer.reCreate();
        }
    }
 
}
