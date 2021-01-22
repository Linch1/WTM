
import { FileWriter } from "../files/FileWriter";
import { Theme } from "./Theme";

import { WpFunctionComposer } from "../files/WpFunctionComposer";

import { PostType } from "../Entities/wp/postTypes/PostType";
import { WidgetArea } from "../Entities/wp/widgetAreas/WidgetArea";
import { SettingsPage } from "../Entities/wp/settingsPages/SettingsPage";
import { Menu } from "../Entities/wp/menus/Menu";
import { ThemeAux } from "./ThemeAux";
import { importsJsonKeys } from "../Enums";
import { Single } from "../Entities/rendering/Single";
import { Template } from "../Entities/rendering/Template";
import { addBlockParams } from "../Types";
import { StringComposeWriter } from "../files/StringComposeWriter";

/**
 * This class is used to perform the write actions
 * like edit/create new files
 * for example add an import line to functions.php
 * or create a new custom post type
 */
class ThemeWriter {
  

  constructor(public themeAux: ThemeAux) {}


  /**
   * @description import in the WP theme given style file
   * @param stylePath the file path to the style file
   */
  public importStyle(stylePath: string): void {
    let importString: string = WpFunctionComposer.enqueueStyleFunction(stylePath); // get the wp syntax for import the style
    importString = StringComposeWriter.preformatString(importString);
    this.themeAux.updateJsonImports(importsJsonKeys.STYLES, importString, -1);
    this.appendToFunctionBody(
      this.themeAux.ASSETS_IMPORT_FILE_PATH, // file path
      this.themeAux.IMPORT_STYLES_FUNCTION_NAME, // function name
      importString // string to append to the function body
    );
    
  }
  /**
   * @description import in the WP theme given script file
   * @param scriptPath the file path to the script file
   */
  public importScript(scriptPath: string): void {
    
    let importString: string = WpFunctionComposer.enqueueScriptFunction(scriptPath); // get the wp syntax for import the script
    importString = StringComposeWriter.preformatString(importString);
    this.themeAux.updateJsonImports(importsJsonKeys.SCRIPTS, importString, -1);
    this.appendToFunctionBody(
      this.themeAux.ASSETS_IMPORT_FILE_PATH, // file path
      this.themeAux.IMPORT_SCRIPTS_FUNCTION_NAME, // function name
      importString // string to append to the function body
    );
    
  }
  /**
   * @description import in the WP theme given font url
   * @param fontUrl the url of the font to import ( google font )
   */
  public importFont(fontUrl: string): void {
    let importString: string = WpFunctionComposer.enqueueStyleFunction(fontUrl); // get the wp syntax for import the style
    importString = StringComposeWriter.preformatString(importString);
    this.themeAux.updateJsonImports(importsJsonKeys.FONTS, importString, -1);
    this.appendToFunctionBody(
      this.themeAux.ASSETS_IMPORT_FILE_PATH, // file path
      this.themeAux.IMPORT_FONTS_FUNCTION_NAME, // function name
      importString // string to append to the function body
    );
    
  }

  /**
   * @description create and import the given postType in the theme
   * @param postTypeObject the post type to create and import
   */
  public wpPushPostType(postTypeObject: PostType): void {
    postTypeObject.create();
    postTypeObject.import();
  }

  /**
   * @description create and import the given widgeArea in the theme
   * @param widgetArea the widget area to create and import
   */
  public wpPushWidgetArea(widgetArea: WidgetArea): void {
    widgetArea.create();
    widgetArea.import();
  }

  /**
   * @description create and import the given settings page in the theme
   * @param settingsPage the settings page to create and import
   */
  public wpPushSettingsPage(settingsPage: SettingsPage): void {
    settingsPage.create();
    settingsPage.import();
  }

  /**
   * @description create and import the givenmenu in the theme
   * @param menu the menu to create and import
   */
  public wpPushMenu(menu: Menu): void {
    menu.createMainPage();
    menu.createSubPages();
    menu.importMainPage();
    menu.importSubPages();
  }

  /**
   * @description create the given page
   * @param template the Template or Single to create
   */
  public renderingPagePush(page: Template | Single){
    page.create();
  }
  /**
   * @description add the given blocks to the given page
   * @param page the page where to add the blocks
   * @param blocks the blocks to add
   */
  public renderingPageAddBlocks(page: Single | Template, blocks: addBlockParams[]){
    for ( let block of blocks ){
      page.addBlock(block);
    }
  }
  /**
   * @description include the path in the given block as last element
   * @param page the page where to add this include statements
   * @param includeInfo an array of tuples. The tuple have to follow the format 
   * - [ _BLOCK NAME_ , _RELATIVE PATH TO INCLUDE_ ]
   */
  public renderingPageIncludeRelative( page: Single | Template, includeInfo: [ string, string ][] ){
    for ( let include of includeInfo ){
      page.includeRelative(include[0], include[1]);
    }
  }

  /**
   * @description add to the given function the given text and prettify the given file
   * @param filePath the path to the file where the function is defined
   * @param functionDeclaration the declaration of the function ( ex: add_text(myparam: string) )
   * @param toAppend the text to add in the function's body
   * @todo implement the php-prettier function
   */
  public appendToFunctionBody(
    filePath: string,
    functionDeclaration: string,
    toAppend: string
  ): void {
    StringComposeWriter.appendBeetweenChars(filePath, toAppend, 'function', '}', functionDeclaration );
  }
}

export { ThemeWriter };
