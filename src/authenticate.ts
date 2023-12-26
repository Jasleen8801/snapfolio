import * as vscode from 'vscode';
// import * as dotenv from 'dotenv';
import axios from 'axios';

export function activate(context: vscode.ExtensionContext) {
	// dotenv.config();
	// const AUTH_URL: string = process.env.AUTHORIZATION_URL || '';
	// const AUTH_URL: string = 'https://api.notion.com/v1/oauth/authorize?client_id=b608c940-c804-4788-b3f7-71ba638d2acf&response_type=code&owner=user&redirect_uri=https%3A%2F%2Fapp-pvtat5vj4a-uc.a.run.app%2Fauth%2Fredirect_uri';

	let authDisposable = vscode.commands.registerCommand('snapfolio.authenticate', async () => {
		const API_URI: string = "https://app-pvtat5vj4a-uc.a.run.app";
		const config = vscode.workspace.getConfiguration('snapfolio');
		// const API_URI: string = config.get('apiUrl') || '';
		const AUTH_URL: string = `${API_URI}/auth`;
		const targetUri = vscode.Uri.parse(AUTH_URL);
		// console.log(targetUri);
		// console.log(targetUri.toString());
		vscode.window.showInformationMessage(targetUri.toString());
		await vscode.env.openExternal(targetUri);
		// console.log(AUTH_URL);

		const panel = vscode.window.createWebviewPanel(
			'snapfolio',
			'Snapfolio',
			vscode.ViewColumn.One,
			{
				enableScripts: true,
				enableCommandUris: false	
			}
		);

		panel.webview.html = html_content;

		panel.webview.onDidReceiveMessage(async (message) => {
			if (message.command === 'authenticate') {
				// await vscode.env.openExternal(targetUri);
				const input: string = await vscode.window.showInputBox({
					prompt: 'Enter your final Uri you copied',
					placeHolder: 'Final URI'
				}) || '';
				// console.log(input);
				if (input !== '') {
					const url = new URL(input);
					const code = url.searchParams.get('code');
					console.log(code);
					if (code) {
						try {
							const response = await axios.post(`${API_URI}/auth/redirect_uri?code=${code}`);
							// console.log(response);
							if (response.status === 200) {
								const { bot_id } = response.data;
								const config = vscode.workspace.getConfiguration('snapfolio');
								await config.update('botId', bot_id, vscode.ConfigurationTarget.Global);
								await config.update('apiUrl', API_URI, vscode.ConfigurationTarget.Global);
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
			color: #eee;
			size: 50px;
		}

		p {
			color: #666;
			font-size: 15px;
		}

		button {
			padding: 10px 20px;
			font-size: 25px;
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

