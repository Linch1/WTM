enum customPartType {
  NONE = "NONE",
  WIDGET_AREA = "WIDGET-AREA",
  POST_TYPE = "POST-TYPES",
  MENU = "MENU",
  SETTINGS_PAGE = "SETTINGS-PAGE",
  WIDGET = "WIDGETS",
}
enum customPartPath {
  NONE = "NONE",
  WIDGET_AREA = "custom-widget-areas/",
  POST_TYPE = "custom-post-types/",
  MENU = "custom-menu/",
  SETTINGS_PAGE = "custom-settings-page/",
  WIDGET = "",
}

export { customPartType, customPartPath };
