# Document Analysis Web Application
### link:
    https://azure-document-intelligence-client.vercel.app/
## Setup Instructions

### 1.Clone the Repository:
  git clone https://github.com/amprajasri/azure.git
  cd azure
### 2.Install Dependencies: 
  Server:
   cd server
   npm install
  Client:
   cd ../client
   npm install
### 3.Create .env File: Create a .env file in the server folder with the following
### 4.Start the Server:
  cd server
  npm start
### 5.Start the Client:
   cd ../client
   npm start
## API Documentation
Endpoint: /upload Method: POST Description: Uploads a PDF file and analyzes its content using Azure Document Intelligence.

### Request
Headers: Content-Type: multipart/form-data

Body: FormData with a file field containing the PDF.

Response
Success: 200 OK
{
  "wordCount": 1234,
  "characterCountWithSpaces": 5678,
  "characterCountWithoutSpaces": 4567,
  "sentenceCount": 100,
  "averageWordLength": 4.5,
  "top20Words": [
    { "word": "example", "count": 10 },
    ...
  ]
}


Error: 500 Internal Server Error
{
  "message": "Error processing the PDF."
}


## Design Decisions and Trade-offs
### 1.Choice of React for Frontend: 
React provides a modular and component-based structure, making it easy to build and maintain the UI. Trade-off: It requires understanding JSX and React's lifecycle methods.

### 2.Express for Backend: 
Express is a minimal and flexible Node.jsweb application framework, suitable for handling API requests. Trade-off: It requires manual setup for things like error handling and middlewares.

### 3.Azure Document Intelligence:
Using Azure Document Intelligence for PDF analysis leverages powerful AI capabilities. Trade-off: It involves managing API keys and handling potential API response delays.

### 4.Multer for File Uploads: 
Multer is used for handling file uploads in the server. Trade-off: It adds complexity to handle large files and edge cases like unsupported file types.


Future Improvements
### 1.User Authentication:
Add user authentication to protect the API and manage user sessions.

### 2.Progress Bar for Uploads:
Implement a progress bar to provide users with visual feedback on file upload status.

### 3.Advanced text analysis features like:
- Sentiment analysis
- Entity recognition
- Language detection
- Grammar checking

### 4.Support for Additional File Types:
Extend support for other document formats like DOCX, TXT, etc.
