import { copyToClipboard, getDocumentUri, log } from "./shared";
import * as path from 'path';

export function copyFolderPath() {
    const filePath = getDocumentUri()?.fsPath;
    if (!filePath) {
        log("No active editor found");
        return;
    }

    const folderPath = path.dirname(filePath);
    console.log(folderPath);
    copyToClipboard(folderPath);
}