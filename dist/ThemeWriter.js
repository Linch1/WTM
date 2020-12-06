"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeWriter = void 0;
var Theme_1 = require("./Theme");
var ThemeReader_1 = require("./ThemeReader");
var ThemeWriter = /** @class */ (function (_super) {
    __extends(ThemeWriter, _super);
    function ThemeWriter(ThemeFolder) {
        var _this = _super.call(this, ThemeFolder) || this;
        _this.ThemeFolder = ThemeFolder;
        _this.IMPORT_STYLES_FUNCTION_NAME = "add_css_";
        _this.IMPORT_FONTS_FUNCTION_NAME = "add_fonts";
        _this.IMPORT_SCRIPTS_FUNCTION_NAME = "add_scripts";
        _this.IMPORT_FILE_PATH = "assets/functions/first-setup.php";
        _this.reader = new ThemeReader_1.ThemeReader(ThemeFolder);
        return _this;
    }
    ThemeWriter.prototype.getThemePath = function (location) {
        return this.ThemeFolder.endsWith("/") ? this.ThemeFolder + location : this.ThemeFolder + "/" + location;
    };
    // import the style based on
    // stylePath ( inside the theme relatively to the theme main directory: myThemeContainerDir/path/to/style),
    // this.IMPORT_STYLES_FUNCTION_NAME,
    // this.IMPORT_FILE_PATH,
    ThemeWriter.prototype.importStyle = function (stylePath) {
        var fileContent = this.reader.readFunctionBody(this.getThemePath(this.IMPORT_FILE_PATH), this.IMPORT_STYLES_FUNCTION_NAME); // get the import file content
        var functionBody = fileContent.functionBody; // get the function body to edit
        var importString = this.enqueueStyleFunction(stylePath); // get the wp syntax for import the style
        functionBody = functionBody.endsWith(";") ? functionBody + "\n" + importString : functionBody + ";\n" + importString; // add the file importation
        this.editFileFunction(fileContent, functionBody); // edit the file
    };
    ThemeWriter.prototype.enqueueStyleFunction = function (fileToImport) {
        fileToImport = fileToImport.startsWith("/") ? fileToImport : "/" + fileToImport;
        return "wp_enqueue_style( '" + fileToImport.replace("/", "-") + "', get_template_directory_uri() . \"" + fileToImport + "\", false, '0.0.1', 'all');";
    };
    ThemeWriter.prototype.importScript = function (scriptPath) {
        // se è della lib va importato nel file di setup.php
        // se e dei partials va importato nel file di setup.php
    };
    ThemeWriter.prototype.importFont = function (fontUrl) {
        // Google Fonts are imported as the css files
        this.importStyle(fontUrl);
    };
    ThemeWriter.prototype.editFileFunction = function (fileContent, newFunctionBody) {
        var functions = fileContent.functionsArray;
        var functionIndex = fileContent.functionIndex;
        fileContent.targetFunctionCloseSplit[0] = newFunctionBody;
        fileContent.targetFunctionOpenSplit[1] = fileContent.targetFunctionCloseSplit.join("}");
        functions[functionIndex] = fileContent.targetFunctionOpenSplit.join("{");
        console.log(functions.join("\nfunction "));
    };
    return ThemeWriter;
}(Theme_1.Theme));
exports.ThemeWriter = ThemeWriter;
