import { getDocumentUri, writeClipboard, getWorkspaceFolder, log } from './shared';

/**
 * Copies the workspace path to the clipboard
 * @export
 * @return {*}  {(string | undefined)}
 */
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
    writeClipboard(workspaceRootFolder);
}
