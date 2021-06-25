import { getFilePath, getFileName } from "./files";
import { getFolderPath } from "./folders";
import * as path from "path";
import { askForDuplicateName, notImplementedException, ValueSelection, getDocumentUri, getWorkspaceFolder } from "./shared";
import { Uri, workspace, window, WorkspaceEdit } from "vscode";
import * as os from "os";

/**
 * Duplicate the file open in the active editor
 * @export
 * @return {*}  {Promise<void>}
 */
export async function duplicateFile(): Promise<void> {
    const currentFilePath = getFilePath();
    if (!currentFilePath) {
        return Promise.resolve();
    }

    const folderPath = getFolderPath(false);
    if (!folderPath) {
        return Promise.resolve();
    }

    const currentFileName = getFileName();
    if (!currentFileName) {
        return;
    }

    const valueSelectionStart = folderPath.length + 1;
    const valueSelectionEnd = currentFileName.lastIndexOf(path.parse(currentFileName).ext);
    const valueSelection: ValueSelection = {
        start: valueSelectionStart,
        end: valueSelectionStart + valueSelectionEnd,
    };
    const targetFileName = await askForDuplicateName(currentFilePath, "Choose the new file name", valueSelection);
    if (!targetFileName) {
        return;
    }

    await workspace.fs.copy(Uri.file(currentFilePath), Uri.file(targetFileName), { overwrite: false });

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

/**
 * Remove the file open in the active editor
 * @export
 * @return {*}  {Promise<boolean>}
 */
export async function removeFile(): Promise<boolean> {
    const documentUri = getDocumentUri();
    if (!documentUri) {
        return Promise.reject(false);
    }

    // ask the use to confirm file removal
    let answer = await window.showInformationMessage(`Are you sure you want to remove ${documentUri.fsPath}?`, { modal: true }, "Move to Recycle Bin");
    if (!answer) {
        return Promise.reject();
    }

    const wEdit = new WorkspaceEdit();
    wEdit.deleteFile(documentUri);
    await workspace.applyEdit(wEdit);

    return Promise.resolve(true);
}

/**
 * Ask the user to the path and name of the new file to create.
 * @export
 * @param {boolean} [relativeToCurrentFile] Create the new file relative to the file open in the active editor
 * @param {boolean} [relativeToWorkspaceRoot] Create the file relative to the workspace root
 * @return {*}  {Promise<void>}
 */
export async function askForFilePathAndName(relativeToCurrentFile?: boolean, relativeToWorkspaceRoot?: boolean): Promise<void> {
    let newFilePath: string = "";

    if (relativeToCurrentFile) {
        let currentFilePath = getDocumentUri()?.fsPath;
        if (!currentFilePath) {
            return Promise.reject();
        }

        let folderPath = path.parse(currentFilePath).dir;
        let fileName = await askForFilePathAndNameInternal(folderPath);
        if (!fileName) {
            return Promise.reject();
        }

        newFilePath = fileName;
    }

    if (relativeToWorkspaceRoot) {
        let workspaceFolder = getWorkspaceFolder()?.uri.fsPath;
        if (!workspaceFolder) {
            return Promise.reject();
        }

        let fileName = await askForFilePathAndNameInternal(workspaceFolder);
        if (!fileName) {
            return Promise.reject();
        }

        newFilePath = path.join(workspaceFolder, fileName);
    }

    createNewFile(newFilePath);

    return Promise.reject();
}

/**
 * Ask for new file path and name
 * @param {string} folderPath
 * @return {*}  {(Promise<string | undefined>)}
 */
async function askForFilePathAndNameInternal(folderPath: string): Promise<string | undefined> {
    let fileName = await window.showInputBox({
        ignoreFocusOut: true,
        prompt: "Enter the new file name",
        value: folderPath + path.sep,
        valueSelection: [folderPath.length + 2, folderPath.length + 2],
    });

    if (!fileName) {
        return Promise.reject();
    }

    return Promise.resolve(fileName);
}

/**
 * Create a new file
 * @export
 * @param {string} newFilePath File path to create
 * @return {*}  {Promise<boolean>}
 */
export async function createNewFile(newFilePath: string): Promise<boolean> {
    const uri = Uri.file(newFilePath);
    workspace.fs.writeFile(uri, new Uint8Array()).then((_) => {
        workspace.openTextDocument(uri).then((doc) => {
            Promise.resolve(window.showTextDocument(doc));
        });
    });

    return Promise.resolve(true);
}
