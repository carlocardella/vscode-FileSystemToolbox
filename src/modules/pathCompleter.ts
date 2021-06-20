import { Range, Uri, workspace, FileType } from 'vscode';
import { getActiveEditor } from "./shared";

/*
// @TODO: configuration
// separator format: system, win32, posix
// trigger character: /, \, drive letter
// recognize and trigger home directory notation: ~\, HOME\, $HOME\, $env: if powershell
*/

// todo: remove it
export async function test() {
    // let items = await workspace.fs.readDirectory(Uri.parse("c:/Temp/"));
    // console.log(items);

    const editor = getActiveEditor();
    let s = editor?.document.getWordRangeAtPosition(editor.selection.active, RegExp('[^"]+$'));
    console.log(getTextFromRange(s!));
}

// /**
//  * Returns the content of the passed in folder
//  * @export
//  * @param {Uri} folderUri Uri of the folder to return the content from
//  * @return {*}  {Promise<[string, FileType][]>}
//  */
// async function getFolderContent(folderUri: Uri): Promise<[string, FileType][]> {
//     return Promise.resolve(workspace.fs.readDirectory(folderUri));
// }

// /**
//  * Returns the path the user entered in the text editor
//  * @export
//  * @return {*}  {(Promise<string | undefined>)}
//  */
// export async function getUserPath(): Promise<string | undefined> {
//     const editor = getActiveEditor();

//     let range = editor?.document?.getWordRangeAtPosition(getActiveEditor()?.selection.active!, RegExp('[^\\"]+$'));
//     if (!range) {
//         return Promise.reject();
//     }

//     return Promise.resolve(await getTextFromRange(range));
// }

// /**
//  * Returns text from the selected Range
//  * @param {Range} range The Range to return text from
//  * @return {*}  {(Promise<string | undefined>)}
//  */
// export async function getTextFromRange(range: Range): Promise<string | undefined> {
//     return Promise.resolve(getActiveEditor()?.document.getText(range));
// }

export function getUserPath(): string {
    const editor = getActiveEditor();

    let range = editor?.document.getWordRangeAtPosition(editor.selection.active, RegExp('[^\\"]+$'));
    if (!range) {
        return "";
    }

    return getTextFromRange(range);
}

export function getTextFromRange(range: Range): string {
    return getActiveEditor()?.document.getText(range)!;
}
