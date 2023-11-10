import * as vscode from 'vscode';

import { activate as authenticateActivate, deactivate as authenticateDeactivate } from './authenticate';
import { activate as addTextActivate, deactivate as addTextDeactivate } from './addText';
import { activate as addCodeActivate, deactivate as addCodeDeactivate } from './addCode';
import { activate as customizeSnippetActivate, deactivate as customizeSnippetDectivate } from './customizeSnippet';
import { activate as createPageActivate, deactivate as createPageDeactivate } from './createPage';
import { activate as explorerViewActivate, deactivate as explorerViewDeactivate } from './explorerView';

export function activate(context: vscode.ExtensionContext) {
	authenticateActivate(context);
	addTextActivate(context);
	addCodeActivate(context);
	customizeSnippetActivate(context);
	createPageActivate(context);
	explorerViewActivate(context);
}

export function deactivate() { }
