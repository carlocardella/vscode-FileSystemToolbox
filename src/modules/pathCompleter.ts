import * as path from "path";
import { CompletionItem, CompletionItemKind, FileType, Range, Uri, workspace, Position, TextDocument } from "vscode";
import { expandHomeDirAlias } from "./pathStrings";
import { getActiveDocument, getActiveEditor, getCursorPosition, getDocumentContainer, getLinesFromSelection, getTextFromRange } from "./shared";

/*
// todo: if json and using \, escape it
// todo: normalize path autocompletion
// todo: manage relative path in the form of   "Assets/tech-service.png". Works fine for items under the root folder, it should work for other folders as well 
*/

let config = workspace.getConfiguration("FileSystemToolbox");

/**
 * Returns the path the user entered in the text editor
 * @export
 * @return {*}  {string}
 */
export function getUserPath(): string | undefined {
    // get the latest config
    getPathCompletionConfiguration();

    if (shouldComplete()) {
        const editor = getActiveEditor();
        if (!editor) {
            return;
        }

        let userPath = getStringWithinQuotes();

        return userPath;
    }

    return;
}

/**
 * Returns a CompletionItem[] object to be used to show the path autocompletion in the editor
 * @export
 * @param {string} currentFolder The path so far typed (or selected) by the user. It is used to show the next CompletionItem[]
 * @return {*}  {Promise<CompletionItem[]>}
 */
export function getCompletionItems(currentFolder: string, document: TextDocument, position: Position): Promise<CompletionItem[]> {
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
                    
                    // if (document.languageId === "json" || document.languageId === "jsonc") {
                    //     completionItemLabel = completionItemLabel.replace(/\\/g, "\\\\");
                    // }

                    let completionItem = new CompletionItem(completionItemLabel, completionItemKind!);

                    if (appendPathSeparator) {
                        // trigger the next autocompletion
                        triggerNextCompletion(completionItem, appendPathSeparator!, pathCompletionSeparator!);
                    }

                    completionItem.sortText = sortString;
                    // https://stackoverflow.com/questions/60001714/custom-extension-for-json-completion-does-not-work-in-double-quotes
                    // https://stackoverflow.com/questions/64584850/get-vscode-registercompletionitemprovider-to-work-in-a-json-file-with-a-word
                    completionItem.range = new Range(position, position);

                    return completionItem;
                });

                // add folderUp (..) but only if the current folder is not the root folder
                if (path.resolve(currentFolder) !== path.resolve("/")) {
                    let folderUp = new CompletionItem("..", CompletionItemKind.Folder);
                    folderUp.sortText = "a";
                    folderUp.range = new Range(position, position);

                    completionItems.push(folderUp);
                    if (appendPathSeparator) {
                        // trigger the next autocompletion
                        triggerNextCompletion(folderUp, appendPathSeparator!, pathCompletionSeparator!);
                    }
                }

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
export function getStringWithinQuotes(text?: string): string | undefined {
    // return text?.match(new RegExp(/(?<=["'`]).*?(?=['"`])/))?.[0];
    const editor = getActiveEditor();
    if (!editor) {
        return "";
    }

    let cursorPosition = getCursorPosition(editor);
    let currentLine = getLinesFromSelection(editor);
    if (!currentLine) {
        return "";
    }

    // investigate: This is a bit cumbersome, but it works: the idea is to get the string "around" the cursor and delimited by /["'` ]/. I tried to use a regexp instead of this workaround but I could not get it to work.
    let textBeforeCursor = currentLine[0].text.substring(0, cursorPosition[0].character);
    let textAfterCursor = currentLine[0].text.substring(cursorPosition[0].character);

    let regexTextBeforeCursor = "";
    let triggerOutsideQuotes = config.get<boolean>("PathCompleterTriggerOutsideQuotes");
    triggerOutsideQuotes ? (regexTextBeforeCursor = "[^\"'`]*?$") : "[^\"'` ]*?$";
    let regexTextAfterCursor = new RegExp("[^\"'` ]*");

    textBeforeCursor = textBeforeCursor.match(new RegExp(regexTextBeforeCursor))![0].trim();
    textAfterCursor = textAfterCursor.match(new RegExp(regexTextAfterCursor))![0].trim();

    // let stringWithinQuotes = path.join(textBeforeCursor, textAfterCursor);
    // note: path.join normalizes the path, it strips the leading . for a local path, e.g. ".\wsl" and prevents the next auto-complete from working
    let stringWithinQuotes = textBeforeCursor + textAfterCursor;

    if (config.get<boolean>("PathCompleterExpandHomeDirAlias")) {
        expandHomeDirAlias(stringWithinQuotes);
    }

    // the file has a path on disk, use it as base for the path completion
    if (!getActiveDocument()?.isUntitled && stringWithinQuotes.startsWith(".")) {
        let documentContainer = getDocumentContainer();
        stringWithinQuotes = path.join(documentContainer!, stringWithinQuotes);
    }

    return stringWithinQuotes;
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
