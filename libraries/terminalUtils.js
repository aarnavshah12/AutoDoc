// terminalUtils.js

const vscode = require('vscode');
const { EventEmitter } = require('events');
const { Readable } = require('stream');

// Define analysis types
const analysisTypes = [
    'Security threats',
    'Inefficiencies',
    'Hard-to-read components',
    'Code style issues',
    'Performance bottlenecks',
    'Unused code',
    'Other'
];

// Function to prompt the user for the type of analysis
async function promptAnalysisType() {
    const terminal = vscode.window.createTerminal(); // Create a new terminal instance

    terminal.show(); // Show the terminal in the VSCode window

    terminal.sendText('clear'); // Clear the terminal output

    terminal.sendText('echo "What do you want to analyze? (use arrow keys to navigate, enter to select):"');

    // Display analysis types in the terminal
    analysisTypes.forEach((type, index) => {
        terminal.sendText(`echo "${index + 1}. ${type}"`);
    });

    const inputEmitter = new EventEmitter(); // Event emitter to capture user input
    const inputBuffer = []; // Buffer to store user input

    // Create a readable stream from the input buffer
    const inputStream = new Readable({
        read() {}
    });

    // Event listener for terminal output
    terminal.processId.then((pid) => {
        vscode.window.terminals.forEach((term) => {
            if (term.processId === pid) {
                term.onDidWriteData((data) => {
                    const line = data.trim();
                    if (line.startsWith('>') && line.length > 1) {
                        // User input detected
                        const input = line.slice(1).trim(); // Remove the prompt symbol '>'
                        inputEmitter.emit('input', input); // Emit user input event
                    }
                });
            }
        });
    });

    // Event listener for user input
    const inputListener = (input) => {
        inputBuffer.push(input); // Push user input to the buffer
    };
    inputEmitter.on('input', inputListener);

    // Wait for user input
    const selectedAnalysis = await new Promise((resolve) => {
        inputStream.on('data', () => {
            // Check if buffer contains user input
            if (inputBuffer.length > 0) {
                const input = inputBuffer.shift(); // Get user input from the buffer
                const selection = parseInt(input);
                if (!isNaN(selection) && selection >= 1 && selection <= analysisTypes.length) {
                    // If a valid selection is made, resolve the promise with the selected analysis
                    resolve(analysisTypes[selection - 1]);
                }
            }
        });
    });

    // Remove input listener
    inputEmitter.off('input', inputListener);

    return selectedAnalysis;
}

module.exports = {
    promptAnalysisType
};
