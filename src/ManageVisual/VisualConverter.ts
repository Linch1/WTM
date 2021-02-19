import { Identifiers, StringComposeWriter } from "..";
import { identifierActions, identifierToClass, identifierType, IncludeFunctions, ProjectTypes } from "../Enums";
import { renderTypes } from "../Enums/manageVisual.renderType";
import { FileReader } from "../files/FileReader";
import { FileWriter } from "../files/FileWriter";
import { identifiersAttributesType, visualJson } from "../Types";
import { replaceIdentifiersParams } from "../Types/files.StringComposerWriter.replaceIdentifiers";
import { Visual } from "./Visual";

class VisualConverter {
  constructor(public visual: Visual) {}

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
      json.identifiers[type][identifierActions.STATIC]
    );
    newHtml = this.replaceAllExecutableIdentifiers(
      newHtml,
      type,
      json.identifiers[type][identifierActions.EXECUTABLE]
    );
    FileWriter.writeFile(this.visual.RENDER_FILE_PATH, newHtml);
  }

  /**
   * @description return an html <div> that replaces the identifier in the render file
   * @param identifier the identifier
   * @param action the identifier action
   * @param type the identifier type
   * @param name the identifier name
   * @param attributes attributes of the identifier
   */
  buildIdentifierReplacer(
    identifier: string, 
    action: identifierActions, 
    type: renderTypes, 
    name: string,
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
      >`;
      tagStart = tagStart.replace(/\n/g,' '); // removes the \n chars
      tagStart = tagStart.replace(/[ \t]+/g,' '); // conver sequences of white spaces to a single white space

      let includeStatement = this.getIncludeStatement(attributes.visualTarget,);
      let tagEnd = `</div>`;
      return tagStart + includeStatement + tagEnd
  }
  
  /**
   * @description given a visual name and a projectType it searches for a visual that hase the following name: *visualName*-*projectType*; 
   * - it returns the visual if exists
   * - it returns undefined if the visual doesn't exists
   * @param visualTargetName 
   * @param projectType 
   */
  getVisualBasedOnType( visualTargetName: string, projectType: ProjectTypes): Visual | undefined{
    let visualTargetObjectBasedOneProjectTypeRenderPath: undefined | Visual = undefined;

    visualTargetObjectBasedOneProjectTypeRenderPath = new Visual( this.visual.getVisualsPath(), visualTargetName, projectType );
    if( !visualTargetObjectBasedOneProjectTypeRenderPath.isCreated() ) return undefined;
    else return visualTargetObjectBasedOneProjectTypeRenderPath;
  }

  /**
   * @description returns the include statement for the passed visual name ( visualTarget )
   * - it is also based on the current projectType, it means that by default the searched visual to include has not directly the passed name but has the following name *visualTarget*-*projectType*. If the visual with that name doesn't exists, the one with _visualTarget_ as name is searched.
   * @param visualTarget the path to the visual to include
   */
  getIncludeStatement(visualTarget: string | undefined){

    let includeStatement = "";
    if(visualTarget){
      let visualBasedOnType = this.getVisualBasedOnType(visualTarget, this.visual.getProjectType());
      if( visualBasedOnType ) {
        includeStatement = IncludeFunctions.include(visualBasedOnType.getRenderFilePath(), this.visual.getProjectType(), false);
      } else {
        let visualTargetObject = new Visual( this.visual.getVisualsPath(), visualTarget );
        includeStatement = IncludeFunctions.include(visualTargetObject.getRenderFilePath(), this.visual.getProjectType(), false);
      }
    }
    return includeStatement;
  }

  /**
   * @description replace all the occurences of a _STATIC_ identifier with a given word
   * @param text the text that contains the words to replace
   * @param type render type of the visual
   * @param params an object with the following structure  
   * - _{[key: string]: identifiersAttributesType}_ 
   */
  replaceAllStaticIdentifiers(
    text: string,
    type: renderTypes,
    params: replaceIdentifiersParams,
  ): string {
    Object.keys(params).forEach((placeholder) => {
      let identifierAttributes = params[placeholder];
      let identifierName: string = placeholder;
      let identifier: string = identifierToClass[type].getIdentifierWithAction(identifierName, identifierActions.STATIC, false);
      let newContent: string = "";
      newContent = this.buildIdentifierReplacer(identifier, identifierActions.STATIC, type, identifierName, identifierAttributes);
      if(!newContent.length) return;
      let regex = Identifiers.getIdentifierWithActionRegex(
        Identifiers.getIdentifier(type as unknown as identifierType), 
        identifierActions.STATIC,
        identifierName
      );
      text = text.replace( regex, newContent);
    });

    return text;
  }

  /**
   * @description replace all the occurences of a _EXECUTABLE_ identifier with a predefined html tag
   * @param text the text that contains the words to replace
   * @param type render type of the visual
   * @param params an object with the following structure 
   * - _{[key: string]: identifiersAttributesType}_ 
   */
  replaceAllExecutableIdentifiers(
    text: string,
    type: renderTypes,
    params: replaceIdentifiersParams
  ): string {
    Object.keys(params).forEach((placeholder) => {
      let identifierAttributes = params[placeholder];
      let identifierName: string = placeholder;
      let identifier: string = identifierToClass[type].getIdentifierWithAction(identifierName, identifierActions.EXECUTABLE, false);
      let newContent: string = "";
      newContent = this.buildIdentifierReplacer(identifier, identifierActions.EXECUTABLE, type, identifierName, identifierAttributes);
      if(!newContent.length) return;
      let regex = Identifiers.getIdentifierWithActionRegex(
        Identifiers.getIdentifier(type as unknown as identifierType), 
        identifierActions.EXECUTABLE,
        identifierName
      );
      text = text.replace( regex, newContent);
    });
    return text;
  }
}

export { VisualConverter };
