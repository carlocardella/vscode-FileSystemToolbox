import * as path from "path";
import { getActiveEditor, getTextFromSelection, getTextFromRange, createNewEditor } from "./shared";
import { commands, Range, Uri } from "vscode";
import { getUserPathInternal } from "./pathCompleter";
import * as fs from "fs";

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

export async function openFileUnderCursor() {
    const editor = getActiveEditor();
    if (!editor) {
        return;
    }

    const selection = editor?.selection;
    if (!selection) {
        return;
    }

    let range: Range | undefined = undefined;
    let regex = new RegExp("((?<=[\"'`]).*?(?=['\"`]))|([^\"'` ]+$)");
    // fix: if getWordRangeAtPosition returns a string like "" "\", autocompletion is not presented but no real exception is thrown
    range = editor?.document.getWordRangeAtPosition(editor.selection.active, regex);
    if (!range) {
        return;
    }

    let userPath = getUserPathInternal(range!).trim();
    let filePath = path.resolve(userPath);
    if (fs.existsSync(filePath)) {
        commands.executeCommand("vscode.open", Uri.file(filePath));
    }
}
