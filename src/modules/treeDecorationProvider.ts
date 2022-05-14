import { CancellationToken, Disposable, FileDecoration, FileDecorationProvider, ProviderResult, Uri, window } from "vscode";

class TreeDecorationProvider implements FileDecorationProvider {
    private _disposables: Disposable[];

    constructor() {
        this._disposables = [];
        this._disposables.push(window.registerFileDecorationProvider(this));
    }

    provideFileDecoration(uri: Uri, token: CancellationToken): ProviderResult<FileDecoration> {
        if (uri.scheme !== "file") {
            return {};
		}
		
        return {};
    }
}
