import * as os from "os";
import * as path from "path";
import { CompletionItem, CompletionItemKind, FileType, Range, Selection, Uri, workspace } from "vscode";
import { getActiveDocument, getActiveEditor, getCursorPosition, getDocumentContainer, getLinesFromSelection, getTextFromRange } from "./shared";

/*
// todo: normalize path autocompletion
// todo: improve performance
// todo: properly handle relative paths starting with '.' or '..'
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

        let range: Range | undefined = undefined;
        let regex = new RegExp("((?<=[\"'`]).*?(?=['\"`]))|([^\"'`]+$)");

        range = editor?.document.getWordRangeAtPosition(editor.selection.active, regex);
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
    let userPath = getTextFromRange(pathSelection).trim();

    if (config.get<boolean>("PathCompleterExpandHomeDirAlias")) {
        expandHomeDirAlias(pathSelection);
    }

    let document = getActiveDocument();
    if (document?.isUntitled) {
        return userPath;
    }

    let documentContainer = getDocumentContainer();
    userPath = path.join(documentContainer!, userPath);

    return userPath;
}

/**
 * Expand the home directory alias: "~", "HOME"
 * @export
 * @param {Range} pathSelection The Range containing the path the user entered
 */
export function expandHomeDirAlias(pathSelection: Range) {
    // investigate: resolve environment variables? If so, add $env:USERPROFILE if the language is Powershell
    let userPath = getTextFromRange(pathSelection).trim();
    const editor = getActiveEditor();

    if (userPath.startsWith("~\\")) {
        userPath = userPath.replace("~\\", os.homedir());
    }

    if (userPath.toUpperCase().startsWith("HOME\\")) {
        userPath = userPath.replace("HOME\\", os.homedir());
    }

    editor?.edit((editBuilder) => {
        editBuilder.replace(pathSelection, userPath);
    });
    // todo: remove unwanted text selection
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
    config = workspace.getConfiguration("fst");
}
