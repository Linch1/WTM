import { Test } from "./Test";



/* TEST FOR RENDER CUSTOM THEME PARTES
Test.createThemePostType();
Test.createThemeWidgetArea();
Test.createThemeSettingsPage();
Test.createThemeMenu(); 
*/

Test.visualRenderDefault();



// writer.pushPostType(composer.buildPostType("images", "Images", "image"));
// writer.pushWidgetArea(composer.buildWidgetArea("footer"));

// let folderTree = FileReader.readFolderTree("/home/pero/Scrivania/blankslate1");
// FileReader.printFolderTree(folderTree);

// writer.importStyle("/partials/header/style.css");
// writer.importScript("/partials/header/style.css");
// writer.importFont("/partials/header/style.css");

// FileWriter.makePretty("/var/www/html/wordpress/wp-content/themes/GUDesign/partials/header/script.js");
// let path: string = FileReader.concatenatePaths("/home/pero", "Scrivania", "nonloSo/file.php/")
// console.log(path);

// let PTImage = new PostType(StringComposeWriter.concatenatePaths(themePath, writer.ASSETS_PATH), "images", "Images", "image");
// PTImage.create(true);
// writer.importPostType(PTImage);

// widgetArea.create(true);
// writer.importWidgetArea(widgetArea);

// let menu: Menu = new Menu(
//   StringComposeWriter.concatenatePaths(themePath, writer.ASSETS_PATH)
// );
// let mainPage = "myMenu";
// let subPag = "sub_page";
// menu.createMainPage(mainPage, "Main Menu Name", "browser-title");
// menu.createSubPage(subPag, "Sub Page Name", "browser-title");
// writer.appendToFunctionBody(
//   menu.getMainPagePath(mainPage),
//   menu.importRenderFileFunction(mainPage),
//   StrCompW.preformatString("include ('./menu-content/default/html.php');")
// );
// writer.appendToFunctionBody(
//   menu.getSubPagePath(subPag),
//   menu.importRenderFileFunction(subPag),
//   StrCompW.preformatString("include ('./menu-content/default/html.php');")
// );

// let settingsPageName: string = "page_Asd";
// let settingsPage: SettingsPage = new SettingsPage(
//   StringComposeWriter.concatenatePaths(themePath, writer.ASSETS_PATH)
// );
// settingsPage.add(
//   {
//     pageName: "page_Asd",
//     pageDisplayedName: "My Page",
//     pageBrowserTitle: "title",
//   },
//   {
//     pageName: "page_Asd1",
//     pageDisplayedName: "My Page",
//     pageBrowserTitle: "title",
//   },
//   {
//     pageName: "page_Asd2",
//     pageDisplayedName: "My Page",
//     pageBrowserTitle: "title",
//   }
// );
// settingsPage.createAll();

// writer.appendToFunctionBody(
//   settingsPage.getSettingsPagePath(settingsPageName),
//   settingsPage.importRenderFileFunction(settingsPageName),
//   StrCompW.preformatString("include ('./menu-content/default/html.php');")
// );

// let stringa: string = `
// register_post_type( '[WTM-PLACEHOLDER-CPT]',
//    array(
//        'labels' => array(
//            'name' => __( '[WTM-PLACEHOLDER-CPTN]' ),
//            'singular_name' => __( '[WTM-PLACEHOLDER-CPTS]' ),
//            'supports' => array( 'thumbnail' ),
//            'hierarchical' => false
//        ),
// `;
// console.log(
//   FileWriter.reinsertSpacesAndNewlines(
//     stringa,
//     FileReader.removeSpacesAndNewLines(stringa)
//   )
// );

// let content = StringComposeWriter.appendBeetweenChars(
//   FileReader.concatenatePaths(themePath, "functions.php"),
//   "hey\n",
//   "//<[WTM-IMPORT-THEME-MENU]",
//   "//[WTM-IMPORT-THEME-MENU]>"
// );
// console.log(content);

//console.log(CommentsIdentifiers.checkIdentifier("WTM-ID-CIAO"))

// FileWriter.addAfterCommentIdentifierPair(
//   FileReader.concatenatePaths(themePath, "functions.php"),
//   "IMPORT",
//   "THEME-MENU",
//   "hey\n"
// );
