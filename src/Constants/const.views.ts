import { IncludeFunctions } from "../Enums";
import { ProjectTypes } from "../Enums/common.projectTypes";
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
    header: string;
    footer: string;
    scripts: string[],
    styles: string[]
  } = { header: "", footer: "", scripts: [], styles: [] }; // used for share a same start( header )/end( footer ) of file through the views, this is the content of 'common.json'
  static IdentifierPageName = "PAGE-NAME"; // this identifier is used to place the view name into a newly created view
  static IdentifierPageHeader = "PAGE-HEADER"; // this identifier is used to place the footer ( defined inside the file 'common.json' ) into a newly created view
  static IdentifierPageFooter = "PAGE-FOOTER"; // this identifier is used to place the header ( defined inside the file 'common.json' ) into a newly created view
  static IdentifierDefaultScripts = "ADD-DEFAULT-SCRIPTS";
  static IdentifierDefaultStyles = "ADD-DEFAULT-STYLES";
  static CommonContentFileName = "common"; // 'common.--' the extension of this file is inherited from the project type
  static CommonBaseBlock = "BODY";
  static CommonContent = `
[WTM-PLACEHOLDER-PAGE-HEADER]
[WTM-HTML-!EXEC!-ADD-DEFAULT-STYLES]
<!--<[WTM-HTML-BODY]-->

<!--[WTM-HTML-BODY]>-->
[WTM-HTML-!EXEC!-ADD-DEFAULT-SCRIPTS]
[WTM-PLACEHOLDER-PAGE-FOOTER]`; //  content used to generate a view file, this is the content of 'common.--'
  static JsonInformations: informationsJson = {
    blocks: { BODY: { open: "", close: "", include: [] } },
    view: { name: "", projectType: ProjectTypes.ejs },
  }; //  content inside a specific view json, this is the content of 'specificViewName.--'

  static getViewsJsonInformations(): informationsJson {
    return JSON.parse(JSON.stringify(ConstViews.JsonInformations));
  }
  static getViewsCommonJsonInformations( ): {
    header: string;
    footer: string;
    scripts: string[];
    styles: string[];
  } {
    return JSON.parse(JSON.stringify(ConstViews.CommonJsonInformations));
  }
}
