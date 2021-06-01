import * as path from 'path';
import { getActiveEditor, getTextFromSelection } from './shared';

/**
 * Enumerates Platform path types
 * @enum {number}
 */
export enum PathTransformationType {
    'posix' = 'posix',
    'win32' = 'win32',
    'darwin' = 'darwin'
}

/**
 * Transforms the selected path string to the chosen platform type target
 * @param {PathTransformationType} type Enum the Platform types to transform the path to
 * @return {*}  {(Promise<string | undefined>)}
 */
export async function transformPath(type: PathTransformationType): Promise<string | undefined> {
    const editor = getActiveEditor();
    if (!editor) { return Promise.reject(); }

    const selection = editor.selection;
    if (!selection) { return Promise.reject(); }

    let pathString = getTextFromSelection(editor, selection);

    switch (type) {
        case PathTransformationType.posix:
            pathString = path.posix.normalize(pathString!).replace(/\\+/g, '/');
            break;

        case PathTransformationType.darwin:
            pathString = path.posix.normalize(pathString!).replace(/\\+/g, '/');
            break;

        case PathTransformationType.win32:
            pathString = path.posix.normalize(pathString!).replace(/\/+/g, '\\');
            break;

        default:
            break;
    }

    editor.edit(editBuilder => {
        editBuilder.replace(selection, pathString!);
    });
}