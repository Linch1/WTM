

import { ThemeAux } from "./ThemeAux";

import { PostType } from "../custom-theme-parts/postTypes/PostType";
import { WidgetArea } from "../custom-theme-parts/widgetAreas/WidgetArea";
import { SettingsPage } from "../custom-theme-parts/settingsPages/SettingsPage";
import { MenuMainPage } from "../custom-theme-parts/menus/MenuMainPage";
import { MenuSubPage } from "../custom-theme-parts/menus/MenuSubPage";
import { Menu } from "../custom-theme-parts/menus/Menu";
import { postTypeParams } from "../custom-theme-parts/postTypes/types/types";
import { widgetAreaParams } from "../custom-theme-parts/widgetAreas/types/types";
import { settingsPageParams } from "../custom-theme-parts/settingsPages/types/types";
import { menuMainPageParams, menuSubPageParams } from "../custom-theme-parts/menus/types/types";
/**
 * This class is used to build objects like a custom post type ( PostType )
 * or a widgetArea and other relative to the Theme
 */
class ThemeComposer {
  constructor(public themeAux: ThemeAux) {}

  /**
   * @description build a PostType object and after returns it
   * @param params an object following the type postTypeParams [ the postTypeName should be also a valid function name. ]
   */
  public buildPostType(params: postTypeParams): PostType {
    let postType = new PostType(this.themeAux, params);
    return postType;
  }

  /**
   * @description build a WidgetArea object and after returns it
   * @param params an object following the type widgetAreaParams [ the widgetAreaName should be also a valid function name. ]
   *
   */
  public buildWidgetArea(params: widgetAreaParams): WidgetArea {
    let widgetArea = new WidgetArea(this.themeAux, params);
    return widgetArea;
  }

  /**
   * @description build a settingsPage object and after returns it
   * @param params an object following the type settingsPageParams [ the pageName should be also a valid function name. ]
   */
  public buildSettingsPage(params: settingsPageParams): SettingsPage {
    let settingsPage = new SettingsPage(this.themeAux, params);
    return settingsPage;
  }

  /**
   * @param params [ the menuName should be also a valid function name. ]
   */
  public buildMenuMainPage(params: menuMainPageParams): MenuMainPage{
    let mainPage = new MenuMainPage(this.themeAux, params);
    return mainPage;
  }

  /**
   * @param params [ the pageName should be also a valid function name. ]
   */
  public buildMenuSubPage(params: menuSubPageParams): MenuSubPage{
    let subPage = new MenuSubPage(this.themeAux, params);
    return subPage;
  }

  public buildMenu(mainPage: MenuMainPage, subPages: MenuSubPage[]): Menu{
    let menu = new Menu(this.themeAux, mainPage, subPages);
    return menu;
  }
}

export { ThemeComposer };
