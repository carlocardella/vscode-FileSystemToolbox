import { getDocumentUri, writeClipboard, log, getLineNumberOrRange, getActiveEditor, getLinesFromSelection } from "./shared";
import * as path from "path";
import { Uri, window, workspace, TextEditor } from "vscode";
import { EOL } from "os";

/**
 * The type of file path to return as file metadata
 * @export
 * @enum {number}
 */
// prettier-ignore
export enum FileMetadataType {
    "fullPath"     = "fullPath",
    "fileName"     = "fileName",
    "relativePath" = "relativePath",
}

/**
 * Returns file metadata
 * @export
 * @param {FileMetadataType} metadataType The type of path metadata to return
 * @param {boolean} appendSelectionRange Append the selected line or lines range
 * @param {Uri} [uri] Optional URI to use instead of the active editor
 * @return {*}  {(Promise<string | undefined>)}
 */
export async function getFileMetadata(metadataType: FileMetadataType, appendSelectionRange: boolean, uri?: Uri): Promise<string | undefined> {
    const filePath = getFilePath(uri);
    if (!filePath) {
        return Promise.reject();
    }

    let fileMetadata: string | undefined;
    switch (metadataType) {
        case FileMetadataType.fileName:
            fileMetadata = path.parse(filePath).base;
            break;
        case FileMetadataType.fullPath:
            fileMetadata = getFilePath();
            break;
        case FileMetadataType.relativePath:
            fileMetadata = workspace.asRelativePath(filePath);
            break;
        default:
            break;
    }

    if (appendSelectionRange) {
        let lineNumberOrRange: string = await getLineNumberOrRange();
        fileMetadata = fileMetadata + ":" + lineNumberOrRange;
    }

    return Promise.resolve(fileMetadata);
}

/**
 * Returns the active file path
 * @export
 * @param {Uri} [uri] Optional URI to use instead of the active editor
 * @return {*}  {(string | undefined)}
 */
export function getFilePath(uri?: Uri): string | undefined {
    let filePath: string | undefined;
    uri ? (filePath = uri.fsPath) : (filePath = getDocumentUri()?.fsPath);
    return filePath;
}

/**
 * Copies the path of the file open in the current editor to the clipboard
 * @export
 * @param {boolean} appendSelectionRange Optionally copies the file path with the active line number
 * @param {Uri} [uri] Optional URI to use instead of the active editor
 * @return {*}
 */
export async function copyFilePath(appendSelectionRange: boolean, uri?: Uri) {
    const filePath = await getFileMetadata(FileMetadataType.fullPath, appendSelectionRange, uri);
    if (!filePath) {
        return;
    }

    await writeClipboard(filePath);
}

/**
 * Copes the name of the file open in the current editor to the clipboard
 * @export
 * @param {boolean} appendSelectionRange Optionally copies the file name with the active line number
 * @return {*}
 */
export async function copyFileName(appendSelectionRange: boolean, uri?: Uri) {
    const fileName = await getFileMetadata(FileMetadataType.fileName, appendSelectionRange, uri);
    if (!fileName) {
        return;
    }

    await writeClipboard(fileName);
}

/**
 * Copy the name of the file open in the current editor, without extension
 * @export
 * @param {boolean} appendSelectionRange Optionally copies the file name with the active line number
 * @return {*}
 */
export async function copyFileNameWithoutExtension(uri?: Uri) {
    const fileName = getFileName(uri);
    if (!fileName) {
        return;
    }

    await writeClipboard(path.parse(fileName).name);
}

/**
 * Copy the path of the file open in the editor relative to the workspace root folder.
 * If there is no workspace or folder open, the function returns undefined
 * @export
 * @param {boolean} appendSelectionRange Append the active line number of selected lines range
 * @return {*}  {(string | undefined)}
 */
export async function copyRelativeFilePath(appendSelectionRange: boolean): Promise<string | undefined> {
    const relativeFilePath = await getFileMetadata(FileMetadataType.relativePath, appendSelectionRange);
    if (!relativeFilePath) {
        return;
    }

    writeClipboard(relativeFilePath);
}

/**
 * Returns the active file name
 * @export
 * @param {boolean} appendSelectionRange Optionally copies the file name with the active line number
 * @return {*}  {(string | undefined)}
 */
export function getFileName(uri?: Uri): string | undefined {
    const filePath = getFilePath(uri);
    if (!filePath) {
        return undefined;
    }

    return path.parse(filePath).base;
}

/**
 * Return the active file path relative to the workspace root.
 * If there is no active workspace, returns the file full path.
 * @export
 * @return {*}  {(string | undefined)}
 */
export function getRelativeFilePath(): string | undefined {
    const filePath = getDocumentUri()?.fsPath;
    if (!filePath) {
        log("No active file found");
        return;
    }

    let relativeFilePath = workspace.asRelativePath(filePath);
    if (!relativeFilePath) {
        console.log("No active workspace found");
        return;
    }

    return relativeFilePath;
}

/**
 * Copy the selected text along with selection and file metadata: file path, selection range, line numbers.
 * Metadata details can be configured in Settings
 * @export
 * @return {*}  {(Promise<string | undefined | void>)}
 */
export async function copySelectionWithMetadata(): Promise<string | undefined | void> {
    if (window.activeTextEditor?.selection.isEmpty) {
        return Promise.reject();
    }

    let config = workspace.getConfiguration("FileSystemToolbox", window.activeTextEditor?.document);

    let filePath: string | undefined;
    switch (config.get("CopyMetadataPathType")) {
        case "fullPath":
            filePath = await getFileMetadata(FileMetadataType.fullPath, config.get("CopyMetadataSelectionRange")!);
            break;
        case "fileName":
            filePath = await getFileMetadata(FileMetadataType.fileName, config.get("CopyMetadataSelectionRange")!);
            break;
        case "relativePath":
            filePath = await getFileMetadata(FileMetadataType.relativePath, config.get("CopyMetadataSelectionRange")!);
            break;
        default:
            break;
    }

    let metadata: string[] = [];

    const editor = getActiveEditor();
    if (!editor) {
        return Promise.reject();
    }

    let selectedLines = getLinesFromSelection(editor);
    if (!selectedLines) {
        return Promise.reject();
    }

    // prepare the metadata content
    metadata = selectedLines.map((s) => {
        let copiedLine: string = "";
        config.get("MetadataCopyLineNumbers") ? (copiedLine = `${s.lineNumber + 1}: ${s.text}`) : (copiedLine = s.text);
        return copiedLine;
    });

    if (config.get("MetadataPathPosition") === "below") {
        if (config.get("MetadataSeparatePathWithEmptyLine")) {
            metadata.push("");
        }
        metadata.push(filePath!);
    } else {
        if (config.get("MetadataSeparatePathWithEmptyLine")) {
            metadata.unshift("");
        }
        metadata.unshift(filePath!);
    }

    // copy to clipboard
    await writeClipboard(metadata.join(EOL));
    return Promise.resolve();
}

export async function moveFile(fileUris: Uri[]) {
    if (!fileUris) {
        return;
    }

    const destinationFolder = await window.showOpenDialog({ canSelectMany: false, title: "Select destination folder", canSelectFolders: true });
    if (!destinationFolder) {
        return;
    }

    fileUris.forEach((uri) => {
        let fileName = path.basename(uri.fsPath);

        let destinationUri = Uri.joinPath(destinationFolder[0], fileName);
        workspace.fs.stat(destinationUri).then(
            (stat) => {
                window.showWarningMessage(`Destination file already exists: ${destinationUri.fsPath}`);
                return;
            },
            (err) => {
                // the destination file does not exist, we can attempt to move it (this may still fail if the user does not have write permissions)
                try {
                    workspace.fs.rename(uri, destinationUri, { overwrite: false });
                } catch (error) {
                    console.log(error);
                    window.showErrorMessage(`Failed to move file: ${error}`);
                    return;
                }
            }
        );
    });
}
