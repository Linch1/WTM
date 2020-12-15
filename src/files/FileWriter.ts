import * as fs from "fs";
import { nestedStringsArrays } from "../types/customTypes";
import { StringComposeWriter } from "./StringComposeWriter";
import { CommentsIdentifiers } from "../comments-identifiers/CommentsIdentifiers";
import { FileReader } from "./FileReader";

class FileWriter {
  static EMPTY_TEXT: string = "ERR: Empty text in the body";

  /**
   * @description modify the content of a text in a file
   * @param filePath the file containing the function to edit
   * @param oldContent the old content of the function
   * @param newContent the new content of the function
   */
  static editFileFunction(
    filePath: string,
    oldContent: string,
    newContent: string
  ): void {
    /**
     * When the content is empty calling the edit function will replace "" with the text
     * that so -> the first char of the filecontent is replaced with the newContent instead of
     * adding the line to the function
     */
    let fileContent = FileReader.readFile(filePath);
    if (!oldContent.trim()) throw new Error(this.EMPTY_TEXT);
    this.writeFile(filePath, fileContent.replace(oldContent, newContent));
  }

  /**
   * @description add at the end of a function the given text
   * @param filePath the file path that contains the function to edit
   * @param functionName the function name
   * @param toAppend the text to add at the function body
   */
  static appendToFunctionBody(
    filePath: string,
    functionName: string,
    toAppend: string
  ): void {
    let functionBody: string = FileReader.readFunctionBody(
      filePath,
      functionName
    ); // get the import file content
    let functionBodyNew: string = functionBody.endsWith(";") || functionBody.endsWith("/")
      ? `${functionBody}${toAppend}`
      : `${functionBody};${toAppend}`; // add the file importation
    this.editFileFunction(filePath, functionBody, functionBodyNew); // edit the file
  }

  /**
   * 
   * @param filePath the path of the file that contains the text to edit
   * @param identifierType The type of the identifier that contains the text to edit
   * @param identifierName The name of the identifier 
   * @param toAppend The text to add
   * @return void
   */
  static addAfterCommentIdentifierPair(
    filePath: string,
    identifierType: string,
    identifierName: string,
    toAppend: string
  ): void {
    let CI = CommentsIdentifiers;
    let idIdentifiers: string[];
    if (Object.keys(CI.IDENTIFIERS).includes(identifierType)) {
      // @ts-ignore
      idIdentifiers = CI.IDENTIFIERS[identifierType][
        CI.IDENTIFIER_FUNCTION_POS
      ](identifierName);
    } else {
      throw new Error(CI.NoIdentifierFoundWithThatType);
    }
    StringComposeWriter.appendBeetweenChars(
      filePath,
      toAppend,
      idIdentifiers[0],
      idIdentifiers[1]
    );
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
