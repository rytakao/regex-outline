# regex-outline README

Regex Outline is a Visual Studio Code extension that extracts text matching a configurable regular expression from the active document and lists the results in a dedicated Explorer view. Clicking an item in the outline jumps to the matching line in the source file.

## Features

- Show all matches of a user-defined regular expression from the active document in the Explorer’s “Regex Outline” view.
- Click any outline item to jump directly to the corresponding line in the original document.
- Configure both the regex pattern and an optional directory filter via VS Code settings.
- Supports multiple matches per line and updates automatically when the active editor or document content changes.

Use cases include:
- Extracting `show` command lines from Cisco IOS “show tech” files for quick navigation.
- Highlighting common log levels like `ERROR`, `WARN`, and `INFO` in large log files.

## Requirements

- Visual Studio Code version: ^1.85.0.
- The extension activates on startup and when opening plaintext documents.
- No additional runtime dependencies are required.

## Extension Settings

This extension contributes the following settings:

- `regexOutline.pattern`: Regular expression used to extract matches from documents. Uses JavaScript `RegExp` with the `g` flag. Default: `ERROR|WARN|INFO`.
- `regexOutline.directory`: Limit processing to files under this directory. Accepts absolute paths or paths relative to the workspace root. Default: empty string.

Example (`settings.json`):

```json
{
  "regexOutline.pattern": "^.+#\\s*show\\s.+$|--- show\\s.+\\s---",
  "regexOutline.directory": "/Users/USERNAME/logs"
}
```

## Known Issues

- If the pattern is empty, no results will be listed.
- `regexOutline.directory` is evaluated via a simple prefix match on the file’s absolute path; consider ending the path with a separator (e.g., `/`) to avoid unintended matches.
- Very large files or permissive patterns (including those that can match empty strings) may lead to many results and slower updates.
- Navigation jumps to the start of the matching line (column 0), not the exact character offset.
- Only the currently active editor’s document is processed; if no editor is active, the view will be empty.

## Release Notes

### 0.0.2

- Initial public release of Regex Outline.
- Added Explorer view (“Regex Outline”) listing regex matches.
- Added “Regex Outline: Refresh” command.
- Added `regexOutline.pattern` and `regexOutline.directory` settings.

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

- Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
- Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
- Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

- [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
- [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**