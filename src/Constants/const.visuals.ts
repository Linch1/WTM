import { ProjectTypes } from "../Enums/common.projectTypes";
import { visualJson, visualJsonIdentifiers } from "../Types/manageVisual.jsons";
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
  static visualsAssetsCssDirectory = "css"; // the 'css' directory of each visual ( this folder is inside the 'assets' directory )
  static visualsAssetsJsDirectory = "js"; // the 'js' directory of each visual ( this folder is inside the 'assets' directory )
  static visualsAssetsLibDirectory = "lib"; // the 'lib' directory of each visual ( this folder is inside the 'assets' directory )
  static visualsJsonIdentifiersContent: visualJsonIdentifiers = {
    HTML: {
      "!STATIC!": {},
      "!ALL!": {},
      "!EXEC!": {},
    }
  }; // the default identifiers content of the json file ( 'WTM.json' ) of each visual
  static visualsLibElemContent = {
    scripts: [],
    styles: []
  } // the content the visuals of a lib elemenets
  static visualsJsonContent: visualJson = {
    visual: { name: "", projectType: ProjectTypes.ejs },
    identifiers: ConstVisuals.visualsJsonIdentifiersContent,
    dependencies: {
      scripts: [],
      styles: [],
    },
    lib: {},
    connected: {},
  }; // the default content of each visual json file ( 'WTM.json' )

  static getVisualsJsonContent(): visualJson {
    return JSON.parse( JSON.stringify( ConstVisuals.visualsJsonContent ) );
  }
  static getVisualsLibElemContent(): {
    scripts: [],
    styles: []
  } {
    return JSON.parse( JSON.stringify( ConstVisuals.visualsLibElemContent ) );
  }
}
