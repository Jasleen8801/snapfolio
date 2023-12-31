import * as vscode from 'vscode';
import axios from 'axios';

export function activate(context: vscode.ExtensionContext) {
  const API_URI: string = vscode.workspace.getConfiguration('snapfolio').get('apiUrl') || '';

  let addCodeDisposable = vscode.commands.registerCommand('snapfolio.addCode', async () => {
    const bot_id = vscode.workspace.getConfiguration('snapfolio').get('botId');
    const theme = vscode.workspace.getConfiguration('snapfolio').get('theme');
    const fontSize = vscode.workspace.getConfiguration('snapfolio').get('fontSize');
    const backgroundColor = vscode.workspace.getConfiguration('snapfolio').get('backgroundColor');
    const textEditor = vscode.window.activeTextEditor;
    const page_id = vscode.workspace.getConfiguration('snapfolio').get('pageId');
    let flag: boolean = false;
    if(textEditor){
      const selectedText = textEditor.document.getText(textEditor.selection);
      if(selectedText){
        const subheading = await vscode.window.showInputBox({
          prompt: "Enter a subheading for the code block",
          placeHolder: "Enter a subheading",
        }) || '';
        const description = await vscode.window.showInputBox({
          prompt: "Enter a description for the code block",
          placeHolder: "Enter a description",
        }) || '';
        const ans: string = await vscode.window.showInputBox({
          prompt: "Do you want to add the output to the document?",
          placeHolder: "Enter (y/n)",
        }) || 'n';
        // console.log(ans);
        if(ans === 'y' || ans === 'Y'){
          flag = true;
          const config = vscode.workspace.getConfiguration();
          config.update('terminal.integrated.copyOnSelection', true, vscode.ConfigurationTarget.Global);
          const selectedOutput = await vscode.env.clipboard.readText();

          const output = await vscode.window.showInputBox({
            prompt: "Check the output selected in the terminal",
            placeHolder: selectedOutput,
          }) || '';
          console.log(output);

          const response = await axios.post(`${API_URI}/notion/appendCode`, {
            bot_id: bot_id,
            flag: flag,
            code: selectedText,
            subheading: subheading,
            description: description,
            theme: theme,
            fontSize: fontSize,
            backgroundColor: backgroundColor,
            output: selectedOutput,
            page_id: page_id
          });
          console.log(response.data);
        } else if(ans === 'n'){
          const response = await axios.post(`${API_URI}/notion/appendcode`, {
            bot_id: bot_id,
            flag: flag,
            code: selectedText,
            subheading: subheading,
            description: description,
            theme: theme,
            fontSize: fontSize,
            backgroundColor: backgroundColor,
            page_id: page_id
          });
          console.log(response);
        }
      }
    }
  });

  context.subscriptions.push(addCodeDisposable);
}

export function deactivate() { }