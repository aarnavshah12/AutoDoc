const vscode = require('vscode');
const fileProcessing = require('./libraries/fileProcessing.js');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('Congratulations, your extension "autodoc" is now active!');

    const documentThisFile = vscode.commands.registerCommand('autodoc.documentThisFile', async function () {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const filePath = editor.document.fileName;
            try {
                await fileProcessing.processFile(filePath);
                vscode.window.showInformationMessage('File has been documented successfully!');
            } catch (error) {
                vscode.window.showErrorMessage('Error documenting the file: ' + error.message);
            }
        } else {
            vscode.window.showInformationMessage('No active editor found!');
        }
    });

    const documentCode = vscode.commands.registerCommand('autodoc.documentCode', function () {
        vscode.window.showInformationMessage('Documenting code!');
    });

    context.subscriptions.push(documentThisFile);
    context.subscriptions.push(documentCode);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
    activate,
    deactivate
}