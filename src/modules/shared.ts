import { env, Uri, window, workspace, WorkspaceFolder } from 'vscode';

export function getDocumentUri(): Uri | undefined {
    return window.activeTextEditor?.document.uri;
}

export function getWorkspaceFolder(): WorkspaceFolder | undefined {
    const fileUri = getDocumentUri();
    if (!fileUri) { return; }
    return workspace.getWorkspaceFolder(fileUri);
}

export function getLineNumber(): number | undefined {
    return window.activeTextEditor?.selection.active.line;
}

export function writeClipboard(textToCopy: string) {
    env.clipboard.writeText(textToCopy);
}

export function log(message: string) {
    console.log(message);
}