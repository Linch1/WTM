import { Identifiers } from "..";
import { identifierActions, identifierToClass, identifierType, IncludeFunctions } from "../Enums";
import { renderTypes } from "../Enums/entity.visual.renderType";
import { extensions } from "../Enums/extension";
import { FileReader } from "../files/FileReader";
import { FileWriter } from "../files/FileWriter";
import { StringComposeWriter } from "../files/StringComposeWriter";
import { visualJson } from "../Types/entity.visual.jsons";
import { replaceIdentifiersParams } from "../Types/files.StrCompWr.replaceIdentifiers";
import { Visual } from "./Visual";

class VisualConverter {
  constructor(public visual: Visual) {}
  VISUALS_PATH = 'VISUALS-PATH'; // this is a param that will replaced whit the visuals directory path

  /**
   * @description replace all the placholders in the inside **default.##**
   * with the identifiers HTML values inside **WTM.json**.
   * then the new html obtained by this operation is wrote inside **render.##**
   */
  render(type: renderTypes) {
    if (!this.visual.isCreated())
      throw new Error(this.visual.ERR_VISUAL_NOT_CREATED);
    let html: string = FileReader.readFile(this.visual.DEFAULT_FILE_PATH);
    let json: visualJson = JSON.parse(
      FileReader.readFile(this.visual.JSON_FILE_PATH)
    );
    let newHtml: string = this.replaceAllStaticIdentifiers(
      html,
      type,
      json.identifiers[type][identifierActions.STATIC],
      this.visual.getExtension() as extensions
    );
    newHtml = this.replaceAllExecutableIdentifiers(
      newHtml,
      type,
      json.identifiers[type][identifierActions.EXECUTABLE],
      this.visual.getExtension() as extensions
    );
    FileWriter.writeFile(this.visual.RENDER_FILE_PATH, newHtml);
  }

  /**
   * @description return an html <div> that replaces the identifier in the render file
   * @param identifier the identifier
   * @param action the identifier action
   * @param type the identifier type
   * @param name the identifier name
   */
  getReplacingHtmlTag(identifier: string, action: identifierActions, type: renderTypes, name: string): string{
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
  getReplacingHtmlTagWhitVisualInclude(identifier: string, action: identifierActions,type: renderTypes, name: string, visualPath: string, extension: extensions): string{
    visualPath = visualPath.replace(this.VISUALS_PATH, this.visual.getVisualsPath());
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
  replaceAllStaticIdentifiers(
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
        newText = this.getReplacingHtmlTagWhitVisualInclude(identifier, identifierActions.STATIC, type, identifierName, identifierContent.visualTarget, extension); 
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
  replaceAllExecutableIdentifiers(
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
        newText = this.getReplacingHtmlTagWhitVisualInclude(identifier, identifierActions.EXECUTABLE, type, identifierName, identifierContent.visualTarget, extension); 
      else  newText = this.getReplacingHtmlTag(identifier, identifierActions.EXECUTABLE, type, identifierName);
      if(!newText.length) return;
      text = text.replace( new RegExp(`\\[${Identifiers.getIdentifier(type as unknown as identifierType)}-${identifierActions.EXECUTABLE}-${identifierName}(.*)\\]`, "g") , newText);
    });
    return text;
  }
}

export { VisualConverter };
