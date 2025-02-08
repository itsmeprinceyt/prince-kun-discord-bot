import { copySync, existsSync } from "fs-extra";
import { resolve } from "path";

const srcPath = resolve("src/public");
const destPath = resolve("dist/src/public");

console.log(`[ DEBUG ] Source Path: ${srcPath}`);
console.log(`[ DEBUG ] Destination Path: ${destPath}`);

if (!existsSync(srcPath)) {
    console.error("[ ERROR ] Source folder does not exist!");
    process.exit(1);
}

try {
    copySync(srcPath, destPath);
    console.log("[ SUCCESS ] Public folder copied successfully.");
} catch (error) {
    console.error("[ ERROR ] Failed to copy public folder:", error);
}
