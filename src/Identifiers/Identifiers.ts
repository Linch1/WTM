import { IdentifierPlaceholder } from ".";
import { replaceAllParams } from "..";
import { extensions } from "../Enums";
import { identifierActions } from "../Enums/identifiers.actions";
import { identifiersAttributes } from "../Enums/identifiers.attributes";
import { identifierType } from "../Enums/identifiers.type";
import { FileReader } from "../files/FileReader";
import { identifiersAttributesType } from "../Types/identifiers.attributes";

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
      let actionVal: identifierActions = (<any>identifierActions)[action];
      if( identifierAction !=  identifierActions.ALL && actionVal != identifierAction) continue;
      for (let identifierType of this.IDENTIFIERS) {
        identifiersRegex.push( new RegExp(`\\[${this.getIdentifier(identifierType)}-${actionVal}-(.*)\\]`, "g") );
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
   * @description get the identifier type, action and name
   * @param identifier the identifier to analyze
   * @returns array of strings [IDENTIFIER_TYPE, IDENTIFIER_NAME];
   */
  static getIdentifierTypeActionName(identifier: string): [identifierType, identifierActions, string] {
    identifier = identifier.substring(4, identifier.length - 1); // removes "[WTM" and "]"
    let splitted: string[] = identifier.split("-");
    let TYPE = (splitted.shift() == undefined ? "" : splitted.shift()) as identifierType; // the first .shift() remove an empty char, the second get the type
    let ACTION = splitted.shift() as identifierActions;
    let NAME_AND_ATTRIBUTES = splitted.join("-").split(" ");
    let NAME = NAME_AND_ATTRIBUTES[0];
    return [TYPE, ACTION, NAME];
  }

  /**
   * @description based on a passed identifier it returns an object conaining it's attributes
   * @param identifier the identifier to analyze
   */
  static getIdentifierAttributes(identifier: string): identifiersAttributesType{
    let attributes = [];
    let foundAttributes = identifier.match(/(\w+)\s*=\s*((["'])(.*?)\3|([^>\s]*)(?=\s|\/>))/g);
    if( foundAttributes ) attributes.push(...foundAttributes);
    let toReturn: identifiersAttributesType = {};

    for ( let attribute of attributes ){
      let attributeNameValue = attribute.split("=");
      let attributeName = attributeNameValue[0];
      
      let attributeValue = attributeNameValue[1]; // after removes the inital and end chars ( "", '', `` )
      attributeValue = attributeValue.replace(/\"/g, "")
      attributeValue = attributeValue.replace( /\'/g, "");
      attributeValue = attributeValue.replace( /\`/g, "");

      if( attributeName in identifiersAttributes ){
        let castAttribute = attributeName as keyof typeof identifiersAttributes;
        toReturn[castAttribute] = attributeValue;
      }
    }
    
    return toReturn;
  }

  static checkValidExtension( extension: string | extensions | undefined): boolean{
    if( extension && extension in extensions) return true;
    return false;
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
  
}
