import { env } from "vscode";

export function sleep(milliseconds: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

export function readClipboard(): Promise<void> {
    return new Promise(_ => {
        env.clipboard.readText();
    });
}