import * as fs from "fs";
import {nestedStringsArrays} from "./customTypes";

class FileManager {

  // @desc: recursively get the passed folder tree
  static readFolderTree(path: string, excludedFolders: string[] = []): nestedStringsArrays {
    let folderDirectories: string[] = this.getDirectories(path); // read the directories
    let folderTree: nestedStringsArrays[] = []; // init the folder Tree
    let folderFiles: string[] = this.getFiles(path);
    folderTree.push(...folderFiles);

    for( let folder of folderDirectories ){
        let folder_name = folder;
        folder = path.endsWith("/") ? `${path}${folder}` : `${path}/${folder}`; // get the full folder path
        let treeLevel: nestedStringsArrays[] = []; // init the folder level
        let subLevels: nestedStringsArrays = [];
        if(!excludedFolders.includes(folder_name)){ // if the folder is not excluded 
            subLevels = this.readFolderTree(folder); // get the folder subLevels
        }

        treeLevel.push(folder); // push the folder name ( always the first elem of the array is the folder name )
        treeLevel.push(subLevels); // push the sublevels
        folderTree.push(treeLevel); // push the current level tree to the main tree
    }
    return folderTree;
  }

  // @desc: print the tree got from the this.readFolderTree method
  static printFolderTree(folderTree: nestedStringsArrays, level: number = 0){
      let print_spaces: number = level - 1 > 0 ? level - 1 : 0
      let indent_string: string = "|" + "    |".repeat(print_spaces) + "---";
      for( let folderOrFile of folderTree ){
        if(typeof folderOrFile == "object" ) this.printFolderTree(folderOrFile, level + 1);
        else console.log(`${indent_string} ${folderOrFile}`);
      }
  }
  
  static readFile(path: string): string {
    return fs.readFileSync(path, "utf-8");
  }

  static writeFile(path: string, content: string): void {
    fs.writeFileSync(path, content, "utf8");
  }

  static appendFile(path: string, content: string): void {
    if (!this.existsFile(path)) return;
    fs.appendFileSync(path, content, "utf8");
  }

  static moveFile(old_path: string, new_path: string): void {
    fs.renameSync(old_path, new_path);
  }

  static existsFile(path: string): boolean {
    return fs.existsSync(path);
  }

  static getFiles(path: string): string[] {
    return fs
      .readdirSync(path, { withFileTypes: true })
      .filter((dirent) => dirent.isFile())
      .map((dirent) => dirent.name);
  }

  static getDirectories(path: string): string[] {
    return fs
      .readdirSync(path, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
  }

  static getFirstLevelFilesAndFolders(path: string): string[] {
    return fs.readdirSync(path, { withFileTypes: true }).map((dirent) => dirent.name);
  }

  static createFile(path: string, content: string): void {
    if (!fs.existsSync(path)) {
      this.writeFile(path, content);
    }
  }

  static createDirectory(path: string): void {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
  }

  static removeFile(path: string): void {
    fs.unlinkSync(path);
  }

  static deleteFolderRecursive(path: string): void {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach((file: string, index: number) => {
        let curPath = path + "/" + file;
        if (fs.lstatSync(curPath).isDirectory()) {
          // recurse
          this.deleteFolderRecursive(curPath);
        } else {
          // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  }
}

export { FileManager };
