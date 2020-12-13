import { nestedStringsArrays } from "../types/customTypes";
import { FileReader } from "../files/FileReader";
import { FileWriter } from "../files/FileWriter";
import { StringComposeWriter } from "../files/StringComposeWriter";

import { Theme } from "./Theme";
import { ThemeWriter } from "./ThemeWriter";
import { ThemeReader } from "./ThemeReader"

import { PostType } from "../custom-theme-parts/PostType";
import { WidgetArea } from "../custom-theme-parts/WidgetArea";

/**
 * This class is used to build objects like a custom post type ( PostType )
 * or a widgetArea and other relative to the Theme
 */
class ThemeComposer extends Theme {

  

  constructor(public ThemeFolder: string) {
    super(ThemeFolder);
  }

  /**
   * @description build a PostType object with the given name, creates it in the theme, and after returns it
   * @param postTypeName the name of the post type
   * @param postTypeDisplayName the name of the post type displayed in the admin page
   * @param postTypeNameSingular the singular name of the post type
   */
  public buildPostType(postTypeName: string, postTypeDisplayName: string, postTypeNameSingular: string): PostType {

    let postType = new PostType(
      StringComposeWriter.concatenatePaths(this.ThemeFolder, this.ASSETS_PATH),
      postTypeName,
      postTypeDisplayName,
      postTypeNameSingular
    );

    return postType;
  }

  /**
   * @description build a WidgetArea object, creates it in the theme, and after returns it
   * @param widgetAreaName the name of the widgetArea
   * 
   */
  public buildWidgetArea(widgetAreaName: string): WidgetArea {
      
    let widgetArea = new WidgetArea(
      StringComposeWriter.concatenatePaths(this.ThemeFolder, this.ASSETS_PATH),
      widgetAreaName
    );

    return widgetArea;
  }

}

export { ThemeComposer };
