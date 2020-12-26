import { identifierType } from "../Enums/identifiers.type";

export abstract class InterfaceGeneralIdentifier {
  static ERR_INVALID_IDENTIFIER_TYPE =
    "The IDENTIFIER_TYPE was not correctly initalized, it is undefined on empty";
  static ERR_INVALID_NAME = "The passed name was empty";

  static IDENTIFIER_TYPE: identifierType;

  static getIdentifier(name: string, addInitialSlash: boolean): string {
    throw new Error("Implement me, Please.");
  }

  static getIdentifierPairJsComment(name: string): string[] {
    throw new Error("Implement me, Please.");
  }

  static getIdentifierPairHtmlComment(name: string): string[] {
    throw new Error("Implement me, Please.");
  }
}
