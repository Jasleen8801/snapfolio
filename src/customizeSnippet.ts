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
    
    panel.webview.html = html_content;
    
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

let html_content = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Customize Snippet Settings</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 20px;
      text-align: center;
    }

    h1 {
      color: #333;
    }

    label {
      display: block;
      margin-top: 10px;
      margin-bottom: 5px;
      color: #555;
    }

    input, select {
      padding: 8px;
      margin-bottom: 10px;
      box-sizing: border-box;
    }

    button {
      padding: 10px 20px;
      font-size: 16px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }

    button:hover {
      background-color: #45a049;
    }

    #feedback {
      margin-top: 15px;
      font-size: 14px;
      color: #777;
    }
  </style>
</head>
<body>
  <h1>Customize Snippet Settings</h1>
  <div>
    <label for="theme">Theme: </label>
    <select id="theme">
      <option value="3024-night">3024 Night</option>
      <option value="a11y-dark">A11y Dark</option>
      <option value="blackboard">Blackboard</option>
      <option value="base16-dark">Base16 Dark</option>
      <option value="cobalt">Cobalt</option>
      <option value="darcula">Darcula</option>
      <option value="dracula">Dracula</option>
      <option value="duotone-dark">Duotone Dark</option>
      <option value="gruvbox-dark">Gruvbox Dark</option>
      <option value="hopscotch">Hopscotch</option>
      <option value="material">Material</option>
      <option value="material-darker">Material Darker</option>
      <option value="material-palenight">Material Palenight</option>
      <option value="nord">Nord</option>
      <option value="oceanic-next">Oceanic Next</option>
      <option value="panda-syntax">Panda Syntax</option>
      <option value="paraiso-dark">Paraiso Dark</option>
      <option value="seti">Seti</option>
      <option value="shades-of-purple">Shades of Purple</option>
      <option value="solarized">Solarized</option>
      <option value="synthwave-84">SynthWave '84</option>
      <option value="twilight">Twilight</option>
      <option value="verminal">Verminal</option>
      <option value="vscode">Visual Studio Code</option>
      <option value="yeti">Yeti</option>
      <option value="zenburn">Zenburn</option>
    </select>
  </div>
  <div>
    <label for="fontSize">Font Size: </label>
    <input id="fontSize" type="number" placeholder="Enter font size">
  </div>
  <div>
    <label for="backgroundColor">Background Color: </label>
    <input id="backgroundColor" type="color" placeholder="Choose background color">
  </div>
  <button id="customizeButton">Submit</button>
  <div id="feedback"></div>

  <script>
    const vscode = acquireVsCodeApi();
    const customizeButton = document.getElementById('customizeButton');
    const feedbackElement = document.getElementById('feedback');

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

    window.addEventListener('message', (event) => {
      if (event.data.command === 'feedback') {
        const { success, message } = event.data;
        feedbackElement.textContent = message;
        feedbackElement.style.color = success ? '#4CAF50' : '#FF6347'; // Green for success, red for error
      }
    });
  </script>
</body>
</html>`;
