import * as path from "path";
import { getActiveEditor, getTextFromSelection, getUserPathRangeAtCursorPosition, getTextFromRange } from "./shared";
import { commands, Uri, Selection, Range } from "vscode";
import { getStringWithinQuotes } from "./pathCompleter";
import * as fs from "fs";
import * as os from "os";

/**
 * Enumerates Platform path types
 * @enum {number}
 */
// prettier-ignore
export enum PathTransformationType {
    'posix'  = 'posix',
    'win32'  = 'win32',
    'darwin' = 'darwin'
}

/**
 * Transforms the selected path string to the chosen platform type target
 * @param {PathTransformationType} type Enum the Platform types to transform the path to
 * @return {*}  {(Promise<string | undefined>)}
 */
export async function transformPath(type: PathTransformationType): Promise<string | undefined> {
    const editor = getActiveEditor();
    if (!editor) {
        return Promise.reject();
    }

    const selection = editor.selection;
    if (!selection) {
        return Promise.reject();
    }

    let pathString = getTextFromSelection(editor, selection);

    switch (type) {
        case PathTransformationType.posix:
            pathString = path.posix.normalize(pathString!).replace(/\\+/g, "/");
            break;

        case PathTransformationType.darwin:
            pathString = path.posix.normalize(pathString!).replace(/\\+/g, "/");
            break;

        case PathTransformationType.win32:
            // if this is a json document, use double backslashes
            if (editor.document.languageId === "json" || editor.document.languageId === "jsonc") {
                pathString = path.posix.normalize(pathString!).replace(/\/+/g, "\\\\");
            } else {
                pathString = path.posix.normalize(pathString!).replace(/\/+/g, "\\");
            }
            break;

        default:
            break;
    }

    editor.edit((editBuilder) => {
        editBuilder.replace(selection, pathString!);
    });
}

/**
 * Open the file path under the active cursor: does not support multiple cursors
 * @export
 * @return {*}
 */
export async function openFileUnderCursor() {
    const editor = getActiveEditor();
    if (!editor) {
        return;
    }

    let userPath = getStringWithinQuotes();
    if (userPath) {
        let filePath = path.resolve(userPath);
        if (fs.existsSync(filePath)) {
            commands.executeCommand("vscode.open", Uri.file(filePath));
        }
    }
}

/**
 * Normalize the path string to the platform type
 * @export
 * @param {string} [pathToNormalize] The path to normalize
 * @return {*}  {string}
 */
export function normalizePath(pathToNormalize?: string): string {
    const editor = getActiveEditor();
    if (!editor) {
        return "";
    }

    editor.edit((editBuilder) => {
        if (!pathToNormalize) {
            if (!editor.selection.isEmpty) {
                pathToNormalize = getTextFromSelection(editor, editor.selection);
                editBuilder.replace(editor.selection, path.normalize(pathToNormalize!));
                return pathToNormalize;
            }
        }
    });

    return "";
}

export function expandHomeDirAlias(userPath?: string) {
    const editor = getActiveEditor();
    if (!editor) {
        return;
    }

    if (!userPath) {
        userPath = getTextFromSelection(editor, editor.selection);
    }

    //     // investigate: resolve environment variables? If so, add $env:USERPROFILE if the language is Powershell

    if (userPath!.startsWith("~")) {
        userPath = userPath?.replace("~", os.homedir());
    }

    if (userPath!.startsWith("HOME\\") || userPath!.startsWith("HOME/")) { // investigate: make it case insensitive? 
        userPath = userPath!.replace("HOME", os.homedir());
    }

    editor
        ?.edit((editBuilder) => {
            editBuilder.replace(editor.selection, userPath!);
        })
        .then(() => {
            // remove the selection added by the replace
            editor.selection = new Selection(editor.selection.active, editor.selection.active);
        });
}
