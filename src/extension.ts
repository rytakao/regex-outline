import * as vscode from 'vscode';
import * as path from 'path';

class RegexOutlineProvider implements vscode.TreeDataProvider<OutlineItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<OutlineItem | undefined | void> = new vscode.EventEmitter<OutlineItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<OutlineItem | undefined | void> = this._onDidChangeTreeData.event;

  constructor(private context: vscode.ExtensionContext) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: OutlineItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: OutlineItem): Thenable<OutlineItem[]> {
    if (element) {
      return Promise.resolve([]);
    } else {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return Promise.resolve([]);
      }

      const doc = editor.document;
      const config = vscode.workspace.getConfiguration('regexOutline');
      const pattern = config.get<string>('pattern') || '';
      const directorySetting = config.get<string>('directory') || '';

      // ディレクトリ制限チェック
      if (directorySetting) {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';
        const absSettingPath = path.isAbsolute(directorySetting)
          ? directorySetting
          : path.join(workspaceFolder, directorySetting);

        if (!doc.uri.fsPath.startsWith(absSettingPath)) {
          return Promise.resolve([]);
        }
      }

      if (!pattern) {
        return Promise.resolve([]);
      }

      const regex = new RegExp(pattern, 'g');
      const items: OutlineItem[] = [];

      for (let i = 0; i < doc.lineCount; i++) {
        const line = doc.lineAt(i);
        let match;
        while ((match = regex.exec(line.text)) !== null) {
          items.push(new OutlineItem(match[0], i + 1, doc.uri));
        }
      }

      return Promise.resolve(items);
    }
  }
}

class OutlineItem extends vscode.TreeItem {
  constructor(label: string, line: number, uri: vscode.Uri) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.command = {
      command: 'vscode.open',
      title: 'Open',
      arguments: [uri, { selection: new vscode.Range(line - 1, 0, line - 1, 0) }]
    };
    this.description = `Line ${line}`;
  }
}

export function activate(context: vscode.ExtensionContext) {
  const provider = new RegexOutlineProvider(context);
  vscode.window.registerTreeDataProvider('regexOutlineView', provider);

  const refreshCommand = vscode.commands.registerCommand('regexOutline.refresh', () => {
    provider.refresh();
  });

  context.subscriptions.push(refreshCommand);

  vscode.window.onDidChangeActiveTextEditor(() => provider.refresh());
  vscode.workspace.onDidChangeTextDocument(() => provider.refresh());

  console.log('Regex Outline TreeView activated');
}

export function deactivate() {}
