import * as fs from "fs";
import { folderObject } from "../Types/files.FileReader";
import { StringComposeWriter } from "./StringComposeWriter";

export class FileReader {
  static readonly ERR_NO_FUNCTION_FOUND =
    "NO FUNCTION FOUND: no function was found with the given name";

  /**
   * @description recursively get the passed folder tree
   * @param path the path to the folder
   * @param excludedFolders the folders to exclude ( array of strings )
   */
  static readFolderTree(
    path: string,
    excludedFolders: string[] = [],
    level: number = 0,
  ): folderObject {
    let currentFolder: folderObject = {
      folderPath: path,
      files: this.getFiles(path),
      level: level,
      folders: []
    }; // init the folder Tree
    let containedFolders = this.getDirectories(path);

    for (let folderName of containedFolders) {
      let folderPath = path.endsWith("/") ? `${path}${folderName}` : `${path}/${folderName}`; // get the full folder path
      if (!excludedFolders.includes(folderName)) {
        currentFolder.folders.push( this.readFolderTree(folderPath, excludedFolders, level + 1 ) );
      } else {
        currentFolder.folders.push({
          folderPath: folderPath,
          files: [],
          folders: [],
          level: level + 1
        })
      }
    }
    return currentFolder;
  }

  /**
   * @description print the tree got from the this.readFolderTree method
   * @param folderTree pass to this param the output of the function this.readFolderTree(path, excludedFolders)
   */
  static printFolderTree(folderTree: folderObject) {
    let level = folderTree.level;
    let print_spaces: number = level - 1 > 0 ? level - 1 : 0;
    let indent_string: string = "|" + "    |".repeat(print_spaces) + "---";
    for (let folder of folderTree.folders) {
      console.log(`${indent_string} ${folder.folderPath}`);
      this.printFolderTree(folder);
    }
    for ( let file of folderTree.files){
      console.log(`${indent_string} ${file}`);
    }
  }

  /**
   * @description given a folderTree returns an array of all the paths inside the folder tree
   * @param folderTree 
   */
  static folderTreePaths(folderTree: folderObject): string[]{
    let paths: string[] = [];
    let parentFolder = folderTree.folderPath;
    for ( let folder of folderTree.folders ){
        paths.push( ...this.folderTreePaths(folder) );
    }
    for ( let file of folderTree.files ){
      paths.push( StringComposeWriter.concatenatePaths( parentFolder, file))
    }
    return paths;
  }

  

  static readFile(path: string): string {
    return fs.readFileSync(path, "utf-8");
  }

  static existsPath(path: string): boolean {
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

  static isDirectory(path: string): boolean {
    return fs.lstatSync(path).isDirectory() 
  }
  static isFile(path: string): boolean {
    return fs.lstatSync(path).isFile() 
  }

  static getFirstLevelFilesAndFolders(path: string): string[] {
    return fs
      .readdirSync(path, { withFileTypes: true })
      .map((dirent) => dirent.name);
  }

  /**
   * @description read the body of a function inside a given file
   * @param filePath the path to the fail that contains the function
   * @param functionName the function name
   */
  static readFunctionBody(filePath: string, functionName: string): string {
    let fileText: string = FileReader.readFile(filePath);
    let functions: string[] = fileText.split("function"); // get all the texts between the function words // static
    let functionBody: string = "";
    for (let i = 0; i < functions.length; i++) {
      let func: string = functions[i].trim();
      if (!func.startsWith(functionName)) continue; // check that is the correct function and if not skip
      let functionBodyOpenSplit: string[] = func.split("{");
      // the index 0 contains name_function(), the index 1 is the start of the function body
      let functionBodyCloseSplit: string[] = functionBodyOpenSplit[1].split(
        "}"
      );
      functionBody = functionBodyCloseSplit[0].trim(); // delimit the end of the function definition
      // return all this vars for let easier and faster the function changes in ThemeWriter
      return functionBody;
    }
    throw new Error(this.ERR_NO_FUNCTION_FOUND);
  }


}

