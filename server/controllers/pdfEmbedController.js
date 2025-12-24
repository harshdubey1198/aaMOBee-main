const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const openai = require("../config/openai.js");
dotenv.config();

const generateVectorStoreFromLocalPDFs = async (req, res) => {
  try {
    // Path of your local folder containing the PDF and DOCX files inside backend
    const fileFolderPath = path.resolve(__dirname, "../Chatbot_Data");

    // Read the files in the folder
    const files = fs.readdirSync(fileFolderPath).filter(file => 
      file.endsWith('.pdf') || file.endsWith('.docx')
    );

    if (files.length === 0) {
      return res.status(404).json({ error: "No PDF or DOCX files found in the specified folder" });
    }

    let vectorStoreId = process.env.VECTOR_STORE_ID;

    // Step 1: Create vector store if not exists
    if (!vectorStoreId || vectorStoreId.trim() === "") {
      const vs = await openai.vectorStores.create({
        name: "Backend_Chatbot_VectorStore",
      });

      vectorStoreId = vs.id;

      // Save ID to .env automatically
      fs.appendFileSync(".env", `\nVECTOR_STORE_ID=${vectorStoreId}`);
    }

    // Step 2: Loop through each file and upload it
    for (let file of files) {
      const filePath = path.join(fileFolderPath, file);

      if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filePath}`);
        continue; // Skip if a file is missing
      }

      // Upload the file to OpenAI
      const fileUpload = await openai.files.create({
        file: fs.createReadStream(filePath),
        purpose: "assistants",
      });

      // Step 3: Attach the uploaded file to the vector store
      await openai.vectorStores.files.create(vectorStoreId, {
        file_id: fileUpload.id,
      });

      console.log(`Successfully uploaded and attached file: ${file}`);
    }

    return res.json({
      success: true,
      message: "All files (PDFs and DOCX) embedded successfully!",
      vectorStoreId,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
};


module.exports = { generateVectorStoreFromLocalPDFs };
