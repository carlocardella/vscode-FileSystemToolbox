import { writeClipboard, getDocumentUri, log } from "./shared";
import * as path from 'path';
import { workspace } from "vscode";

/**
 * Returns the path of the folder containing the active file
 * @param {boolean} relativeToWorkspace Returns the path relative to the current workspace
 * @export
 * @return {*}  {(string | undefined)}
 */
export function getFolderPath(relativeToWorkspace: boolean): string | undefined {
    const filePath = getDocumentUri()?.fsPath;
    if (!filePath) {
        log("No active editor found");
        return;
    }

    let folderPath = relativeToWorkspace ?
        workspace.asRelativePath(filePath) : // @fix: if there is no workspace, this line returns the file path
        path.dirname(filePath);

    return folderPath;
}

/**
 * Copies to the clipboard the path of the folder containing the active file
 * @export
 * @param {boolean} relativeToWorkspace Copies the path relative to the current workspace
 * @return {*} 
 */
export async function copyFolderPath(relativeToWorkspace: boolean) {
    let folderPath = getFolderPath(relativeToWorkspace);
    if (!folderPath) { return; }

    await writeClipboard(folderPath);
}

/**
 * Returns the name of the folder containing the active file
 * @export
 * @return {*}  {(string | undefined)}
 */
export function getFolderName(): string | undefined {
    const folderPath = getFolderPath(false);
    if (!folderPath) { return; }

    return path.parse(folderPath).base;
}