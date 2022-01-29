import * as path from "path";
import { getActiveEditor, getTextFromSelection } from "./shared";
import { commands, Uri, Selection, window, workspace, WorkspaceFolder } from "vscode";
import { getStringWithinQuotes } from "./pathCompleter";
import * as fs from "fs";
import * as os from "os";
import { getFolderPath } from "./folders";

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
        // assume the path exists (it is a full path)
        let filePath = path.resolve(userPath);
        if (!fs.existsSync(filePath)) {
            // if the path does not exist, check if it is a relative path (relative to the open document)
            filePath = path.join(getFolderPath(false)!, userPath);
        }

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

/**
 * Expand Home directory to the current user's home directory
 * @export
 * @param {string} [userPath] The path to expand
 * @return {*}
 */
export function expandHomeDirAlias(userPath?: string) {
    const editor = getActiveEditor();
    if (!editor) {
        return;
    }

    if (!userPath) {
        userPath = getTextFromSelection(editor, editor.selection);
    }

    // investigate: resolve environment variables? If so, add $env:USERPROFILE if the language is Powershell

    if (userPath!.startsWith("~")) {
        userPath = userPath?.replace("~", os.homedir());
    }

    if (userPath!.startsWith("HOME\\") || userPath!.startsWith("HOME/")) {
        // investigate: make it case insensitive?
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

/**
 * Ask the user to enter the path to a file in the current workspace or folder
 * @return {*}  {(Promise<string | undefined>)}
 */
async function askForFilePath(): Promise<string | undefined> {
    let fileName = await window.showInputBox({
        ignoreFocusOut: true,
        prompt: "Enter the file path",
    });

    if (!fileName) {
        return Promise.reject();
    }

    return Promise.resolve(fileName);
}

/**
 * Ask the user to chose which workspace to use as the root folder
 * @return {*}  {(Promise<WorkspaceFolder | undefined>)}
 */
async function askForWhichWorkspace(): Promise<WorkspaceFolder | undefined> {
    let items = workspace.workspaceFolders;
    let workspaceName = await window.showQuickPick(items?.map((folder) => folder.name) ?? [], { ignoreFocusOut: true });

    return items?.find((folder) => folder.name === workspaceName);
}

/**
 * Allows the user to type/paste a relative file path to open; the path is relative to the workspace root or open folder. In a multi-root workspace, the user is prompted to choose which workspace to use as root for the relative path.
 * @export
 * @param {string} [filePath] The relative file path to open
 * @return {*}
 */
export async function openWorkspaceFile(filePath?: string) {
    let workspaceFolderPath: string | undefined;

    if (workspace.workspaceFolders) {
        if (workspace.workspaceFolders?.length > 1) {
            // ask which workspace
            let workspaceFolder = await askForWhichWorkspace();
            if (!workspaceFolder) {
                return;
            } else {
                workspaceFolderPath = workspaceFolder?.uri.fsPath;
            }
        } else {
            workspaceFolderPath = workspace.workspaceFolders?.[0]?.uri.fsPath;
        }
    } else {
        window.showWarningMessage("No Workspace or folder open");
        return;
    }

    if (!filePath) {
        filePath = await askForFilePath();
    }
    if (!filePath) {
        return;
    }

    if (workspaceFolderPath) {
        const fileToOpen = path.join(workspaceFolderPath, filePath);
        if (fs.existsSync(fileToOpen) && fs.lstatSync(fileToOpen).isFile()) {
            commands.executeCommand("vscode.open", Uri.file(fileToOpen));
        }
    }
}
