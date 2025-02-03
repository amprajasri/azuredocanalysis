const express = require("express");
const multer = require("multer");
const axios = require("axios");
const cors = require("cors");
require('dotenv').config();
const { AzureKeyCredential } = require("@azure/core-auth");
const DocumentIntelligence = require("@azure-rest/ai-document-intelligence").default;

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

// Your Azure credentials

const key = process.env.KEY;
const endpoint = process.env.ENDPOINT;

// Log the endpoint and key for debugging
console.log("Endpoint:", endpoint);
console.log("Key:", key);

// Ensure the endpoint does not have a trailing slash
const formattedEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;

// Create Azure Document Intelligence client
const client = DocumentIntelligence(formattedEndpoint, new AzureKeyCredential(key));

// Helper function for manual polling using axios
async function pollForResult(url, apiKey) {
  let result = null;
  while (!result) {
    const response = await axios.get(url, {
      headers: {
        'Ocp-Apim-Subscription-Key': apiKey,
        'Content-Type': 'application/json'
      }
    });
    if (response.data.status === 'succeeded') {
      result = response.data.analyzeResult;
    } else if (response.data.status === 'failed') {
      throw new Error('Analysis failed.');
    } else {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before polling again
    }
  }
  return result;
}

// Function to extract document statistics and word frequency analysis
function extractDocumentStatistics(text) {
  const words = text.split(/\s+/);
  const wordCount = words.length;
  const characterCountWithSpaces = text.length;
  const characterCountWithoutSpaces = text.replace(/\s/g, "").length;
  const sentenceCount = text.split(/[.?!]+/).length - 1;
  const averageWordLength = words.reduce((acc, word) => acc + word.length, 0) / wordCount;

  const wordFrequency = {};
  words.forEach(word => {
    word = word.toLowerCase();
    if (!wordFrequency[word]) {
      wordFrequency[word] = 0;
    }
    wordFrequency[word]++;
  });

  const stopWords = ["the", "is", "in", "and", "of", "to", "a", "with", "for", "as", "on", "by", "an", "this", "that", "it"];
  const top20Words = Object.entries(wordFrequency)
    .filter(([word]) => !stopWords.includes(word))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word, count]) => ({ word, count }));

  return {
    wordCount,
    characterCountWithSpaces,
    characterCountWithoutSpaces,
    sentenceCount,
    averageWordLength,
    top20Words,
  };
}

// POST endpoint to upload PDF and analyze
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send("No file uploaded.");
    }

    // Read the file content
    const fileContent = require("fs").readFileSync(file.path);

    // Send the PDF to Azure Document Intelligence
    const initialResponse = await client
      .path("/documentModels/{modelId}:analyze", "prebuilt-layout")
      .post({
        contentType: "application/pdf",
        body: fileContent,
      });

    console.log("Initial Response:", JSON.stringify(initialResponse, null, 2));

    // Get the operation-location URL from the response headers
    const operationLocation = initialResponse.headers['operation-location'];
    if (!operationLocation) {
      throw new Error('Operation-Location header not found.');
    }

    console.log("Operation Location:", operationLocation);

    const analyzeResult = await pollForResult(operationLocation, key);

    const pages = analyzeResult?.pages;
    if (!pages || pages.length === 0) {
      throw new Error("Expected at least one page in the result.");
    }

    // Collect all text from the pages
    let text = "";
    for (const page of pages) {
      for (const line of page.lines) {
        text += line.content + " ";
      }
    }

    const statistics = extractDocumentStatistics(text);

    res.json(statistics);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send("Error processing the PDF.");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
