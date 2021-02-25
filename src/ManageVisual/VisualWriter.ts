import { FileWriter } from "../files/FileWriter";
import { FileReader } from "../files/FileReader";
import { visualJsonIdentifiers } from "../Types/manageVisual.jsons";
import { Identifiers } from "../Identifiers/Identifiers";
import { identifierActions, renderTypes } from "../Enums";
import { identifiersAttributesType } from "../Types/identifiers.attributes";
import { ConstVisuals } from "../Constants";
import { timeStamp } from "console";
import { StringComposeWriter } from "../files";
import { Visual } from "./Visual";

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
    FileWriter.createDirectory(this.visual.depManager.getAssetsPath());
    FileWriter.createDirectory(this.visual.depManager.getAssetsScriptsPath());
    FileWriter.createDirectory(this.visual.depManager.getAssetsStylesPath());
    FileWriter.createDirectory(this.visual.depManager.getAssetsImgPath());

    FileWriter.createFile(
      this.visual.RENDER_FILE_PATH,
      this.visual.INIT_RENDER_FILE_CONTENT
    );
    FileWriter.createFile(
      this.visual.DEFAULT_FILE_PATH,
      this.visual.INIT_DEFAULT_FILE_CONTENT
    );
    this.visual.saveJson();
    
    return visualPath;
  }
  public setName(name: string){
    this.visual.JSON_FILE_CONTENT.name = name;
    this.visual.saveJson();
  }
  public setAuthor(author: string){
    this.visual.JSON_FILE_CONTENT.author = author;
    this.visual.saveJson();
  }
  public setAssetsAutoImport(autoImport: boolean){
    this.visual.JSON_FILE_CONTENT.assetsAutoImport = autoImport;
    this.visual.saveJson();
  }
  public setAuthorUrl(url: string){
    this.visual.JSON_FILE_CONTENT.authorUrl = url;
    this.visual.saveJson();
  }
  public setGithubRepo(name: string){
    this.visual.JSON_FILE_CONTENT.name = name;
    this.visual.saveJson();
  }
  /**
   * @description populate the WTM.json file of the given visual with the identifiers contained in default.##
   */
  public populateIdentifiers() {
    if(!this.visual.isCreated()) throw new Error(this.visual.ERR_VISUAL_NOT_CREATED);
    
    let identifiersJson: visualJsonIdentifiers = this.visual.JSON_FILE_CONTENT.identifiers;
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
    if(!this.visual.isCreated()) throw new Error(this.visual.ERR_VISUAL_NOT_CREATED);
    FileWriter.writeFile(this.visual.DEFAULT_FILE_PATH, newHtml);
  }

}
