import * as path from "path";
import { CompletionItem, CompletionItemKind, FileType, Range, Uri, workspace } from "vscode";
import { expandHomeDirAlias, normalizePath } from "./pathStrings";
import {
    getActiveDocument,
    getActiveEditor,
    getCursorPosition,
    getDocumentContainer,
    getLinesFromSelection,
    getTextFromRange,
    getUserPathRangeAtCursorPosition,
} from "./shared";

/*
// todo: normalize path autocompletion
// todo: improve performance
// todo: manage relative path in the form of   "Assets/tech-service.png",
*/

let config = workspace.getConfiguration("FileSystemToolbox");

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
        if (!editor) {
            return "";
        }

        let range = getUserPathRangeAtCursorPosition(editor);
        if (!range) {
            return "";
        }

        let userPath = getUserPathInternal(range);

        return userPath;
    }

    return "";
}

/**
 * Get the path the user entered in the text editor
 * @export
 * @param {Range} pathSelection The Range containing the path the user entered
 * @return {*}  {string}
 */
export function getUserPathInternal(pathSelection: Range): string {
    if (config.get<boolean>("PathCompleterExpandHomeDirAlias")) {
        expandHomeDirAlias(pathSelection);
    }

    let userPath = getTextFromRange(pathSelection).trim();

    // the file has a path on disk, use it as base for the path completion
    if (!getActiveDocument()?.isUntitled && userPath.startsWith(".")) {
        let documentContainer = getDocumentContainer();
        userPath = path.join(documentContainer!, userPath);
    }

    // unsaved document, it is not possible to use a relative path, return whatever the user entered
    return userPath;
}

/**
 * Returns a CompletionItem[] object to be used to show the path autocompletion in the editor
 * @export
 * @param {string} currentFolder The path so far typed (or selected) by the user. It is used to show the next CompletionItem[]
 * @return {*}  {Promise<CompletionItem[]>}
 */
export function getCompletionItems(currentFolder: string): Promise<CompletionItem[]> {
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

                    if (appendPathSeparator) {
                        // trigger the next autocompletion
                        triggerNextCompletion(completionItem, appendPathSeparator!, pathCompletionSeparator!);
                    }

                    completionItem.sortText = sortString;

                    return completionItem;
                });

                // add folderUp (..)
                let folderUp = new CompletionItem("..", CompletionItemKind.Folder);
                folderUp.sortText = "a";
                completionItems.push(folderUp);
                if (appendPathSeparator) {
                    // trigger the next autocompletion
                    triggerNextCompletion(folderUp, appendPathSeparator!, pathCompletionSeparator!);
                }

                // if (config.get<boolean>("PathCompleterNormalizePath")) {
                //     normalizePath();
                //     if (appendPathSeparator) {
                //         // trigger the next autocompletion @fix: does not work
                //         triggerNextCompletion(folderUp, appendPathSeparator!, pathCompletionSeparator!);
                //     }
                // }

                return resolve(completionItems);
            },
            (err) => reject(err)
        );
    });
}

/**
 * Append the path separator to the current path and trigger the next autocompletion
 * @param {CompletionItem} completionItem CompletionType of type Folder to append the path separator to
 * @param {boolean} appendPathSeparator Make sure the user wants to append the path separator
 * @param {string} pathCompletionSeparator Path separator to use
 */
function triggerNextCompletion(completionItem: CompletionItem, appendPathSeparator: boolean, pathCompletionSeparator: string) {
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
    let cursorPosition = getCursorPosition(editor)[0];

    getLinesFromSelection(editor)?.forEach((line) => {
        let lineTextToCursorPosition = line.text.substring(0, cursorPosition.character);
        let match = lineTextToCursorPosition.match(/(["]|[']|[`])/g);
        if (match && match?.length % 2 === 1) {
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
    return text?.match(new RegExp(/(?<=["'`]).*?(?=['"`])/))?.[0];
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
    config = workspace.getConfiguration("FileSystemToolbox");
}
