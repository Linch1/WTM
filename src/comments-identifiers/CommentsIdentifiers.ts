import { nestedStringsArrays } from "../types/customTypes";
import { FileReader } from "../files/FileReader";
import { FileWriter } from "../files/FileWriter";

class CommentsIdentifiers {

  /**
   * The comments identifiers have the following structure
   * [WTM-{TYPE}-{NAME}]
   */
  
  static readonly IDENTIFIERS = {
    "ID": ["WTM-ID", CommentsIdentifiers.getIdentifierIdPair],
    "IMPORT": ["WTM-IMPORT", CommentsIdentifiers.getIdentifierImportPair],
    "IMPORTED": ["WTM$IMPORTED"],
    "PLACEHOLDER": ["WTM-PLACEHOLDER", CommentsIdentifiers.getIdentifierPlaceholderPair],
    "HTML": ["WTM-HTML", CommentsIdentifiers.getIdentifierHtmlPair]
  };
  static readonly IDENTIFIER_KEYWORD_POS: number = 0;
  static readonly IDENTIFIER_FUNCTION_POS: number = 1;
  static readonly NoIdentifierFoundWithThatType = "ERR: Ther are no identifiers of the given type"
  
  /**
   * @description get the comment identifier of the type ID
   * @param element the name of the identifier
   * @param addInitialSlash if the placeholder has to start with '//'
   */
  static getIdentifierId(element: string, addInitialSlash: boolean=true): string{
    let identifier = `[WTM-ID-${element}]`;
    return addInitialSlash ? `//` + identifier: identifier;
  }
  /**
   * @description get the comment identifier of the type IMPORT
   * @param element the name of the identifier
   */
  static getIdentifierImport(element: string): string{
    return `//[WTM-IMPORT-${element}]`;
  }
  /**
   * @description get the comment identifier of the type PLACEHOLDER
   * @param element the name of the identifier
   * @param addInitialSlash if the placeholder has to start with '//'
   */
  static getIdentifierPlaceholder(element: string, addInitialSlash: boolean=true): string{
    let identifier = `[WTM-PLACEHOLDER-${element}]`;
    return addInitialSlash ? `//` + identifier: identifier;
  }

  /**
   * @description get the comment identifier of the type HTML
   * @param element the name of the identifier
   */
  static getIdentifierHtml(element: string): string{
    return `[WTM-HTML-${element}]`;
  }
  /**
   * @description get the comment identifier pair ( close identifier and open identifier ) of the type ID
   * @param element the name of the identifier
   */
  static getIdentifierIdPair(element: string): string[]{
    return [`//<[WTM-ID-${element}]`, `//[WTM-ID-${element}]>`];
  }
  /**
   * @description get the comment identifier pair ( close identifier and open identifier ) of the type IMPORT
   * @param element the name of the identifier
   */
  static getIdentifierImportPair(element: string): string[]{
    return [`//<[WTM-IMPORT-${element}]`, `//[WTM-IMPORT-${element}]>`];
  }
  /**
   * @description get the comment identifier pair ( close identifier and open identifier ) of the type PLACEHOLDER
   * @param element the name of the identifier
   */
  static getIdentifierPlaceholderPair(element: string): string[]{
    return [`//<[WTM-PLACEHOLDER-${element}]`, `//[WTM-PLACEHOLDER-${element}]>`];
  }
  /**
   * @description get the comment identifier pair ( close identifier and open identifier ) of the type HTML
   * @param element the name of the identifier
   */
  static getIdentifierHtmlPair(element: string): string[]{
    return [`<!--<[WTM-HTML-${element}]-->`, `<!--[WTM-HTML-${element}]>-->`];
  }
  /**
   * @description check if a given word is a comment identifier
   * @param word the word that has to be analized for check if it is a comment identifier
   */
  static checkIdentifier(word: string): string{
    for ( let identifier of Object.keys(this.IDENTIFIERS)){
      // @ts-ignore
      let identifierKeyword = this.IDENTIFIERS[identifier][this.IDENTIFIER_KEYWORD_POS];
      if(word.includes(identifierKeyword) && word.startsWith("//")) return identifierKeyword
    }
    return "";
  }
}

export { CommentsIdentifiers };
