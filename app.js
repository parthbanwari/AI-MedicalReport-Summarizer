const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const path = require('path');
const fs = require('fs');

const PDFDocument = require('pdfkit');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);




app.use('/uploads', express.static('uploads'));


// Initialize OpenAI with your API key

const app = express();

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
    return stream; // Return the stream to handle completion
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

async function summarizeText(text, genAI) {
    const prompt = `Summarize this medical report in a way that a non-medical user can understand. Use clear, simple language while maintaining professionalism.\n\nMedical Report:\n${text}\n\nSummary:`;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    console.log(result.response.text());

    return result.response.text(); // Return the summary text
}

// Upload route
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

        // Respond with the summary and PDF filename
        res.json({ summary, pdfFilename });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error processing the file or summarizing the text');
    }
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});