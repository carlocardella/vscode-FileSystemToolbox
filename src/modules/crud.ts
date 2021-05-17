import { getFilePath, getFileName } from './files';
import { getFolderPath } from './folders';
import * as path from 'path';
import { askForDuplicateName, notImplementedException, ValueSelection } from './shared';
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
    
    workspace.openTextDocument(targetFileName).then(doc => {
        window.showTextDocument(doc);
    });

    return Promise.resolve();
}

export async function removeFile(): Promise<boolean> {
    notImplementedException();
    return Promise.reject();
}