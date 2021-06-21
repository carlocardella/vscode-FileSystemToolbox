import { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } from "node:constants";
import { Range, Uri, workspace, FileType, CompletionItem, CompletionItemKind } from "vscode";
import { getActiveEditor } from "./shared";

/*
// @TODO: configuration
// separator format: system, win32, posix
// trigger character: /, \, drive letter
// recognize and trigger home directory notation: ~\, HOME\, $HOME\, $env: if powershell
*/

// todo: remove it
export async function test() {
    // let items = await workspace.fs.readDirectory(Uri.parse("c:/Temp/"));
    // console.log(items);

    const editor = getActiveEditor();
    let s = editor?.document.getWordRangeAtPosition(editor.selection.active, RegExp('[^"]+$'));
    console.log(getTextFromRange(s!));
}

// /**
//  * Returns the content of the passed in folder
//  * @export
//  * @param {Uri} folderUri Uri of the folder to return the content from
//  * @return {*}  {Promise<[string, FileType][]>}
//  */
// async function getFolderContent(folderUri: Uri): Promise<[string, FileType][]> {
//     return Promise.resolve(workspace.fs.readDirectory(folderUri));
// }

/**
 * Returns the path the user entered in the text editor
 * @export
 * @return {*}  {string}
 */
export function getUserPath(): string {
    const editor = getActiveEditor();

    let range = editor?.document.getWordRangeAtPosition(editor.selection.active, RegExp('[^\\"]+$'));
    if (!range) {
        return "";
    }

    return getTextFromRange(range);
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
 * Returns a CompletionItem[] object to be used to show the path autocompletion in the editor
 * @export
 * @param {string} currentFolder The path so far typed (or selected) by the user. It is used to show the next CompletionItem[]
 * @return {*}  {Promise<CompletionItem[]>}
 */
export function getCompletionItems(currentFolder: string): Promise<CompletionItem[]> {
    return new Promise(async (resolve, reject) => {
        await workspace.fs.readDirectory(Uri.parse(currentFolder)).then(
            (items) => {
                let completionItems: CompletionItem[] = [];
                completionItems = items.map((item) => {
                    let completionItemKind: CompletionItemKind;
                    switch (item[1]) {
                        case 1:
                            completionItemKind = CompletionItemKind.File;
                            break;
                        case 2:
                            completionItemKind = CompletionItemKind.Folder;
                            break;
                        case 64:
                            completionItemKind = CompletionItemKind.Folder;
                            break;
                        default:
                            break;
                    }

                    return new CompletionItem(item[0], completionItemKind!);
                });

                resolve(completionItems);
            },
            (err) => reject(err)
        );
    });
}
