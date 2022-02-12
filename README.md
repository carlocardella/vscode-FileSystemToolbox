# VSCode File System Toolbox

![.github/workflows/BuildAndPublish.yml](https://github.com/carlocardella/vscode-FileSystemToolbox/workflows/.github/workflows/BuildAndPublish.yml/badge.svg?branch=master)
![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/carlocardella.vscode-fileSystemToolbox)
![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/carlocardella.vscode-fileSystemToolbox)
![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/carlocardella.vscode-fileSystemToolbox)
![Visual Studio Marketplace Rating](https://img.shields.io/visual-studio-marketplace/r/carlocardella.vscode-fileSystemToolbox)
[![GitHub issues](https://img.shields.io/github/issues/carlocardella/vscode-FileSystemToolbox.svg)](https://github.com/carlocardella/vscode-FileSystemToolbox/issues)
[![GitHub license](https://img.shields.io/github/license/carlocardella/vscode-FileSystemToolbox.svg)](https://github.com/carlocardella/vscode-FileSystemToolbox/blob/master/LICENSE.md)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/carlocardella/vscode-FileSystemToolbox.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fgithub.com%2Fcarlocardella%2Fvscode-FileSystemToolbox)
<!-- [![Open in Visual Studio Code](https://open.vscode.dev/badges/open-in-vscode.svg)](https://open.vscode.dev/carlocardella/vscode-filesystemtoolbox) -->

[Install for VS Code](https://marketplace.visualstudio.com/items?itemName=CarloCardella.vscode-filesystemtoolbox)

[Install for VS Codium](https://open-vsx.org/extension/carlocardella/vscode-filesystemtoolbox)

Collection of tools to work with the File System.

The marketplace has a number of great extensions to work with files and folder, I installed a few of them to cover the entire range of actions I normally use, unfortunately that means there is some overlapping between them, basically the same action is contributed by multiple extensions. That is what motivated me to build this extension: I like the idea to have a single extension for all those operations and without duplicates; plus, it is a good pastime 😊.

Please open an issue to leave a comment, report a bug, request a feature etc... (you know the drill).

## Workspace Trust

The extension does not require any special permission, therefore is enabled to run in an [Untrusted Workspace](https://github.com/microsoft/vscode/issues/120251).

## Current list of commands

* Copy file name
* Copy file name without extension
* Copy file name with line number or range (e.g. `file.txt:2~8` for a selection from line 2 through 8)
  * Supports multiple selections
  * Multiple ranges are separated by `;`
* Copy full file path
* Copy full file path with line number or range (e.g. `C:\temp\file.txt:2~8` for a selection from line 2 through 8)
  * Supports multiple selections
  * Multiple ranges are separated by `;`
* Copy containing folder full path
* Copy relative file path
* Copy relative file path with line number
* Copy workspace folder path
* Copy workspace root path
* Copy folder path
* Copy relative folder path
* Transform path string to posix format
* Transform path string to win32 format
* Copy text selection with file metadata (line numbers, file path, selection range)
* New file relative to current file path
* New file relative to workspace root
* Duplicate active file
* Remove active file
* Open file under cursor
* Normalize path (platform specific)
* Expand home dir alias
* Open workspace file

### Path Autocomplete

a.k.a. `path intellisense`, in other words, you can start typing a file system path and the extension will suggest completion items, as you are probably already used to with your programming language of choice.

The feature is enabled by default and can be customized through these settings:

* `FileSystemToolbox.EnablePathCompleter` (default `true`):
  * Easy to guess, change this to `false` and the path autocomplete feature will be completely disabled
* `FileSystemToolbox.PathCompleterAppendPathSeparator` (default `true`):
  * If enabled and if you select a folder from the autocompletion, it appends the default path separator and automatically shows the next list of completion items
* `FileSystemToolbox.PathCompleterSeparator` (default `SystemDefault`):
  * Controls the path separator you want to use: by default it uses the System separator (`\` on Windows, `/` on Linux/macOS)
* `FileSystemToolbox.PathCompleterTriggerOutsideQuotes` (default `true`):
  * Show the path autocompletion even if the cursor is not within quotes. Supported quotes are
    * Single quotes: `'`
    * Double quotes: `"`
    * Backtick: `` ` ``
* `FileSystemToolbox.PathCompleterExpandHomeDirAlias` (default `false`)
  * Expand home dir aliases:
    * `~`
    * `HOME`
* `FileSystemToolbox.PathCompleterUseSlashInJsonFile` (default `true`)
  * Use the slash character as path separator in JSON file, regardless of the OS default (e.g. on Windows)

![path autocomplete](/Assets/path_autocomplete.gif)

### Thanks to

File System Toolbox is freely inspired by these fine extensions:

* [Open file](https://marketplace.visualstudio.com/items?itemName=Fr43nk.seito-openfile)
* [File Utils](https://marketplace.visualstudio.com/items?itemName=sleistner.vscode-fileutils)
* [Copy Relative Path and Line Numbers](https://marketplace.visualstudio.com/items?itemName=ezforo.copy-relative-path-and-line-numbers)
* [Path autocomplete](https://marketplace.visualstudio.com/items?itemName=ionutvmi.path-autocomplete)
* [Path Tools](https://marketplace.visualstudio.com/items?itemName=cg-cnu.vscode-path-tools)
