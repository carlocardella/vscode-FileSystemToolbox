import { before, describe, after } from "mocha";
import * as assert from 'assert';
import * as path from 'path';
import { closeTextEditor, readClipboard, sleep } from "./testHelpers";
import { window, workspace } from "vscode";
import { copyFolderPath } from '../../modules/folders';

describe("Folders", () => {
    const testFilePath = path.join(__dirname, "../../../src/test/assets/test.txt");
    before(async () => {
        console.log("Starting Folders tests");
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

        test("Copy folder path", async () => {
            const expectedPath = path.dirname(testFilePath);
            copyFolderPath(false);
            let clipContent = await readClipboard();
            assert.deepStrictEqual(clipContent, expectedPath);
        });
    });
});