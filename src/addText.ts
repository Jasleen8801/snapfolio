import * as vscode from 'vscode';
import axios from 'axios';

export function activate(context: vscode.ExtensionContext) {
	const API_URI: string = "http://localhost:3000";
  
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

			panel.webview.html = `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<title>Add Text to Notion Page</title>
			</head>
			<body>
				<h1>Add Text to Notion Page</h1>
				<div>
					<label>Subtitle: </label>
					<input id="title" type="text" placeholder="(in bold)">
				</div>
				<div>
					<label>Text: </label>
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
			
			panel.webview.onDidReceiveMessage(async (message) => {
				if(message.command === 'customize'){
					const { title, description } = message;
					console.log(title, description);
					const response = await axios.post(`${API_URI}/notion/appendText`, {
						bot_id: bot_id,
						boldText: title,
						text: description
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
