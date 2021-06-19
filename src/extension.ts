import * as vscode from "vscode";
import * as files from "./modules/files";
import * as workspaces from "./modules/workspaces";
import * as folders from "./modules/folders";
import * as crud from "./modules/crud";
import * as pathStrings from "./modules/pathStrings";
import * as pathCompleter from "./modules/pathCompleter";
import { TextDocument, CompletionList, CompletionItem } from "vscode";
import * as fs from "fs";
import * as path from "path";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
// prettier-ignore
export function activate(context: vscode.ExtensionContext) {
	console.log("vscode-FileSystemToolbox is active");

	// files
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('vscode-FileSystemToolbox.CopyFilePath', () => { files.copyFilePath(false); }));
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
	
	context.subscriptions.push(
        vscode.commands.registerTextEditorCommand("vscode-FileSystemToolbox.test", () => {
            pathCompleter.test();
        })
    );


	// path intellisense
	   var selector : vscode.DocumentSelector = [{
        pattern: '*'
	}];
	// context.subscriptions.push(vscode.languages.registerCompletionItemProvider(selector, new PathAutocomplete(), "/", "\\"));
	// context.subscriptions.push(vscode.languages.registerCompletionItemProvider(selector, { provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) { pathCompleter.provideCompletionItems();}}, "/"));

	// const provider2 = vscode.languages.registerCompletionItemProvider(
    //     "*",
    //     // {
    //     //     provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
    //     //         // get all text until the `position` and check if it reads `console.`
    //     //         // and if so then complete if `log`, `warn`, and `error`
    //     //         const linePrefix = document.lineAt(position).text.substr(0, position.character);
    //     //         if (!linePrefix.endsWith("console.")) {
    //     //             return undefined;
    //     //         }

    //     //         return [
    //     //             new vscode.CompletionItem("log", vscode.CompletionItemKind.Method),
    //     //             new vscode.CompletionItem("warn", vscode.CompletionItemKind.Method),
    //     //             new vscode.CompletionItem("error", vscode.CompletionItemKind.Method),
    //     //         ];
    //     //     },
    //     // },
	// 	pathCompleter.provideCompletionItems(),
	// 	// new pathCompleter.pathCompletion(),
    //     "/" // triggered whenever a '.' is being typed
    // );

	const provider2 = vscode.languages.registerCompletionItemProvider(
		"*",
        {
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				
				let folderItems = fs.readdirSync("C:/Temp/", null);

				let completionItems = folderItems.map((item) => {
					return new vscode.CompletionItem(item);
				});

				return completionItems;
            },
        },
		"/"
    );

    context.subscriptions.push(provider2);
}

// this method is called when your extension is deactivated
export function deactivate() {
    console.log("vscode-FileSystemToolbox unloaded");
}
