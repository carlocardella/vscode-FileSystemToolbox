import * as vscode from "vscode";
import * as files from "./modules/files";
import * as workspaces from "./modules/workspaces";
import * as folders from "./modules/folders";
import * as crud from "./modules/crud";
import * as pathStrings from "./modules/pathStrings";
import * as pathCompleter from "./modules/pathCompleter";
import { getCompletionItems, getPathCompletionConfiguration } from "./modules/pathCompleter";
import * as path from "path";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
// prettier-ignore
export function activate(context: vscode.ExtensionContext) {
	console.log("vscode-FileSystemToolbox is active");

	// files
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('vscode-FileSystemToolbox.CopyFileName', () => { files.copyFileName(false); }));
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('vscode-FileSystemToolbox.CopyFileNameWithoutExtension', () => { files.copyFileNameWithoutExtension(); }));
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('vscode-FileSystemToolbox.CopyFilePathWithLineNumber', () => { files.copyFilePath(true); }));
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('vscode-FileSystemToolbox.CopyFileNameWithLineNumber', () => { files.copyFileName(true); }));
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('vscode-FileSystemToolbox.CopyRelativeFilePath', () => { files.copyRelativeFilePath(false); }));
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('vscode-FileSystemToolbox.CopyRelativeFilePathWithLineNumber', () => { files.copyRelativeFilePath(true); }));
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('vscode-FileSystemToolbox.DuplicateFile', () => { crud.duplicateFile(); }));
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('vscode-FileSystemToolbox.RemoveFile', () => { crud.removeFile(); }));
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('vscode-FileSystemToolbox.NewFileRelativeToCurrentFile', () => { crud.askForFilePathAndName(true, false); }));
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('vscode-FileSystemToolbox.NewFileRelativeToWorkspaceRoot', () => { crud.askForFilePathAndName(false, true); }));

	context.subscriptions.push(vscode.commands.registerTextEditorCommand('vscode-FileSystemToolbox.CopySelectionWithMetadata', () => { files.copySelectionWithMetadata(); }));

	// folders
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('vscode-FileSystemToolbox.CopyFolderPath', () => { folders.copyFolderPath(false); }));
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('vscode-FileSystemToolbox.CopyRelativeFolderPath', () => { folders.copyFolderPath(true); }));

	// workspaces
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('vscode-FileSystemToolbox.CopyWorkspaceRootPath', () => { workspaces.getWorkspaceRootPath(); }));

	// path transformation
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('vscode-FileSystemToolbox.TransformPathToPosix', () => { pathStrings.transformPath(pathStrings.PathTransformationType.posix); }));
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('vscode-FileSystemToolbox.TransformPathToWin32', () => { pathStrings.transformPath(pathStrings.PathTransformationType.win32); }));

	// path intellisense
	// let pathCompletionSeparator: string = vscode.workspace.getConfiguration("fst").get("pathCompletionSeparator")!;
	// if (pathCompletionSeparator === "SystemDefault") { pathCompletionSeparator = path.sep; };
	const completionProvider = vscode.languages.registerCompletionItemProvider(
        "*",
        {
            provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
                let currentFolder = pathCompleter.getUserPath();
                if (!currentFolder) {
                    return;
                }

                return getCompletionItems(currentFolder);
            },
        },
        ...["/", "\\"]
		// pathCompletionSeparator
	);
    context.subscriptions.push(completionProvider);
}

// this method is called when your extension is deactivated
export function deactivate() {
    console.log("vscode-FileSystemToolbox unloaded");
}
