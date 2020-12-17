import {
  postTypeParams,
  widgetAreaParams,
  settingsPageParams,
} from "../types/customTypes";
import { FileReader } from "../files/FileReader";
import { FileWriter } from "../files/FileWriter";
import { StringComposeWriter } from "../files/StringComposeWriter";

import { Theme } from "./Theme";
import { ThemeWriter } from "./ThemeWriter";
import { ThemeReader } from "./ThemeReader";
import { ThemeAux } from "./ThemeAux";

import { PostType } from "../custom-theme-parts/postTypes/PostType";
import { WidgetArea } from "../custom-theme-parts/widgetAreas/WidgetArea";
import { SettingsPage } from "../custom-theme-parts/settingsPages/SettingsPage";

/**
 * This class is used to build objects like a custom post type ( PostType )
 * or a widgetArea and other relative to the Theme
 */
class ThemeComposer {
  constructor(public themeAux: ThemeAux) {}

  /**
   * @description build a PostType object and after returns it
   * @param params an object following the type postTypeParams
   */
  public buildPostType(params: postTypeParams): PostType {
    let postType = new PostType(this.themeAux, params);
    return postType;
  }

  /**
   * @description build a WidgetArea object and after returns it
   * @param params an object following the type widgetAreaParams
   *
   */
  public buildWidgetArea(params: widgetAreaParams): WidgetArea {
    let widgetArea = new WidgetArea(this.themeAux, params);
    return widgetArea;
  }

  /**
   * @description build a settingsPage object and after returns it
   * @param params an object following the type settingsPageParams
   */
  public buildSettingsPage(params: settingsPageParams): SettingsPage {
    let settingsPage = new SettingsPage(this.themeAux, params);
    return settingsPage;
  }
}

export { ThemeComposer };
