import { ValidateIdentifierMethods } from "../Decorators";
import { identifierType } from "../Enums/identifiers.type";

export class GeneralIdentifier {
  static ERR_INVALID_IDENTIFIER_TYPE =
    "The IDENTIFIER_TYPE was not correctly initalized, it is undefined on empty";
  static ERR_INVALID_NAME = "The passed name was empty";

  static IDENTIFIER_TYPE: identifierType;

  /**
   * @description get the identifier
   * @param name the name of the identifier
   * @param addInitialSlash if the identifier has to start with '//'
   */

  @ValidateIdentifierMethods
  static getIdentifier(name: string, addInitialSlash: boolean = true): string {
    let identifier = `[WTM-${this.IDENTIFIER_TYPE}-${name}]`;
    return addInitialSlash ? `//` + identifier : identifier;
  }
  /**
   * @description get the identifier pair ( close identifier and open identifier )
   * @param name the name of the identifier
   */
  @ValidateIdentifierMethods
  static getIdentifierPairJsComment(name: string): string[] {
    return [
      `//<[WTM-${this.IDENTIFIER_TYPE}-${name}]`,
      `//[WTM-${this.IDENTIFIER_TYPE}-${name}]>`,
    ];
  }
  /**
   * @description get the identifier pair ( close identifier and open identifier )
   * @param name the name of the identifier
   */
  @ValidateIdentifierMethods
  static getIdentifierPairHtmlComment(name: string): string[] {
    return [
      `<!--<[WTM-${this.IDENTIFIER_TYPE}-${name}]-->`,
      `<!--[WTM-${this.IDENTIFIER_TYPE}-${name}]>-->`,
    ];
  }
}
