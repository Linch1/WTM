
import { identifierActions } from "../Enums";
import { renderTypes } from "../Enums/entity.visual.renderType";
import { FileReader } from "../files/FileReader";
import { FileWriter } from "../files/FileWriter";
import { StringComposeWriter } from "../files/StringComposeWriter";
import { visualJson } from "../Types/entity.visual.jsons";
import { Visual } from "./Visual";

class VisualConverter {
  constructor(public visual: Visual) {}

  /**
   * @description replace all the placholders in the inside **default.##**
   * with the identifiers HTML values inside **WTM.json**.
   * then the new html obtained by this operation is wrote inside **render.##**
   */
  render(type: renderTypes) {
    if(!this.visual.isCreated()) throw new Error(this.visual.ERR_VISUAL_NOT_CREATED);
    let html: string = FileReader.readFile(this.visual.DEFAULT_FILE_PATH);
    let json: visualJson = JSON.parse(
      FileReader.readFile(this.visual.JSON_FILE_PATH)
    );
    let newHtml: string = StringComposeWriter.replaceAllStaticIdentifiersHtml(
      html,
      json.identifiers[type][identifierActions.STATIC]
    );
    FileWriter.writeFile(this.visual.RENDER_FILE_PATH, newHtml);
  }
}

export { VisualConverter };
