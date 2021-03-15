import { getDocumentUri, copyToClipboard, getWorkspaceFolder, log } from './shared';

export function getWorkspaceRootPath(): string | undefined {
    const filePath = getDocumentUri();
    if (!filePath) {
        log("No active file found");
        return;
    }

    const workspaceRootFolder = getWorkspaceFolder()?.uri.fsPath;
    if (!workspaceRootFolder) {
        log("No active workspace found");
        return;
    }

    log(workspaceRootFolder);
    copyToClipboard(workspaceRootFolder);
}
