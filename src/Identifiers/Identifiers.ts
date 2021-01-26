import { identifierActions } from "../Enums/identifiers.actions";
import { identifierType } from "../Enums/identifiers.type";
import { FileReader } from "../files/FileReader";

export class Identifiers {
  static IDENTIFIERS: identifierType[] = [
    ...Object.keys(identifierType),
  ] as identifierType[];

  static getIdentifier(type: identifierType) {
    return `WTM-${type}`;
  }

  /**
   * @description check if a given word is a comment identifier
   * @param word the word that has to be analized for check if it is a comment identifier
   */
  static checkCommentIdentifier(word: string): string {
    for (let identifierType of this.IDENTIFIERS) {
      let identifierKeyword = this.getIdentifier(identifierType);
      if (word.includes(identifierKeyword) && word.startsWith("//"))
        return identifierKeyword;
    }
    return "";
  }

  /**
   * @description return a list containg the regex expression for find the identifiers inside a string
   * @param identifierAction the action category of the identifiers to retrive
   */
  static getIdentifiersRegex(identifierAction: identifierActions): RegExp[] {
    let identifiersRegex = [];
    for(let action in identifierActions){
      if( identifierAction !=  identifierActions.ALL && action != identifierAction) continue;
      for (let identifierType of this.IDENTIFIERS) {
        identifiersRegex.push( new RegExp(`\\[${this.getIdentifier(identifierType)}-${identifierAction}-(.*)\\]`, "g") );
      } 
    }
    
    return identifiersRegex;
  }

  /**
   * @description get the identifiers contained in the passed file  that have a given action 
   * @param filePath the path to the file
   * @param identifierAction the action category of the identifiers to retrive
   */
  static getContainedIdentifiers(filePath: string, identifierAction: identifierActions): string[] {
    let text = FileReader.readFile(filePath);
    let identifiersRegex: RegExp[] = this.getIdentifiersRegex(identifierAction);
    let foundIdentifiers: string[] = [];

    for (let regex of identifiersRegex) {
      let found: string[] | null = text.match(regex);
      if (found == null) found = [];
      foundIdentifiers.push(...found);
    }

    return foundIdentifiers;
  }

  /**
   * @description get the identifier type and name
   * @param identifier the identifier to analyze
   * @returns array of strings [IDENTIFIER_TYPE, IDENTIFIER_NAME];
   */
  static getIdentifierTypeActionName(identifier: string): [identifierType, identifierActions, string] {
    identifier = identifier.substring(4, identifier.length - 1); // removes "[WTM" and "]"
    let splitted = identifier.split("-");
    let TYPE = (splitted.shift() == undefined ? "" : splitted.shift()) as identifierType; // the first .shift() remove an empty char, the second get the type
    let ACTION = splitted.shift() as identifierActions;
    let NAME = splitted.join("-");
    return [TYPE, ACTION, NAME];
  }
}
