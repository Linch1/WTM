import * as fs from "fs";
import { nestedStringsArrays } from "../types/customTypes";
import { FileWriter } from "./FileWriter";

class FileReader {
  static readonly NoFunctionFoundErr =
    "NO FUNCTION FOUND: no function was found with the given name";

  // @desc: recursively get the passed folder tree
  static readFolderTree(
    path: string,
    excludedFolders: string[] = []
  ): nestedStringsArrays {
    let folderDirectories: string[] = this.getDirectories(path); // read the directories
    let folderTree: nestedStringsArrays[] = []; // init the folder Tree
    let folderFiles: string[] = this.getFiles(path);
    folderTree.push(...folderFiles);

    for (let folder of folderDirectories) {
      let folder_name = folder;
      folder = path.endsWith("/") ? `${path}${folder}` : `${path}/${folder}`; // get the full folder path
      let treeLevel: nestedStringsArrays[] = []; // init the folder level
      let subLevels: nestedStringsArrays = [];
      if (!excludedFolders.includes(folder_name)) {
        // if the folder is not excluded
        subLevels = this.readFolderTree(folder); // get the folder subLevels
      }

      treeLevel.push(folder); // push the folder name ( always the first elem of the array is the folder name )
      treeLevel.push(subLevels); // push the sublevels
      folderTree.push(treeLevel); // push the current level tree to the main tree
    }
    return folderTree;
  }

  // @desc: print the tree got from the this.readFolderTree method
  static printFolderTree(folderTree: nestedStringsArrays, level: number = 0) {
    let print_spaces: number = level - 1 > 0 ? level - 1 : 0;
    let indent_string: string = "|" + "    |".repeat(print_spaces) + "---";
    for (let folderOrFile of folderTree) {
      if (typeof folderOrFile == "object")
        this.printFolderTree(folderOrFile, level + 1);
      else console.log(`${indent_string} ${folderOrFile}`);
    }
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

  static getFirstLevelFilesAndFolders(path: string): string[] {
    return fs
      .readdirSync(path, { withFileTypes: true })
      .map((dirent) => dirent.name);
  }

  static readFunctionBody(filePath: string, functionName: string): string {
    let fileText: string = FileReader.readFile(filePath);
    let functions: string[] = fileText.split("function"); // get all the texts between the function words
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
    throw new Error(this.NoFunctionFoundErr);
  }


}

export { FileReader };
