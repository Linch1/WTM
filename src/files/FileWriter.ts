import * as fs from "fs";
import { nestedStringsArrays } from "../types/customTypes";
import { FileReader } from "./FileReader";
import * as prettier from "prettier";

class FileWriter {
  static editFileFunction(
    filePath: string,
    fileContent: string,
    oldContent: string,
    newContent: string
  ): void {
    this.writeFile(filePath, fileContent.replace(oldContent, newContent));
  }

  static makePretty(filePath: string){
    let fileContent: string = FileReader.readFile(filePath);
    let splittedFileName: string[] = filePath.split(".");
    let extension = splittedFileName[splittedFileName.length - 1];
    let lang: string = "";
    if (extension == "css") lang = "css";
    else if ( extension == "js" || extension == "ts" ) lang = "typescript";
    else if ( extension == "html" || extension == "php" ) lang = "html";
    this.writeFile(filePath, prettier.format(fileContent, { semi: false, parser: lang }));

  }

  static appendToFunctionBody(
    filePath: string,
    functionName: string,
    toAppend: string
  ): void {
    let fileContent = FileReader.readFile(filePath);
    let functionBody: string = FileReader.readFunctionBody(
      filePath,
      functionName
    ); // get the import file content
    
    let functionBodyNew: string = functionBody.endsWith(";")
      ? `${functionBody}\n${toAppend}`
      : `${functionBody};\n${toAppend}`; // add the file importation
    this.editFileFunction(filePath, fileContent, functionBody, functionBodyNew); // edit the file
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

  static moveFile(old_path: string, new_path: string): void {
    fs.renameSync(old_path, new_path);
  }
  static writeFile(path: string, content: string): void {
    fs.writeFileSync(path, content, "utf8");
  }

  static appendFile(path: string, content: string): void {
    if (!FileReader.existsFile(path)) return;
    fs.appendFileSync(path, content, "utf8");
  }
}

export { FileWriter };
