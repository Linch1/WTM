import { ConstViews, identifierActions, identifierType, IdentifierPlaceholder } from "..";
import { StringComposeWriter } from "../ManageFiles/StringComposeWriter";
import { IdentifierHtml } from "../Identifiers/IdentifierHtml";
import { Visual } from "../ManageVisual/Visual";
import { addBlockParams } from "../Types/entity.rendering.params.addBlock";
import { View } from "./View";

export class ViewRender {

  constructor(public view: View) {}

  /**
   * @description include the given path in the block identified by the passed parentBlockName **without** saving it into the view's json
   * - for save it also in the json call this.includeRelative()
   * @param parentBlockName
   * @param path
   */
   public buildIncludeRelative(parentBlockName: string, visual: Visual): void {
    if( !visual.reader.isCreated() ) throw new Error(this.view.ERR_VISUAL_NO_EXISTS);
    let pathToInclude = this.view.reader.getVisualPathToInclude(visual);
    if (!Object.keys(this.view.JSON_FILE_CONTENT.blocks).includes(parentBlockName))
      throw new Error(this.view.ERR_NOT_VALID_HTML_BLOCK);
    StringComposeWriter.appendBeetweenStrings(
      this.view.reader.getPath(),
      this.view.reader.getIncludeFunction(pathToInclude), // parse path
      IdentifierHtml.getIdentifierPairHtmlComment(parentBlockName)[0],
      IdentifierHtml.getIdentifierPairHtmlComment(parentBlockName)[1]
    );
  }

  /**
   * @description add a block in the view ( like the BODY block  ) **without** saving it into the view's json
   * - a block starts and ends with an _HTML comment identifier_
   * - for save it also in the json call this.addBlock()
   * @param blockInfo.parentBlockName the parent of the block the create
   * @param blockInfo.blockName the name of the block
   * @param blockInfo.open how the block start
   * @param blockInfo.close how the block end
   * @param addToJson true if the include has also to be stored in the json, _duafult: true_
   */
   public buildAddBlock(blockInfo: addBlockParams): void {
    if (
      !Object.keys(this.view.JSON_FILE_CONTENT.blocks).includes(
        blockInfo.parentBlockName
      )
    ) { throw new Error(this.view.ERR_NOT_VALID_HTML_BLOCK); }
    blockInfo.open = blockInfo.open ? blockInfo.open : "";
    blockInfo.close = blockInfo.close ? blockInfo.close : "";

    let toAdd = `
${blockInfo.open}
${IdentifierHtml.getIdentifierPairHtmlComment(blockInfo.blockName)[0]}   
${IdentifierHtml.getIdentifierPairHtmlComment(blockInfo.blockName)[1]}
${blockInfo.close}
`;
    StringComposeWriter.appendBeetweenStrings(
      this.view.reader.getPath(),
      toAdd,
      IdentifierHtml.getIdentifierPairHtmlComment(blockInfo.parentBlockName)[0],
      IdentifierHtml.getIdentifierPairHtmlComment(blockInfo.parentBlockName)[1]
    );
    StringComposeWriter.makePretty(this.view.reader.getPath());
  }



  public populateScripts( text: string ): string{
    let scripts = [
      ...this.view.PROJECT.depManager.reader.getAllLibScripts(),
      ...this.view.PROJECT.depManager.reader.getScripts(),
      ...this.view.PROJECT.depManager.getVisualsScripts()
    ]
    for ( let i = 0; i < scripts.length; i++){
      let scriptPath = scripts[i]; 
      scriptPath = this.view.reader.getStyleOrCssPathToInclude(scriptPath);
      scripts[i] = `<script type="module" src="${scriptPath}" ></script>`
    }
    let cdnScripts = this.view.PROJECT.depManager.reader.getAllLibCdnScripts();
    for ( let i = 0; i < cdnScripts.length; i++) cdnScripts[i] = `<script type="module" src="${cdnScripts[i]}" ></script>`
    scripts.push( ...cdnScripts );


    let tagStart = `
      <div 
      id="${ConstViews.IdentifierScripts}" 
      data-action="${identifierActions.EXECUTABLE}" 
      data-type="${identifierType.PLACEHOLDER}" 
      data-name="${ConstViews.IdentifierScripts}" 
      >`;
    tagStart = tagStart.replace(/\n/g,' '); // removes the \n chars
    tagStart = tagStart.replace(/[ \t]+/g,' '); // convert sequences of white spaces to a single white space
    
    let tagEnd = `</div>`;
    let finalBlock = tagStart + scripts.join('\n') + tagEnd;
    return text.replace(
      IdentifierPlaceholder.getIdentifierWithAction(ConstViews.IdentifierScripts, identifierActions.EXECUTABLE),
      finalBlock
    )
  }

  public populateStyles( text: string ): string{
    let styles = [ 
      ...this.view.PROJECT.depManager.reader.getAllLibStyles(),
      ...this.view.PROJECT.depManager.reader.getStyles(),
      ...this.view.PROJECT.depManager.getVisualsStyles()
    ]
    for ( let i = 0; i < styles.length; i++){
      let stylePath = styles[i]; 
      stylePath = this.view.reader.getStyleOrCssPathToInclude(stylePath);
      styles[i] = `<link rel="stylesheet" href="${stylePath}">`
    }
    let cdnStyles = this.view.PROJECT.depManager.reader.getAllLibCdnStyles();
    for ( let i = 0; i < cdnStyles.length; i++) cdnStyles[i] = `<script type="module" src="${cdnStyles[i]}" ></script>`
    styles.push( ...cdnStyles );

    let tagStart = `
      <div 
      id="${ConstViews.IdentifierStyles}" 
      data-action="${identifierActions.EXECUTABLE}" 
      data-type="${identifierType.PLACEHOLDER}" 
      data-name="${ConstViews.IdentifierStyles}" 
      >`;
    tagStart = tagStart.replace(/\n/g,' '); // removes the \n chars
    tagStart = tagStart.replace(/[ \t]+/g,' '); // conver sequences of white spaces to a single white space

    let tagEnd = `</div>`;
    let finalBlock = tagStart + styles.join('\n') + tagEnd;
    return text.replace(
      IdentifierPlaceholder.getIdentifierWithAction(ConstViews.IdentifierStyles, identifierActions.EXECUTABLE),
      finalBlock
    )
  }
}
