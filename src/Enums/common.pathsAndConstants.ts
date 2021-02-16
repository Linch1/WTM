import { ProjectTypes } from ".";
import { informationsJson, visualJson } from "..";

/**
 * @description in this class are stored all the  values and the files names/prefixes
 * - this is a class and not an enum to support also non strings/numeric values.
 */
export class WTMPathsAndConstants {
  static jsonPathInProjectDirectory = "WTM-PROJECT";
  static jsonProjectsDirectory = "Projects";
  static jsonProjectsFile = "projects.json";
  static jsonProjectFile = "project-info.json";

  static viewsDirectory = "WTM-VIEWS";
  static viewsPrefix = "views-";
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
  static viewsCommonContent = `[WTM-PLACEHOLDER-PAGE-HEADER]
<!--<[WTM-HTML-BODY]-->
<!--[WTM-HTML-BODY]>-->
[WTM-PLACEHOLDER-PAGE-FOOTER]`; //  content used to generate a view file, this is the content of 'common.--'
  static viewsJsonInformations: informationsJson = {
    blocks: { BODY: { open: "", close: "", include: [] } },
    view: { name: "", projectType: ProjectTypes.ejs },
  }; //  content inside a specific view json, this is the content of 'specificViewName.--'

  // wordpress templates and singles are like the views just with different prefixes and directories so they inherit all the daefault values and constants
  static wpTemplatesDirectory = ""; // wp templates are in the theme root
  static wpTemplatePrefix = "template-";
  static wpTemplateCommonContent = `
<?php 
/*
Template Name: [WTM-PLACEHOLDER-PAGE-NAME]
Template Post Type: page
*/
?>
${WTMPathsAndConstants.viewsCommonContent}`; //  content of wordpress templates
  static wpSinglesDirectory = ""; // wp singles are in the theme root
  static wpSinglePrefix = "single-";
  static wpSingleCommonContent = `
<?php 
/*
Template Name: [WTM-PLACEHOLDER-PAGE-NAME]
Template Post Type: post
*/
?>
${WTMPathsAndConstants.viewsCommonContent}`; //  content of wordpress singles

  static visualsDirectory = "WTM-VISUALS"; // visuals directory
  static visualsJsonFile = "WTM.json"; // the json file name of each visual
  static visualsHtmlDefaultFileName = "default"; // the 'default.--' file of each visual
  static visualsHtmlDefaultContent = ""; // default content used to intialize the visual 'default.--' file
  static visualsHtmlRenderFileName = "render"; // the 'render.--' file of each visual
  static visualsHtmlRenderContent = "";  // default content used to intialize the visual 'render.--' file
  static visualsAssetsDirectory = "assets"; // the 'assets' directory of each visual
  static visaulsAssetsCssDirectory = "css"; // the 'css' directory of each visual ( this folder is inside the 'assets' directory )
  static visualsAssetsJsDirectory = "js"; // the 'js' directory of each visual ( this folder is inside the 'assets' directory )
  static visualsJsonIdentifiersContent = {
    HTML: {
      "!STATIC!": {},
      "!ALL!": {},
      "!EXEC!": {}
    },
    ACF: {
      "!STATIC!": {},
      "!ALL!": {},
      "!EXEC!": {}
    }
  }; // the default identifiers content of the json file ( 'WTM.json' ) of each visual
  static visualsJsonContent: visualJson = {
    visual: { name: "", projectType: ProjectTypes.ejs },
    identifiers: WTMPathsAndConstants.visualsJsonIdentifiersContent,
    dependencies: {
      scripts: [],
      styles: []
    },
    connected: {}
  }; // the default content of each visual json file ( 'WTM.json' )
}
