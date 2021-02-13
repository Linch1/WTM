import { Identifiers } from "..";
import { identifierActions, identifierToClass, identifierType, IncludeFunctions } from "../Enums";
import { renderTypes } from "../Enums/entity.visual.renderType";
import { extensions } from "../Enums/extension";
import { FileReader } from "../files/FileReader";
import { FileWriter } from "../files/FileWriter";
import { StringComposeWriter } from "../files/StringComposeWriter";
import { IdentifierPlaceholder } from "../Identifiers";
import { identifiersAttributesType, replaceAllParams } from "../Types";
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
  buildIdentifierReplacer(
    identifier: string, 
    action: identifierActions, 
    type: renderTypes, 
    name: string,
    extension: extensions,
    attributes: identifiersAttributesType,
    ): string{
      
      // if there is the text attributes returns it directly
      if(attributes.text) return attributes.text; 

      // else build the html div tag
      let tagClasses = `class="${attributes.parentClasses}"`
      
      let tagStart = `
      <div 
      id="${identifier}" 
      data-action="${action}" 
      data-type="${type}" 
      data-name="${name}" 
      ${ attributes.parentClasses ? tagClasses : ""}
      >`.replace('\n', '');

      let includeStatement = this.getIncludeStatement(attributes.visualTarget, extension);
      let tagEnd = `</div>`;
      return tagStart + includeStatement + tagEnd
  }
  
  /**
   * @description returns the include statement for the passed visual path ( visualTarget )
   * @param visualTarget the path to the visual to include
   * @param extension the extension of the visual
   */
  getIncludeStatement(visualTarget: string | undefined, extension: extensions){
    let includeStatement = "";
    if(visualTarget){
      let addMainFolderInIncludeStatement: boolean;
      if(visualTarget.includes(this.VISUALS_PATH)) {
        addMainFolderInIncludeStatement = false;
        let options: replaceAllParams = {}
        options[this.VISUALS_PATH] = this.visual.getVisualsPath();
        visualTarget = Identifiers.replaceAllIdentifiersPlaceholders( visualTarget, options );
      } else {
        addMainFolderInIncludeStatement = true;
      }
      includeStatement = IncludeFunctions.include(visualTarget, extension, addMainFolderInIncludeStatement)
    }
    return includeStatement;
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
      let identifierAttributes = params[placeholder];
      let identifierName: string = placeholder;
      let identifier: string = identifierToClass[type].getIdentifierWithAction(identifierName, identifierActions.STATIC, false);
      let newContent: string = "";
      newContent = this.buildIdentifierReplacer(identifier, identifierActions.STATIC, type, identifierName, extension, identifierAttributes);
      if(!newContent.length) return;
      text = text.replace( new RegExp(`\\[${Identifiers.getIdentifier(type as unknown as identifierType)}-${identifierActions.STATIC}-${identifierName}(.*)\\]`, "g") , newContent);
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
      let identifierAttributes = params[placeholder];
      let identifierName: string = placeholder;
      let identifier: string = identifierToClass[type].getIdentifierWithAction(identifierName, identifierActions.EXECUTABLE, false);
      let newContent: string = "";
      newContent = this.buildIdentifierReplacer(identifier, identifierActions.EXECUTABLE, type, identifierName, extension, identifierAttributes);
      text = text.replace( new RegExp(`\\[${Identifiers.getIdentifier(type as unknown as identifierType)}-${identifierActions.EXECUTABLE}-${identifierName}(.*)\\]`, "g") , newContent);
    });
    return text;
  }
}

export { VisualConverter };
