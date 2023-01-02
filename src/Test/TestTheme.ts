import { ThemeAux } from "../ManageTheme/ThemeAux";
import { ThemeReader } from "../ManageTheme/ThemeReader";
import { ThemeWriter } from "../ManageTheme/ThemeWriter";
import { ThemeComposer } from "../ManageTheme/ThemeComposer";
//@ts-ignore
import { Single } from "../Entities/rendering/Single";
//@ts-ignore
import { Template } from "../Entities/rendering/Template";

import { PostType } from "../Entities/wp/postTypes/PostType";
import { WidgetArea } from "../Entities/wp/widgetAreas/WidgetArea";
import { SettingsPage } from "../Entities/wp/settingsPages/SettingsPage";
import { MenuMainPage } from "../Entities/wp/menus/MenuMainPage";
import { MenuSubPage } from "../Entities/wp/menus/MenuSubPage";
import { Menu } from "../Entities/wp/menus/Menu";
import { write } from "fs";

let themePath: string = "/home/pero/Scrivania/blankslate-test";
let initalizer: ThemeAux = new ThemeAux(themePath);
const composer: ThemeComposer = initalizer.composer;
const reader: ThemeReader = initalizer.reader;
const writer: ThemeWriter = initalizer.writer;

const single: Single = new Single(initalizer, "Test single");
const template: Template = new Template(initalizer, "Test template");

/**
 * @description class to perform tests on the lib
 */
class TestTheme {
  constructor() {}

  static log(phrase: string) {
    console.log(`[ WTM-TEST ] : ${phrase}`);
  }

  static wpImportsTest(){
    writer.importFont('/font/import');
    writer.importStyle('/style/import');
    writer.importScript('/script/import');
    this.log("made custom imports");
  }

  static createThemePostType() {
    let postType: PostType = composer.buildPostType({
      postTypeName: "images",
      postTypeDisplayName: "Images edu",
      postTypeNameSingular: "image",
      skipIfExists: true,
    });
    writer.wpPushPostType(postType);
    this.log("created post type");
  }

  static createThemeWidgetArea() {
    let widgetArea: WidgetArea = composer.buildWidgetArea({
      widgetAreaName: "widgetArea",
      skipIfExists: true,
    });
    writer.wpPushWidgetArea(widgetArea);
    this.log("created widget area");
  }

  static createThemeSettingsPage() {
    let settingsPage: SettingsPage = composer.buildSettingsPage({
      pageName: "settings_page",
      pageDisplayedName: "displayed name",
      pageBrowserTitle: "browser title",
      skipIfExists: true,
    });
    writer.wpPushSettingsPage(settingsPage);
    this.log("created settings page");
  }

  static createThemeMenu(): Menu {
    let mainPage: MenuMainPage = composer.buildMenuMainPage({
      menuName: "menuName",
      menuDisplayedName: "displayed menu name",
      pageBrowserTitle: "browser title",
      skipIfExists: true,
    });

    let subPageOne: MenuSubPage = composer.buildMenuSubPage({
      pageName: "pageNameOne",
      pageNameDisplayed: "Page One",
      pageBrowserTitle: "browser title one",
      skipIfExists: true,
    });
    let subPageTwo: MenuSubPage = composer.buildMenuSubPage({
      pageName: "pageNameTwo",
      pageNameDisplayed: "Page Two",
      pageBrowserTitle: "browser title two",
      skipIfExists: true,
    });

    let menu = composer.buildMenu(mainPage, [subPageOne, subPageTwo]);
    writer.wpPushMenu(menu);
    this.log("created menu");

    return menu;
  }

  static createSingle() {
    writer.renderingPagePush(single);
  }
  static addBlockInSingle() {
    writer.renderingPageAddBlocks(single, [
      {
        parentBlockName: "BODY",
        blockName: "PRIMO-DIV",
        open: "<div id='ciao' class='come' >",
        close: "</div>",
      },
      {
        parentBlockName: "PRIMO-DIV",
        blockName: "SECONDO-DIV",
        open: "<div id='ciao-SECONDO' class='come' >",
        close: "</div>",
      },
    ]);
  }
  static includeFileInSingle() {
    writer.renderingPageIncludeRelative(single, [["BODY", "/partials/BODY"], ["PRIMO-DIV", "/partials/PRIMO-DIV"]]);
  }

  static createTemplate() {
    writer.renderingPagePush(template);
  }
  static addBlockInTemplate() {
    writer.renderingPageAddBlocks(template, [
      {
        parentBlockName: "BODY",
        blockName: "PRIMO-DIV",
        open: "<div id='ciao' class='come' >",
        close: "</div>",
      },
      {
        parentBlockName: "PRIMO-DIV",
        blockName: "SECONDO-DIV",
        open: "<div id='ciao-SECONDO' class='come' >",
        close: "</div>",
      },
    ]);
  }
  static includeFileInTemplate() {
    writer.renderingPageIncludeRelative(template, [["BODY", "/partials/BODY"], ["PRIMO-DIV", "/partials/PRIMO-DIV"]]);
  }

  static deleteEntity( entity: Single | Template | PostType | WidgetArea | SettingsPage | Menu ) {
    //entity.writer.delete();
  }

  static readTheme() {
    this.log("Reading template");
    console.log(reader.getPostTypes());
    console.log(reader.getSettingsPages());
    console.log(reader.getWidgetAreas());
    console.log(reader.getMenus());
    console.log(reader.getSingles());
    console.log(reader.getTemplates());
  }
}

export { TestTheme };
