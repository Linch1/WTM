import { customPartPath } from "../custom-theme-parts/enums/enums";
import { Menu } from "../custom-theme-parts/menus/Menu";
import { MenuMainPage } from "../custom-theme-parts/menus/MenuMainPage";
import { MenuSubPage } from "../custom-theme-parts/menus/MenuSubPage";
import {
  menuMainPageParams,
  menuSubPageParams,
} from "../custom-theme-parts/menus/types/types";
import { PostType } from "../custom-theme-parts/postTypes/PostType";
import { postTypeParams } from "../custom-theme-parts/postTypes/types/types";
import { SettingsPage } from "../custom-theme-parts/settingsPages/SettingsPage";
import { settingsPageParams } from "../custom-theme-parts/settingsPages/types/types";
import { widgetAreaParams } from "../custom-theme-parts/widgetAreas/types/types";
import { WidgetArea } from "../custom-theme-parts/widgetAreas/WidgetArea";
import { FileReader } from "../files/FileReader";
import { StringComposeWriter } from "../files/StringComposeWriter";
import { pagePath } from "./theme-rendering/enums/enums";
import { Single } from "./theme-rendering/Single";
import { Template } from "./theme-rendering/Template";
import { informationsJson } from "./theme-rendering/types/types";
import { ThemeAux } from "./ThemeAux";
import { functionsJson, importsJson } from "./types/types";

/**
 * This class is used to perform the read actions on the Theme
 * Like reading a custom post type or a page or other things like that
 */
class ThemeReader {
  public JSON_PREFIX = "WTM-";

  constructor(public themeAux: ThemeAux) {}

  public getWidgets() {}
  public getWidget(name: string) {}

  public getPostTypes(): PostType[] {
    let elements: PostType[] = [];
    let path = this.themeAux.getInsideWTMPath(customPartPath.POST_TYPE);
    let files = FileReader.getFiles(path);
    for (let file of files) {
      let json: postTypeParams = JSON.parse(
        FileReader.readFile(StringComposeWriter.concatenatePaths(path, file))
      );
      elements.push(this.themeAux.composer.buildPostType(json));
    }
    return elements;
  }
  public getPostType(name: string): PostType | null {
    for (let elem of this.getPostTypes()) {
      if (elem.getInformations.postTypeName == name) return elem;
    }
    return null;
  }
  public getSettingsPages(): SettingsPage[] {
    let elements: SettingsPage[] = [];
    let path = this.themeAux.getInsideWTMPath(customPartPath.SETTINGS_PAGE);
    let files = FileReader.getFiles(path);
    for (let file of files) {
      let json: settingsPageParams = JSON.parse(
        FileReader.readFile(StringComposeWriter.concatenatePaths(path, file))
      );
      elements.push(this.themeAux.composer.buildSettingsPage(json));
    }
    return elements;
  }
  public getSettingsPage(name: string): SettingsPage | null {
    for (let elem of this.getSettingsPages()) {
      if (elem.getInformations.pageName == name) return elem;
    }
    return null;
  }

  public getWidgetAreas(): WidgetArea[] {
    let elements: WidgetArea[] = [];
    let path = this.themeAux.getInsideWTMPath(customPartPath.WIDGET_AREA);
    let files = FileReader.getFiles(path);
    for (let file of files) {
      let json: widgetAreaParams = JSON.parse(
        FileReader.readFile(StringComposeWriter.concatenatePaths(path, file))
      );
      elements.push(this.themeAux.composer.buildWidgetArea(json));
    }
    return elements;
  }
  public getWidgetArea(name: string): WidgetArea | null {
    for (let elem of this.getWidgetAreas()) {
      if (elem.getInformations.widgetAreaName == name) return elem;
    }
    return null;
  }
  public getMenus(): Menu[] {
    let elements: Menu[] = [];
    let path = this.themeAux.getInsideWTMPath(customPartPath.MENU);
    let files = FileReader.getFiles(path);
    for (let file of files) {
      let json: {
        [key: string]: menuMainPageParams | menuSubPageParams;
      } = JSON.parse(
        FileReader.readFile(StringComposeWriter.concatenatePaths(path, file))
      );
      let mainPage: MenuMainPage | null = null;
      let subPages: MenuSubPage[] = [];
      for (let key in json) {
        let currentParams = json[key];
        if ("menuName" in currentParams) {
          mainPage = this.themeAux.composer.buildMenuMainPage(currentParams);
        } else if ("pageName" in currentParams) {
          subPages.push(this.themeAux.composer.buildMenuSubPage(currentParams));
        }
      }
      if (mainPage)
        elements.push(this.themeAux.composer.buildMenu(mainPage, subPages));
    }
    return elements;
  }
  public getMenu(name: string): Menu | null {
    for (let elem of this.getMenus()) {
      if (elem.MENU_NAME == name) return elem;
    }
    return null;
  }

  public getSingles(): Single[] {
    let elements: Single[] = [];
    let path = this.themeAux.getInsideWTMPath(pagePath.POST);
    let files = FileReader.getFiles(path);
    for (let file of files) {
      let json: informationsJson = JSON.parse(
        FileReader.readFile(StringComposeWriter.concatenatePaths(path, file))
      );
      let single = this.themeAux.composer.buildSingle(json.name);
      single.JSON_INFORMATIONS = json;
      elements.push(single);
    }
    return elements;
  }
  public getSingle(name: string): Single | null {
    for (let elem of this.getSingles()) {
      if (elem.PAGE_NAME == name) return elem;
    }
    return null;
  }
  public getTemplates(): Template[] {
    let elements: Template[] = [];
    let path = this.themeAux.getInsideWTMPath(pagePath.PAGE);
    let files = FileReader.getFiles(path);
    for (let file of files) {
      let json: informationsJson = JSON.parse(
        FileReader.readFile(StringComposeWriter.concatenatePaths(path, file))
      );
      let template = this.themeAux.composer.buildTemplate(json.name);
      template.JSON_INFORMATIONS = json;
      elements.push(template);
    }
    return elements;
  }
  public getTemplate(name: string): Template | null {
    for (let elem of this.getTemplates()) {
      if (elem.PAGE_NAME == name) return elem;
    }
    return null;
  }
  public getFunctionsJson(): functionsJson {
    return JSON.parse(FileReader.readFile(this.themeAux.JSON_FUNCTIONS_PATH));
  }
  public getImportsJson(): importsJson {
    return JSON.parse(FileReader.readFile(this.themeAux.JSON_IMPORTS_PATH));
  }
}

export { ThemeReader };
