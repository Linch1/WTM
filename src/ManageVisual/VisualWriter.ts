import { FileWriter } from "../ManageFiles/FileWriter";
import { FileReader } from "../ManageFiles/FileReader";
import { visualJson, visualJsonIdentifiers } from "../Types/manageVisual.jsons";
import { Identifiers } from "../Identifiers/Identifiers";
import { identifierActions, ProjectTypes, renderTypes } from "../Enums";
import { identifiersAttributesType } from "../Types/identifiers.attributes";
import { ConstVisuals } from "../Constants";
import { timeStamp } from "console";
import { StringComposeWriter } from "../ManageFiles";
import { Visual } from "./Visual";

export class VisualWriter {

  public ERR_NOT_RENDER_IDENTIFIER = "During the population of the identifier was found a non registered RENDER identifier, check the enum renderTypes."

  constructor(public visual: Visual) {}

  /**
   * @description saves the visual json
   */
  public saveJson() {
    FileWriter.writeFile(
      this.visual.JSON_FILE_PATH,
      JSON.stringify(this.visual.JSON_FILE_CONTENT)
    );
  }

  /**
   * @description initalize the lib-elem dependencies if the elem is not yet present
   * @param elemName the name of the lib to intialize
   */
   public initializeLibElem(elemName: string){
    if ( !this.visual.JSON_FILE_CONTENT.lib[elemName] ) {
      this.visual.JSON_FILE_CONTENT.lib[elemName] = ConstVisuals.getVisualsLibElemContent();
    }
    this.visual.writer.saveJson();
  }

  public setName(name: string){
    this.visual.JSON_FILE_CONTENT.name = name;
    this.visual.writer.saveJson();
  }
  public setProjectType(type: ProjectTypes){
    this.visual.JSON_FILE_CONTENT.projectType = type;
    this.visual.writer.saveJson();
  }
  public setAuthor(author: string){
    this.visual.JSON_FILE_CONTENT.author = author;
    this.visual.writer.saveJson();
  }
  public setAssetsAutoImport(autoImport: boolean){
    this.visual.JSON_FILE_CONTENT.assetsAutoImport = autoImport;
    this.visual.writer.saveJson();
  }
  public setAuthorUrl(url: string){
    this.visual.JSON_FILE_CONTENT.authorUrl = url;
    this.visual.writer.saveJson();
  }
  public setGithubRepo(name: string){
    this.visual.JSON_FILE_CONTENT.name = name;
    this.visual.writer.saveJson();
  }
  public setProjectPath(path: string){
    this.visual.JSON_FILE_CONTENT.projectPath = path;
    this.visual.writer.saveJson();
  }
  public setJson(json: visualJson){
    this.visual.JSON_FILE_CONTENT = json;
    this.visual.writer.saveJson();
  }
  /**
   * @description populate the WTM.json file of the given visual with the identifiers contained in default.##
   */
  public populateIdentifiers() {
    if(!this.visual.reader.isCreated()) throw new Error(this.visual.ERR_VISUAL_NOT_CREATED);
    
    // reset the identifiers
    this.visual.JSON_FILE_CONTENT.identifiers = ConstVisuals.JsonIdentifiersContent
    let identifiersJson: visualJsonIdentifiers = ConstVisuals.JsonIdentifiersContent;

    let identfiers: string[] = Identifiers.getContainedIdentifiers(
      this.visual.DEFAULT_FILE_PATH,
      identifierActions.ALL
    );
    for (let _knownIdentifier in identifiersJson){
      for (let foundIdentifier of identfiers) {
        
        let [TYPE, ACTION, NAME] = Identifiers.getIdentifierTypeActionName(foundIdentifier);
        let ATTRIBUTES: identifiersAttributesType = Identifiers.getIdentifierAttributes(foundIdentifier);
        if( ! (TYPE in renderTypes ) ) {
          throw new Error(this.ERR_NOT_RENDER_IDENTIFIER);
        }
        let castType = TYPE as unknown as renderTypes;
        
        identifiersJson[castType][ACTION][NAME] = ATTRIBUTES ;
      }
    }
    FileWriter.writeFile(
      this.visual.JSON_FILE_PATH,
      JSON.stringify(this.visual.JSON_FILE_CONTENT)
    );
  }
  /**
   * @description replace the current default html with the passed one
   * @param newHtml the new html to use
   */
  public editDefaultHtml(newHtml: string){
    if(!this.visual.reader.isCreated()) throw new Error(this.visual.ERR_VISUAL_NOT_CREATED);
    FileWriter.writeFile(this.visual.DEFAULT_FILE_PATH, newHtml);
  }

}
