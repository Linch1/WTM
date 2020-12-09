import { nestedStringsArrays } from "../types/customTypes";
import { FileReader } from "./FileReader";
import { FileWriter } from "./FileWriter";
import {StringComposeWriter} from "./StringComposeWriter";
import { CommentsIdentifiers } from "../comments-identifiers/CommentsIdentifiers"
import * as prettier from "prettier";

class StringComposeReader {
  static readonly NoStartCharFound =
    "ERR: The given start char is not present in the file";
    static readonly NoContentFound = null;

  /**
   * @description read the text contained beetween to chars/phrases ( and that start with a specific text optionally )
   * @param filePath the file that you want to edht
   * @param startChar the start character
   * @param endChar the end character
   * @param specificIdentifier a specific word/phrase that idicate that the found thext is the right one ( in case there are more startChar in the same file )
   *
   * @return string: the found text
   *
   * @example
   * `
   * - WARNING It may cause errors in case where we have a similar situation:
   * Consider the following text to edit in a specific file:
   *
   *         My Identifier hey whats up ''' this text is the wrong one ''' this is
   *         MyIdentifier hey whats up ''' this text should be returned ''' this is
   *
   * in this case calling the function
   *
   *         readBeetweenChars(filePath, "MyIdentifier", "this is", "hey whats up")  -- return --> ''' this text is the wrong one '''
   *
   * But this is a really rare case.
   * `
   */
  static readBeetweenChars(
    filePath: string,
    startChar: string,
    endChar: string = "",
    specificIdentifier: string = ""
  ): string {
    // reformat all the texts to single line
    let fileText: string = FileReader.readFile(filePath);
    let fileTextSingleLine = StringComposeWriter.removeSpacesAndNewLines(fileText);
    startChar = StringComposeWriter.removeSpacesAndNewLines(startChar);
    endChar = StringComposeWriter.removeSpacesAndNewLines(endChar);
    
    specificIdentifier = StringComposeWriter.removeSpacesAndNewLines(specificIdentifier);
    let startCharSplit: string[] = fileTextSingleLine.split(startChar);
    if (startCharSplit.length <= 1) throw new Error(this.NoStartCharFound);
    let foundContent: string = "";
    for (let i = 0; i < startCharSplit.length; i++) {
      let content: string = startCharSplit[i].trim();
      if (endChar && content.indexOf(endChar) == -1) continue; // check if the end character is contained if not skip
      if (specificIdentifier && !content.startsWith(specificIdentifier)) continue; // check that is the correct content starts with the given phrase if not skip
      let endCharSplit: string[] = endChar ? content.split(endChar) : [content];
      foundContent = endCharSplit[0];
      return foundContent;
    }
    return "";
  }
}

export { StringComposeReader };
