import { FileWriter } from "../files/FileWriter";
import { FileReader } from "../files/FileReader";
import { Visual } from "./Visual";
import { CommentsIdentifiers } from "../Identifiers/CommentsIdentifiers";
import { visualIdentifiersJson } from "../Types/manageVisual.jsons";
import { renderTypes } from "../Enums/manageVisual.visual.type";

class VisualWriter extends Visual {
  constructor(public VISUALS_MAIN_FOLDER: string) {
    super(VISUALS_MAIN_FOLDER);
  }

  /**
   * @description create the visual directory and populate it with the main files [render.html, default.html, identifiers.json]
   * @returns string: the path to the visual folder
   */
  public createVisual(): string {
    let visualPath = this.getVisualPath();
    if (FileReader.existsPath(visualPath)) {
      throw new Error(this.ERR_VISUAL_ALREADY_EXISTS);
    }
    FileWriter.createDirectory(visualPath);
    FileWriter.createFile(
      this.getRenderFilePath(),
      this.INIT_RENDER_FILE_CONTENT
    );
    FileWriter.createFile(
      this.getDefaultFilePath(),
      this.INIT_DEFAULT_FILE_CONTENT
    );
    FileWriter.createFile(
      this.getIdentifiersFilePath(),
      this.INIT_IDENTIFIERS_FILE_CONTENT
    );
    return visualPath;
  }

  /**
   * @description replace the html contained in the visual default.php with the given html
   * @param html the new html to use
   */
  public setHtml(html: string) {
    this.HTML = html;
    FileWriter.writeFile(this.getDefaultFilePath(), html);
  }

  /**
   * @description populate the WTM.json file of the given visual with the identifiers contained in default.php
   */
  public populateIdentifiers() {
    let identifiersJson: visualIdentifiersJson = {};
    let identfiers: string[] = CommentsIdentifiers.getContainedIdentifiers(
      this.getDefaultFilePath()
    );

    for (let identifier of identfiers) {
      let [TYPE, NAME] = CommentsIdentifiers.getIdentifierTypeName(identifier);
      if (!identifiersJson[TYPE]) identifiersJson[TYPE] = {};
      identifiersJson[TYPE][NAME] = "";
    }

    FileWriter.writeFile(
      this.getIdentifiersFilePath(),
      JSON.stringify(identifiersJson)
    );
  }

  /**
   * @description
   * add the ACF identifiers inside the identifiers.json
   * - **[ACF identifiers are token from the HTML idetnfiers inside default.php]**
   * - call this function after _this.populateIdentifiers(visualName)_
   */
  public populateIdentifiersAcf() {
    let identifiersJson: visualIdentifiersJson = JSON.parse(
      FileReader.readFile(this.getIdentifiersFilePath())
    );
    let identfiers: string[] = CommentsIdentifiers.getContainedIdentifiers(
      this.getDefaultFilePath()
    );

    for (let identifier of identfiers) {
      let [TYPE, NAME] = CommentsIdentifiers.getIdentifierTypeName(identifier);
      if (TYPE != renderTypes.HTML) continue;
      if (!identifiersJson[renderTypes.ACF]) identifiersJson[renderTypes.ACF] = {};
      identifiersJson[renderTypes.ACF][NAME] = "<?php ?>";
    }

    FileWriter.writeFile(
      this.getIdentifiersFilePath(),
      JSON.stringify(identifiersJson)
    );
  }
}

export { VisualWriter };
