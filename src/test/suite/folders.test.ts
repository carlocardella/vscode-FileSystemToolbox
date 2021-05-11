import { before, describe, after } from "mocha";
import * as assert from 'assert';
import * as path from 'path';

suite("Folders", () => {
    const testFilePath = path.join(__dirname, "../../../src/test/assets/test.txt");
    before(async () => {
        console.log("Starting Folders tests");
    });

    describe("No workspace", () => {

    });
});