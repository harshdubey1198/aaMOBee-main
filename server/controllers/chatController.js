const dotenv = require("dotenv");
const openai = require("../config/openai.js");

dotenv.config();

const chatFromVectorStore = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question)
      return res.status(400).json({ error: "Question is required" });

    const vectorStoreId = process.env.VECTOR_STORE_ID;

    if (!vectorStoreId)
      return res.status(500).json({ error: "VECTOR_STORE_ID missing" });

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: [
            { 
              type: "input_text", 
              text: `
                You are a friendly and helpful assistant. Your responses should be warm, welcoming, and conversational. 
                Always try to make the user feel understood and comfortable. If you find the answer in the documents, provide it.
                If the answer is not available, kindly say 'I couldn't find that information in the documents. Could you please clarify?'`
            }
          ]
        },
        {
          role: "user",
          content: [{ type: "input_text", text: question }],
        },
      ],
      tools: [
        {
          type: "file_search",
          vector_store_ids: [vectorStoreId],
        },
      ],
    });

    console.log("RAW RESPONSE:", JSON.stringify(response, null, 2));

    let answer = "No answer generated.";

    if (response.output_text) {
      answer = response.output_text;
    } else if (response.output?.[0]?.content?.[0]?.text?.value) {
      answer = response.output[0].content[0].text.value;
    }

    res.json({ answer });
  } catch (error) {
    console.log("Chat error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { chatFromVectorStore };
