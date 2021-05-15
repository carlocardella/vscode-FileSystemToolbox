import { getDocumentUri, writeClipboard, getLineNumber, log, getLineNumberOrRange } from './shared';
import * as path from 'path';
import { workspace } from 'vscode';

/**
 * Copies the path of the file open in the current editor to the clipboard
 * @export
 * @param {boolean} appendFileNumber Optionally copies the file path with the active line number
 * @return {*} 
 */
export function copyFilePath(appendFileNumber: boolean) {
    var filePath = getDocumentUri()?.fsPath;
    if (!filePath) {
        log("No active file found");
        return;
    }

    if (appendFileNumber) {
        const lineNumber = getLineNumber();
        if (!lineNumber) {
            log("No active line number found");
            return;
        }

        filePath = filePath + ":" + lineNumber.toString();
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
    const filePath = getDocumentUri()?.fsPath;
    if (!filePath) {
        log("No active file found");
        return;
    }

    var fileName = path.parse(filePath).base;

    if (appendFileNumber) {
        // const lineNumber = getLineNumber();
        // if (!lineNumber) {
        //     log("No active line number found");
        //     return;
        // }

        let lineNumber: string = await getLineNumberOrRange();
        // fileName = fileName + ":" + lineNumber.toString();
        fileName = fileName + ":" + lineNumber;
    }

    writeClipboard(fileName);
}

/**
 * Copy the name of the file open in the current editor, without extension
 * @export
 * @return {*} 
 */
export function copyFileNameWithoutExtension() {
    const filePath = getDocumentUri()?.fsPath;
    if (!filePath) {
        log("No active file found");
        return;
    }

    const fileName = path.parse(filePath).name;
    writeClipboard(fileName);
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
        const lineNumber = getLineNumber();
        if (!lineNumber) {
            log("No active line number found");
            return;
        }

        relativeFilePath = relativeFilePath + ":" + lineNumber;
    }

    writeClipboard(relativeFilePath);
}