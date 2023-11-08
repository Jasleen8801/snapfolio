import * as vscode from 'vscode';

import { activate as authenticateActivate, deactivate as authenticateDeactivate } from './authenticate';
import { activate as addTextActivate, deactivate as addTextDeactivate } from './addText';
import { activate as addCodeActivate, deactivate as addCodeDeactivate } from './addCode';

export function activate(context: vscode.ExtensionContext) {
	authenticateActivate(context);
	addTextActivate(context);
	addCodeActivate(context);
}

export function deactivate() { }
