import { read } from "fs";
import { nestedStringsArrays } from "./types/customTypes";

import { FileReader } from "./files/FileReader";
import { FileWriter } from "./files/FileWriter";
import { StringComposeWriter } from "./files/StringComposeWriter";
import { StringComposeReader } from "./files/StringComposeReader";

import { Theme } from "./theme/Theme";
import { ThemeAux } from "./theme/ThemeAux";
import { ThemeReader } from "./theme/ThemeReader";
import { ThemeWriter } from "./theme/ThemeWriter";
import { ThemeComposer } from "./theme/ThemeComposer";

import { PostType } from "./custom-theme-parts/postTypes/PostType";
import { WidgetArea } from "./custom-theme-parts/widgetAreas/WidgetArea";
import { SettingsPage } from "./custom-theme-parts/settingsPages/SettingsPage";
import { Menu } from "./custom-theme-parts/menus/Menu";


import { CommentsIdentifiers } from "./comments-identifiers/CommentsIdentifiers";
import * as prettier from "prettier";

let themePath: string = "/home/pero/Scrivania/blankslate1";
let initalizer: ThemeAux = new ThemeAux(themePath);
const composer: ThemeComposer = new ThemeComposer(initalizer);
const reader: ThemeReader = initalizer.reader;
const writer: ThemeWriter = initalizer.writer;

let StrCompW = StringComposeWriter;

/**
 * @description class to perform tests on the lib
 */
class Test  {

    constructor(public ThemeFolder: string){}

}

export { Test };