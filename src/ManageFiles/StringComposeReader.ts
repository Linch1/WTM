import { ConstProjects, ConstVisuals } from "../Constants";
import { extensions } from "../Enums/common.extension";
import { FileReader } from "./FileReader";
import { StringComposeWriter } from "./StringComposeWriter";

export class StringComposeReader {
  static readonly ERR_NO_START_CHAR_FOUND =
    "ERR: The given start char is not present in the file";
  static readonly ERR_CANNOT_GET_LAST_ELEM: "ERR: Cannot get the last element of the given Path";

  /**
   * @description read the text between two chars
   * @param filePath the path to the file that contains the text
   * @param startChar the start char/string
   * @param endChar the end char/string
   */
  static readBeetweenStrings(
    filePath: string,
    startString: string,
    endString: string = "",
  ) {
    let fileText = FileReader.readFile( filePath )
    let startCharSpacesInsensitive = StringComposeReader.escapeRegexChars(startString).replace(/[ \t]+/g, '\[\\s\\S\]*');
    let endCharSpacesInsensitive = StringComposeReader.escapeRegexChars(endString).replace(/[ \t]+/g, '\[\\s\\S\]*');
    let bewtweenCharsRegex = new RegExp( startCharSpacesInsensitive + '(.?\[\\s\\S\])*' + endCharSpacesInsensitive );
    let startCharRegex = new RegExp( startCharSpacesInsensitive, 'g');
    let endCharRegex = new RegExp( endCharSpacesInsensitive, 'g');
    let matches = fileText.match( bewtweenCharsRegex );
    if ( !matches ) return { text: null, bewtweenCharsRegex };
    else return { text: matches[0].replace( startCharRegex, '' ).replace(endCharRegex, ''), bewtweenCharsRegex };
  }

  static getPathLastElem(path: string): string {
    let lastElem = path.match(/([^\/]*)\/*$/);
    if (lastElem == null) throw new Error(this.ERR_CANNOT_GET_LAST_ELEM);
    else return lastElem[1];
  }
  static escapeRegexChars( text: string ): string{
    return text.replace(/[-[\]{}()*+?.,\\^$|#]/g, '\\$&');
  }
}
