import { Uri, window, workspace } from "vscode";

function getFilePath(): Uri | undefined {
    return window.activeTextEditor?.document.uri;
}

function getLineNumber(): number | undefined {
    return window.activeTextEditor?.selection.active.line;
}

function getWorkspaceRootFolder(): string | undefined {
    const filePath = getFilePath();
    if (!filePath) { return; }
    return workspace.getWorkspaceFolder(filePath)?.uri.fsPath;
}
