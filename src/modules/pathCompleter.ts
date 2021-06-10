import { CancellationToken, CompletionContext, Position, TextDocument } from "vscode";

/*
TODO: configuration
separator format: system, win32, posix
trigger character: /, \, drive letter

recognize and trigger home directory notation: ~\, HOME\, $HOME\, $env: if powershell
*/

export async function provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext) {

}
