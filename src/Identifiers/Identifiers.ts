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
  static checkIdentifier(word: string): string {
    for (let identifierType of this.IDENTIFIERS) {
      let identifierKeyword = this.getIdentifier(identifierType);
      if (word.includes(identifierKeyword) && word.startsWith("//"))
        return identifierKeyword;
    }
    return "";
  }

  /**
   * @description return a list containg the regex expression for find the identifiers inside a string
   */
  static getIdentifiersRegex(): RegExp[] {
    let identifiersRegex = [];
    for (let identifierType of this.IDENTIFIERS) {
      identifiersRegex.push(
        new RegExp(`\\[${this.getIdentifier(identifierType)}-(.*)\\]`, "g")
      );
    }
    return identifiersRegex;
  }

  /**
   * @description get all the identifiers of the type *[WTM-IDENTIFIER-NAME]* contained in a file
   * @param filePath the path to the file
   */
  static getContainedIdentifiers(filePath: string): string[] {
    let text = FileReader.readFile(filePath);
    let identifiersRegex: RegExp[] = this.getIdentifiersRegex();
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
  static getIdentifierTypeName(identifier: string): string[] {
    identifier = identifier.substring(4, identifier.length - 1);
    let splitted = identifier.split("-");
    let TYPE = (splitted.shift() == undefined
      ? ""
      : splitted.shift()) as string;
    let NAME = splitted.join("-");
    return [TYPE, NAME];
  }
}
