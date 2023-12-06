import * as vscode from 'vscode';
import axios from 'axios';

export function activate(context: vscode.ExtensionContext){
  const API_URI: string = vscode.workspace.getConfiguration('snapfolio').get('apiUrl') || '';

  let createPageDisposable = vscode.commands.registerCommand('snapfolio.createPage', async() => {
    const bot_id = vscode.workspace.getConfiguration('snapfolio').get('botId');
    if(bot_id){
      const panel = vscode.window.createWebviewPanel(
        'createPage',
        'Create a Notion Page',
        vscode.ViewColumn.One,
        {
          enableScripts: true
        }
      );

      panel.webview.html = html_content;

      panel.webview.onDidReceiveMessage(async (message) => {
        if(message.command === 'create'){
          const { title } = message;
          console.log(title);
          const response = await axios.post(`${API_URI}/notion/createPage`, {
            bot_id: bot_id,
            title: title
          });
          const { page_id } = response.data;
          console.log(page_id);
          panel.dispose();
          vscode.window.showInformationMessage(response.data.message);
        }
      });
    }
  });

  context.subscriptions.push(createPageDisposable);
}

export function deactivate() {}

let html_content =  `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Create a Notion Page</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 20px;
      text-align: center;
    }

    h1 {
      color: #eee;
      size: 50px;
    }

    label {
      display: block;
      margin-top: 10px;
      margin-bottom: 5px;
      color: #eee;
      font-size: 15px;
    }

    input {
      padding: 8px;
      margin-bottom: 10px;
      box-sizing: border-box;
    }

    button {
      padding: 10px 20px;
      font-size: 20px;
      background-color: #214BDE;
      color: white;
      border: none;
      border-radius: 20px;
      cursor: pointer;
    }

    button:hover {
      background-color: #2123DE;
    }
  </style>
</head>
<body>
  <h1>Create a Notion Page</h1>
  <div>
    <label for="title">Page Title: </label>
    <input id="title" type="text" placeholder="Page Title">
  </div>
  <button id="createButton">Create</button>

  <script>
    const vscode = acquireVsCodeApi();
    const createButton = document.getElementById('createButton');

    createButton.addEventListener('click', () => {
      const title = document.getElementById('title').value;
      vscode.postMessage({
        command: 'create',
        title: title
      });
    });
  </script>
</body>
</html>`;
