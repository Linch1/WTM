import { FileReader } from "./FileReader";
import { FileWriter } from "./FileWriter";
import * as prettier from "prettier";
import { StringComposeReader } from "./StringComposeReader";
import * as path from 'path';

export class StringComposeWriter {
  /**
   * @description conncatenate into a valid path the given strings
   * @param paths an array of strings to concatenate
   */
  static concatenatePaths(...paths: string[]): string {
    let completePath: string = "";
    completePath += paths[0].startsWith("/") ? "/" : "";
    for (let path of paths) {
      path = path.startsWith("/") ? path.substr(1) : path;
      path = path.endsWith("/") ? path : path + "/";
      completePath += path;
    }
    completePath = completePath.endsWith("/")
      ? completePath.substring(0, completePath.length - 1)
      : completePath;
    return completePath;
  }
  /**
   * @description returns the realtive path to path2 from path1
   * @param path1 
   * @param path2 
   */
  static relativePath( path1: string, path2: string): string{
    return path.relative(path.dirname(path1),path.dirname(path2));
  } 

  /**
   * @description
   * Add a given text at the end of the content contained between two specified characters/phrases.
   * @param filePath: the path of the file that contains the text to edit
   * @param text: the text to append
   * @param startChar: the start character
   * @param endChar: the end character
   */
  static appendBeetweenStrings(
    filePath: string,
    textToAdd: string,
    startChar: string,
    endChar: string
  ): void {
    let fileText = FileReader.readFile( filePath );
    let foundAndRegex = StringComposeReader.readBeetweenStrings( filePath, startChar, endChar );
    if( !foundAndRegex.text ) return;
    else FileWriter.writeFile( filePath, fileText.replace(foundAndRegex.bewtweenCharsRegex, startChar + foundAndRegex.text + textToAdd + endChar) );
  }
  
  /**
   * @description uses the prettier module to reformat a text
   * @param filePath the file path to make pretty
   */
  static makePretty(filePath: string) {
    let fileContent: string = FileReader.readFile(filePath);
    let splittedFileName: string[] = filePath.split(".");
    let extension = splittedFileName[splittedFileName.length - 1];
    let lang: string = "";
    if (extension == "css") lang = "css";
    else if (extension == "js" || extension == "ts") lang = "typescript";
    else if (extension == "html" || extension == "php" || "ejs") lang = "html";
    FileWriter.writeFile(
      filePath,
      prettier.format(fileContent, { semi: false, parser: lang })
    );
  }

  /**
   * @description add at the given word an initial '/' if it doesn't have it
   * @param word the word to analyze
   */
  static addInitialSlash(word: string) {
    return word.startsWith("/") ? word : "/" + word;
  }

  /**
   * @description prepend a '\n\t' and append a '\n'
   * @param word the word to format
   */
  static preformatString(word: string): string {
    return "\n\t" + word;
  }

  

}
