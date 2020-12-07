import { nestedStringsArrays } from "../types/customTypes";
import { FileReader } from "../files/FileReader";
import { FileWriter } from "../files/FileWriter";

class Theme {
    
  public themeStructure: nestedStringsArrays = [];
  public readonly IMPORT_STYLES_FUNCTION_NAME: string = "add_styles";
  public readonly IMPORT_FONTS_FUNCTION_NAME: string = "add_fonts";
  public readonly IMPORT_SCRIPTS_FUNCTION_NAME: string = "add_scripts";
  public readonly IMPORT_FILE_PATH: string = "assets/functions/imports.php";

  constructor(public ThemeFolder: string) {
    this.themeStructure = FileReader.readFolderTree(ThemeFolder);
  }
}

export { Theme };
