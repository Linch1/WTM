export class ConstWordpressMenuMainPage {
    static IdentifierSlug = "MENU-SLUG";
    static IdentifierName = "MENU-MAIN-PAGE";
    static IdentifierNameToDisplay = "MENU-MAIN-PAGE-DISPLAY";
    static IdentifierBrowserTitle = "MENU-MAIN-PAGE-BROWSER-TITLE";
    static File = "-MAIN-PAGE.php";
    static Content = `<?php
/* Add custom menu */
function render_file_[WTM-PLACEHOLDER-MENU-MAIN-PAGE](){
    /* DEFAULT PLACEHOLDER FILE [WTM-IMPORT-FILE] */
}
function add_theme_menu_[WTM-PLACEHOLDER-MENU-MAIN-PAGE](){
    /* add_menu_page(page-title-in-browser, page-title-in-menu, capability, menu_slug, function-for-populate, icon_path, menu-position ); */
    add_menu_page('[WTM-PLACEHOLDER-MENU-MAIN-PAGE-BROWSER-TITLE]', '[WTM-PLACEHOLDER-MENU-MAIN-PAGE-DISPLAY]', 'manage_options', '[WTM-PLACEHOLDER-MENU-SLUG]', 'render_file_[WTM-PLACEHOLDER-MENU-MAIN-PAGE]', plugins_url('/img/icon.png',__DIR__), 1);
}
add_action('admin_menu','add_theme_menu_[WTM-PLACEHOLDER-MENU-MAIN-PAGE]'); 
    `;

}