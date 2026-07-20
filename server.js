const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());
// زيادة حد حجم البيانات المستلمة لتجنب مشاكل الملفات الكبيرة
app.use(express.json({ limit: "10mb" })); 

app.get("/", (req, res) => {
  res.send("✅ SmartSummary Backend يعمل بنجاح");
});

app.post("/summarize", async (req, res) => {
  try {
    let { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({
        error: "لم يتم إرسال أي نص أو ملف الـ PDF فارغ"
      });
    }

    // حل المشكلة: اقتصاص النص إذا كان ضخماً جداً لحماية الحصة المجانية (أول 8000 كلمة تقريباً)
    if (text.length > 35000) {
      text = text.substring(0, 35000) + "... [تم اقتصاص النص لكبر حجمه]";
    }

    // استدعاء النموذج بالطريقة الحديثة والمستقرة
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash"
    });

    const prompt = `لخص النص التالي باللغة العربية بشكل دقيق ومفهوم:\n\n${text}`;

    // إرسال الطلب
    const result = await model.generateContent(prompt);
    
    // الصيغة الحديثة والمباشرة لقراءة النص المسترجع
    const summaryText = result.response.text();

    res.json({
      summary: summaryText
    });

  } catch (error) {
    console.error("Gemini Error:", error);

    // إرجاع رسالة الخطأ بشكل واضح لتعرف المشكلة فوراً
    res.status(500).json({
      error: error.message || "حدث خطأ أثناء معالجة الملخص من خلال الذكاء الاصطناعي"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

