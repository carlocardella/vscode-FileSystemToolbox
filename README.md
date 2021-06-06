# VSCode File System Toolbox

![.github/workflows/BuildAndPublish.yml](https://github.com/carlocardella/vscode-FileSystemToolbox/workflows/.github/workflows/BuildAndPublish.yml/badge.svg?branch=master)
![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/carlocardella.vscode-fileSystemToolbox)
![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/carlocardella.vscode-fileSystemToolbox)
![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/carlocardella.vscode-fileSystemToolbox)
![Visual Studio Marketplace Rating](https://img.shields.io/visual-studio-marketplace/r/carlocardella.vscode-fileSystemToolbox)
[![GitHub issues](https://img.shields.io/github/issues/carlocardella/vscode-FileSystemToolbox.svg)](https://github.com/carlocardella/vscode-FileSystemToolbox/issues)
[![GitHub license](https://img.shields.io/github/license/carlocardella/vscode-FileSystemToolbox.svg)](https://github.com/carlocardella/vscode-FileSystemToolbox/blob/master/LICENSE.md)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/carlocardella/vscode-FileSystemToolbox.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fgithub.com%2Fcarlocardella%2Fvscode-FileSystemToolbox)

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
* Convert path string to posix format
* Convert path string to win32 format
* Copy text selection with file metadata (line numbers, file path, selection range)

### Thanks to

File System Toolbox is freely inspired by these fine extensions:

* [Open file](https://marketplace.visualstudio.com/items?itemName=Fr43nk.seito-openfile)
* [File Utils](https://marketplace.visualstudio.com/items?itemName=sleistner.vscode-fileutils)
* [Copy Relative Path and Line Numbers](https://marketplace.visualstudio.com/items?itemName=ezforo.copy-relative-path-and-line-numbers)
* [Path autocomplete](https://marketplace.visualstudio.com/items?itemName=ionutvmi.path-autocomplete)
* [Path Tools](https://marketplace.visualstudio.com/items?itemName=cg-cnu.vscode-path-tools)