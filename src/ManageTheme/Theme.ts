import { FileReader } from "../files/FileReader";

import { StringComposeWriter } from "../files/StringComposeWriter";

import { nestedStringsArrays } from "../files/types/types";

class Theme {
  public themeStructure: nestedStringsArrays = [];
  public readonly IMPORT_STYLES_FUNCTION_NAME: string = "add_styles";
  public readonly IMPORT_FONTS_FUNCTION_NAME: string = "add_fonts";
  public readonly IMPORT_SCRIPTS_FUNCTION_NAME: string = "add_scripts";

  public readonly ASSETS_CUSTOM_PATH: string = this.getInsideThemePath(
    "assets/functions/"
  );
  public readonly ASSETS_IMPORT_FILE_PATH: string = this.getInsideThemeAssetsPath(
    "imports.php"
  );
  public readonly THEME_FUNCTIONS_FILE: string = this.getInsideThemePath(
    "functions.php"
  );

  constructor(public THEME_MAIN_FOLDER: string) {
    this.themeStructure = FileReader.readFolderTree(THEME_MAIN_FOLDER);
  }

  public getInsideThemePath(...paths: string[]): string {
    let path = this.THEME_MAIN_FOLDER;
    for (let subPath of paths) {
      path = StringComposeWriter.concatenatePaths(path, subPath);
    }
    return path;
  }
  public getInsideThemeAssetsPath(...paths: string[]): string {
    let path = this.ASSETS_CUSTOM_PATH;
    for (let subPath of paths) {
      path = StringComposeWriter.concatenatePaths(path, subPath);
    }
    return path;
  }
}

export { Theme };
