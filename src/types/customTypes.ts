import { StringComposeWriter } from "../files/StringComposeWriter";

type nestedStringsArrays = string | string[] | nestedStringsArrays[];

type settingsPageParams = {
  pageName: string;
  pageDisplayedName: string;
  pageBrowserTitle: string;
  skipIfExists?: boolean;
};
type postTypeParams = {
  postTypeName: string;
  postTypeDisplayName: string;
  postTypeNameSingular: string;
  skipIfExists?: boolean;
};
type widgetAreaParams = {
  widgetAreaName: string;
};

export { widgetAreaParams, postTypeParams, nestedStringsArrays, settingsPageParams };
