import { identifierType } from "../Enums";
import { GeneralIdentifier } from "../Identifiers/GeneralIdentfier";
import { IdentifierImport } from "../Identifiers/IdentifierImport";
import { Identifiers } from "../Identifiers/Identifiers";
import { StringComposeWriter } from "./StringComposeWriter";

export class WpFunctionComposer {
  static IDENTIFIER_IMPORTED = IdentifierImport;
  /**
   * @description return the syntax of the function for correctly import a style file in wordpress
   * @param fileToImport the file path to import in the WP theme
   */
  static enqueueStyleFunction(fileToImport: string): string {
    fileToImport = StringComposeWriter.addInitialSlash(fileToImport);
    return `wp_enqueue_style( '${WpFunctionComposer.IDENTIFIER_IMPORTED.getIdentifier(
      fileToImport, false
    )}',get_template_directory_uri().'${fileToImport}',false,'0.0.1','all');\n`;
  }
  /**
   * @description return the syntax of the function for correctly import a script file in wordpress
   * @param fileToImport the file path to import in the WP theme
   */
  static enqueueScriptFunction(fileToImport: string): string {
    fileToImport = StringComposeWriter.addInitialSlash(fileToImport);
    return `wp_enqueue_script( '${WpFunctionComposer.IDENTIFIER_IMPORTED.getIdentifier(
      fileToImport, false
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

  /**
   * @description return the syntax of the function for correctly include a fine in a template/single
   * @param path the path to include ( relative to the theme dir path )
   */
  static includeRelative(path: string): string {
    return `<?php include(TEMPLATEPATH.'${path}');?>\n`;
  }
}
