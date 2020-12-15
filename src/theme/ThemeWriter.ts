import { nestedStringsArrays } from "../types/customTypes";
import { FileReader } from "../files/FileReader";
import { FileWriter } from "../files/FileWriter";
import { Theme } from "./Theme";
import { ThemeReader } from "./ThemeReader";
import { PostType } from "../custom-theme-parts/PostType";
import { WidgetArea } from "../custom-theme-parts/WidgetArea";
import { CommentsIdentifiers } from "../comments-identifiers/CommentsIdentifiers";
import { StringComposeWriter } from "../files/StringComposeWriter";
import { SettingsPage } from "../custom-theme-parts/SettingsPage";
import { WpFunctionComposer } from "../files/WpFunctionComposer"

/**
 * This class is used to perform the write actions
 * like edit/create new files
 * for example add an import line to functions.php
 * or create a new custom post type
 */
class ThemeWriter extends Theme {
  

  constructor(public ThemeFolder: string) {
    super(ThemeFolder);
  }


  /**
   * @description import in the WP theme given style file
   * @param stylePath the file path to the style file
   */
  public importStyle(stylePath: string): void {
    let importString: string = WpFunctionComposer.enqueueStyleFunction(stylePath); // get the wp syntax for import the style
    FileWriter.appendToFunctionBody(
      this.ASSETS_IMPORT_FILE_PATH, // file path
      this.IMPORT_STYLES_FUNCTION_NAME, // function name
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
      this.ASSETS_IMPORT_FILE_PATH, // file path
      this.IMPORT_SCRIPTS_FUNCTION_NAME, // function name
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
      this.ASSETS_IMPORT_FILE_PATH, // file path
      this.IMPORT_FONTS_FUNCTION_NAME, // function name
      importString // string to append to the function body
    );
  }
  /**
   * @description create and import the postType passed in the theme
   * @param postTypeObject the post type to create and import
   */
  public pushPostType(postTypeObject: PostType): void {
    postTypeObject.create();
    this.importPostType(postTypeObject);
  }
  /**
   * @description import the given post type in the theme
   * @param postTypeObject the post type to import
   */
  public importPostType(postTypeObject: PostType): void {
    StringComposeWriter.appendBeetweenChars(
      this.THEME_FUNCTIONS_FILE,
      WpFunctionComposer.requirePhpFile(
        StringComposeWriter.concatenatePaths(
          postTypeObject.PATH,
          postTypeObject.postType
        )
      ),
      CommentsIdentifiers.getIdentifierImportPair(
        postTypeObject.IDENTIFIER_NAME
      )[0],
      CommentsIdentifiers.getIdentifierImportPair(
        postTypeObject.IDENTIFIER_NAME
      )[1]
    );
  }

  /**
   * @description create and import the postType passed in the theme
   * @param postTypeObject the widget area to create and import
   */
  public pushWidgetArea(widgetArea: WidgetArea): void {
    widgetArea.create();
    this.importWidgetArea(widgetArea);
  }
  /**
   * @description import the given widget area in the theme
   * @param postTypeObject the widget area to import
   */
  public importWidgetArea(widgetArea: WidgetArea): void {
    StringComposeWriter.appendBeetweenChars(
      this.THEME_FUNCTIONS_FILE,
      WpFunctionComposer.requirePhpFile(
        StringComposeWriter.concatenatePaths(
          widgetArea.PATH,
          widgetArea.widgetAreaName
        )
      ),
      CommentsIdentifiers.getIdentifierImportPair(
        widgetArea.IDENTIFIER_NAME
      )[0],
      CommentsIdentifiers.getIdentifierImportPair(widgetArea.IDENTIFIER_NAME)[1]
    );
  }

  /**
   * @description create and import the settings page passed in 
   * @param postTypeObject the settings page to create and import
   */
  public pushSettingsPage(settingsPage: SettingsPage): void {
    settingsPage.createAll();
    // this.importSettingsPage(settingsPage);
  }
  /**
   * @description import the given settings page in the Theme
   * @param postTypeObject the settings page to import
   */
  // public importSettingsPage(settingsPage: SettingsPage): void {
  //   StringComposeWriter.appendBeetweenChars(
  //     this.getThemePath(this.FUNCTIONS_FILE),
  //     this.requirePhpFile(
  //       StringComposeWriter.concatenatePaths(
  //         settingsPage.PATH,
  //         widgetArea.widgetAreaName
  //       )
  //     ),
  //     CommentsIdentifiers.getIdentifierImportPair(
  //       widgetArea.IDENTIFIER_NAME
  //     )[0],
  //     CommentsIdentifiers.getIdentifierImportPair(widgetArea.IDENTIFIER_NAME)[1]
  //   );
  // }

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
