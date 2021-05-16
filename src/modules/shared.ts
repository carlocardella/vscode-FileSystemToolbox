import { env, TextEditor, Uri, window, workspace, WorkspaceFolder } from 'vscode';
import * as path from 'path';

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
 * Returns the current line number or selection ranges
 * @export
 * @return {*}  {Promise<string>}
 */
export function getLineNumberOrRange(): Promise<string> {
    const editor = getActiveEditor();

    if (editor?.selection.isEmpty) {
        let lineNumber = editor.selection.active.line + 1;
        return Promise.resolve(lineNumber.toString());
    }

    let selectedRanges = editor?.selections.map((s) => {
        let lineStart = s.start.line + 1;
        let lineEnd = s.end.line + 1;
        return lineStart === lineEnd ? lineStart : `${lineStart}~${lineEnd}`;
    });

    return Promise.resolve(selectedRanges!.join(';')!);
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

/**
 * Returns the current active editor
 * @return {*}  {(TextEditor | undefined)}
 */
function getActiveEditor(): TextEditor | undefined {
    return window.activeTextEditor;
}

/**
 * Returns the active file path
 * @export
 * @return {*}  {(string | undefined)}
 */
export function getFilePath(): string | undefined {
    return getDocumentUri()?.fsPath;
}

/**
 * Returns the active file name
 * @export
 * @return {*}  {(string | undefined)}
 */
export function getFileName(): string | undefined {
    const filePath = getFilePath();
    if (!filePath) { return undefined; }

    return path.parse(filePath).base;
}