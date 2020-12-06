import { read } from "fs";
import {
    nestedStringsArrays, 
    readFileContent
} from "./customTypes";
import {FileManager} from "./FileManager";
import {Theme} from "./Theme";
import {ThemeReader} from "./ThemeReader";
import {ThemeWriter} from "./ThemeWriter";

let themePath: string = "/var/www/html/wordpress/wp-content/themes/GUDesign";
let reader : ThemeReader = new ThemeReader(themePath);
let writer : ThemeWriter = new ThemeWriter(themePath);
let content: readFileContent = reader.readFunctionBody("/var/www/html/wordpress/wp-content/themes/GUDesign/assets/functions/first-setup.php", "add_custom_js");

writer.importStyle("/partials/header/style.css");