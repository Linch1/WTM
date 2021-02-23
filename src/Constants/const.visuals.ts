import { ProjectTypes } from "../Enums/common.projectTypes";
import { visualJson, visualJsonIdentifiers } from "../Types/manageVisual.jsons";
/**
 * @description in this class are stored all the  values and the files names/prefixes
 * - this is a class and not an enum to support also non strings/numeric values.
 */
export class ConstVisuals {

  static Directory = "WTM-VISUALS"; // visuals directory
  static JsonFile = "WTM.json"; // the json file name of each visual
  static HtmlDefaultFileName = "default"; // the 'default.--' file of each visual
  static HtmlDefaultContent = ""; // default content used to intialize the visual 'default.--' file
  static HtmlRenderFileName = "render"; // the 'render.--' file of each visual
  static HtmlRenderContent = ""; // default content used to intialize the visual 'render.--' file
  static AssetsDirectory = "assets"; // the 'assets' directory of each visual
  static AssetsCssDirectory = "css"; // the 'css' directory of each visual ( this folder is inside the 'assets' directory )
  static AssetsJsDirectory = "js"; // the 'js' directory of each visual ( this folder is inside the 'assets' directory )
  static AssetsImgDirectory = "img"; // the 'js' directory of each visual ( this folder is inside the 'assets' directory )
  static IdentifierPlaceholderNamePathToImages = "VS-ASSETS-IMAGES" // the path ends without '/'. This placeholder when the visual is rendered is replaced with the path to the visuals images folder. 
  static JsonIdentifiersContent: visualJsonIdentifiers = {
    HTML: {
      "!STATIC!": {},
      "!ALL!": {},
      "!EXEC!": {},
    }
  }; // the default identifiers content of the json file ( 'WTM.json' ) of each visual
  static LibElemContent = {
    scripts: [],
    styles: [],
    cdn: []
  } // the content the visuals of a lib elemenets
  static JsonContent: visualJson = {
    visual: { 
      name: "", 
      projectType: ProjectTypes.ejs,
      assetsAutoImport: false,
      author: "",
      authorUrl: "",
      githubRepo: ""
    },
    identifiers: ConstVisuals.JsonIdentifiersContent,
    dependencies: {
      scripts: [],
      styles: [],
    },
    lib: {},
    connected: {},
  }; // the default content of each visual json file ( 'WTM.json' )

  static getVisualsJsonContent(): visualJson {
    return JSON.parse( JSON.stringify( ConstVisuals.JsonContent ) );
  }
  static getVisualsLibElemContent(): {
    scripts: [],
    styles: [],
    cdn: [],
    url: ""
  } {
    return JSON.parse( JSON.stringify( ConstVisuals.LibElemContent ) );
  }
}
