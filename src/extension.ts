import * as child_process from 'child_process';
import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    let formaTXTDisposable = vscode.commands.registerCommand('extension.formaTXT', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const fileName = document.fileName;
            if (!fileName.endsWith(".txt")) {
                // if the file is not txt, pop up a window to ask user if he user wants to proceed
                const proceed = await vscode.window.showWarningMessage(
                    'The file is not a .txt file. Do you want to proceed?',
                    'Yes', 'No'
                );
                if (proceed !== 'Yes') {
                    return;
                }
            }

            // Save the document before formatting to make sure we're working with the latest version of the file
            await document.save();

            // Ask user for width
            const width = await vscode.window.showInputBox({
                prompt: 'Enter the line width',
                value: '90'  // Default value
            });

            // If user cancels, width will be undefined, exit early
            if (width === undefined) { return; }

            // Construct the full path to your Python script
            const scriptPath = path.join(context.extensionPath, 'script', 'formatxt.py');

            // Run the Python script with child_process
            child_process.exec(`python3 ${scriptPath} ${fileName} ${width}`, (error, stdout, stderr) => {
                if (error) {
                    vscode.window.showErrorMessage(`Error running FormatXT: ${error}`);
                    return;
                }

                // Output any standard output or standard error to the VSCode output console
                if (stdout) {
                    console.log(stdout);
                }
                if (stderr) {
                    console.log(stderr);
                }

                // Reload the document to reflect the changes made by the script
                vscode.commands.executeCommand('workbench.action.files.revert');
            });
        }
    });

    let formatSelectedTXTDisposable = vscode.commands.registerCommand('extension.formatSelectedTXT', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const selection = editor.selection;
            const selectedText = document.getText(selection);

            const endLine = selection.end.line;
            const startCharacter = selection.start.character;
            const endCharacter = selection.end.character;

            // Check if selection starts at the beginning of a line and ends at the end of a line
            if (startCharacter !== 0 || endCharacter !== document.lineAt(endLine).text.length) {
                const proceed = await vscode.window.showWarningMessage(
                    'The selected text does not start at the beginning or end at the end of a line. Do you want to proceed?',
                    'Yes', 'No'
                );
                if (proceed !== 'Yes') {
                    return;
                }
            }

            // Write the selected text to a temporary file
            const tmp = require('tmp');
            const fs = require('fs');
            const tmpFile = tmp.fileSync();
            fs.writeFileSync(tmpFile.name, selectedText);

            // Run your Python script on the temporary file
            const scriptPath = path.join(context.extensionPath, 'script', 'formatxt.py');
            child_process.exec(`python3 ${scriptPath} ${tmpFile.name} 90`, (error, stdout, stderr) => {
                if (error) {
                    vscode.window.showErrorMessage(`Error running FormatXT: ${error}`);
                    return;
                }

                // Read the formatted text back from the temporary file
                const formattedText = fs.readFileSync(tmpFile.name, 'utf8');

                // Replace the selected text with the formatted text in the editor
                editor.edit((editBuilder) => {
                    editBuilder.replace(selection, formattedText);
                });

                // Cleanup the temporary file
                tmpFile.removeCallback();
            });
        }
    });


    let formatSelectedTXTWidthDisposable = vscode.commands.registerCommand('extension.formatSelectedTXTWidth', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const selection = editor.selection;
            const selectedText = document.getText(selection);

            const endLine = selection.end.line;
            const startCharacter = selection.start.character;
            const endCharacter = selection.end.character;

            // Check if selection starts at the beginning of a line and ends at the end of a line
            if (startCharacter !== 0 || endCharacter !== document.lineAt(endLine).text.length) {
                const proceed = await vscode.window.showWarningMessage(
                    'The selected text does not start at the beginning or end at the end of a line. Do you want to proceed?',
                    'Yes', 'No'
                );
                if (proceed !== 'Yes') {
                    return;
                }
            }

            // Ask user for width
            const width = await vscode.window.showInputBox({
                prompt: 'Enter the line width',
                value: '90'  // Default value
            });

            // If user cancels, width will be undefined, exit early
            if (width === undefined) { return; }

            // Write the selected text to a temporary file
            const tmp = require('tmp');
            const fs = require('fs');
            const tmpFile = tmp.fileSync();
            fs.writeFileSync(tmpFile.name, selectedText);

            // Run your Python script on the temporary file
            const scriptPath = path.join(context.extensionPath, 'script', 'formatxt.py');
            child_process.exec(`python3 ${scriptPath} ${tmpFile.name} ${width}`, (error, stdout, stderr) => {
                if (error) {
                    vscode.window.showErrorMessage(`Error running FormatXT: ${error}`);
                    return;
                }

                // Read the formatted text back from the temporary file
                const formattedText = fs.readFileSync(tmpFile.name, 'utf8');

                // Replace the selected text with the formatted text in the editor
                editor.edit((editBuilder) => {
                    editBuilder.replace(selection, formattedText);
                });

                // Cleanup the temporary file
                tmpFile.removeCallback();
            });
        }
    });


    context.subscriptions.push(formaTXTDisposable);
    context.subscriptions.push(formatSelectedTXTDisposable);
    context.subscriptions.push(formatSelectedTXTWidthDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
