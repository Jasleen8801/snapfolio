import * as vscode from 'vscode';
import * as dotenv from 'dotenv';
import axios from 'axios';

export function activate(context: vscode.ExtensionContext) {
	dotenv.config();
	const AUTH_URL: string = process.env.AUTHORIZATION_URL || '';
	const API_URI: string = "http://localhost:3000";

	let disposable = vscode.commands.registerCommand('snapfolio.authenticate', async () => {
		if(vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
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
			
			panel.webview.html = `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<title>Snapfolio</title>
			</head>
			<body>
				<h1>Authentication</h1>
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

			panel.webview.onDidReceiveMessage(async (message) => {
				if (message.command === 'authenticate') {
					const input: string = await vscode.window.showInputBox({
						prompt: 'Enter your final Uri you copied',
						placeHolder: 'Final URI'
					}) || '';
					console.log(input);
					if(input !== ''){
						const url = new URL(input);
						const code = url.searchParams.get('code');
						console.log(code);
						if(code) {
							try {
								const response = await axios.post(`${API_URI}/auth/redirect_uri?code=${code}`);
								console.log(response);
								if (response.status === 200) {
									const { bot_id } = response.data;
									const config = vscode.workspace.getConfiguration('snapfolio');
									await config.update('botId', bot_id);
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
		} else {
			vscode.window.showErrorMessage("No workspace found! Open one and try again.");
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
