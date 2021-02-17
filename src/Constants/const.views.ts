
import { informationsJson, ProjectTypes } from "..";
/**
 * @description in this class are stored all the  values and the files names/prefixes
 * - this is a class and not an enum to support also non strings/numeric values.
 */
export class ConstViews {
  static viewsDirectory = "WTM-VIEWS";
  static viewsPrefix = "view-";
  static viewsJsonDirectory = "views-json";
  static viewsCommonJsonFile = "common.json";
  static viewsCommonJsonInformations: {
    header: string;
    footer: string;
  } = { header: "", footer: "" }; // used for share a same start( header )/end( footer ) of file through the views, this is the content of 'common.json'
  static viewsIdentifierPageName = "PAGE-NAME"; // this identifier is used to place the view name into a newly created view
  static viewsIdentifierPageHeader = "PAGE-HEADER"; // this identifier is used to place the footer ( defined inside the file 'common.json' ) into a newly created view
  static viewsIdentifierPageFooter = "PAGE-FOOTER"; // this identifier is used to place the header ( defined inside the file 'common.json' ) into a newly created view
  static viewsCommonContentFileName = "common"; // 'common.--' the extension of this file is inherited from the project type
  static viewsCommonBaseBlock = 'BODY';
  static viewsCommonContent = `[WTM-PLACEHOLDER-PAGE-HEADER]
<!--<[WTM-HTML-BODY]-->
<!--[WTM-HTML-BODY]>-->
[WTM-PLACEHOLDER-PAGE-FOOTER]`; //  content used to generate a view file, this is the content of 'common.--'
  static viewsJsonInformations: informationsJson = {
    blocks: { BODY: { open: "", close: "", include: [] } },
    view: { name: "", projectType: ProjectTypes.ejs },
  }; //  content inside a specific view json, this is the content of 'specificViewName.--'
}
