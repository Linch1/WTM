"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileManager = void 0;
var fs = __importStar(require("fs"));
var FileManager = /** @class */ (function () {
    function FileManager() {
    }
    // @desc: recursively get the passed folder tree
    FileManager.readFolderTree = function (path, excludedFolders) {
        if (excludedFolders === void 0) { excludedFolders = []; }
        var folderDirectories = this.getDirectories(path); // read the directories
        var folderTree = []; // init the folder Tree
        var folderFiles = this.getFiles(path);
        folderTree.push.apply(folderTree, folderFiles);
        for (var _i = 0, folderDirectories_1 = folderDirectories; _i < folderDirectories_1.length; _i++) {
            var folder = folderDirectories_1[_i];
            var folder_name = folder;
            folder = path.endsWith("/") ? "" + path + folder : path + "/" + folder; // get the full folder path
            var treeLevel = []; // init the folder level
            var subLevels = [];
            if (!excludedFolders.includes(folder_name)) { // if the folder is not excluded 
                subLevels = this.readFolderTree(folder); // get the folder subLevels
            }
            treeLevel.push(folder); // push the folder name ( always the first elem of the array is the folder name )
            treeLevel.push(subLevels); // push the sublevels
            folderTree.push(treeLevel); // push the current level tree to the main tree
        }
        return folderTree;
    };
    // @desc: print the tree got from the this.readFolderTree method
    FileManager.printFolderTree = function (folderTree, level) {
        if (level === void 0) { level = 0; }
        var print_spaces = level - 1 > 0 ? level - 1 : 0;
        var indent_string = "|" + "    |".repeat(print_spaces) + "---";
        for (var _i = 0, folderTree_1 = folderTree; _i < folderTree_1.length; _i++) {
            var folderOrFile = folderTree_1[_i];
            if (typeof folderOrFile == "object")
                this.printFolderTree(folderOrFile, level + 1);
            else
                console.log(indent_string + " " + folderOrFile);
        }
    };
    FileManager.readFile = function (path) {
        return fs.readFileSync(path, "utf-8");
    };
    FileManager.writeFile = function (path, content) {
        fs.writeFileSync(path, content, "utf8");
    };
    FileManager.appendFile = function (path, content) {
        if (!this.existsFile(path))
            return;
        fs.appendFileSync(path, content, "utf8");
    };
    FileManager.moveFile = function (old_path, new_path) {
        fs.renameSync(old_path, new_path);
    };
    FileManager.existsFile = function (path) {
        return fs.existsSync(path);
    };
    FileManager.getFiles = function (path) {
        return fs
            .readdirSync(path, { withFileTypes: true })
            .filter(function (dirent) { return dirent.isFile(); })
            .map(function (dirent) { return dirent.name; });
    };
    FileManager.getDirectories = function (path) {
        return fs
            .readdirSync(path, { withFileTypes: true })
            .filter(function (dirent) { return dirent.isDirectory(); })
            .map(function (dirent) { return dirent.name; });
    };
    FileManager.getFirstLevelFilesAndFolders = function (path) {
        return fs.readdirSync(path, { withFileTypes: true }).map(function (dirent) { return dirent.name; });
    };
    FileManager.createFile = function (path, content) {
        if (!fs.existsSync(path)) {
            this.writeFile(path, content);
        }
    };
    FileManager.createDirectory = function (path) {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
    };
    FileManager.removeFile = function (path) {
        fs.unlinkSync(path);
    };
    FileManager.deleteFolderRecursive = function (path) {
        var _this = this;
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach(function (file, index) {
                var curPath = path + "/" + file;
                if (fs.lstatSync(curPath).isDirectory()) {
                    // recurse
                    _this.deleteFolderRecursive(curPath);
                }
                else {
                    // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    };
    return FileManager;
}());
exports.FileManager = FileManager;
