"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ThemeReader_1 = require("./ThemeReader");
var ThemeWriter_1 = require("./ThemeWriter");
var themePath = "/var/www/html/wordpress/wp-content/themes/GUDesign";
var reader = new ThemeReader_1.ThemeReader(themePath);
var writer = new ThemeWriter_1.ThemeWriter(themePath);
var content = reader.readFunctionBody("/var/www/html/wordpress/wp-content/themes/GUDesign/assets/functions/first-setup.php", "add_custom_js");
writer.importStyle("/partials/header/style.css");
