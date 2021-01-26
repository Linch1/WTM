import { ValidateIdentifierMethods } from "../Decorators";
import { identifierType } from "../Enums/identifiers.type";
import { AbstractGeneralIdentifier } from "../Abstracts/identifiers.AbstractGeneralIdentifier";
import { identifierActions } from "../Enums";

export class GeneralIdentifier implements AbstractGeneralIdentifier {
  static ERR_MISSING_IDENTIFIER_TYPE =
    "The IDENTIFIER_TYPE was not correctly initalized, it is undefined on empty";
  static ERR_INVALID_IDENTIFIER_TYPE = "The identifier type is not recognized";
  static ERR_INVALID_NAME = "The passed name was empty";
  static ERR_PROTECTED_NAME =
    "The given name is used by default from the library, please choose another one";

  static PROTECTED_NAMES: string[] = [];
  static IDENTIFIER_TYPE: identifierType;
  
  static EXEC: { [key: string]: () => any } = {};

  /**
   * @description get the identifier
   * @param name the name of the identifier
   * @param addInitialSlash if the identifier has to start with '//' ( default: true )
   */
  @ValidateIdentifierMethods
  static getIdentifier(name: string, addInitialSlash: boolean = true): string {
    let identifier = `[WTM-${this.IDENTIFIER_TYPE}-${name}]`;
    return addInitialSlash ? `//` + identifier : identifier;
  }
  /**
   * @description get the identifier pair in js comment notation( close identifier and open identifier )
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
   * @description get the identifier pair in html comment notation ( close identifier and open identifier )
   * @param name the name of the identifier
   */
  @ValidateIdentifierMethods
  static getIdentifierPairHtmlComment(name: string): string[] {
    return [
      `<!--<[WTM-${this.IDENTIFIER_TYPE}-${name}]-->`,
      `<!--[WTM-${this.IDENTIFIER_TYPE}-${name}]>-->`,
    ];
  }
  /**
   * @description get the identifier executable
   * @param name the name of the identifier
   * @param action the action category of the identifier
   * @param addInitialSlash if the identifier has to start with '//' ( default: true )
   */
  static getIdentifierWithAction(
    name: string,
    action: identifierActions,
    addInitialSlash: boolean = true
  ): string {
    let identifier = `[WTM-${this.IDENTIFIER_TYPE}-${action}-${name}]`;
    return addInitialSlash ? `//` + identifier : identifier;
  }
  
  static setExecutable(identifierName: string, callback: () => any) {
    if (this.PROTECTED_NAMES.includes(identifierName)) {
      throw new Error(this.ERR_PROTECTED_NAME);
    }
    this.EXEC[identifierName] = callback;
  }
}
