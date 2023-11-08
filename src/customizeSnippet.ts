import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  let customizeSnippetDisposable = vscode.commands.registerCommand('snapfolio.customizeSnippet', async () => {
    const panel = vscode.window.createWebviewPanel(
      'customizeSnippet',
      'Customize Snippet',
      vscode.ViewColumn.One,
      {
        enableScripts: true
      }
    );
    
    panel.webview.html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Customize Snippet Settings</title>  
    </head>
    <body>
      <h1>Customize Snippet Settings</h1>
      <div>
        <label>Theme: </label>
        <input id="theme" type="text" placeholder="Theme">
      </div>
      <div>
        <label>Font Size: </label>
        <input id="fontSize" type="text" placeholder="Font Size">
      </div>
      <div>
        <label>Background Color: </label>
        <input id="backgroundColor" type="color" placeholder="Background Color">
      </div>
      <button id="customizeButton">Submit</button>
      <script>
        const vscode = acquireVsCodeApi();
        const customizeButton = document.getElementById('customizeButton');
        customizeButton.addEventListener('click', () => {
          const theme = document.getElementById('theme').value;
          const fontSize = document.getElementById('fontSize').value;
          const backgroundColor = document.getElementById('backgroundColor').value;
          vscode.postMessage({
            command: 'customizeSnippet',
            theme: theme,
            fontSize: fontSize,
            backgroundColor: backgroundColor
          });
        });
      </script>
    </body>
    </html>`;
    
    panel.webview.onDidReceiveMessage(async (message) => {
      if(message.command === 'customizeSnippet'){
        const { theme, fontSize, backgroundColor } = message;
        console.log(theme, fontSize, backgroundColor);
        const config = vscode.workspace.getConfiguration();
        config.update('snapfolio.theme', theme, vscode.ConfigurationTarget.Global);
        config.update('snapfolio.fontSize', fontSize, vscode.ConfigurationTarget.Global);
        config.update('snapfolio.backgroundColor', backgroundColor, vscode.ConfigurationTarget.Global);
        panel.dispose();
      }
    });
  });

  context.subscriptions.push(customizeSnippetDisposable);
}

export function deactivate() { }