import * as vscode from 'vscode';
import axios from 'axios';

export function activate(context: vscode.ExtensionContext) {
  const API_URI: string = vscode.workspace.getConfiguration('snapfolio').get('apiUrl') || '';
  console.log(API_URI);

  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusBarItem.text = "$(book) Snapfolio";
  statusBarItem.command = 'snapfolio.explorerView';

  let explorerViewDisposable = vscode.commands.registerCommand('snapfolio.explorerView', async () => {
    try {
      const bot_id = vscode.workspace.getConfiguration('snapfolio').get('botId');
      const response = await axios.get(`${API_URI}/notion/getPages`, {
        params: {
          bot_id: bot_id
        }
      });

      const pages = response.data.pages;
      const pageTitles = pages.map((page: any) => page.title);
      const selectedPage = await vscode.window.showQuickPick(pageTitles);
      const index = pageTitles.indexOf(selectedPage || '') || 0;

      statusBarItem.text = `$(book) Snapfolio - ${selectedPage}`;

      await vscode.workspace.getConfiguration('snapfolio').update('pageId', pages[index].id, vscode.ConfigurationTarget.Global);
      // console.log(pages[index].id);
      vscode.window.showInformationMessage(`Selected Page: ${selectedPage}`);
    } catch (error) {
      vscode.window.showErrorMessage(`Please choose a page first!`);
    }
  });

  context.subscriptions.push(explorerViewDisposable);
  context.subscriptions.push(statusBarItem);

  statusBarItem.show();
}

export function deactivate() { }
