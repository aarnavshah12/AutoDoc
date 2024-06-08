const vscode = require('vscode');
const fileProcessing = require('./libraries/fileProcessing.js');
const fs = require('fs');
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('Congratulations, your extension "autodoc" is now active!');

    const CommentThisFile = vscode.commands.registerCommand('autodoc.CommentThisFile', async function () {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const filePath = editor.document.fileName;
            try {
                await fileProcessing.processFile(filePath);
                vscode.window.showInformationMessage('File has been Commented successfully!');
            } catch (error) {
                vscode.window.showErrorMessage('Error Commenting the file: ' + error.message);
            }
        } else {
            vscode.window.showInformationMessage('No active editor found!');
        }
    });

    const documentCode = vscode.commands.registerCommand('autodoc.documentCode', function () {
        vscode.window.showInformationMessage('Documenting code!');
    });
    
    const DocumentThisFile = vscode.commands.registerCommand('autodoc.DocumentThisFile', async function () {
        const editor = vscode.window.activeTextEditor;
        if(editor) {
            const filePath = editor.document.fileName;
            try {
                await fileProcessing.processFileDocument(filePath);
                vscode.window.showInformationMessage('File has been Documented successfully!');
            } catch (error) {
                vscode.window.showErrorMessage('Error Documenting the file: ' + error.message);
            }
        } else {
            vscode.window.showInformationMessage('No active editor found!');
        }
    })
    const CommentCodeBase = vscode.commands.registerCommand("autodoc.CommentCurrentDir",async function(){
        const editor = vscode.window.activeTextEditor;
        if(editor) {
            let filePath = editor.document.fileName
            try {
                const files = await fileProcessing.getFiles(filePath)[0];
                const len = files.length
                for(let i = 0; i<len;i++){
                    await fileProcessing.processFile(files[i]);
                }
                vscode.window.showInformationMessage('File has been Documented successfully!');
            } catch (error) {
                vscode.window.showErrorMessage('Error Documenting the file: ' + error.message);
            }
        } else {
            vscode.window.showInformationMessage('No active editor found!');
        }
    })
    const DocGenCurrDir = vscode.commands.registerCommand("autodoc.DocumentCurrentDir",async function(){
        const editor = vscode.window.activeTextEditor;
        if(editor) {
            let filePath = editor.document.fileName

            try {
                const both = await fileProcessing.getFiles(filePath);
                const files = both[0]
                const dirRef = both[1]+"/docs"
                const len = files.length
                await fs.mkdir(dirRef, (err) => {
                    if (err) {
                      console.error('Error creating directory:', err);
                    } else {
                      console.log('Directory created successfully!');
                    }
                  });
                for(let i = 0; i<len;i++){
                    await fileProcessing.processFileDocumentFolder(files[i]);
                    
                }
                vscode.window.showInformationMessage('File has been Documented successfully!');
            } catch (error) {
                vscode.window.showErrorMessage('Error Documenting the file: ' + error.message);
            }
        } else {
            vscode.window.showInformationMessage('No active editor found!');
        }
    })
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
    activate,
    deactivate
}