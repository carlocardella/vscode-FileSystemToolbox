import * as vscode from "vscode";
import * as files from "./modules/files";
import * as workspaces from "./modules/workspaces";
import * as folders from "./modules/folders";
import * as crud from "./modules/crud";
import * as pathStrings from "./modules/pathStrings";
import * as pathCompleter from "./modules/pathCompleter";
import * as pathString from "./modules/pathStrings";
import * as shared from "./modules/shared";
import { Uri, TextEditor, TextDocument } from "vscode";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    console.log("vscode-FileSystemToolbox is active");

    // files
    context.subscriptions.push(
        vscode.commands.registerCommand("vscode-FileSystemToolbox.CopyFileName", (e) => {
            files.copyFileName(false, e);
        })
    );
    context.subscriptions.push(
        vscode.commands.registerCommand("vscode-FileSystemToolbox.CopyFileNameWithoutExtension", (e) => {
            files.copyFileNameWithoutExtension(e);
        })
    );
    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand("vscode-FileSystemToolbox.CopyFilePathWithLineNumber", () => {
            files.copyFilePath(true);
        })
    );
    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand("vscode-FileSystemToolbox.CopyFileNameWithLineNumber", () => {
            files.copyFileName(true);
        })
    );
    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand("vscode-FileSystemToolbox.CopyRelativeFilePath", () => {
            files.copyRelativeFilePath(false);
        })
    );
    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand("vscode-FileSystemToolbox.CopyRelativeFilePathWithLineNumber", () => {
            files.copyRelativeFilePath(true);
        })
    );
    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand("vscode-FileSystemToolbox.DuplicateFile", () => {
            crud.duplicateFile();
        })
    );
    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand("vscode-FileSystemToolbox.DeleteFile", () => {
            crud.removeFile();
        })
    );
    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand("vscode-FileSystemToolbox.NewFileRelativeToCurrentFile", () => {
            crud.askForFilePathAndName(true, false);
        })
    );
    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand("vscode-FileSystemToolbox.NewFileRelativeToWorkspaceRoot", () => {
            crud.askForFilePathAndName(false, true);
        })
    );
    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand("vscode-FileSystemToolbox.OpenFileUnderCursor", () => {
            pathString.openFileUnderCursor();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand("vscode-FileSystemToolbox.CopySelectionWithMetadata", () => {
            files.copySelectionWithMetadata();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand("vscode-FileSystemToolbox.MoveFile", async (explorerSelectedUri) => {
            if (explorerSelectedUri instanceof Uri) {
                // invoked from context menu in Explorer treeview
                console.log("from explorer treeview");
            } else if (explorerSelectedUri instanceof String) {
                // invoked from context menu in a text editor
                console.log("from tect editor");
            } else {
                // invoked from command palette or keybinding
                console.log("from command palette or keybinding");
            }

            // if (!explorerSelectedUri) {
            //     explorerSelectedUri = await shared.getSelectedExplorerItems();
            // }
            // files.moveFile([explorerSelectedUri]);
        })
    );

    // folders
    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand("vscode-FileSystemToolbox.CopyFolderPath", () => {
            folders.copyFolderPath(false);
        })
    );
    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand("vscode-FileSystemToolbox.CopyRelativeFolderPath", () => {
            folders.copyFolderPath(true);
        })
    );

    // workspaces
    context.subscriptions.push(
        vscode.commands.registerCommand("vscode-FileSystemToolbox.CopyWorkspaceRootPath", (e) => {
            workspaces.getWorkspaceRootPath(e);
        })
    );
    context.subscriptions.push(
        vscode.commands.registerCommand("vscode-FileSystemToolbox.OpenWorkspaceFile", () => {
            pathStrings.openWorkspaceFile();
        })
    );

    // path transformation
    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand("vscode-FileSystemToolbox.TransformPathToPosix", () => {
            pathStrings.transformPath(pathStrings.PathTransformationType.posix);
        })
    );
    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand("vscode-FileSystemToolbox.TransformPathToWin32", () => {
            pathStrings.transformPath(pathStrings.PathTransformationType.win32);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand("vscode-FileSystemToolbox.NormalizePath", () => {
            pathStrings.normalizePath();
        })
    );
    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand("vscode-FileSystemToolbox.expandHomeDirAlias", () => {
            pathStrings.expandHomeDirAlias();
        })
    );

    // path completer
    const completionProvider = vscode.languages.registerCompletionItemProvider(
        "*",
        {
            provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
                let currentFolder = pathCompleter.getUserPath();
                if (!currentFolder) {
                    return;
                }

                return pathCompleter.getCompletionItems(currentFolder, document, position);
            },
        },
        ...["/", "\\"]
    );
    context.subscriptions.push(completionProvider);
}

// this method is called when your extension is deactivated
export function deactivate() {
    console.log("vscode-FileSystemToolbox unloaded");
}
