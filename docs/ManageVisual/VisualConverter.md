class VisualConverter {
  constructor(public visual: Visual) {}

  /**
   * replace all the placholders in the inside **default.##**
   * with the identifiers HTML values inside **WTM.json**.
   * then the new html obtained by this operation is wrote inside **render.##**
   */
  render(type: renderTypes) {}
}
