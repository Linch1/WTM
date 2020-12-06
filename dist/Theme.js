"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Theme = void 0;
var FileManager_1 = require("./FileManager");
var Theme = /** @class */ (function () {
    function Theme(ThemeFolder) {
        this.ThemeFolder = ThemeFolder;
        this.themeStructure = [];
        this.themeStructure = FileManager_1.FileManager.readFolderTree(ThemeFolder);
    }
    return Theme;
}());
exports.Theme = Theme;
