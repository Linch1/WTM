import { AbstractGeneralVisual } from "../Abstracts/AbstractGeneralVisual";
import { renderTypes } from "../Enums/manageVisual.renderType";
import { VisualConverter } from "./VisualConverter";
import { VisualReader } from "./VisualReader";
import { VisualWriter } from "./VisualWriter";
import { ProjectTypes } from "../Enums";

export class Visual extends AbstractGeneralVisual {
  public reader: VisualReader;
  public writer: VisualWriter;
  public converter: VisualConverter;

  /**
   * @description creates a new visual
   * @param VISUALS_FOLDER the visuals folder of the poroject
   * @param VISUAL_NAME the name of the visual to create
   * @param projectType the project type
   * - if this field is empty the project type will be automatically take from the visual json ( if it already exists )
   * - else an error will be thrown
   */
  constructor(public VISUALS_FOLDER: string, public VISUAL_NAME: string, projectType: ProjectTypes = ProjectTypes.html) {
    super(VISUALS_FOLDER, VISUAL_NAME, projectType);
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
    if(!this.isCreated()) throw new Error(this.ERR_VISUAL_NOT_CREATED);
    this.writer.editDefaultHtml(newHtml);
    this.writer.populateIdentifiers();
    this.converter.render(renderType);
  }

  public getFallbackVisual(): Visual | undefined{
    let fbVisual = new Visual(this.getVisualsPath(), this.getName(), ProjectTypes.html);
    if( fbVisual.isCreated() ) return fbVisual;
    else return undefined;
  }
}
