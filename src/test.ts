import { read } from "fs";
import {
    nestedStringsArrays
} from "./types/customTypes";
import { FileReader } from "./files/FileReader";
import { FileWriter } from "./files/FileWriter";
import {Theme} from "./theme/Theme";
import {ThemeReader} from "./theme/ThemeReader";
import {ThemeWriter} from "./theme/ThemeWriter";

let themePath: string = "/home/pero/Scrivania/blankslate1";
let reader : ThemeReader = new ThemeReader(themePath);
let writer : ThemeWriter = new ThemeWriter(themePath);

// let folderTree = FileReader.readFolderTree("/home/pero/Scrivania/blankslate1");
// FileReader.printFolderTree(folderTree);

// writer.importStyle("/partials/header/style.css");
// writer.importScript("/partials/header/style.css");
// writer.importFont("/partials/header/style.css");


FileWriter.makePretty("/var/www/html/wordpress/wp-content/themes/GUDesign/partials/header/script.js")

