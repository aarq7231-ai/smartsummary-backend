
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
app.use(cors())
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ SmartSummary Backend يعمل بنجاح");
});

app.post("/summarize", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({
      error: "لم يتم إرسال أي نص"
    });
  }

  res.json({
    summary: "تم استلام النص بنجاح. الخطوة القادمة هي ربط الذكاء الاصطناعي لإنتاج ملخص حقيقي."
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
