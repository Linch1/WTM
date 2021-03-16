import { identifierActions, IncludeFunctions } from "../Enums";
import { ProjectTypes } from "../Enums/common.projectTypes";
import { IdentifierAcf, IdentifierPlaceholder } from "../Identifiers";
import { informationsJson } from "../Types/entity.rendering.jsons";

/**
 * @description in this class are stored all the  values and the files names/prefixes
 * - this is a class and not an enum to support also non strings/numeric values.
 */
export class ConstViews {
  static Directory = "WTM-VIEWS";
  static Prefix = "view-";
  static JsonDirectory = "views-json";
  static CommonJsonFile = "common.json";
  static CommonJsonInformations: {
    viewStart: string;
    viewEnd: string;
    scripts: string[],
    styles: string[],
    projectPath: string
  } = { viewStart: "", viewEnd: "", scripts: [], styles: [], projectPath: "" }; // used for share a same start( header )/end( footer ) of file through the views, this is the content of 'common.json'
  static IdentifierPageName = "PAGE-NAME"; // this identifier is used to place the view name into a newly created view
  static IdentifierPageStart = "PAGE-START"; // this identifier is used to place the footer ( defined inside the file 'common.json' ) into a newly created view
  static IdentifierPageEnd = "PAGE-END"; // this identifier is used to place the header ( defined inside the file 'common.json' ) into a newly created view
  static IdentifierDefaultScripts = "ADD-DEFAULT-SCRIPTS";
  static IdentifierDefaultStyles = "ADD-DEFAULT-STYLES";
  static IdentifierScripts = "ADD-SCRIPTS";
  static IdentifierStyles = "ADD-STYLES";

  static CommonContentFileName = "common"; // 'common.--' the extension of this file is inherited from the project type
  static CommonBaseBlock = "BODY";
  static CommonContent = `
${IdentifierPlaceholder.getIdentifier(ConstViews.IdentifierPageStart, false)}
${IdentifierPlaceholder.getIdentifier(ConstViews.IdentifierDefaultStyles, false)}
${IdentifierPlaceholder.getIdentifierWithAction(ConstViews.IdentifierStyles, identifierActions.EXECUTABLE)}
<!--<[WTM-HTML-BODY]-->

<!--[WTM-HTML-BODY]>-->
${IdentifierPlaceholder.getIdentifier(ConstViews.IdentifierDefaultScripts, false)}
${IdentifierPlaceholder.getIdentifierWithAction(ConstViews.IdentifierScripts, identifierActions.EXECUTABLE)}
${IdentifierPlaceholder.getIdentifier(ConstViews.IdentifierPageEnd, false)}`; //  content used to generate a view file, this is the content of 'common.--'
  
static JsonContent: informationsJson = {
    blocks: { BODY: { open: "", close: "", include: [] } },
    view: { name: "", projectType: ProjectTypes.ejs },
  }; //  content inside a specific view json, this is the content of 'specificViewName.--'

  static getViewsJsonContent(): informationsJson {
    return JSON.parse(JSON.stringify(ConstViews.JsonContent));
  }
  static getViewsCommonJsonContent( ): {
    viewStart: string;
    viewEnd: string;
    scripts: string[];
    styles: string[];
  } {
    return JSON.parse(JSON.stringify(ConstViews.CommonJsonInformations));
  }
}
