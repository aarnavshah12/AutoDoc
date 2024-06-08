const fs = require('fs');
const axios = require('axios');
const path = require('path');

// Read the API key from an environment variable
const { API_KEY } = require('../configs/creds');

// Function to read the file content
function readFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

// Function to write content to a file
function writeFile(filePath, content) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, content, 'utf8', err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

// Function to send code to ChatGPT and receive the response
async function getCommentedCode(code, fileType) {
    try {
        const prompt = `Here is a ${fileType} file. Please add appropriate code comments to it.\n\n${code}`;
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4o',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 1500,
                temperature: 0.7,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                }
            }
        );
        const newCode = extractCode(response.data.choices[0].message.content);
        console.log(newCode);
        return newCode;
    } catch (error) {
        console.error('Error:', error.message);
        return null;
    }
}


// Function to extract code from the response text
function extractCode(responseText) {
    // Look for the start and end of the code block
    const codeStartIndex = responseText.indexOf("```");
    const codeEndIndex = responseText.lastIndexOf("```");

    if (codeStartIndex !== -1 && codeEndIndex !== -1 && codeStartIndex < codeEndIndex) {
        // Extract the code block without the triple backticks
        return responseText.substring(codeStartIndex + 3, codeEndIndex).trim();
    }
    // If code block delimiters are not found, return the text as is
    return responseText.trim();
}

// Main function to process the file
async function processFile(filePath) {
    try {
        const fileExtension = path.extname(filePath).substring(1);
        const fileContent = await readFile(filePath);
        const commentedCode = await getCommentedCode(fileContent, fileExtension);
        const outputFilePath = path.join(path.dirname(filePath), `commented_${path.basename(filePath)}`);
        await writeFile(outputFilePath, commentedCode);

        console.log(`Processed file saved as ${outputFilePath}`);
    } catch (error) {
        console.error('Error processing the file:', error);
        throw error;
    }
}

module.exports = {
    processFile
};
