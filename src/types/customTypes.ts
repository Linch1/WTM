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
type menuMainPageParams = {
  menuName: string;
  menuDisplayedName: string;
  pageBrowserTitle: string;
  skipIfExists?: boolean;
};
type menuSubPageParams = {
  pageName: string;
  pageNameDisplayed: string;
  pageBrowserTitle: string;
  skipIfExists?: boolean;
};
type replaceAllParams = {
  [key: string]: string
}

type visualIdentifiersJson = {
  HTML: {[key: string]: string}
}

export {
  visualIdentifiersJson,
  replaceAllParams,
  menuMainPageParams,
  menuSubPageParams,
  widgetAreaParams,
  postTypeParams,
  nestedStringsArrays,
  settingsPageParams,
};
