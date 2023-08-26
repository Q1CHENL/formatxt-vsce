import * as child_process from 'child_process';
import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.formaTXT', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const fileName = document.fileName;

            // Save the document before formatting to make sure we're working with the latest version of the file
            await document.save();

            // Ask user for width
            const width = await vscode.window.showInputBox({
                prompt: 'Enter the line width',
                value: '90'  // Default value
            });

            // If user cancels, width will be undefined, exit early
            if (width === undefined) return;

            // Construct the full path to your Python script
            const scriptPath = path.join(context.extensionPath, 'script', 'formatxt.py');

            // Run the Python script with child_process
            child_process.exec(`python ${scriptPath} ${fileName} ${width}`, (error, stdout, stderr) => {
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

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
