import * as vscode from 'vscode';
import * as FS from './fileSystem';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log("vscode-FSToolbox is active");

	context.subscriptions.push(vscode.commands.registerTextEditorCommand('vscode-FSToolbox.CopyFileName', () => { FS.getFileName(); }));
}

// this method is called when your extension is deactivated
export function deactivate() { }
