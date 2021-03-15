import { before, describe } from "mocha";
import * as assert from 'assert';
import { Uri, window, workspace, env } from "vscode";
import * as vscode from 'vscode';
import { copyFilePath } from "../../files";

suite("Files", () => {
    before(() => {
        console.log("Starting files tests");
    });

    describe("File path", () => {
        test("Copy file path", () => {
            const workspaceFilePath = "${workspaceFolder}/assets/ws1/ws1_1.txt";
            workspace.openTextDocument(workspaceFilePath);
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