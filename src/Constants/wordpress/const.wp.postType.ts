export class ConstWordpressPostType {
    
    static IdentifierName = "POST-TYPES";
    static IdentifierNameSingular = "POST-TYPES-DISPLAYED-NAME";
    static IdentifierNameToDisplay = "POST-TYPES-DISPLAYED-NAME";
    static File = "-POST-TYPE.php";
    static Content = `<?php
// Our POST post type function
function create_[WTM-PLACEHOLDER-POST-TYPES]() {
    // Add thumbnail support
    add_post_type_support( '[WTM-PLACEHOLDER-POST-TYPES]', 'thumbnail' ); /* add featured image capabilites */
    register_post_type( '[WTM-PLACEHOLDER-POST-TYPES]',
        array(
            'labels' => array(
                'name' => __( '[WTM-PLACEHOLDER-POST-TYPES-DISPLAYED-NAME]' ),
                'singular_name' => __( '[WTM-PLACEHOLDER-POST-TYPES-SINGULAR-NAME]' ),
                'supports' => array( 'thumbnail' ),
                'hierarchical' => false
            ),
            'description' => "default description",
            'exclude_from_search' => false,
            'public' => true,
            'has_archive' => true,
            'rewrite' => array('slug' => '[WTM-PLACEHOLDER-POST-TYPES]'),
            'show_in_rest' => true,
            'taxonomies' => array('category', 'post_tag') /* add tags capabilites */
        )
    );

}
// function for add tags to POST post type
function reg_tag_[WTM-PLACEHOLDER-POST-TYPES]() {
        register_taxonomy_for_object_type('post_tag', '[WTM-PLACEHOLDER-POST-TYPES-SINGULAR-NAME]');
}
// Hooking up our function to theme setup
add_action( 'init', 'create_[WTM-PLACEHOLDER-POST-TYPES]' );
add_action('init', 'reg_tag_[WTM-PLACEHOLDER-POST-TYPES]');`;
  }
  