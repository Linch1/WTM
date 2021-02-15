import { identifiersAttributes } from "../Enums/identifiers.attributes";
import { genereicStringsObject } from "../Types/genericStringsObject";
import { identifiersAttributesType } from "../Types/identifiers.attributes";

export class IdentifiersAttributesParser {
  /**
   * @description this regex detects all the attributes in a string, the attributes must be in one of the following format
   * - key="value"
   * - key='value'
   * - key=`value`
   */
  static IDENTIFIERS_ATTRIBUTES_REGEX = /(\w+)\s*=\s*((["'])(.*?)\3|([^>\s]*)(?=\s|\/>))/g;

  /**
   * @description removes the quotes from a string and returns it
   * @param value the string to parse
   */
  static removeQuotesFromValue(value: string){
    value = value.replace(/\"/g, "")
    value = value.replace( /\'/g, "");
    value = value.replace( /\`/g, "");
    return value;
  }
  /**
   * @description given a string with one of this formats ( key='value', key="value", key=`value` ) it returns an array with the format [ KEY, VALUE ]
   * @param attributeKeyValue the string to parse
   */
  static getKeyValueFromAttrribute(attributeKeyValue: string): string[]{
    let attributeNameValue = attributeKeyValue.split("=");
    let attributeName = attributeNameValue[0];
    let attributeValue = attributeNameValue[1];
    return [attributeName, attributeValue]
  }
  /**
   * @description filter the given object for remove unautorized attributes and returns te filtered object
   * @param toParse the object to filter
   */
  static buildValidAttributedObject( toParse: genereicStringsObject ): identifiersAttributesType{
    let toReturn: identifiersAttributesType = {}
    for ( let attrName of  Object.keys(toParse) ){
      if( attrName in identifiersAttributes ){
        let castedNameToAttribute = attrName as keyof typeof identifiersAttributes;
        toReturn[castedNameToAttribute] = toParse[attrName];
      }
    }
    return toReturn;
  }
  
  /**
   * @description based on a passed string that represents an identifier it returns an object conaining it's attributes
   * @param identifier the identifier to analyze
   */
  static getIdentifierAttributes(identifier: string): identifiersAttributesType{
    let attributes = [];
    let foundAttributes = identifier.match(IdentifiersAttributesParser.IDENTIFIERS_ATTRIBUTES_REGEX);
    if( foundAttributes ) attributes.push(...foundAttributes);
    let toParse: genereicStringsObject = {}
    for ( let attribute of attributes ){
      let [attrName, attrVal] = IdentifiersAttributesParser.getKeyValueFromAttrribute(attribute);
      attrVal = IdentifiersAttributesParser.removeQuotesFromValue(attrVal);
      toParse[attrName] = attrVal;
    }
    return IdentifiersAttributesParser.buildValidAttributedObject(toParse);
  }


  
}
