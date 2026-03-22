---
"@quicktask/core": patch
"quicktask-vscode": patch
"quicktask-openclaw": patch
---

## New Features

- Add approved `/qt` discovery and diagnostics commands (`list`, `show`, `doctor`) with end-to-end adapter rendering support.

## Bug Fixes

- Fix command-surface drift risk by introducing contract checks that fail when runtime result codes diverge from docs or adapter coverage.

## Internal Improvements

- Unify host rendering through shared core mapping, expand adapter lifecycle/parity smoke coverage, and tighten VS Code chat compatibility handling.

## Breaking Changes

- None.
