export class ConstWordpressMenuSubPage {

  static IdentifierParentMenuSlug = "MENU-SLUG";
  static IdentifierSlug = "SUB-PAGE-SLUG";
  static IdentifierName = "MENU-SUB-PAGE";
  static IdentifierNameToDisplay = "MENU-SUB-PAGE-DISPLAY";
  static IdentifierBrowserTitle = "MENU-SUB-PAGE-BROWSER-TITLE";
  static File = "-SUB-PAGE.php";
  static Content = `<?php
/* Add Sub-menu Page */
function render_file_[WTM-PLACEHOLDER-MENU-SUB-PAGE](){
    /* DEFAULT PLACEHOLDER FILE [WTM-IMPORT-FILE] */
}
function add_sub_page_[WTM-PLACEHOLDER-MENU-SUB-PAGE](){
    /* add_submenu_page(parent-slug, page-title-in-browser, page-name-in-menu, page-capability, page-slug, function-for-populate); */
    add_submenu_page('[WTM-PLACEHOLDER-MENU-SLUG]', '[WTM-PLACEHOLDER-MENU-SUB-PAGE-BROWSER-TITLE]', '[WTM-PLACEHOLDER-MENU-SUB-PAGE-DISPLAY]', 'manage_options', '[WTM-PLACEHOLDER-SUB-PAGE-SLUG]', 'render_file_[WTM-PLACEHOLDER-MENU-SUB-PAGE]');
}
add_action('admin_menu','add_sub_page_[WTM-PLACEHOLDER-MENU-SUB-PAGE]');`;
}
