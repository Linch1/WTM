import { FileReader, StringComposeWriter } from "../../files";
import { View } from "./View";

export class BulkView {
    /**
     * @param VIEWS_FOLDER the folder where the views are contained
     * @param extension the extension of the visual files ( php, ejs, html etc...) _without the dot_
     */
    constructor(public VIEWS_FOLDER: string, public extension?: string){}

    public getAllViews(): View[]{
        let views: View[] = []; 
        let viewsFolderFiles = FileReader.getFiles(this.VIEWS_FOLDER);
        for ( let viewFile of viewsFolderFiles){
            let viewNameArr: string[] = viewFile.split(".");
            viewNameArr.pop(); // remove the extension from the file name
            viewFile = viewNameArr.join(".");
            views.push(new View(this.VIEWS_FOLDER, viewFile));
        }
        return views;
    }
 
}
