import { FileReader } from "../files/FileReader";

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
    "HTML": ["WTM-HTML", CommentsIdentifiers.getIdentifierHtmlPair],
    "ACF": ["WTM-ACF", CommentsIdentifiers.getIdentifierAcfPair]
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
   * @description get the comment identifier of the type ACF
   * @param element the name of the identifier
   */
  static getIdentifierAcf(element: string): string{
    return `[WTM-ACF-${element}]`;
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
   * @description get the comment identifier pair ( close identifier and open identifier ) of the type ACF
   * @param element the name of the identifier
   */
  static getIdentifierAcfPair(element: string): string[]{
    return [`<!--<[WTM-ACF-${element}]-->`, `<!--[WTM-ACF-${element}]>-->`];
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

  /**
   * @description return a list containg the regex expression for find the identifiers inside a string
   */
  static getIdentifiersRegex(): RegExp[]{
    let identifiersRegex = [];
    for ( let identifier of Object.keys(this.IDENTIFIERS)){
      // @ts-ignore
      let identifierKeyword: any = this.IDENTIFIERS[identifier][this.IDENTIFIER_KEYWORD_POS];
      identifiersRegex.push(new RegExp(`\\[${identifierKeyword}-(.*)\\]`, "g"))
    }
    return identifiersRegex;
  }

  /**
   * @description get all the identifiers of the type *[WTM-IDENTIFIER-NAME]* contained in a file
   * @param filePath the path to the file
   */
  static getContainedIdentifiers(filePath: string): string[]{
    let text = FileReader.readFile(filePath);
    let identifiersRegex: RegExp[] = this.getIdentifiersRegex();
    let foundIdentifiers: string[] = [];

    for( let regex of identifiersRegex) {
      let found: string[] | null = text.match(regex);
      if( found == null ) found = [];
      foundIdentifiers.push(...found);
    }

    return foundIdentifiers;
  }

  /**
   * @description get the identifier type and name
   * @param identifier the identifier to analyze
   * @returns array of strings [IDENTIFIER_TYPE, IDENTIFIER_NAME];
   */
  static getIdentifierTypeName(identifier: string): string[]{
    identifier = identifier.substring(4, identifier.length - 1);
    let splitted = identifier.split("-");
    let TYPE = (splitted.shift() == undefined ? "": splitted.shift()) as string ;
    let NAME = splitted.join("-");
    return [TYPE, NAME] ;

  }
}

export { CommentsIdentifiers };
