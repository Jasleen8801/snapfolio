import * as vscode from 'vscode';
import axios from 'axios';

export function activate(context: vscode.ExtensionContext) {
	const API_URI: string = vscode.workspace.getConfiguration('snapfolio').get('apiUrl') || '';
  
  let addTextDisposable = vscode.commands.registerCommand('snapfolio.addText', async () => {
		const bot_id = vscode.workspace.getConfiguration('snapfolio').get('botId');
		// console.log(bot_id);

		if (bot_id) {
			const panel = vscode.window.createWebviewPanel(
				'addText',
				'Notion Page Customization',
				vscode.ViewColumn.One,
				{
					enableScripts: true
				}
			);

			panel.webview.html = html_content;
			
			panel.webview.onDidReceiveMessage(async (message) => {
				if(message.command === 'customize'){
					const { title, description } = message;
					console.log(title, description);
					const pageId = vscode.workspace.getConfiguration('snapfolio').get('pageId');
					const response = await axios.post(`${API_URI}/notion/appendText`, {
						bot_id: bot_id,
						boldText: title,
						text: description,
						page_id: pageId
					});
					console.log(response);
					if(response.status === 200){
						vscode.window.showInformationMessage('Text Added Successfully!');
						panel.dispose();
					} else {
						vscode.window.showErrorMessage('Text Addition failed!');
					}
				} else {
					console.log(message);
				}
			});
		}
	});
  
  context.subscriptions.push(addTextDisposable);
}

export function deactivate() { }

let html_content = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Add Text</title>
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
  <h1>Add Text to Notion Page</h1>
  <div>
    <label for="title">Subtitle: </label>
    <input id="title" type="text" placeholder="(in bold)">
  </div>
  <div>
    <label for="description">Text: </label>
    <input id="description" type="text" placeholder="Description">
  </div>
  <button id="customizeButton">Submit</button>

  <script>
    const vscode = acquireVsCodeApi();
    const customizeButton = document.getElementById('customizeButton');

    customizeButton.addEventListener('click', () => {
      const title = document.getElementById('title').value;
      const description = document.getElementById('description').value;

      vscode.postMessage({
        command: 'customize',
        title: title,
        description: description
      });
    });
  </script>
</body>
</html>`;
