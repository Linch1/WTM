import { AbstractGeneralVisual } from "../Abstracts/entity.visual.AbstractGeneralVisual";
import { renderTypes } from "../Enums/entity.visual.renderType";
import { VisualConverter } from "./VisualConverter";
import { VisualReader } from "./VisualReader";
import { VisualWriter } from "./VisualWriter";

export class Visual extends AbstractGeneralVisual {
  public reader: VisualReader;
  public writer: VisualWriter;
  public converter: VisualConverter;

  constructor(public VISUAL_FOLDER: string, extension?: string) {
    super(VISUAL_FOLDER, extension);
    this.reader = new VisualReader(this);
    this.writer = new VisualWriter(this);
    this.converter = new VisualConverter(this);
  }

  /**
   * @description does the following:
   * - **edit** the default html
   * - **re-populate** the identifiers based on the new html
   * - **render** the new html
   * @param newHtml
   * @param renderType
   */
  public Vupdate(newHtml: string, renderType: renderTypes) {
    this.writer.editDefaultHtml(newHtml);
    this.writer.populateIdentifiers();
    this.converter.render(renderType);
  }
}
