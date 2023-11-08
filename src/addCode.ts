import * as vscode from 'vscode';
import axios from 'axios';

export function activate(context: vscode.ExtensionContext) {
  const API_URI: string = "http://localhost:3000";
  
  function formatCode(code: string): string {
    const indentedCode = code.replace(/(?:\r\n|\r|\n)/g, '\\n');
    const tabSpaces = vscode.workspace.getConfiguration('editor').get('tabSize');
    // console.log(tabSpaces);
    const formattedCode = indentedCode.replace(`/\s{${tabSpaces}}/g`, '\\t'); 
    return formattedCode;
  }

  let addCodeDisposable = vscode.commands.registerCommand('snapfolio.addCode', async () => {
    const bot_id = vscode.workspace.getConfiguration('snapfolio').get('botId');
    const theme = vscode.workspace.getConfiguration('snapfolio').get('theme');
    const fontSize = vscode.workspace.getConfiguration('snapfolio').get('fontSize');
    const backgroundColor = vscode.workspace.getConfiguration('snapfolio').get('backgroundColor');
    const textEditor = vscode.window.activeTextEditor;
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
        const formattedCode = formatCode(selectedText);
        console.log(formattedCode);
        const ans: string = await vscode.window.showInputBox({
          prompt: "Do you want to add the output to the document?",
          placeHolder: "Enter (y/n)",
        }) || 'n';
        // console.log(ans);
        if(ans === 'y'){
          flag = true;
          const config = vscode.workspace.getConfiguration();
          config.update('terminal.integrated.copyOnSelection', true, vscode.ConfigurationTarget.Global);
          const selectedOutput = await vscode.env.clipboard.readText();
          const formattedOutput = formatCode(selectedOutput) || '';
          console.log(formattedOutput);

          const output = await vscode.window.showInputBox({
            prompt: "Check the output selected in the terminal",
            value: formattedOutput,
          });
          console.log(output);

          const response = await axios.post(`${API_URI}/notion/appendCode`, {
            bot_id: bot_id,
            flag: flag,
            code: formattedCode,
            subheading: subheading,
            description: description,
            theme: theme,
            fontSize: fontSize,
            backgroundColor: backgroundColor,
            output: formattedOutput
          });
          console.log(response.data);
        }
      }
    }
  });

  context.subscriptions.push(addCodeDisposable);
}

export function deactivate() { }