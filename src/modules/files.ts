import { getDocumentUri, writeClipboard, getLineNumber, getWorkspaceFolder, log } from './shared';
import * as path from 'path';

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

    log(filePath);
    writeClipboard(filePath);
}

export function copyFileName(appendFileNumber: boolean) {
    const filePath = getDocumentUri()?.fsPath;
    if (!filePath) {
        log("No active file found");
        return;
    }

    var fileName = path.parse(filePath).base;

    if (appendFileNumber) {
        const lineNumber = getLineNumber();
        if (!lineNumber) {
            log("No active line number found");
            return;
        }

        fileName = fileName + ":" + lineNumber.toString();
    }

    log(fileName);
    writeClipboard(fileName);
}

export function copyFileNameWithoutExtension() {
    const filePath = getDocumentUri()?.fsPath;
    if (!filePath) {
        log("No active file found");
        return;
    }

    const fileName = path.parse(filePath).name;
    log(fileName);
    writeClipboard(fileName);
}

export function copyRelativeFilePath(appendLineNumber: boolean): string | undefined {
    const filePath = getDocumentUri()?.fsPath;
    if (!filePath) {
        log("No active file found");
        return;
    }

    const workspaceFolderPath = getWorkspaceFolder()?.uri.fsPath;
    if (!workspaceFolderPath) {
        log("No active workspace found");
        return;
    }

    var relativeFilePath = filePath.replace(workspaceFolderPath, "");

    if (appendLineNumber) {
        const lineNumber = getLineNumber();
        if (!lineNumber) {
            log("No active line number found");
            return;
        }

        relativeFilePath = relativeFilePath + ":" + lineNumber;
    }

    log(relativeFilePath);
    writeClipboard(relativeFilePath);
}