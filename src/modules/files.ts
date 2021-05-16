import { getDocumentUri, writeClipboard, log, getLineNumberOrRange, getFilePath, getFileName } from './shared';
import * as path from 'path';
import { workspace } from 'vscode';

/**
 * Copies the path of the file open in the current editor to the clipboard
 * @export
 * @param {boolean} appendFileNumber Optionally copies the file path with the active line number
 * @return {*} 
 */
export async function copyFilePath(appendFileNumber: boolean) {
    var filePath = getFilePath();
    if (!filePath) {
        log("No active file found");
        return;
    }

    if (appendFileNumber) {
        const lineNumberOrRange: string = await getLineNumberOrRange();
        filePath = filePath + ":" + lineNumberOrRange;
    }

    writeClipboard(filePath);
}

/**
 * Copes the name of the file open in the current editor to the clipboard
 * @export
 * @param {boolean} appendFileNumber Optionally copies the file name with the active line number
 * @return {*} 
 */
export async function copyFileName(appendFileNumber: boolean) {
    var fileName = getFileName();
    if (!fileName) { return; }

    if (appendFileNumber) {
        let lineNumberOrRange: string = await getLineNumberOrRange();
        fileName = fileName + ":" + lineNumberOrRange;
    }

    writeClipboard(fileName);
}

/**
 * Copy the name of the file open in the current editor, without extension
 * @export
 * @return {*} 
 */
export function copyFileNameWithoutExtension() {
    const fileName = getFileName();
    if (!fileName) { return; }

    writeClipboard(path.parse(fileName).name);
}

/**
 * Copy the path of the file open in the editor relative to the workspace root folder. 
 * If there is no workspace or folder open, the function returns undefined
 * @export
 * @param {boolean} appendLineNumber
 * @return {*}  {(string | undefined)}
 */
export function copyRelativeFilePath(appendLineNumber: boolean): string | undefined {
    const filePath = getDocumentUri()?.fsPath;
    if (!filePath) {
        log("No active file found");
        return;
    }

    let relativeFilePath = workspace.asRelativePath(filePath);
    if (!relativeFilePath) {
        console.log("No active workspace found");
        return;
    };

    if (appendLineNumber) {
        const lineNumber = getLineNumberOrRange();
        if (!lineNumber) {
            log("No active line number found");
            return;
        }

        relativeFilePath = relativeFilePath + ":" + lineNumber;
    }

    writeClipboard(relativeFilePath);
}