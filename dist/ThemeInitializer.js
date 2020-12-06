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
exports.ThemeInitializer = void 0;
var Theme_1 = require("./Theme");
var ThemeInitializer = /** @class */ (function (_super) {
    __extends(ThemeInitializer, _super);
    function ThemeInitializer(ThemeFolder) {
        var _this = _super.call(this, ThemeFolder) || this;
        _this.ThemeFolder = ThemeFolder;
        return _this;
    }
    return ThemeInitializer;
}(Theme_1.Theme));
exports.ThemeInitializer = ThemeInitializer;
