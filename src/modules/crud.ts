import { getFilePath, getFileName } from './files';
import { getFolderPath } from './folders';
import * as path from 'path';
import { askForDuplicateName, notImplementedException, ValueSelection, getDocumentUri, getWorkspaceFolder } from './shared';
import { Uri, workspace, window } from 'vscode';

export async function duplicateFile(): Promise<void> {
    const currentFilePath = getFilePath();
    if (!currentFilePath) { return Promise.resolve(); }

    const folderPath = getFolderPath(false);
    if (!folderPath) { return Promise.resolve(); }

    const currentFileName = getFileName();
    if (!currentFileName) { return; }

    const valueSelection: ValueSelection = {
        start: folderPath.length + 1,
        end: currentFilePath.length - currentFileName.lastIndexOf(path.parse(currentFileName).ext)
    };
    const targetFileName = await askForDuplicateName(
        currentFilePath,
        "Choose the new file name",
        valueSelection
    );
    if (!targetFileName) { return; }

    workspace.fs.copy(Uri.file(currentFilePath),
        Uri.file(targetFileName),
        { overwrite: false });

    // workspace.openTextDocument(targetFileName).then(doc => {
    //     window.showTextDocument(doc);
    // });
    return new Promise((resolve, reject) => {
        workspace.openTextDocument(targetFileName).then(
            (doc) => {
                window.showTextDocument(doc);
                return resolve();
            },
            (err) => {
                return reject(err);
            }
        );
    });
}

export async function removeFile(): Promise<boolean> {
    const documentUri = getDocumentUri();
    if (!documentUri) { return Promise.reject(false); };

    workspace.fs.delete(documentUri);
    return Promise.resolve(true);
}

export async function askForFilePathAndName(relativeToCurrentFile?: boolean, relativeToWorkspaceRoot?: boolean): Promise<void> {
    let newFilePath: string = "";

    if (relativeToCurrentFile) {
        let currentFilePath = getDocumentUri()?.fsPath;
        if (!currentFilePath) { return Promise.reject(); };

        let folderPath = path.parse(currentFilePath).dir;
        let fileName = await askForFilePathAndNameInternal(folderPath);
        if (!fileName) { return Promise.reject(); };

        newFilePath = path.join(currentFilePath, fileName);
    }

    if (relativeToWorkspaceRoot) {
        let workspaceFolder = getWorkspaceFolder()?.uri.fsPath;
        if (!workspaceFolder) { return Promise.reject(); };

        let fileName = await askForFilePathAndNameInternal(workspaceFolder);
        if (!fileName) { return Promise.reject(); };

        newFilePath = path.join(workspaceFolder, fileName);
    }

    createNewFile(newFilePath);

    return Promise.reject();
}

async function askForFilePathAndNameInternal(folderPath: string): Promise<string | undefined> {
    let fileName = await window.showInputBox({
        ignoreFocusOut: true,
        prompt: "Enter the new file name",
        value: folderPath
    });

    if (!fileName) { return Promise.reject(); };

    return Promise.resolve(fileName);
}

export async function createNewFile(newFilePath: string): Promise<boolean> {
    notImplementedException();

    const uri = Uri.file(newFilePath);
    workspace.fs.writeFile(uri, new Uint8Array()).then(_ => {
        workspace.openTextDocument(uri).then((doc) => {
            Promise.resolve(window.showTextDocument(doc));
        });
    });

    return Promise.resolve(true);
}
