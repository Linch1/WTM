export class ConstWordpressSettingsPage{

    static IdentifierSlug = "SETTINGS-PAGE-SLUG";
    static IdentifierName = "SETTINGS-PAGE";
    static IdentifierNameToDisplay = "SETTINGS-PAGE-DISPLAY";
    static IdentifierBrowserTitle = "SETTINGS-PAGE-BROWSER-TITLE";
    static File = "-SETTINGS-PAGE.php";
    static Content = `<?php 
function render_file_[WTM-PLACEHOLDER-SETTINGS-PAGE]() {
    /* DEFAULT PLACEHOLDER FILE [WTM-IMPORT-FILE] */
}
function options_page_[WTM-PLACEHOLDER-SETTINGS-PAGE]() {
    add_options_page('[WTM-PLACEHOLDER-SETTINGS-PAGE-BROWSER-TITLE]', '[WTM-PLACEHOLDER-SETTINGS-PAGE-DISPLAY]', 'manage_options', '[WTM-PLACEHOLDER-SETTINGS-PAGE-SLUG]', 'render_file_[WTM-PLACEHOLDER-SETTINGS-PAGE]');
}
add_action('admin_menu', 'options_page_[WTM-PLACEHOLDER-SETTINGS-PAGE]');`;

}