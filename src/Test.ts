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
import { MenuMainPage } from "./custom-theme-parts/menus/MenuMainPage";
import { MenuSubPage } from "./custom-theme-parts/menus/MenuSubPage";
import { Menu } from "./custom-theme-parts/menus/Menu";

import { CommentsIdentifiers } from "./comments-identifiers/CommentsIdentifiers";
import * as prettier from "prettier";
import { VisualAux } from "./visual/VisualAux";
import { VisualWriter } from "./visual/VisualWriter";
import { VisualReader } from "./visual/VisualReader";
import { VisualConverter } from "./visual/VisualConverter";

let themePath: string = "/home/pero/Scrivania/blankslate1";
let initalizer: ThemeAux = new ThemeAux(themePath);
const composer: ThemeComposer = new ThemeComposer(initalizer);
const reader: ThemeReader = initalizer.reader;
const writer: ThemeWriter = initalizer.writer;

let testVisual = "/home/pero/projects/WPThemeManager/visual/header";
let visualIntializer: VisualAux = new VisualAux(testVisual);
let visualWr: VisualWriter = visualIntializer.writer;
let visualRd: VisualReader = visualIntializer.reader;
let visualCv: VisualConverter= visualIntializer.converter;

let StrCompW = StringComposeWriter;

/**
 * @description class to perform tests on the lib
 */
class Test {
  constructor() {}

  static log(phrase: string){
      console.log(`[ WTM-TEST ] : ${phrase}`);
  }
  static createThemePostType() {
    let postType: PostType = composer.buildPostType({
      postTypeName: "images",
      postTypeDisplayName: "Images edu",
      postTypeNameSingular: "image",
    });
    writer.pushPostType(postType);
    this.log("created post type");
  }

  static createThemeWidgetArea() {
    let widgetArea: WidgetArea = composer.buildWidgetArea({
      widgetAreaName: "widgetArea"
    });
    writer.pushWidgetArea(widgetArea);
    this.log("created widget area");
  }

  static createThemeSettingsPage() {
    let settingsPage: SettingsPage = composer.buildSettingsPage({
        pageName: "settings_page",
        pageDisplayedName: "displayed name",
        pageBrowserTitle: "browser title"
    });
    writer.pushSettingsPage(settingsPage);
    this.log("created settings page");
  }

  static createThemeMenu(): Menu {
    let mainPage: MenuMainPage = composer.buildMenuMainPage({
      menuName: "menuName",
      menuDisplayedName: "displayed menu name",
      pageBrowserTitle: "browser title"
    });

    let subPageOne: MenuSubPage = composer.buildMenuSubPage({
      pageName: "pageNameOne",
      pageNameDisplayed: "Page One",
      pageBrowserTitle: "browser title one"
    });
    let subPageTwo: MenuSubPage = composer.buildMenuSubPage({
      pageName: "pageNameTwo",
      pageNameDisplayed: "Page Two",
      pageBrowserTitle: "browser title two"
    });

    let menu = composer.buildMenu(mainPage, [subPageOne, subPageTwo]);
    writer.pushMenu(menu);
    this.log("created menu");

    return menu;
  }

  static visualRenderDefault(){
    visualCv.renderDefault();
  }


}

export { Test };
