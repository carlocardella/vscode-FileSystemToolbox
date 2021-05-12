import { writeClipboard, getWorkspaceFolder, log } from './shared';

/**
 * Copies the workspace path to the clipboard
 * @export
 * @return {*}  {(string | undefined)}
 */
export function getWorkspaceRootPath(): string | undefined {
    const workspaceRootFolder = getWorkspaceFolder()?.uri.fsPath;
    if (!workspaceRootFolder) {
        log("No active workspace found");
        return;
    }

    writeClipboard(workspaceRootFolder);
}
