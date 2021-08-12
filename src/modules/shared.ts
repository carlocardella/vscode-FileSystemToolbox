import { env, Position, Range, Selection, TextDocument, TextEditor, TextLine, Uri, window, workspace, WorkspaceFolder } from "vscode";
import * as path from "path";

/**
 * Returns the Uri of the active document
 * @export
 * @return {*}  {(Uri | undefined)}
 */
export function getDocumentUri(): Uri | undefined {
    return window.activeTextEditor?.document.uri;
}

/**
 * Get the path to the folder containing the active document
 * @export
 * @return {*}  {(string | undefined)}
 */
export function getDocumentContainer(): string | undefined {
    let documentUri = getDocumentUri();
    if (!documentUri) {
        return;
    }

    return path.dirname(documentUri.fsPath);
}

/**
 * Get the active document
 * @export
 * @return {*}  {(TextDocument | undefined)}
 */
export function getActiveDocument(): TextDocument | undefined {
    return window.activeTextEditor?.document;
}

/**
 * Returns the active WorkspaceFolder
 * @export
 * @return {*}  {(WorkspaceFolder | undefined)}
 */
export function getWorkspaceFolder(): WorkspaceFolder | undefined {
    const fileUri = getDocumentUri();
    if (!fileUri) {
        return;
    }
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

    return Promise.resolve(selectedRanges!.join(";")!);
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
 * @param {string} value The value to pre-fill in the input box
 * @param {string} promptThe text to display underneath the input box
 * @param {ValueSelection} valueSelection Selection of the prefilled value
 * @return {*}  {(Promise<string | undefined>)}
 */
export async function askForDuplicateName(value: string, prompt: string, valueSelection: ValueSelection): Promise<string | undefined> {
    let newPath = await window.showInputBox({
        ignoreFocusOut: true,
        value: value,
        prompt: prompt,
        valueSelection: [valueSelection.start, valueSelection.end],
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

/**
 * Returns an object with line information for each line in the selection
 * @return {(TextLine[] | undefined)}
 */
export function getLinesFromSelection(editor: TextEditor): TextLine[] | undefined {
    let lines: TextLine[] = [];
    let selections = editor?.selections;
    if (!selections) {
        return;
    }

    selections.forEach((s) => {
        let selectionStartLine = s.start.line;
        let selectionEndLine = s.end.line;

        for (let i = selectionStartLine; i <= selectionEndLine; i++) {
            lines.push(editor?.document.lineAt(i));
        }
    });

    return lines!;
}

/**
 * Returns text from the selected Range
 * @export
 * @param {Range} range The Range to return text from
 * @return {*}  {string}
 */
export function getTextFromRange(range: Range): string {
    return getActiveEditor()?.document.getText(range)!;
}

/**
 * Returns the Position of the cursor in the editor. Supports multicursor
 * @export
 * @param {TextEditor} editor The editor to get the cursor position from
 * @return {*}  {Position[]}
 */
export function getCursorPosition(editor: TextEditor): Position[] {
    let position: Position[] = [];
    editor.selections.forEach((selection) => {
        position.push(selection.active);
    });

    return position;
}

/**
 * Creates a new TextEditor containing the passed in text
 * @param {string} text
 * @returns {TextEditor}
 */
export function createNewEditor(text?: string): Promise<TextEditor> {
    return new Promise(async (resolve, reject) => {
        await workspace.openTextDocument({ content: text, preview: true } as any).then(
            (doc) => {
                resolve(window.showTextDocument(doc));
            },
            (err) => reject(err)
        );
    });
}

/**
 * Returns the file system path at the current cursor position
 * @export
 * @param {TextEditor} editor The editor containing the cursor position
 * @return {*}  {(Range | undefined)}
 */
export function getUserPathRangeAtCursorPosition(editor: TextEditor): Range | undefined {
    if (!editor) {
        return;
    }

    let regex = new RegExp("((?<=[\"'`]).*?(?=['\"`]))|([^\"'` ]+$)", "g");
    return editor?.document.getWordRangeAtPosition(editor.selection.active, regex);
}

export function getRangeFromText(editor: TextEditor, text: string, selection: Selection): Range | undefined {
    let selectionText = getTextFromSelection(editor, selection);
    
    if (selectionText?.includes(text)) {
        let start = selectionText?.indexOf(text);
        let end = selectionText?.lastIndexOf(text);
        return new Range(selection.active.line, start, selection.active.line, end);
    }

    return;
}