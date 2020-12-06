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
exports.ThemeReader = void 0;
var FileManager_1 = require("./FileManager");
var Theme_1 = require("./Theme");
var ThemeReader = /** @class */ (function (_super) {
    __extends(ThemeReader, _super);
    function ThemeReader(ThemeFolder) {
        var _this = _super.call(this, ThemeFolder) || this;
        _this.ThemeFolder = ThemeFolder;
        _this.NoFunctionFoundErr = "NO FUNCTION FOUND: no function was found with the given name";
        return _this;
    }
    ThemeReader.prototype.readFile = function (filePath) {
        return FileManager_1.FileManager.readFile(filePath);
    };
    ThemeReader.prototype.readFunctionBody = function (filePath, functionName) {
        var fileText = FileManager_1.FileManager.readFile(filePath);
        var functions = fileText.split("function"); // get all the texts between the function words
        var functionBody = "";
        for (var i = 0; i < functions.length; i++) {
            var func = functions[i].trim();
            if (!func.startsWith(functionName))
                continue; // check that is the correct function and if not skip
            var functionBodyOpenSplit = func.split("{");
            // the index 0 contains name_function(), the index 1 is the start of the function body
            var functionBodyCloseSplit = functionBodyOpenSplit[1].split("}");
            functionBody = functionBodyCloseSplit[0].trim(); // delimit the end of the function definition
            // return all this vars for let easier and faster the function changes in ThemeWriter
            return {
                functionsArray: functions,
                functionIndex: i,
                targetFunctionOpenSplit: functionBodyOpenSplit,
                targetFunctionCloseSplit: functionBodyCloseSplit,
                functionBody: functionBody
            };
        }
        throw new Error(this.NoFunctionFoundErr);
    };
    return ThemeReader;
}(Theme_1.Theme));
exports.ThemeReader = ThemeReader;
