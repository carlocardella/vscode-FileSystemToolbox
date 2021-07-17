import { Uri, workspace, CompletionItem, CompletionItemKind, FileType } from "vscode";
import { getActiveEditor, getLinesFromSelection, getTextFromRange } from "./shared";
import * as path from "path";

/*
// todo: normalize path autocompletion
// todo: support home directory aliases, e.g. "~", "HOME", $env:USERPROFILE (and others) if powershell
*/

let config = workspace.getConfiguration("fst");

/**
 * Returns the path the user entered in the text editor
 * @export
 * @return {*}  {string}
 */
export function getUserPath(): string {
    // get the latest config
    getPathCompletionConfiguration();

    if (shouldComplete()) {
        const editor = getActiveEditor();

        let range = editor?.document.getWordRangeAtPosition(editor.selection.active, new RegExp(/[^"'`]+$/));
        if (!range) {
            return "";
        }

        return getTextFromRange(range).trim();
    }

    return "";
}

/**
 * Returns a CompletionItem[] object to be used to show the path autocompletion in the editor
 * @export
 * @param {string} currentFolder The path so far typed (or selected) by the user. It is used to show the next CompletionItem[]
 * @return {*}  {Promise<CompletionItem[]>}
 */
export function getCompletionItems(currentFolder: string): Promise<CompletionItem[]> {
    const config = workspace.getConfiguration("fst");

    return new Promise(async (resolve, reject) => {
        let pathCompletionSeparator = config.get<string>("PathCompleterSeparator");
        if (pathCompletionSeparator === "SystemDefault") {
            pathCompletionSeparator = path.sep;
        }
        let appendPathSeparator = config.get<boolean>("PathCompleterAppendPathSeparator");

        await workspace.fs.readDirectory(Uri.file(currentFolder)).then(
            (items) => {
                let completionItems: CompletionItem[] = [];
                completionItems = items.map((item) => {
                    let completionItemKind: CompletionItemKind;
                    let sortString = "";
                    let completionItemLabel = "";
                    switch (item[1]) {
                        case FileType.Unknown:
                            completionItemKind = CompletionItemKind.Issue;
                            sortString = "u";
                            break;
                        case FileType.File:
                            completionItemKind = CompletionItemKind.File;
                            sortString = "f";
                            break;
                        case FileType.Directory:
                            completionItemKind = CompletionItemKind.Folder;
                            sortString = "d";
                            break;
                        case FileType.SymbolicLink:
                            completionItemKind = CompletionItemKind.Variable;
                            // sortString = "s";
                            break;
                        default:
                            if (<number>item[1] === 65) {
                                completionItemKind = CompletionItemKind.File;
                                sortString = "f";
                            } else if (<number>item[1] === 66) {
                                completionItemKind = CompletionItemKind.Folder;
                                sortString = "d";
                            }
                            break;
                    }
                    completionItemLabel = item[0];

                    let completionItem = new CompletionItem(completionItemLabel, completionItemKind!);

                    // trigger the next autocompletion
                    if (completionItem.kind === CompletionItemKind.Folder && appendPathSeparator) {
                        completionItem.command = {
                            command: "default:type",
                            title: "triggerCompletion",
                            arguments: [
                                {
                                    text: pathCompletionSeparator,
                                },
                            ],
                        };
                    }

                    completionItem.sortText = sortString;
                    return completionItem;
                });

                return resolve(completionItems);
            },
            (err) => reject(err)
        );
    });
}

/**
 * Return `true` if the cursor is within quotes
 * @param {string} text Text containing the cursor
 * @return {*}  {boolean}
 */
function isInsideQuotes(): boolean {
    let editor = getActiveEditor();
    if (!editor) {
        return false;
    }

    let isInsideQuotes = false;

    getLinesFromSelection(editor)?.forEach((line) => {
        let match = line.text.match(/(["]|[']|[`])/g);
        if (match!.length % 2 === 1) {
            isInsideQuotes = true;
        }
    });

    return isInsideQuotes;
}

/**
 * Return the string within quotes (single or double)
 * @param {string} text The text to filter
 * @return {*}  {(string | undefined)}
 */
function getStringWithinQuotes(text: string): string | undefined {
    return text?.match(new RegExp(/(?<=["'])[^"']*/))?.[0];
}

/**
 * Checks if the extension should provide Path Autocompletion
 * @return {*}  {boolean}
 */
function shouldComplete(): boolean {
    // check of PathAutocompleter is enabled
    if (!config.get<boolean>("EnablePathCompleter")) {
        return false;
    }

    // check if the cursor is inside quotes
    if (!config.get<boolean>("PathCompleterTriggerOutsideQuotes") && !isInsideQuotes()) {
        return false;
    }

    return true;
}

/**
 * refresh the path completion configuration object
 * @export
 */
export function getPathCompletionConfiguration() {
    config = workspace.getConfiguration("fst");
}
