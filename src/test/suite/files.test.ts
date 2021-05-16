import { before, describe, after } from "mocha";
import * as assert from 'assert';
import { window, workspace, Uri, Selection } from 'vscode';
import { copyFilePath, copyFileName, copyFileNameWithoutExtension } from '../../modules/files';
import * as path from 'path';
import { sleep, readClipboard, closeTextEditor } from './testHelpers';
import * as vscode from 'vscode';

suite("Files", () => {
    const testFilePath = path.join(__dirname, "../../../src/test/assets/test.txt");
    before(async () => {
        console.log("Starting Files tests");
    });

    describe("No workspace", () => {
        before(async () => {
            await workspace.openTextDocument(testFilePath).then(doc => { window.showTextDocument(doc); });
            await sleep(500);
        });
        after(async () => {
            await sleep(500);
            await closeTextEditor(true);
        });

        const testFileName = [
            { f: copyFileName, description: "Copy file name", copyLineNumber: false, useRanges: false, expected: "test.txt" },
            { f: copyFileName, description: "Copy file name with line number", copyLineNumber: true, useRanges: false, expected: 'test.txt:2' },
            { f: copyFileName, description: "Copy file name with line ranges", copyLineNumber: true, useRanges: true, expected: 'test.txt:2~3;5' },
            { f: copyFilePath, description: "Copy file path", copyLineNumber: false, useRanges: false, expected: testFilePath },
            { f: copyFilePath, description: "Copy file path with line number", copyLineNumber: true, useRanges: false, expected: `${testFilePath}:2` },
            { f: copyFilePath, description: "Copy file path with line ranges", copyLineNumber: true, useRanges: true, expected: `${testFilePath}:2~3;5` }
        ];

        testFileName.forEach(t => {
            test(`${t.description}`, async () => {
                if (t.copyLineNumber) {
                    const editor = vscode.window.activeTextEditor;
                    let selections: Selection[] = [];
                    if (t.useRanges) {
                        selections.push(new Selection(1, 0, 2, 6));
                        selections.push(new Selection(4, 0, 4, 5));
                        editor!.selections = selections;
                    }
                    else {
                        selections.push(new Selection(2, 0, 2, 0));
                        editor!.selections = selections;
                    }
                };
                t.f(t.copyLineNumber!);

                let clipContent = await readClipboard();

                assert.deepStrictEqual(clipContent, t.expected);
            });
        });

        test("Copy file name without extension", async () => {
            copyFileNameWithoutExtension();
            let clipContent = await readClipboard();
            assert.deepStrictEqual(clipContent, "test");
        });
    });

    describe.skip("Workspace", () => {
        test("Copy file name in workspace", async () => {
            workspace.updateWorkspaceFolders(0, null, { uri: Uri.file(__dirname) });
            // await sleep(500);


            console.log(workspace.workspaceFolders);
        });
    });
});
