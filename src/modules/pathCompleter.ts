import { Range, Uri, workspace, CompletionItem, CompletionItemKind, TreeItem } from "vscode";
import { getActiveEditor } from "./shared";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

/*
// @TODO: configuration
// separator format: system, win32, posix
// trigger character: /, \, drive letter
// recognize and trigger home directory notation: ~\, HOME\, $HOME\, $env: if powershell
*/

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
                completionItems = items
                    .map((item) => {
                        let completionItemKind: CompletionItemKind;
                        let sortString = "";
                        switch (item[1]) {
                            case 0:
                                completionItemKind = CompletionItemKind.Snippet;
                                sortString = "d";
                                break;
                            case 1:
                                completionItemKind = CompletionItemKind.File;
                                sortString = "f";
                                break;
                            default:
                                completionItemKind = CompletionItemKind.Folder;
                                sortString = "d";
                                break;
                        }

                        let completionItem = new CompletionItem(item[0], completionItemKind!);
                        completionItem.sortText = sortString;
                        return completionItem;
                    })
                    .sort((a, b) => (a.kind! > b.kind! ? 1 : -1));

                return resolve(completionItems);
            },
            (err) => reject(err)
        );
    });
}
