import * as vscode from 'vscode';
import axios from 'axios';

export function activate(context: vscode.ExtensionContext) {
  const API_URI: string = "http://localhost:3000";
  
  function formatCode(code: string): string {
    const indentationMatch = /^(?:(?:( )+)|(?:(\t)+))?/.exec(code);
    if (!indentationMatch) {
      return code;
    }
    const indentation = indentationMatch[1] || indentationMatch[2];
    const formattedCode = code.replace(new RegExp(`^${indentation}`, 'gm'), '\t');
    return formattedCode;
  }

  let addCodeDisposable = vscode.commands.registerCommand('snapfolio.addCode', async () => {
    const textEditor = vscode.window.activeTextEditor;
    if(textEditor){
      const selectedText = textEditor.document.getText(textEditor.selection);
      if(selectedText){
        const formattedCode = formatCode(selectedText);
        console.log(formattedCode);
      }
    }
  });

  context.subscriptions.push(addCodeDisposable);
}

export function deactivate() { }