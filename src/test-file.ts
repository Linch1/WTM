import { TestTheme } from "./Test/TestTheme";
import { TestVisual } from "./Test/TestVisual";
import { TestCustomRender } from "./Test/TestCustomRender";

TestCustomRender.createView();
TestCustomRender.addBlockInTemplate();
TestCustomRender.includeFileInTemplate();
// TestCustomRender.delete();

/* TEST FOR MANAGE THEME SINGLE/TEMPLATE

TestTheme.createSingle();
TestTheme.includeFileInSingle();
TestTheme.addBlockInSingle();
TestTheme.includeFileInSingle();
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
TestVisual.visualRead();

*/


// TestTheme.wpImportsTest();
// TestVisual.bulkGetAllVisuals();
