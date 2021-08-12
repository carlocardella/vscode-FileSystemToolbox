# Change Log

All notable changes to the "vscode-FileSystemToolbox" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

### Folders

* Copy containing folder relative path
* New folder in workspace/folder root
* New folder relative to current file

### Workspace

* Copy workspace name

### Others

* Make Relative
* Resolve
* Create tree with braces as placeholder, e.g. `/folder/{d1,d2,d2}` created folders `d1`, `d2` and `d3` under `/folder`
  * Create files under each leaf folder with the same braces mechanism

## Log

## [0.8.0] - 2021-08-12

### Changed

* Updated command labels (both in the Command Palette and context menu) and settings identifier: "fst" is now spelled out as "File System Toolbox"

### Fixed

* Various improvement around presenting path autocompletion in certain scenarios with complex lines of text

## [0.7.0] - 2021-07-31

### Added

* `Normalize path` (platform specific)
* `Expand home dir alias`: "~" and "HOME"

### Changed

* Enable path autocompletion on folder up: `..`

## [0.6.0] - 2021-07-27

### Added

* `Open file under cursor`: open the file at the current cursor position in VSCode. _Note_: this command does not support multiple cursors

## [0.5.0] - 2021-07-26

* `Path Autocomplete`, optionally expand home dir alias "~" and "HOME"
* `Path Autocomplete`, handle "." and ".." path elements

## [0.4.0] - 2021-07-24

### Changed

* `Path Autocomplete` now uses the file relative path. If the file is already seved on disk, path suggestions will start from the containing folder relative path.
* `Path Autocomplete`: improved quotes handling.

## [0.3.2] - 2021-07-16

### Added

* `Path Autocomplete` (path insellisense): enabled by default

## [0.2.0] - 2021-07-12

### Changed

* Updated context submenu commands

## [0.1.2] - 2021-06-24

### Changed

* Fixed `Duplicate File`: properly select the file name so the user can easily enter the new file name, and make sure the new file is opened in a new editor

## [0.1.1] - 2021-06-17

### Changed

* Updated context menu contributions

## [0.1.0] - 2021-06-13

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
