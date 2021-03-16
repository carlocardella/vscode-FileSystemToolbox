import { before, describe } from "mocha";
import * as assert from 'assert';
import { Uri, window, workspace, env } from "vscode";
import * as vscode from 'vscode';
import { copyFilePath } from "../../files";
import * as path from 'path';
import { sleep } from "../helpers";

suite("Files", () => {
    before(() => {
        console.log("Starting files tests");
    });

    describe("File path", () => {
        test("Copy file path", async () => {
            const workspaceFilePath = path.join(workspace.workspaceFolders![0].uri.fsPath, "ws1/ws1_1.txt");
            const fileUri = Uri.file(workspaceFilePath);
            await workspace.openTextDocument(fileUri).then((doc) => {
                window.showTextDocument(doc);
            });
            await sleep(500);

            // const editor = vscode.window.activeTextEditor;
            // const position = editor!.selection.active;
            // var newPosition = position.with(3, 0);
            // var newSelection = new vscode.Selection(newPosition, newPosition);
            // editor!.selection = newSelection;

            copyFilePath(false);
            const clip = env.clipboard.readText();
            assert.deepStrictEqual(clip, workspaceFilePath);
        });
    });
});