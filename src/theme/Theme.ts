import { nestedStringsArrays } from "../types/customTypes";
import { FileReader } from "../files/FileReader";
import { FileWriter } from "../files/FileWriter";
import {StringComposeWriter} from "../files/StringComposeWriter"

import { ThemeWriter } from "./ThemeWriter";
import { ThemeReader } from "./ThemeReader";
import { ThemeComposer } from "./ThemeComposer";

class Theme {
    
  public themeStructure: nestedStringsArrays = [];
  public readonly IMPORT_STYLES_FUNCTION_NAME: string = "add_styles";
  public readonly IMPORT_FONTS_FUNCTION_NAME: string = "add_fonts";
  public readonly IMPORT_SCRIPTS_FUNCTION_NAME: string = "add_scripts";
  public readonly ASSETS_PATH: string = "assets/functions/"
  public readonly IMPORT_FILE_PATH: string = StringComposeWriter.concatenatePaths(this.ASSETS_PATH, "imports.php");
  public readonly FUNCTIONS_FILE: string = "functions.php";

  constructor(public ThemeFolder: string) {
    this.themeStructure = FileReader.readFolderTree(ThemeFolder);

    
  }
}

export { Theme };
