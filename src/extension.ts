import * as vscode from 'vscode';
import * as files from './files';
import * as workspaces from './workspaces';
import * as folders from './folders';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log("vscode-FSToolbox is active");

	// files
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('vscode-FSToolbox.CopyFilePath', () => { files.copyFilePath(false); }));
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('vscode-FSToolbox.CopyFileName', () => { files.copyFileName(false); }));
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('vscode-FSToolbox.CopyFileNameWithoutExtension', () => { files.copyFileNameWithoutExtension(); }));
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('vscode-FSToolbox.CopyFilePathWithLineNumber', () => { files.copyFilePath(true); }));
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('vscode-FSToolbox.CopyFileNameWithLineNumber', () => { files.copyFileName(true); }));
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('vscode-FSToolbox.CopyRelativeFilePath', () => { files.copyRelativeFilePath(false); }));
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('vscode-FSToolbox.CopyRelativeFilePathWithLineNumber', () => { files.copyRelativeFilePath(true); }));

	// folders
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('vscode-FSToolbox.CopyFolderPath', () => { folders.copyFolderPath(); }));

	// workspaces
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('vscode-FSToolbox.CopyWorkspaceRootPath', () => { workspaces.getWorkspaceRootPath(); }));
}

// this method is called when your extension is deactivated
export function deactivate() {
	console.log("vscode-FSToolbox unloaded");
}
