
class VisualWriter {

  /**
   * @description create the visual directory and populate it with the main files [render.html, default.html, identifiers.json]
   * @returns string: the path to the visual folder
   */
  public createVisual(): string {}

  public saveJson() {}

  /**
   * @description populate the WTM.json file of the given visual with the identifiers contained in default.##
   * - default.## should contain **only** HTML identifiers
   */
  public populateIdentifiers() {}

  /**
   * @description replace the current default html with the passed one
   * @param newHtml the new html to use
   */
  public editDefaultHtml(newHtml: string){}

}
