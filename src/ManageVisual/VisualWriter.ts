import { FileWriter } from "../files/FileWriter";
import { FileReader } from "../files/FileReader";
import { visualJsonIdentifiers } from "../Types/entity.visual.jsons";
import { Identifiers } from "../Identifiers/Identifiers";
import { Visual } from "./Visual";
import { identifierType } from "../Enums";

class VisualWriter {

  public ERR_NOT_HTML_IDENTIFIER = "During the population of the identifier was found a non HTML identifier."

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
   * @description populate the WTM.json file of the given visual with the identifiers contained in default.##
   * - default.## should contain **only** HTML identifiers
   */
  public populateIdentifiers() {
    let identifiersJson: visualJsonIdentifiers = this.visual.JSON_FILE_CONTENT.identifiers;
    let identfiers: string[] = Identifiers.getStaticIdentifiers(
      this.visual.DEFAULT_FILE_PATH
    );

    for (let _knownIdentifier in identifiersJson){
      let knownIdentifier = _knownIdentifier as keyof visualJsonIdentifiers;

      for (let foundIdentifier of identfiers) {
        
        let [TYPE, NAME] = Identifiers.getIdentifierTypeName(foundIdentifier);
        if( TYPE !== identifierType.HTML) throw new Error(this.ERR_NOT_HTML_IDENTIFIER);
        
        identifiersJson[knownIdentifier][NAME] = "";
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
    FileWriter.writeFile(this.visual.DEFAULT_FILE_PATH, newHtml);
  }

}

export { VisualWriter };
