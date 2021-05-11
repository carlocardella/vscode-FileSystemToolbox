import { env, Uri, window, workspace, WorkspaceFolder } from 'vscode';

/**
 * Returns the Uri of the active document
 * @export
 * @return {*}  {(Uri | undefined)}
 */
export function getDocumentUri(): Uri | undefined {
    return window.activeTextEditor?.document.uri;
}

/**
 * Returns the active WorkspaceFolder
 * @export
 * @return {*}  {(WorkspaceFolder | undefined)}
 */
export function getWorkspaceFolder(): WorkspaceFolder | undefined {
    const fileUri = getDocumentUri();
    if (!fileUri) { return; }
    return workspace.getWorkspaceFolder(fileUri);
}

/**
 * Returns the active line number
 * @export
 * @return {*}  {(number | undefined)}
 */
export function getLineNumber(): number | undefined {
    return window.activeTextEditor?.selection.active.line;
}

/**
 * Writes text to the system clipboard
 * @export
 * @param {string} textToCopy
 */
export function writeClipboard(textToCopy: string) {
    env.clipboard.writeText(textToCopy);
}

/**
 * Logs a message to the debug console
 * @export
 * @param {string} message
 */
export function log(message: string) {
    console.log(message);
}