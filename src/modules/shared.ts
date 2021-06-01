import { env, Range, Selection, TextEditor, Uri, window, workspace, WorkspaceFolder } from 'vscode';

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
 * @async
 * @param {string} textToCopy The text to add to the system clipboard
 */
export async function writeClipboard(textToCopy: string): Promise<void> {
    await env.clipboard.writeText(textToCopy);
    return Promise.resolve();
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
export function getActiveEditor(): TextEditor | undefined {
    return window.activeTextEditor;
}


export type ValueSelection = {
    /**
     * Start and End index to be used to select the file name to duplicate
     * @type {number}
     */
    start: number;
    end: number;
};

/**
 * Prompts the user to select a new name for the file to be duplicated
 * @param {string} value The value to prefill in the input box
 * @param {string} promptThe text to display underneath the input box
 * @param {ValueSelection} valueSelection Selection of the prefilled value
 * @return {*}  {(Promise<string | undefined>)}
 */
export async function askForDuplicateName(value: string, prompt: string, valueSelection: ValueSelection): Promise<string | undefined> {
    let newPath = await window.showInputBox({
        ignoreFocusOut: true,
        value: value,
        prompt: prompt,
        valueSelection: [valueSelection.start, valueSelection.end]
    });

    return Promise.resolve(newPath);
}

export function notImplementedException() {
    throw new Error("NotImplementedException");
}

/**
 * Returns text from the passed in Selection
 * @param editor The Editor with the selection
 * @param selection The Selection object to convert into text
 * @type {string | undefined}
 */
export function getTextFromSelection(editor: TextEditor, selection: Selection): string | undefined {
    return editor.document.getText(new Range(selection.start, selection.end));
}