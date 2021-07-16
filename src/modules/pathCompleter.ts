import { Range, Uri, workspace, CompletionItem, CompletionItemKind, window } from "vscode";
import { getActiveEditor, getLinesFromSelection, getTextFromRange } from "./shared";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";

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

        let completionItems: CompletionItem[] = [];
        // bug: does not work with Junctions
        fs.readdirSync(path.resolve(currentFolder), { withFileTypes: true }).forEach((item) => {
            let completionItemKind: CompletionItemKind;
            let sortString = "";
            let completionItemLabel = "";
            if (item.isDirectory() || item.isSymbolicLink()) {
                completionItemKind = CompletionItemKind.Folder;
                sortString = "d";
            } else if (item.isFile()) {
                completionItemKind = CompletionItemKind.File;
                sortString = "f";
            } else {
                completionItemKind = CompletionItemKind.Snippet;
                sortString = "s";
            }
            completionItemLabel = item.name;

            let completionItem = new CompletionItem(completionItemLabel, completionItemKind);

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
            completionItems.push(completionItem);
        });

        return resolve(completionItems);
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
