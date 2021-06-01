import { writeClipboard, getWorkspaceFolder, log } from './shared';

/**
 * Copies the workspace path to the clipboard

 * @export
 * @async
 * @return {*}  {Promise<void>}
 */
export async function getWorkspaceRootPath(): Promise<void> {
    const workspaceRootFolder = getWorkspaceFolder()?.uri.fsPath;
    if (!workspaceRootFolder) {
        log("No active workspace found");
        return;
    }

    await writeClipboard(workspaceRootFolder);
    return Promise.resolve();
}
