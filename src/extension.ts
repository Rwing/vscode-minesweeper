// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "minesweeper" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.minesweeper', () => {
		// The code you place here will be executed every time your command is executed

		const panel = vscode.window.createWebviewPanel(
			'minesweeper',
			"minesweeper",
			vscode.ViewColumn.One, 
			{
				enableScripts: true, 
				retainContextWhenHidden: true, 
			}
		);
		panel.webview.html = getWebViewContent(context, "/game/index.html");
	});

	context.subscriptions.push(disposable);
}

function getWebViewContent(context: vscode.ExtensionContext, templatePath: string) {
	const resourcePath = path.join(context.extensionPath, templatePath);
	const dirPath = path.dirname(resourcePath);
	let html = fs.readFileSync(resourcePath, 'utf-8');
	// vscode不支持直接加载本地资源，需要替换成其专有路径格式，这里只是简单的将样式和JS的路径替换
	html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
		return $1 + vscode.Uri.file(path.resolve(dirPath, $2)).with({ scheme: 'vscode-resource' }).toString() + '"';
	});
	return html;
}

// this method is called when your extension is deactivated
export function deactivate() { }
