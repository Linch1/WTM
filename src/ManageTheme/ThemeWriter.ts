
import { FileWriter } from "../files/FileWriter";
import { Theme } from "./Theme";

import { WpFunctionComposer } from "../files/WpFunctionComposer";

import { PostType } from "../custom-theme-parts/postTypes/PostType";
import { WidgetArea } from "../custom-theme-parts/widgetAreas/WidgetArea";
import { SettingsPage } from "../custom-theme-parts/settingsPages/SettingsPage";
import { Menu } from "../custom-theme-parts/menus/Menu";
import { ThemeAux } from "./ThemeAux";

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
    FileWriter.appendToFunctionBody(
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
    FileWriter.appendToFunctionBody(
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
    FileWriter.appendToFunctionBody(
      this.themeAux.ASSETS_IMPORT_FILE_PATH, // file path
      this.themeAux.IMPORT_FONTS_FUNCTION_NAME, // function name
      importString // string to append to the function body
    );
  }

  /**
   * @description create and import the given postType in the theme
   * @param postTypeObject the post type to create and import
   */
  public pushPostType(postTypeObject: PostType): void {
    postTypeObject.create();
    postTypeObject.import();
  }

  /**
   * @description create and import the given widgeArea in the theme
   * @param postTypeObject the widget area to create and import
   */
  public pushWidgetArea(widgetArea: WidgetArea): void {
    widgetArea.create();
    widgetArea.import();
  }

  /**
   * @description create and import the given settings page in the theme
   * @param postTypeObject the settings page to create and import
   */
  public pushSettingsPage(settingsPage: SettingsPage): void {
    settingsPage.create();
    settingsPage.import();
  }

  /**
   * @description create and import the givenmenu in the theme
   * @param postTypeObject the menu to create and import
   */
  public pushMenu(menu: Menu): void {
    menu.createMainPage();
    menu.createSubPages();
    menu.importMainPage();
    menu.importSubPages();
  }

  /**
   * @description add to the given function the given text and prettify the given file
   * @param filePath the path to the file where the function is defined
   * @param functionName the function name
   * @param toAppend the text to add in the function's body
   * @todo implement the php-prettier function
   */
  public appendToFunctionBody(
    filePath: string,
    functionName: string,
    toAppend: string
  ): void {
    FileWriter.appendToFunctionBody(filePath, functionName, toAppend);
    // StringComposeWriter.makePretty(filePath);
  }
}

export { ThemeWriter };
