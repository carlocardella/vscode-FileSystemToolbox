import { before, describe, after } from "mocha";
import * as assert from 'assert';
import { window, workspace, Uri } from 'vscode';
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
            { f: copyFileName, description: "Copy file name", copyLineNumber: false, expected: "test.txt" },
            { f: copyFileName, description: "Copy file name with line number", copyLineNumber: true, expected: 'test.txt:2' },
            { f: copyFilePath, description: "Copy file path", copyLineNumber: false, expected: testFilePath },
            { f: copyFilePath, description: "Copy file path with line number", copyLineNumber: true, expected: `${testFilePath}:2` }
        ];

        testFileName.forEach(t => {
            test(`${t.description}`, async () => {
                if (t.copyLineNumber) {
                    const editor = vscode.window.activeTextEditor;
                    const position = editor!.selection.active;
                    var newPosition = position.with(2, 2);
                    var newSelection = new vscode.Selection(newPosition, newPosition);
                    editor!.selection = newSelection;
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
