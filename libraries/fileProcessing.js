// Import the necessary modules
// Import the necessary modules
const fs = require('fs');
const axios = require('axios');
const path = require('path');

// Read the API key from an environment variable
const { API_KEY } = require('../configs/creds');

/**
 * Function to read the content of a file
 * @param {string} filePath - Path of the file to read
 * @returns {Promise<string>} - Content of the file
 */
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

/**
 * Function to write content to a file
 * @param {string} filePath - Path of the file to write
 * @param {string} content - Content to write to the file
 * @returns {Promise<void>}
 */
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

/**
 * Function to send code to ChatGPT and receive the response with added comments
 * @param {string} code - The code to be commented
 * @param {string} fileType - The type of the file (e.g., js, py, etc.)
 * @returns {Promise<string|null>} - The commented code or null in case of error
 */
async function getCommentedCode(code, fileType) {
    try {
        const prompt = `Here is a ${fileType} file. Please add appropriate code comments to it.
        DO NOT CHANGE (DO NOT DELETE, MODIFY, CORRECT OR ADD) THE CODE, YOU ARE ONLY ADDING 
        CODE COMMENTS (where applicable). Please DO NOT include the language name at the top of the response:\n\n${code}`;
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

/**
 * Function to generate GitHub-style documentation in markdown based on the provided code
 * @param {string} code - The code to generate documentation for
 * @returns {Promise<string|null>} - The generated documentation or null in case of error
 */
async function Document(code, analysis){
    try {
        const prompt = `Generate a GitHub style documentation in markdown based on the following code.${analysis}: ${code}`;
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
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error:', error.message);
        return null;
    }
}




/**
 * Function to extract code from the response text
 * @param {string} responseText - The response text containing the code block
 * @returns {string} - The extracted code
 */
function extractCode(responseText) {
    // Look for the start and end of the code block
    const codeStartIndex = responseText.indexOf("```");
    const codeEndIndex = responseText.lastIndexOf("```");

    if (codeStartIndex !== -1 && codeEndIndex !== -1 && codeStartIndex < codeEndIndex) {
        // Extract the code block without the triple backticks
        const codeBlock = responseText.substring(codeStartIndex + 3, codeEndIndex).trim();
        
        // Split the code block by newlines and remove the first line
        const codeLines = codeBlock.split('\n');
        //codeLines.shift(); // Remove the first line

        // Join the remaining lines back into a single string
        return codeLines.join('\n').trim();
    }
    // If code block delimiters are not found, return the text as is
    return responseText.trim();
}






/**
 * Main function to process a file by adding comments to it
 * @param {string} filePath - Path of the file to process
 * @returns {Promise<void>}
 */
async function processFile(filePath) {
    try {
        const fileExtension = path.extname(filePath).substring(1);
        const fileContent = await readFile(filePath);
        const commentedCode = await getCommentedCode(fileContent, fileExtension);
        const outputFilePath = filePath; // Overwrite the original file with commented code
        await writeFile(outputFilePath, commentedCode);

        console.log(`Processed file saved as ${outputFilePath}`);
    } catch (error) {
        console.error('Error processing the file:', error);
        throw error;
    }
}

/**
 * Function to process a file by generating documentation for it
 * @param {string} filePath - Path of the file to process
 * @returns {Promise<void>}
 */
async function processFileDocument(filePath) {
    try {
        
        const fileContent = await readFile(filePath);
        const output = await Document(fileContent)
        const outputFilePath = await (filePath.split(".")[0]+".md")
        console.log(output)
        await writeFile(outputFilePath, output);

        console.log(`Processed file saved as ${outputFilePath}`);
    } catch (error) {
        console.error('Error processing the file:', error);
        throw error;
    }
}

/**
 * Function to get all files in a directory and its subdirectories
 * @param {string} dirPath - Path of the directory to search
 * @returns {Promise<string[]>} - List of file paths
 */
async function getFiles(dirPath) {
    console.log(dirPath);
    const length = dirPath.length;
    for (let i = length; i >= 0; i--) {
        if (dirPath[i-1] === "/") {
            break;
        } else {
            dirPath = dirPath.slice(0, -1);
        }
    }
    const files = [];
    const directoryContents = fs.readdirSync(dirPath);
    for (const item of directoryContents) {
        const itemPath = path.join(dirPath, item);
        const fileType = itemPath.split(".")[1];
        if (fs.statSync(itemPath).isDirectory() && fileType !== "png" && fileType !== "jpg" && fileType !== "jpeg") {
            files.push(...await getFiles(itemPath)); // Recursively call for subdirectories
        } else {
            files.push(itemPath); // Add file paths to the results
        }
    }

    // @ts-ignore
    return [files,dirPath];
}
async function processFileDocumentFolder(filePath) {
    try {
        const fileContent = await readFile(filePath);
        const output = await Document(fileContent);
        let outputFilePath = filePath.split("/")
        const docName = outputFilePath.pop()
        outputFilePath= outputFilePath.join("/")
        outputFilePath = outputFilePath + "/docs/" + docName
        outputFilePath = outputFilePath.split(".")[0] + ".md"; // Create a markdown file with the same name
        await writeFile(outputFilePath, output);

        console.log(`Processed file saved as ${outputFilePath}`);
    } catch (error) {
        console.error('Error processing the file:', error);
        throw error;
    }
}
async function getFiles(dirPath){
    const files = [];
    const directoryContents = fs.readdirSync(dirPath);
  
    for (const item of directoryContents) {
      const itemPath = path.join(dirPath, item);
      const fileType = itemPath.split(".")[1]
      if (fs.statSync(itemPath).isDirectory() && fileType !== "png" && fileType !== "jpg" && fileType !== "jpeg") {
        files.push(...await getFiles(itemPath)); // Recursively call for subdirectories
      } else {
        files.push(itemPath); // Add file paths to the results
      }
    }
  
    console.log(files)
    return files
}

// Export the functions for use in other modules
module.exports = {
    processFile,
    processFileDocument,
    Document,
    writeFile,
    processFileDocumentFolder
};