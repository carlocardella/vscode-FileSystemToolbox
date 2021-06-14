# Change Log

All notable changes to the "vscode-FileSystemToolbox" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

### Files

* Open file path under cursor
* Open file path under cursor in external default editor
* Copy relative path relative to current file
* Copy absolute path relative to current file

### Folders

* Copy containing folder relative path
* New folder in workspace/folder root
* New folder relative to current file

### Workspace

* Copy workspace name

### Others

* Show path autocomplete
* Make Relative
* Resolve
* Normalize
* Convert HOME to ~
* Convert ~ to HOME
* Create tree with braces as placeholder, e.g. `/folder/{d1,d2,d2}` created folders `d1`, `d2` and `d3` under `/folder`
  * Create files under each leaf folder with the same braces mechanism

## Log

## [0.0.3] - @todo

### Added

* Copy text selection with file metadata (line numbers, file path, selection range)
* Enabled context menu commands: `Edit/Copy As` and editor title
* `New file relative to current file`
* `New file relative to workspace root`

### Changed

* Updated `Remove File`:
  * Prompt the user to confirm the operation
  * Move the file to Recycle Bin

## [0.0.2] - 2021-06-05

### Changed

* Fixed `win32` and `posix` conversion command names

## [0.0.1] - 2021-06-01

## Added

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
* Duplicate file
* Remove file in the active editor
