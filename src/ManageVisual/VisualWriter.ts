import { FileWriter } from "../files/FileWriter";
import { FileReader } from "../files/FileReader";
import { visualJsonIdentifiers } from "../Types/manageVisual.jsons";
import { Identifiers } from "../Identifiers/Identifiers";
import { Visual } from "./Visual";
import { identifierActions, renderTypes } from "../Enums";
import { identifiersAttributesType } from "../Types/identifiers.attributes";

export class VisualWriter {

  public ERR_NOT_RENDER_IDENTIFIER = "During the population of the identifier was found a non registered RENDER identifier, check the enum renderTypes."

  constructor(public visual: Visual) {}

  /**
   * @description create the visual directory and populate it with the main files [render.html, default.html, identifiers.json]
   * @returns string: the path to the visual folder
   */
  public createVisual(): string {
    let visualPath = this.visual.getDirPath();
    if (FileReader.existsPath(visualPath)) {
      throw new Error(this.visual.ERR_VISUAL_ALREADY_EXISTS);
    }
    
    FileWriter.createDirectory(visualPath);
    FileWriter.createDirectory(this.visual.getAssetsDirPath());
    FileWriter.createDirectory(this.visual.getScriptsDirPath());
    FileWriter.createDirectory(this.visual.getStylesDirPath());

    FileWriter.createFile(
      this.visual.RENDER_FILE_PATH,
      this.visual.INIT_RENDER_FILE_CONTENT
    );
    FileWriter.createFile(
      this.visual.DEFAULT_FILE_PATH,
      this.visual.INIT_DEFAULT_FILE_CONTENT
    );
    this.saveJson();
    
    return visualPath;
  }

  public saveJson() {
    FileWriter.writeFile(
      this.visual.JSON_FILE_PATH,
      JSON.stringify(this.visual.JSON_FILE_CONTENT)
    );
  }
  /**
   * @description add the passed path as style dependency in the visual json
   * @param path 
   */
  public addStyle(path: string): void{
    this.visual.JSON_FILE_CONTENT.dependencies.styles.push(path.trim());
    this.saveJson();
  }
  /**
   * @description add the passed path as script dependency in the visual json
   * @param path 
   */
  public addScript(path: string): void{
    this.visual.JSON_FILE_CONTENT.dependencies.scripts.push(path.trim());
    this.saveJson();
  }

  /**
   * @description populate the WTM.json file of the given visual with the identifiers contained in default.##
   */
  public populateIdentifiers() {
    if(!this.visual.isCreated()) throw new Error(this.visual.ERR_VISUAL_NOT_CREATED);
    
    let identifiersJson: visualJsonIdentifiers = this.visual.getDefaultIdentifiersObj();
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
    this.visual.JSON_FILE_CONTENT.identifiers = identifiersJson;
    
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
    if(!this.visual.isCreated()) throw new Error(this.visual.ERR_VISUAL_NOT_CREATED);
    FileWriter.writeFile(this.visual.DEFAULT_FILE_PATH, newHtml);
  }

}
