# Change Log

All notable changes to the "vscode-FileSystemToolbox" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

### Files

* Duplicate file
* Open file path under cursor
* Open file path under cursor in external default editor
* Copy selected range info (e.g. `file.txt:2~8` for a selection from line 2 through 8)
  * Support multiple selections
* Copy relative path relative to current file
* Copy absolute path relative to current file
* New file in workspace/folder root
* New file relative to current file
* Duplicate file

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
* Convert to posix
* Convert to windows
* Convert HOME to ~
* Convert ~ to HOME
* Copy text selection with file metadata (file path, line number)
* Create tree with braces as placeholder, e.g. `/folder/{d1,d2,d2}` created folders `d1`, `d2` and `d3` under `/folder`
  * Create files under each leaf folder with the same braces mechanism

### Context Menu

* Add relevant commands to context menu
* Context menu in `Folders` treeview
* Context menu on file tab

## Added

* Copy file name
* Copy file name without extension
* Copy file name with line number
* Copy full file path
* Copy full file path with line number
* Copy containing folder full path
* Copy relative file path
* Copy relative file path with line number
* Copy workspace folder path
