import { read } from "fs";
import { nestedStringsArrays } from "./types/customTypes";

import { FileReader } from "./files/FileReader";
import { FileWriter } from "./files/FileWriter";
import { StringComposeWriter } from "./files/StringComposeWriter";
import { StringComposeReader } from "./files/StringComposeReader";

import { Theme } from "./theme/Theme";
import { ThemeInitializer } from "./theme/ThemeInitializer";
import { ThemeReader } from "./theme/ThemeReader";
import { ThemeWriter } from "./theme/ThemeWriter";
import { ThemeComposer } from "./theme/ThemeComposer";

import { PostType } from "./custom-theme-parts/PostType";
import { WidgetArea } from "./custom-theme-parts/WidgetArea";
import { Menu } from "./custom-theme-parts/Menu";

import { CommentsIdentifiers } from "./comments-identifiers/CommentsIdentifiers";
import * as prettier from "prettier";

let themePath: string = "/home/pero/Scrivania/blankslate1";
let initalizer: ThemeInitializer = new ThemeInitializer(themePath);
let reader: ThemeReader = initalizer.reader;
let writer: ThemeWriter = initalizer.writer;
let composer: ThemeComposer = initalizer.composer;



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

// let widgetArea: WidgetArea = new WidgetArea(StringComposeWriter.concatenatePaths(themePath, writer.ASSETS_PATH), "footer");
// widgetArea.create(true);
// writer.importWidgetArea(widgetArea);

let menu: Menu = new Menu(StringComposeWriter.concatenatePaths(themePath, writer.ASSETS_PATH));
menu.createMainPage("myMenu", "Main Menu Name", "browser-title");
menu.createSubPage("sub-page", "Sub Page Name", "browser-title")

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
