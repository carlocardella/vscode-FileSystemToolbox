import { writeClipboard, getDocumentUri, log } from "./shared";
import * as path from 'path';
import { workspace } from "vscode";

export function copyFolderPath(relativeToWorkspace: boolean) {
    const filePath = getDocumentUri()?.fsPath;
    if (!filePath) {
        log("No active editor found");
        return;
    }

    let folderPath: string = "";
    folderPath = relativeToWorkspace ?
        workspace.asRelativePath(filePath) : // @fix: if there is no workspace, this line returns the file path
        path.dirname(filePath);

    writeClipboard(folderPath);
}