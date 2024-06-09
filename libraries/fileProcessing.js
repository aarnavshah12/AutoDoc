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
async function getDir(Path){
    const len = Path.length-1
    for(let i = len;i>=0;i--){
        if (Path[i] == "/"){
            break
        }
        else{
            Path = Path.slice(0,-1)
        }
    }

    return Path
}
async function getFiles(dirPath){
    const files = [];
    const directoryContents = fs.readdirSync(dirPath);

    for (const item of directoryContents) {
      const itemPath = path.join(dirPath, item);
      const fileType = itemPath.split(".")[1]
      if (fs.statSync(itemPath).isDirectory() && fileType !== "png" && fileType !== "jpg" && fileType !== "jpeg" && fileType !== "gitignore") {
        files.push(... await getFiles(itemPath)); // Recursively call for subdirectories
      } else {
        files.push(itemPath); // Add file paths to the results
      }
    }

    console.log(files)
    return files
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
        const prompt = `Here is a ${fileType} file. Please add developer code comments without providing feedback and can you add a comment symbol infront of every generated text.\n\n${code}`;
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
        
        return newCode;
    } catch (error) {
        console.error('Error:', error.message);
        return null;
    }
}


async function Document(code){
    try{
        const prompt = `Generate a github style documentation in markdown based on: ${code}`
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
        return response.data["choices"][0]["message"]["content"]
    }
    catch (error){
        console.error("Error:", error.message)
        return null
    }
}
// Function to extract code from the response text
function extractCode(responseText) {
    // Look for the start and end of the code block
    const codeStartIndex = responseText.indexOf("```");
    const codeEndIndex = responseText.lastIndexOf("```");

    if (codeStartIndex !== -1 && codeEndIndex !== -1 && codeStartIndex < codeEndIndex) {
        // Extract the code block without the triple backticks
        const codeBlock = responseText.substring(codeStartIndex + 3, codeEndIndex).trim();

        // Split the code block by newlines and remove the first line
        const codeLines = codeBlock.split('\n');
        codeLines.shift(); // Remove the first line

        // Join the remaining lines back into a single string
        return codeLines.join('\n').trim();
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
        const outputFilePath = filePath
        await writeFile(outputFilePath, commentedCode);

        console.log(`Processed file saved as ${outputFilePath}`);
    } catch (error) {
        console.error('Error processing the file:', error);
        throw error;
    }
}
async function processFileDocument(filePath){
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
module.exports = {
    processFile,
    processFileDocument,
    getFiles,
    getDir,
    getCommentedCode,
    writeFile,
    processFileDocumentFolder,
};
