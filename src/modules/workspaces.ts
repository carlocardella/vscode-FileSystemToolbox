import { writeClipboard, getWorkspaceFolder, log } from './shared';
import { Uri } from 'vscode';

/**
 * Copies the workspace path to the clipboard
 * @export
 * @async
 * @return {*}  {Promise<void>}
 */
export async function getWorkspaceRootPath(fileUri?: Uri): Promise<void> {
    const workspaceRootFolder = getWorkspaceFolder(fileUri)?.uri.fsPath;
    if (!workspaceRootFolder) {
        log("No active workspace found");
        return;
    }

    await writeClipboard(workspaceRootFolder);
    return Promise.resolve();
}
