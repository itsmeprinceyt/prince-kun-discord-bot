"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const srcPath = (0, path_1.resolve)("src/public");
const destPath = (0, path_1.resolve)("dist/src/public");
console.log(`[ DEBUG ] Source Path: ${srcPath}`);
console.log(`[ DEBUG ] Destination Path: ${destPath}`);
if (!(0, fs_extra_1.existsSync)(srcPath)) {
    console.error("[ ERROR ] Source folder does not exist!");
    process.exit(1);
}
try {
    (0, fs_extra_1.copySync)(srcPath, destPath);
    console.log("[ SUCCESS ] Public folder copied successfully.");
}
catch (error) {
    console.error("[ ERROR ] Failed to copy public folder:", error);
}
