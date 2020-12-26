import { ThemeAux } from "../ManageTheme/ThemeAux";
import { ThemeReader } from "../ManageTheme/ThemeReader";
import { ThemeWriter } from "../ManageTheme/ThemeWriter";
import { ThemeComposer } from "../ManageTheme/ThemeComposer";
import { Single } from "../Entities/rendering/Single";
import { Template } from "../Entities/rendering/Template";

import { PostType } from "../Entities/wp/postTypes/PostType";
import { WidgetArea } from "../Entities/wp/widgetAreas/WidgetArea";
import { SettingsPage } from "../Entities/wp/settingsPages/SettingsPage";
import { MenuMainPage } from "../Entities/wp/menus/MenuMainPage";
import { MenuSubPage } from "../Entities/wp/menus/MenuSubPage";
import { Menu } from "../Entities/wp/menus/Menu";

let themePath: string = "/home/pero/Scrivania/blankslate1";
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
  static createThemePostType() {
    let postType: PostType = composer.buildPostType({
      postTypeName: "images",
      postTypeDisplayName: "Images edu",
      postTypeNameSingular: "image",
      skipIfExists: true
    });
    writer.pushPostType(postType);
    this.log("created post type");
  }

  static createThemeWidgetArea() {
    let widgetArea: WidgetArea = composer.buildWidgetArea({
      widgetAreaName: "widgetArea",
      skipIfExists: true
    });
    writer.pushWidgetArea(widgetArea);
    this.log("created widget area");
  }

  static createThemeSettingsPage() {
    let settingsPage: SettingsPage = composer.buildSettingsPage({
      pageName: "settings_page",
      pageDisplayedName: "displayed name",
      pageBrowserTitle: "browser title",
      skipIfExists: true
    });
    writer.pushSettingsPage(settingsPage);
    this.log("created settings page");
  }

  static createThemeMenu(): Menu {
    let mainPage: MenuMainPage = composer.buildMenuMainPage({
      menuName: "menuName",
      menuDisplayedName: "displayed menu name",
      pageBrowserTitle: "browser title",
      skipIfExists: true
    });

    let subPageOne: MenuSubPage = composer.buildMenuSubPage({
      pageName: "pageNameOne",
      pageNameDisplayed: "Page One",
      pageBrowserTitle: "browser title one",
      skipIfExists: true
    });
    let subPageTwo: MenuSubPage = composer.buildMenuSubPage({
      pageName: "pageNameTwo",
      pageNameDisplayed: "Page Two",
      pageBrowserTitle: "browser title two",
      skipIfExists: true
    });

    let menu = composer.buildMenu(mainPage, [subPageOne, subPageTwo]);
    writer.pushMenu(menu);
    this.log("created menu");

    return menu;
  }

  static createSingle(){
    single.create();
  }
  static includeFileInSingle(){
    single.includeRelative("BODY", "/partials/ciao")
  }
  static addBlockInSingle(){
    single.addBlock("BODY", "PRIMO-DIV", "<div id='ciao' class='come' >", "</div>");
    single.addBlock("PRIMO-DIV", "SECONDO-DIV", "<div id='ciao-SECONDO' class='come' >", "</div>");
  }

  static createTemplate(){
    template.create();
  }
  static includeFileInTemplate(){
    template.includeRelative("BODY", "/partials/ciao")
  }
  static addBlockInTemplate(){
    template.addBlock("BODY", "PRIMO-DIV", "<div id='ciao' class='come' >", "</div>");
  }

  static readTheme(){
    this.log("Reading template")
    console.log(reader.getPostTypes());
    console.log(reader.getSettingsPages());
    console.log(reader.getWidgetAreas());
    console.log(reader.getMenus());
    console.log(reader.getSingles());
    console.log(reader.getTemplates());
  }
}

export { TestTheme };
