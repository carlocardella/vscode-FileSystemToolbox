import { commands, env, Uri, workspace, window, TextEditor } from 'vscode';

/**
 * Pauses execution of the given number of milliseconds
 * @param milliseconds the number of milliseconds to wait
 */
export function sleep(milliseconds: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

/**
 * Read the current clipboard contents as text.
 * @export
 * @return {*}  {Promise<string>}
 */
export async function readClipboard(): Promise<string> {
    return Promise.resolve(await env.clipboard.readText());
}

/**
 * Close the active editor or all active editors in the current window
 * @param {boolean} closeAll Optional: if `true`, closes all editors in the current window; if `false` or missing closes the active editor only
 * @returns {Promise}
 */
export function closeTextEditor(closeAll?: boolean): Promise<void> {
    if (closeAll) {
        commands.executeCommand("workbench.action.closeAllEditors");
    }
    else {
        commands.executeCommand('workbench.action.closeActiveEditor');
    }

    return Promise.resolve();
}

export function openFolder(folderPath: string) {
    console.log("enter openFolder");
    workspace.updateWorkspaceFolders(0, 0, { uri: Uri.parse(folderPath) });
}

export async function openDocument(filePath: string): Promise<void> {
    workspace.openTextDocument(filePath).then(doc => {
        window.showTextDocument(doc);
    });

    return Promise.resolve();
}

export async function getActiveTextEditor(): Promise<TextEditor | undefined> {
    return Promise.resolve(
        window.activeTextEditor
    );
}