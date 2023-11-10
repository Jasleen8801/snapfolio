import * as vscode from 'vscode';
import * as dotenv from 'dotenv';
import axios from 'axios';

export function activate(context: vscode.ExtensionContext) {
  dotenv.config();
	const AUTH_URL: string = process.env.AUTHORIZATION_URL || '';
	const API_URI: string = "http://localhost:3000";

  let authDisposable = vscode.commands.registerCommand('snapfolio.authenticate', async () => {
		const targetUri = vscode.Uri.parse(AUTH_URL);
		await vscode.env.openExternal(targetUri);

		const panel = vscode.window.createWebviewPanel(
			'snapfolio',
			'Snapfolio',
			vscode.ViewColumn.One,
			{
				enableScripts: true
			}
		);

		panel.webview.html = html_content;

		panel.webview.onDidReceiveMessage(async (message) => {
			if (message.command === 'authenticate') {
				const input: string = await vscode.window.showInputBox({
					prompt: 'Enter your final Uri you copied',
					placeHolder: 'Final URI'
				}) || '';
				// console.log(input);
				if (input !== '') {
					const url = new URL(input);
					const code = url.searchParams.get('code');
					// console.log(code);
					if (code) {
						try {
							const response = await axios.post(`${API_URI}/auth/redirect_uri?code=${code}`);
							// console.log(response);
							if (response.status === 200) {
								const { bot_id } = response.data;
								const config = vscode.workspace.getConfiguration('snapfolio');
								await config.update('botId', bot_id, vscode.ConfigurationTarget.Global);
								vscode.window.showInformationMessage('Authentication successful!');
								panel.dispose();
							} else {
								vscode.window.showErrorMessage('Authentication failed!');
							}
						} catch (error) {
							console.log(error);
						}
					}
				}

			}
		});
	});

  context.subscriptions.push(authDisposable);
}

export function deactivate() { }

let html_content = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Snapfolio Authentication</title>
	<style>
		body {
			font-family: 'Arial', sans-serif;
			margin: 20px;
			text-align: center;
		}

		h1 {
			color: #333;
		}

		p {
			color: #666;
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
	</style>
</head>
<body>
	<h1>Snapfolio Authentication</h1>
	<p>Click the button below to authenticate.</p>
	<button id="authenticate">Authenticate</button>

	<script>
		const vscode = acquireVsCodeApi();
		const button = document.getElementById('authenticate');

		button.addEventListener('click', () => {
			vscode.postMessage({
				command: 'authenticate'
			});
		});
	</script>
</body>
</html>`;

