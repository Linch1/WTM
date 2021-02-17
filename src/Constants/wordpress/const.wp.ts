import { ConstViews } from "../const.views";
/**
 * @description in this class are stored all the  values and the files names/prefixes
 * - this is a class and not an enum to support also non strings/numeric values.
 */

export class ConstWordpress {
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
${ConstViews.viewsCommonContent}`; //  content of wordpress templates
  static wpSinglesDirectory = ""; // wp singles are in the theme root
  static wpSinglePrefix = "single-";
  static wpSingleCommonContent = `
<?php 
/*
Template Name: [WTM-PLACEHOLDER-PAGE-NAME]
Template Post Type: post
*/
?>
${ConstViews.viewsCommonContent}`; //  content of wordpress singles
}
