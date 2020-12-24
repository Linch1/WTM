

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
import { Single } from "./theme-rendering/Single";
import { Template } from "./theme-rendering/Template";
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
    return new PostType(this.themeAux, params);
  }

  /**
   * @description build a WidgetArea object and after returns it
   * @param params an object following the type widgetAreaParams [ the widgetAreaName should be also a valid function name. ]
   *
   */
  public buildWidgetArea(params: widgetAreaParams): WidgetArea {
    return new WidgetArea(this.themeAux, params);
  }

  /**
   * @description build a settingsPage object and after returns it
   * @param params an object following the type settingsPageParams [ the pageName should be also a valid function name. ]
   */
  public buildSettingsPage(params: settingsPageParams): SettingsPage { 
    return new SettingsPage(this.themeAux, params);
  }

  /**
   * @param params [ the menuName should be also a valid function name. ]
   */
  public buildMenuMainPage(params: menuMainPageParams): MenuMainPage{
    return new MenuMainPage(this.themeAux, params);
  }

  /**
   * @param params [ the pageName should be also a valid function name. ]
   */
  public buildMenuSubPage(params: menuSubPageParams): MenuSubPage{
    return new MenuSubPage(this.themeAux, params);
  }

  /**
   * @description
   * @param mainPage the menu mainPage [ the menuName should be also a valid function name. ]
   * @param subPages the menu subpages [ the pageName should be also a valid function name. ]
   */
  public buildMenu(mainPage: MenuMainPage, subPages: MenuSubPage[]): Menu{
    return new Menu(this.themeAux, mainPage, subPages);
  }

  /**
   * @description
   * @param name the name of the post 
   * - [ for bind it to a _post type_ pass as `name -> the_post_type_name` ]
   */
  public buildSingle(name: string): Single{
    return new Single(this.themeAux, name);
  }

  /**
   * @description
   * @param name the name of the template 
   */
  public buildTemplate(name: string): Template{
    return new Template(this.themeAux, name);
  }
}

export { ThemeComposer };
