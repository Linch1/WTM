
import { StringComposeWriter } from "./StringComposeWriter";
import { CommentsIdentifiers } from "../comments-identifiers/CommentsIdentifiers";

class WpFunctionComposer {
  static IDENTIFIER_IMPORTED =
    CommentsIdentifiers.IDENTIFIERS["IMPORTED"][
      CommentsIdentifiers.IDENTIFIER_KEYWORD_POS
    ];
  /**
   * @description return the syntax of the function for correctly import a style file in wordpress
   * @param fileToImport the file path to import in the WP theme
   */
  static enqueueStyleFunction(fileToImport: string): string {
    fileToImport = StringComposeWriter.addInitialSlash(fileToImport);
    return `wp_enqueue_style( '${fileToImport.replace(
      "/",
      WpFunctionComposer.IDENTIFIER_IMPORTED
    )}',get_template_directory_uri().'${fileToImport}',false,'0.0.1','all');\n`;
  }
  /**
   * @description return the syntax of the function for correctly import a script file in wordpress
   * @param fileToImport the file path to import in the WP theme
   */
  static enqueueScriptFunction(fileToImport: string): string {
    fileToImport = StringComposeWriter.addInitialSlash(fileToImport);
    return `wp_enqueue_script( '${fileToImport.replace(
      "/",
      this.IDENTIFIER_IMPORTED
    )}',get_template_directory_uri().'${fileToImport}',array('jquery'),'0.0.1',true);\n`;
  }
  /**
   * @description return the syntax of the function for correctly require a file in functions.php
   * @param fileToImport the file path to import in the WP theme
   */
  static requirePhpFile(fileToImport: string): string {
    fileToImport = StringComposeWriter.addInitialSlash(fileToImport);
    return `require_once(get_template_directory_uri() . '${fileToImport}.php');\n`;
  }
}

export { WpFunctionComposer };
