import { ProjectTypes } from "..";
import { visualJson } from "..";
/**
 * @description in this class are stored all the  values and the files names/prefixes
 * - this is a class and not an enum to support also non strings/numeric values.
 */
export class ConstVisuals {

  static visualsDirectory = "WTM-VISUALS"; // visuals directory
  static visualsJsonFile = "WTM.json"; // the json file name of each visual
  static visualsHtmlDefaultFileName = "default"; // the 'default.--' file of each visual
  static visualsHtmlDefaultContent = ""; // default content used to intialize the visual 'default.--' file
  static visualsHtmlRenderFileName = "render"; // the 'render.--' file of each visual
  static visualsHtmlRenderContent = ""; // default content used to intialize the visual 'render.--' file
  static visualsAssetsDirectory = "assets"; // the 'assets' directory of each visual
  static visaulsAssetsCssDirectory = "css"; // the 'css' directory of each visual ( this folder is inside the 'assets' directory )
  static visualsAssetsJsDirectory = "js"; // the 'js' directory of each visual ( this folder is inside the 'assets' directory )
  static visualsJsonIdentifiersContent = {
    HTML: {
      "!STATIC!": {},
      "!ALL!": {},
      "!EXEC!": {},
    },
    ACF: {
      "!STATIC!": {},
      "!ALL!": {},
      "!EXEC!": {},
    },
  }; // the default identifiers content of the json file ( 'WTM.json' ) of each visual
  static visualsJsonContent: visualJson = {
    visual: { name: "", projectType: ProjectTypes.ejs },
    identifiers: ConstVisuals.visualsJsonIdentifiersContent,
    dependencies: {
      scripts: [],
      styles: [],
    },
    connected: {},
  }; // the default content of each visual json file ( 'WTM.json' )
}
