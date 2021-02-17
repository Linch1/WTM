export class ConstWordpressWidgetArea{

    static IdentifierName = "WIDGET-AREA";
    static File = "-WIDGET-AREA.php";
    static Content = `<?php
/**
 * Register ourcustom widgetized area.
 *
 */
function [WTM-PLACEHOLDER-WIDGET-AREA]_widgets_init() {

    register_sidebar( array(
        'name'          => '[WTM-PLACEHOLDER-WIDGET-AREA]', /* Widget Name */
        'id'            => '[WTM-PLACEHOLDER-WIDGET-AREA]-area', /* Widget id to call to embend it */
        'before_widget' => '<div class="col-md-4">', /* Before placeing a contained widget */
        'after_widget'  => '</div>', /* After placing a contained widget */
        'before_title'  => '<h4 class="rounded">', /* Before a contained widget Title */
        'after_title'   => '</h4>', /* After a contained widget Title */
    ) );

}
add_action( 'widgets_init', '[WTM-PLACEHOLDER-WIDGET-AREA]_widgets_init' );`;

}