import { Template } from "./Entities/visual/Template";
import { GeneralIdentifier } from "./Identifiers/GeneralIdentfier";
import { IdentifierId } from "./Identifiers/IdentifierId";
import { TestTheme } from "./Test/TestTheme";
import { TestVisual } from "./Test/TestVisual";

/* TEST FOR MANAGE THEME SINGLE/TEMPLATE
TestTheme.createSingle();
TestTheme.includeFileInSingle();
TestTheme.addBlockInSingle();
TestTheme.createTemplate();
TestTheme.includeFileInTemplate();
TestTheme.addBlockInTemplate();
*/

/* TEST FOR MANAGE CUSTOM THEME PARTES

TestTheme.createThemeMenu(); 
TestTheme.createThemePostType();
TestTheme.createThemeWidgetArea();
TestTheme.createThemeSettingsPage();
TestTheme.readTheme();

*/

/* TEST FOR MANAGE CUSTOM VISUALS
TestVisual.VisualCreate();
TestVisual.VisualEditHtml();
TestVisual.visualPopulateIdentfiers();
TestVisual.visualRenderDefault();
TestVisual.visualRenderAcf();
*/

console.log(
  GeneralIdentifier.IDENTIFIER_TYPE,
  GeneralIdentifier.getIdentifier("asd")
);
console.log(
  IdentifierId.IDENTIFIER_TYPE,
  IdentifierId.getIdentifier("asd")
);
