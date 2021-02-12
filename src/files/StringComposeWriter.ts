import { FileReader } from "./FileReader";
import { FileWriter } from "./FileWriter";
import * as prettier from "prettier";
import { StringComposeReader } from "./StringComposeReader";
import { replaceAllParams } from "../Types/files.StringComposerWriter";
import { IdentifierPlaceholder } from "../Identifiers/IdentifierPlaceholder";
import { IdentifierHtml } from "../Identifiers/IdentifierHtml";
import { identifierActions, identifierToClass, identifierType, renderTypes } from "../Enums";
import { GeneralIdentifier, Identifiers } from "../Identifiers";
import { replaceIdentifiersParams } from "../Types/files.StrCompWr.replaceIdentifiers";
import { IncludeFunctions } from "../Enums/includeFunctions";
import { extensions } from "../Enums/extension";

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
   * @description
   * add spaces and new-lines following the oldText format of a string ( usually called after StringComposeWriter.removeSpacesAndNewLines(text))
   * @param oldFormatText the text pre-singleLine transofrmation
   * @param singleLineText the text after the single line transformation
   *
   * @return string: the singleLineText reformatted based on the oldFormatText
   * @example
   * Consider having:
   * oldFormatText = `
   * register_post_type( '[WTM-PLACEHOLDER-CPT]',
   *   array(
   *       'labels' => array(
   *           'name' => __( '[WTM-PLACEHOLDER-CPTN]' ),
   *           'singular_name' => __( '[WTM-PLACEHOLDER-CPTS]' ),
   *           'supports' => array( 'thumbnail' ),
   *           'hierarchical' => false
   *       ),
   * `
   * singleLineText = `register_post_type(\'[WTM-PLACEHOLDER-CPT]\',*array(*\'labels\'=>array(*\'name\'=>__(\'[WTM-PLACEHOLDER-CPTN]\'),*\'singular_name\'=>__(\'[WTM-PLACEHOLDER-CPTS]\'),*\'supports\'=>array(\'thumbnail\'),*\'hierarchical\'=>false*),`
   * console.log(reinsertSpacesAndNewlines(oldFormatText, singleLineText))
   *
   * `
   * The function
   * will return the single line reformatted following the old formatted text
   * ( a single line text is easier to have for replacing/changing words or phrases )
   * `
   */
  static reinsertSpacesAndNewlines(
    oldFormatText: string,
    singleLineText: string
  ): string {

    let singleLineTextCopy: string = singleLineText;
    let oldFormatTextSpaces: string[] = oldFormatText.split(" ");
    let emptyWordsCount = 0; // check how many consequent empty word there are ( "" )

    // re-add all the spaces and new lines based on the oldFormat
    for (let maybeSingleWord of oldFormatTextSpaces) {
      let words: string[] = maybeSingleWord.includes("\n")
        ? maybeSingleWord.split("\n").join(" \n ").split(" ")
        : [maybeSingleWord];
      let rep = 0;
      while (rep < words.length) {
        let word = words[rep];
        if (!word && words.length == 1) {
          emptyWordsCount++;
          break;
        } else if (!word) {
          rep++;
          continue;
        }
        // find the index of the current word in the single line text
        let wordIndex = singleLineTextCopy.indexOf(word);
        if (wordIndex == -1) {
          rep++;
          continue;
        }
        // find the letter that is right after the current word in the single line text copy
        // [ the letter is used for have the correct accuracy in re-formatting the text]
        let letter = singleLineTextCopy[wordIndex + word.length];
        // remove the current word from the single line text copy
        singleLineTextCopy = singleLineTextCopy.replace(word, "");
        // default char to add is a space becouse the inital split was from spaces
        let toAdd = " ";

        if (rep + 1 < words.length - 1 && words[rep + 1] == "\n") {
          toAdd = "\n";
        }
        // refactor the main single line text with re-build the old format

        singleLineText = singleLineText.replace(
          word + letter,
          " ".repeat(emptyWordsCount) + word + toAdd + letter
        );
        emptyWordsCount = 0;
        rep++;
      }
    }
    return singleLineText;
  }

  /**
   * @description
   * Add a given text at the end of the content contained between two specified characters/phrases.
   * If given also checks if the found content strats with a specific phrase/word.
   * @param filePath: the path of the file that contains the text to edit
   * @param text: the text to append
   * @param startChar: the start character
   * @param endChar: the end character [OPTIONAL]
   * @param specificIdentifier: the specific words that introduce the content to edit [OPTIONAL]
   */
  static appendBeetweenChars(
    filePath: string,
    text: string,
    startChar: string,
    endChar: string = "",
    specificIdentifier: string = ""
  ) {
    let currentBetweenCharsContent = StringComposeWriter.removeSpacesAndNewLines( 
      StringComposeReader.readBeetweenChars(
        filePath,
        startChar,
        endChar,
        specificIdentifier
      )
    );

    let currentFileContent: string = FileReader.readFile(filePath)
    let currentFileContentSIngleLine: string = StringComposeWriter.removeSpacesAndNewLines(
      currentFileContent
    );
    let toReplace: string = startChar + currentBetweenCharsContent + endChar;
    let replaceWith: string = startChar + currentBetweenCharsContent + text + endChar
    
    FileWriter.writeFile(
      filePath,
      StringComposeWriter.reinsertSpacesAndNewlines(
        currentFileContent,
        currentFileContentSIngleLine.replace(
          toReplace,
          replaceWith
        )
      )
    );
  }
  /**
   * @description remove from a text spaces and newlines
   * @param text a string
   * @return string: the text without the spaces and new lines
   */
  static removeSpacesAndNewLines(text: string) {
    text = text.split("\n").join(""); // remove all new lines
    text = text.replace(/ /g, ""); // remove all white spaces
    return text;
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

  /**
   * @description replace all the occurences of a placeholder identifier with a given word
   * @param text the text that contains the words to replace
   * @param params an object with this structure { placholder_identifier_name: new_text_to_put_over_identifier }
   */
  static replaceAllIdentifiersPlaceholders(
    text: string,
    params: replaceAllParams
  ): string {
    Object.keys(params).forEach((placeholder) => {
      let newText = params[placeholder];
      placeholder = IdentifierPlaceholder.getIdentifier(placeholder, false);
      text = text.split(placeholder).join(newText);
    });

    return text;
  }

  /**
   * @description return an html <div> that replaces the identifier in the render file
   * @param identifier the identifier
   * @param action the identifier action
   * @param type the identifier type
   * @param name the identifier name
   */
  static getReplacingHtmlTag(identifier: string, action: identifierActions, type: renderTypes, name: string): string{
    return `<div id="${identifier}" data-action="${action}" data-type="${type}" data-name="${name}"></div>`
  }
  /**
   * @description return an html <div> that contains an include statement that replace the identifier in the render file
   * @param identifier the identifier
   * @param action the identifier action
   * @param type the identifier type
   * @param name the identifier name
   * @param visualPath the path to the visual to include
   * @param extension the extension, base on which the include statement will change
   */
  static getReplacingHtmlTagWhitVisualInclude(identifier: string, action: identifierActions,type: renderTypes, name: string, visualPath: string, extension: extensions): string{
    return `
    <div id="${identifier}" data-action="${action}" data-type="${type}" data-name="${name}">
      ${IncludeFunctions.include(visualPath, extension)} 
    </div>`
  }

  /**
   * @description replace all the occurences of a _STATIC_ identifier with a given word
   * @param text the text that contains the words to replace
   * @param params an object with the following structure  
   * - _{[key: string]: identifiersAttributesType}_ 
   */
  static replaceAllStaticIdentifiers(
    text: string,
    type: renderTypes,
    params: replaceIdentifiersParams,
    extension: extensions
  ): string {
    Object.keys(params).forEach((placeholder) => {
      let identifierContent = params[placeholder];
      let identifierName: string = placeholder;
      let identifier: string = identifierToClass[type].getIdentifierWithAction(identifierName, identifierActions.STATIC, false);
      
      let newText: string = "";
      if(identifierContent.text) newText = identifierContent.text;
      else if(identifierContent.visualTarget) 
        newText = StringComposeWriter.getReplacingHtmlTagWhitVisualInclude(identifier, identifierActions.STATIC, type, identifierName, identifierContent.visualTarget, extension); 
      if(!newText.length) return;
      text = text.replace( new RegExp(`\\[${Identifiers.getIdentifier(type as unknown as identifierType)}-${identifierActions.STATIC}-${identifierName}(.*)\\]`, "g") , newText);
    });

    return text;
  }

  /**
   * @description replace all the occurences of a _EXECUTABLE_ identifier with a predefined html tag
   * @param text the text that contains the words to replace
   * @param params an object with the following structure 
   * - _{[key: string]: identifiersAttributesType}_ 
   */
  static replaceAllExecutableIdentifiers(
    text: string,
    type: renderTypes,
    params: replaceIdentifiersParams,
    extension: extensions
  ): string {
    Object.keys(params).forEach((placeholder) => {
      
      let identifierName: string = placeholder;
      let identifierContent = params[placeholder];
      let identifier: string = identifierToClass[type].getIdentifierWithAction(identifierName, identifierActions.EXECUTABLE, false);
      
      let newText: string = "";
      if(identifierContent.text) newText = identifierContent.text;
      else if(identifierContent.visualTarget) 
        newText = StringComposeWriter.getReplacingHtmlTagWhitVisualInclude(identifier, identifierActions.EXECUTABLE, type, identifierName, identifierContent.visualTarget, extension); 
      else  newText = StringComposeWriter.getReplacingHtmlTag(identifier, identifierActions.EXECUTABLE, type, identifierName);
      if(!newText.length) return;
      text = text.replace( new RegExp(`\\[${Identifiers.getIdentifier(type as unknown as identifierType)}-${identifierActions.EXECUTABLE}-${identifierName}(.*)\\]`, "g") , newText);
    });
    return text;
  }
}
