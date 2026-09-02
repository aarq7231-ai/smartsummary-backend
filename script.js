  async function summarize() {

const file = document.getElementById("pdf").files[0];

if (!file) {
alert("اختر ملف PDF أولاً");
return;
}

document.getElementById("result").innerHTML = "⏳ جاري قراءة الملف...";

try {

const arrayBuffer = await file.arrayBuffer();

const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

let text = "";

for (let i = 1; i <= pdf.numPages; i++) {

const page = await pdf.getPage(i);

const content = await page.getTextContent();

text += content.items.map(item => item.str).join(" ") + "\n";

}

document.getElementById("result").innerHTML = "🤖 جاري إنشاء الملخص...";

const response = await fetch("https://smartsummary-backend.vercel.app/summarize", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
text: text
})
});

const data = await response.json();

document.getElementById("result").innerHTML =
"<b>✅ الملخص:</b><br><br>" + data.summary;

} catch (error) {

document.getElementById("result").innerHTML =
"❌ حدث خطأ:<br><br>" + error.message;

}

}