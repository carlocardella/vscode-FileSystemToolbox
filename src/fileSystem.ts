import { Uri, window, workspace } from "vscode";

function getFilePath(): Uri | undefined {
    return window.activeTextEditor?.document.uri;
}

function getLineNumber(): number | undefined {
    return window.activeTextEditor?.selection.active.line;
}

export function getFileName(): string | undefined {
    window.showInformationMessage(window.activeTextEditor?.document.fileName!);
    return window.activeTextEditor?.document.fileName;
}

function getWorkspaceRootFolder(): string | undefined {
    const filePath = getFilePath();
    if (!filePath) { return; }
    return workspace.getWorkspaceFolder(filePath)?.uri.fsPath;
}
