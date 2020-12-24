import { Template } from "./ManageTheme/theme-rendering/Template";
import { TestTheme } from "./Test/TestTheme";
import { TestVisual } from "./Test/TestVisual";


/* TEST FOR MANAGE THEME SINGLE/TEMPLATE
*/

TestTheme.createThemeMenu(); 
TestTheme.createThemePostType();
TestTheme.createThemeWidgetArea();
TestTheme.createThemeSettingsPage();


TestTheme.createSingle();
TestTheme.includeFileInSingle();
TestTheme.addBlockInSingle();
TestTheme.createTemplate();
TestTheme.includeFileInTemplate();
TestTheme.addBlockInTemplate();



TestTheme.readTheme();


/* TEST FOR MANAGE CUSTOM THEME PARTES

*/

/* TEST FOR MANAGE CUSTOM VISUALS
TestVisual.VisualCreate();
TestVisual.VisualEditHtml();
TestVisual.visualPopulateIdentfiers();
TestVisual.visualRenderDefault();
TestVisual.visualRenderAcf();
*/

