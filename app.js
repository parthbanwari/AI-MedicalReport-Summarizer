const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const cors = require('cors'); // Import cors package
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express(); // Initialize Express app

// Enable CORS for requests from the frontend's port
app.use(cors({ origin: 'http://localhost:5173' })); // Update with your frontend URL if needed

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Serve static files
app.use('/uploads', express.static('uploads'));

// Set up file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

function generatePDF(text, filename) {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(`uploads/${filename}`);
    doc.pipe(stream);
    doc.fontSize(12).text(text);
    doc.end();
    return stream;
}

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

async function summarizeText(text, genAI) {
    const prompt = `Summarize this medical report in 3 small paragraph about the illness , medicine and precautions\n\nMedical Report:\n${text}\n\nSummary:`;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    return result.response.text(); // Return summary text
}

app.post('/upload', upload.single('file'), async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send('No file uploaded');
    }

    try {
        const dataBuffer = fs.readFileSync(file.path);
        const fileData = await pdfParse(dataBuffer);
        const summary = await summarizeText(fileData.text, genAI);
        const pdfFilename = `${path.parse(file.originalname).name}_summary.pdf`;

        generatePDF(summary, pdfFilename);

        // Send summary and generated PDF file path
        res.json({ summary, pdfFilename });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error processing the file or summarizing the text');
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
